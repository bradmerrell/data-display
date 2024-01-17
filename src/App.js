import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import ProjectDisplay from './project-display/project-display';
import FileUploadDialog from './upload/file-upload-display';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog  
  const [builderCount, setBuilderCount]= useState(0);
  const [bcCount, setBcCount]= useState(0);
  const handleMenuClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const timer_ms = 10000;
  const maxRotations = 3;

  const query = useQuery();
  // Retrieve BC parameter only once during the component's mounting
  const bc = query.get("BC") || ""; // Fallback value if BC is not provided

  // Function to extract unique Primary Opp values
  const getDistinctPrimaryOpps = (data) => {
    const primaryOppSet = new Set(
      data
        .map(item => item["Primary Opp"])
        .filter(opp => Boolean(opp) && opp !== "NO PRIMARY")
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
    var bgImage = 'blank.png';
    if (data !== undefined && data.length > 0 && primaryOpp !== undefined) {      
      var projectRow = data.find(row => row["Primary Opp"] === primaryOpp);     
      var market = projectRow["Primary Market"];
      if (market !== undefined) {        
        bgImage = backgroundImageList.find(bg=> bg === `${market}.png`)
        if (bgImage === undefined) {
          bgImage = 'blank.png';
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

  const getBuilderCount = (data, bc) => {    
    var arrBC = [];
    if (bc != null && bc.trim() !== "") {
      arrBC = bc.split(',');            
    } 

    // Create a set to store unique values of the specified field
    const uniqueValues = new Set();
    // Iterate through the array and add the field values to the set        

    data.forEach(item => {
      if (item["Primary Opp"] !== 'NO PRIMARY') {
          if (arrBC.length > 0) {
            if (arrBC.indexOf(item["BC"]) !== -1) {
              uniqueValues.add(item["Name"]);  
            }              
          } else {
            uniqueValues.add(item["Name"]);
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
        uniqueValues.add(item["BC"]);
      });
      // Calculate the distinct count
      return uniqueValues.size; 
    }
  }
  
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    
    try {      
      var url = `${process.env.REACT_APP_DATA_API_GET}`;
      if (bc != null && bc.length > 0) {
        url = url + `&BC=${bc}`;
      }
      const response = await axios.get(url, {
        headers: {
            'x-api-key': process.env.REACT_APP_DATA_API_KEY
        }
      });          
      setData(response.data);
      localStorage.setItem('staffing.showcase.data', JSON.stringify(response.data));
      setPrimaryOpps(getDistinctPrimaryOpps(response.data));
      localStorage.setItem('staffing.showcase.primaryOpps', JSON.stringify(getDistinctPrimaryOpps(response.data)));
      setLastBC(bc); // Update lastBC after successful fetch  
      localStorage.setItem('staffing.showcase.lastBC', bc);    
      console.log("bc:", bc);
      setBcCount(getBuildCenterCount(response.data, bc));    
      setBuilderCount(getBuilderCount(response.data, bc));      
      setSeq(0);          
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bc]); // Add necessary dependencies

  // Function to handle the increment of seq and reset logic
  const updateSeq = useCallback(() => {
    setSeq(prevSeq => {
      if ((prevSeq + 1) >= primaryOpps.length)
      {
        console.log("Rotation:", rotation);
        if (rotation + 1 > maxRotations)
        {
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
      const cachedData = localStorage.getItem('staffing.showcase.data');
      const cachedPrimaryOpps = localStorage.getItem('staffing.showcase.primaryOpps');
      const cachedLastBC = localStorage.getItem('staffing.showcase.lastBC');
      if (bc === cachedLastBC && cachedData && cachedData.length > 0) {
        setData(JSON.parse(cachedData));
        setPrimaryOpps(JSON.parse(cachedPrimaryOpps))
        setLastBC(cachedLastBC); // Update lastBC after successful fetch    
        console.log("bc:", bc);
        setBcCount(getBuildCenterCount(JSON.parse(cachedData), bc));
        setBuilderCount(getBuilderCount(JSON.parse(cachedData), bc));         
        setIsLoading(false);
      } else {
        refreshData();
      }
    };

    // Fetch data only if it's not already loaded or BC query param changes
    if (!data.length || bc !== lastBC) {      
      fetchData();
    }
  }, [bc,data,lastBC, refreshData]);

  if (isLoading) {    
    return <div>Loading...</div>; // Or any other loading indicator
  } 

  return (    
    <div style={{ backgroundImage: getBackgroundImage(data, primaryOpps[seq]),
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover', // or 'contain' depending on your needs
                  backgroundPosition: 'center',
                  height: '100vh', // Adjust the height as needed
                  width: '100vw' // Adjust the width as needed
              }}> 
      <AppBar position="static">
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="h6">Build Project Showcase</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              {primaryOpps.length} projects, {builderCount} builders, {bcCount} build centers
            </Typography>  
            { (bc.trim().length > 0) ? (
              <Typography variant="h8" style={{ textAlign: 'center' }}> {lastBC} </Typography>
              ) : ( "" )
            }            
          </div>
          <div>
            <Button color="inherit" onClick={handleMenuClick}>
              <img                          
                  src={`${process.env.REACT_APP_PUBLIC_URL}/images/upload.png`} 
                  alt="Upload" 
                  style={{
                      maxWidth: '100%',
                      height: '25px',                
                    }}
              />
            </Button>            
          </div>
        </Toolbar>
      </AppBar>
      {/* File Upload Dialog */}
      <FileUploadDialog open={isDialogOpen} onClose={handleCloseDialog} />
      {isLoading ? (
          <div style={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
              <img                          
                  src={`${process.env.REACT_APP_PUBLIC_URL}/logos/slalom_build.png`} 
                  alt="Slalom_build" 
                  style={{
                      maxWidth: '100%',
                      height: '400px',                
                    }}
              />
          </div>
        ) : data && data.length > 0 ? (
            <div>
              <ProjectDisplay projectRow={getFirstRowByPrimaryOpp(data, primaryOpps[seq])} builderList={getListOfBuilders(data, primaryOpps[seq])} primaryOps={ primaryOpps} buildCenters={lastBC} />              
            </div>
        ) : (
            <div>No data available.</div>
        )
      }
    </div>
  );
};

export default App;
