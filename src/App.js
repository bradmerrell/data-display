import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProjectDisplay from './project-display/project-display';
import FileUploadDialog from './upload/file-upload-display';
import ShowcaseAppBar from './page/showcase-appbar';
import LoadingSplash from './page/loading-splash';

// Custom hook to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const backgroundImageList = ["Atlanta.png",
                          "Austin.png",
                          "Boston.png",
                          "Charlotte.png",
                          "Chicago.png",
                          "Columbus.png",
                          "Dallas Fort Worth.png",
                          "Denver.png",
                          "Detroit.png",
                          "Federal.png",
                          "Florida.png",
                          "Hartford.png",
                          "Houston.png",
                          "Kansas City.png",
                          "Los Angeles.png",
                          "Minneapolis.png",
                          "Montreal.png",
                          "Nashville.png",
                          "New Jersey.png",
                          "New York City.png",
                          "Northern California.png",
                          "Orange County.png",
                          "Philadelphia.png",
                          "Phoenix.png",
                          "Portland.png",
                          "Raleigh.png",
                          "Salt Lake City.png",
                          "San Diego.png",
                          "Seattle.png",
                          "Slalom Build.png",
                          "St Louis.png",
                          "Tokyo.png",
                          "Toronto.png",
                          "Washington DC.png",
                          "Western Canada.png",
                          "Slalom.png"];

