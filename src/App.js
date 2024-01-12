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
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [lastBC, setLastBC] = useState(null); // to track the last fetched BC
  const [seq, setSeq] = useState(0); // Using state to manage 'seq'
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog

  const handleMenuClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const timer_ms = 5000;

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

  const getListOfBuilders = (data, primaryOpp) => {
    var builders = data
      .filter(row => row["Primary Opp"] === primaryOpp)
      .sort((a, b) => a["Name"].localeCompare(b["Name"])) // Adding sort here
      .map(row => `${row["Name"]} (${row["Capability"]}) - [${row["Physical Location"]}]`);
    return builders;
  };
  

  // Function to handle the increment of seq and reset logic
  const updateSeq = useCallback(() => {
    setSeq(prevSeq => {
      const nextSeq = (prevSeq + 1) % primaryOpps.length;
      return nextSeq === 0 ? 1 : nextSeq; // Resets to 1 when it exceeds the length
    });
  }, [primaryOpps.length]);

  useEffect(() => {
    const timer = setInterval(updateSeq, timer_ms); // Update every 5 seconds
    return () => clearInterval(timer); // Clear the interval on component unmount
  }, [updateSeq, timer_ms]);

  const updateBackground = useCallback(() => {
    // Randomly select a background image
    const randomIndex = Math.floor(Math.random() * backgroundImageList.length);
    setBackgroundImage(backgroundImageList[randomIndex]);
  }, []);

  useEffect(() => {
    const timer = setInterval(updateBackground, timer_ms); // Update every 5 seconds
    return () => clearInterval(timer); // Clear the interval on component unmount
  }, [updateBackground, timer_ms]);

  
  useEffect(() => {
    // Randomly select a background image
    const randomIndex = Math.floor(Math.random() * backgroundImageList.length);
    setBackgroundImage(backgroundImageList[randomIndex]);
  }, []);

  useEffect(() => {
    // Function to fetch data
    const fetchData = async (forceDataRefresh) => {
      setIsLoading(true);
      const cachedData = localStorage.getItem('staffing.showcase.data');
      const cachedPrimaryOpps = localStorage.getItem('staffing.showcase.primaryOpps');
      const cachedLastBC = localStorage.getItem('staffing.showcase.lastBC');
      if (bc === cachedLastBC && cachedData && cachedData.length > 0) {
        setData(JSON.parse(cachedData));
        setPrimaryOpps(JSON.parse(cachedPrimaryOpps))
        setLastBC(cachedLastBC); // Update lastBC after successful fetch             
        setIsLoading(false);
      } else {
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
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
     }
  };

    // Fetch data only if it's not already loaded or BC query param changes
    if (!data.length || bc !== lastBC) {      
        fetchData();
    }
  }, [bc,data,lastBC]);

  if (isLoading) {    
    return <div>Loading...</div>; // Or any other loading indicator
  } 

  return (    
    <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/backgrounds/${backgroundImage})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover', // or 'contain' depending on your needs
                  backgroundPosition: 'center',
                  height: '100vh', // Adjust the height as needed
                  width: '100vw' // Adjust the width as needed
              }}> 
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Builder Staffed</Typography>
          <Button color="inherit" onClick={handleMenuClick}>Upload</Button>
          {/* Add additional menu items as needed */}
        </Toolbar>
      </AppBar>
      {/* File Upload Dialog */}
      <FileUploadDialog open={isDialogOpen} onClose={handleCloseDialog} />
      {isLoading ? (
          <div>Loading...</div>
        ) : data && data.length > 0 ? (
            <ProjectDisplay projectRow={getFirstRowByPrimaryOpp(data, primaryOpps[seq])} builderList={getListOfBuilders(data, primaryOpps[seq])} />                
        ) : (
            <div>No data available.</div>
        )
      }
    </div>
  );
};

export default App;
