import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Grid, Tooltip } from '@mui/material';

const ShowcaseAppBar = ({ data, lastModified, handleMenuClick }) => {

  const textStyle = {
    color: 'rgba(0, 0, 0, 0.9)', // 50% transparent white background
    textAlign: 'center'
  };

  return (
      <AppBar position="static" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', marginBottom: '8px' }}>
          <div>
            <Typography variant="h6"> </Typography>
          </div>
          <Box textAlign="center">
            <img                          
                src={`${process.env.REACT_APP_PUBLIC_URL}/images/Logo-Black-Cyan.png`} 
                alt="Slalom_build" 
                style={{
                    maxWidth: '100%',
                    height: '30px',                
                    }}
            />
            <Typography variant="h6" style={textStyle}><strong>Build Project Showcase</strong></Typography>
          </Box>
          <div>
            { (data && data.length > 0) ? (
              <Tooltip title="Click to upload the latest spreadsheet">
              <Button color="inherit" onClick={handleMenuClick}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box textAlign="center">
                      <Typography variant="h12" style={textStyle}>
                        Last Updated
                      </Typography> 
                      <br/>
                      <Typography variant="h12" style={textStyle}>
                        { lastModified }
                      </Typography> 
                    </Box>
                  </Grid>
                </Grid>             
              </Button>          
              </Tooltip> 
             ) : (
              <Tooltip title="Click to upload the latest spreadsheet">
              <Button color="inherit" onClick={handleMenuClick}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box textAlign="center">
                      <img                          
                          src={`${process.env.REACT_APP_PUBLIC_URL}/images/upload.png`} 
                          alt="Upload" 
                          style={{
                              maxWidth: '100%',
                              height: '30px',                
                              }}
                      />
                    </Box>
                  </Grid>
                </Grid>             
              </Button>          
              </Tooltip> 
             )  
            }
          </div>
        </Toolbar>
      </AppBar>
  );
};

export default ShowcaseAppBar;
