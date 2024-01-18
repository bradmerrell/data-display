import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Grid, Tooltip } from '@mui/material';

const ShowcaseAppBar = ({ data, primaryOpps, bcCount, builderCount, marketCount, lastModified, bc, lastBC, handleMenuClick }) => {

  return (
      <AppBar position="static">
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="h6">Build Project Showcase</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            { data && data.length > 0 ? (
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              {primaryOpps.length} projects {builderCount} builders {marketCount} markets
            </Typography>  
              ) : ( "" ) 
            }
            { (data && data.length > 0 && bc.trim().length > 0 && bc.trim().split(",").length === 1) ? (
                <Typography variant="h6" style={{ textAlign: 'center' }}> 
                    {bcCount} build center - { lastBC } 
                </Typography>
              ) : data && data.length > 0 && bc.trim().length > 0 && bc.trim().split(",").length > 1 ? (
                <Typography variant="h6" style={{ textAlign: 'center' }}> 
                  {bcCount} build centers - { lastBC } 
                </Typography>
              ) : data && data.length > 0 && bc.trim().length === 0 ? (
              <Typography variant="h6" style={{ textAlign: 'center' }}> 
                {bcCount} build centers
              </Typography>
              ) : ( "" )
            }
          </div>
          <div>
            { (data && data.length > 0) ? (
              <Tooltip title="Click to upload the latest spreadsheet">
              <Button color="inherit" onClick={handleMenuClick}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box textAlign="center">
                      <Typography variant="h12" style={{ textAlign: 'center' }}>
                        Last Updated
                      </Typography> 
                      <br/>
                      <Typography variant="h12" style={{ textAlign: 'center' }}>
                        { lastModified }
                      </Typography> 
                    </Box>
                  </Grid>
                </Grid>             
              </Button>          
              </Tooltip> 
             ) : ("")  
            }
          </div>
        </Toolbar>
      </AppBar>
  );
};

export default ShowcaseAppBar;