const App = () => {
  const [data, setData] = useState([]);
  const [primaryOpps, setPrimaryOpps] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [lastBC, setLastBC] = useState(null); // to track the last fetched BC
  const [seq, setSeq] = useState(0); // Using state to manage 'seq' the index for the project that is being rotated through.
  const [rotation, setRotation] = useState(0);
  const [builderCount, setBuilderCount]= useState(0);
  const [bcCount, setBcCount]= useState(0);
  const [marketCount, setMarketCount] = useState(0);
  const [lastModified, setLastModified] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const timer_ms = 10000;
  const maxRotations = 5;

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleMenuClick = () => {
    setIsDialogOpen(true);
  };

  const query = useQuery();
  // Retrieve BC parameter only once during the component's mounting
  const bc = query.get("BC") || ""; // Fallback value if BC is not provided

  // Function to extract unique Primary Opp values
  const getDistinctPrimaryOpps = (data) => {
    const primaryOppSet = new Set(
      data
        .map(item => item["Primary Opp"])
        .filter(opp => Boolean(opp) && opp.trim().length > 0 && opp.toUpperCase() !== "NO PRIMARY" && opp.toUpperCase() !== "LEAVE" && opp.toUpperCase() !== "PTO")
    );
    const uniquePrimaryOpps = Array.from(primaryOppSet);
    uniquePrimaryOpps.sort(); // Sort the array alphabetically
    return uniquePrimaryOpps;
  };
  

  const getFirstRowByPrimaryOpp = (data, primaryOpp) => {
    var projectRow = data.find(row => row["Primary Opp"] === primaryOpp);     
    return projectRow;
  };

  const getBackgroundImage = (data, primaryOpp) => {
    var bgImage = 'white.png';
    if (data !== undefined && data.length > 0 && primaryOpp !== undefined) {        
      var projectRow = getFirstRowByPrimaryOpp(data, primaryOpp);
      var market = projectRow["Primary Market"];
      if (market !== undefined) {        
        bgImage = backgroundImageList.find(bg=> bg === `${market}.png`)
        if (bgImage === undefined) {
          bgImage = 'black.png';
        }
      }
    }
    return `url(${process.env.PUBLIC_URL}/backgrounds/${bgImage})`
  };

  const getListOfBuilders = (data, primaryOpp) => {
    var builders = data
      .filter(row => row["Primary Opp"] === primaryOpp)
      .sort((a, b) => a["Name"].localeCompare(b["Name"])) // Adding sort here
      .map(row => `${row["Name"]} (${row["Capability"]}) - [${row["Physical Location"]}]`);
    return builders;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1); // Months are zero indexed
    const day = '' + d.getDate();
    const year = d.getFullYear();

    // Pad the month and day with leading zeros if necessary
    const formattedMonth = month.length < 2 ? '0' + month : month;
    const formattedDay = day.length < 2 ? '0' + day : day;

    return `${formattedMonth}/${formattedDay}/${year}`;
  }

  const getDistinctCountByBC = (data, bc, fieldName) => {    
    var arrBC = [];
    if (bc != null && bc.trim() !== "") {
      arrBC = bc.split(',');            
    } 

    // Create a set to store unique values of the specified field
    const uniqueValues = new Set();
    // Iterate through the array and add the field values to the set        

    data.forEach(item => {
      if (item["Primary Opp"].trim().length > 0 && item["Primary Opp"].toUpperCase() !== 'NO PRIMARY' && item["Primary Opp"].toUpperCase() !== 'LEAVE') {
          if (arrBC.length > 0) {
            if (arrBC.indexOf(item["BC"]) !== -1) {
              uniqueValues.add(item[fieldName]);  
            }              
          } else {
            uniqueValues.add(item[fieldName]);
          }
      }
    });
    // Calculate the distinct count
    return uniqueValues.size;     
  }

  const getBuildCenterCount = (data, bc) => {
    if (bc != null && bc.trim() !== "") {
      const arrBC = bc.split(',');        
      return arrBC.length; 
    } else {
      // Create a set to store unique values of the specified field
      const uniqueValues = new Set();
      // Iterate through the array and add the field values to the set
      data.forEach(item => {
        if (item["BC"].trim().length > 0) {
          uniqueValues.add(item["BC"]);
        }
      });
      // Calculate the distinct count
      return uniqueValues.size; 
    }
  }
  
  const fetchDataFromAPI = useCallback(async () => {
    var url = `${process.env.REACT_APP_DATA_API_GET}`;
    if (bc != null && bc.length > 0) {
      url = url + `&BC=${bc}`;
    }
    try {
      const response = await axios.get(url, {
        headers: {
            'x-api-key': process.env.REACT_APP_DATA_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error for handling in the caller
    }
  }, [bc]); // Add necessary dependencies

  const fetchLastModifiedFromAPI = useCallback(async () => {
    var url = `${process.env.REACT_APP_DATA_API_UPLOAD}`;
    url = url.replace("upload","lastmodified");
    try {
      const response = await axios.get(url, {
        headers: {
            'x-api-key': process.env.REACT_APP_DATA_API_KEY
        }
      });
      if (response && response.data && response.data.lastModified) {
        return formatDate(response.data.lastModified);
      } else {
        return "";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error for handling in the caller
    }
  }, []); // Add necessary dependencies

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    
    try {      
      const data = await fetchDataFromAPI();      
      const lastModifiedDate = await fetchLastModifiedFromAPI();
      setData(data);      
      setPrimaryOpps(getDistinctPrimaryOpps(data));      
      setLastBC(bc); // Update lastBC after successful fetch  
      setBcCount(getBuildCenterCount(data, bc));    
      setBuilderCount(getDistinctCountByBC(data, bc, "Name"));      
      setMarketCount(getDistinctCountByBC(data, bc, "Primary Market"));  
      setLastModified(lastModifiedDate);
      setSeq(0);          
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bc, fetchDataFromAPI, fetchLastModifiedFromAPI]); // Add necessary dependencies

  // Function to handle the increment of seq and reset logic
  const updateSeq = useCallback(() => {
    setSeq(prevSeq => {
      if ((prevSeq + 1) >= primaryOpps.length)
      {
        //console.log("Rotation:", rotation);
        if (rotation + 1 >= maxRotations)
        {
          //console.log("Data Refresh");
          localStorage.clear();
          window.location.reload();
        } else {
          setRotation(rotation + 1);
        }
      }
      const nextSeq = (prevSeq + 1) % primaryOpps.length;
      return nextSeq === 0 ? 0 : nextSeq; // Resets to 1 when it exceeds the length
    });
  }, [primaryOpps.length, rotation, maxRotations]);

  useEffect(() => {
    const timer = setInterval(updateSeq, timer_ms); // Update every 5 seconds
    return () => clearInterval(timer); // Clear the interval on component unmount
  }, [updateSeq, timer_ms]);

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      setIsLoading(true);
      refreshData();
    };

    // Fetch data only if it's not already loaded or BC query param changes
    if (!data.length || bc !== lastBC) {      
      fetchData();
    }
  }, [bc,data,lastBC, refreshData]);

  return (    
    <div style={{ backgroundImage: getBackgroundImage(data, primaryOpps[seq]),                  
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover', // or 'contain' depending on your needs
                  backgroundPosition: 'center',
                  height: '100vh', // Adjust the height as needed
                  width: '100vw' // Adjust the width as needed
              }}> 
      <ShowcaseAppBar data={data} primaryOpps={primaryOpps} bcCount={bcCount} 
              builderCount={builderCount} marketCount={marketCount} lastModified={lastModified} 
              bc={bc} lastBC={lastBC} handleMenuClick={handleMenuClick}/>
      <FileUploadDialog open={isDialogOpen} onClose={handleCloseDialog} />
      {isLoading ? (
          <LoadingSplash />
        ) : data && data.length > 0 ? (
          <ProjectDisplay projectRow={getFirstRowByPrimaryOpp(data, primaryOpps[seq])} builderList={getListOfBuilders(data, primaryOpps[seq])} primaryOps={ primaryOpps} buildCenters={lastBC} />              
        ) : (
          <LoadingSplash message="No Data Available"/>
        )
      }
    </div>
  );
};

export default App;
