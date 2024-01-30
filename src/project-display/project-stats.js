import React from 'react';
import { Typography, Card, CardContent, Grid } from '@mui/material';


const ProjectStats = ({ data, buildCenters }) => {

  const cardStyle = {
    marginTop: '16px',
    background: 'rgba(255, 255, 255, 0.80)', // 50% transparent white background
  };

  const getDistinctCountByBC = (data, buildCenters, fieldName) => {    
    if (!data) {
      return 0;
    }

    var arrBuildCenters = [];
    if (buildCenters && buildCenters.trim() !== "") {
      arrBuildCenters = buildCenters.split(',');            
    } 

    // Create a set to store unique values of the specified field
    const uniqueValues = new Set();
    // Iterate through the array and add the field values to the set        

    data.forEach(item => {
      if (item["ClientProject"].trim().length > 0 && 
          item["ClientProject"].toUpperCase() !== 'NO PRIMARY' && 
          item["ClientProject"].toUpperCase() !== 'LEAVE' &&
          item["ClientProject"].toUpperCase() !== 'BENCH'
          ) {
          if (arrBuildCenters.length > 0) {
            if (arrBuildCenters.indexOf(item["BC"]) !== -1) {
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

    if (bc && bc.trim() !== "") {
      const arrBuildCenters = bc.split(',');        
      return arrBuildCenters.length; 
    } else {
      if (!data) {
        return 0;
      }
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

  return (
    <div style={{ paddingTop: '5px', paddingBottom: '5px', paddingLeft: '20px', paddingRight: '20px' }}>    
      <Card style={cardStyle}>         
        <CardContent>   
            <Grid container spacing={5}>
              <Grid item xs={12} md={3}>
                <Typography variant="body1" style={{ textAlign: 'center' }}> 
                  <strong>Build Centers</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body1" style={{ textAlign: 'center' }}>
                  <strong>Markets</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body1" style={{ textAlign: 'center' }}>
                  <strong>Projects</strong>
                </Typography> 
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body1" style={{ textAlign: 'center' }}>
                  <strong>Builders</strong>
                </Typography>  
              </Grid>
          </Grid>
          <Grid container spacing={5}>
              <Grid item xs={12} md={3}>
                { (data && data.length > 0) ? (
                    <Typography variant="body1" style={{ textAlign: 'center' }}> 
                      OVERALL ({ getBuildCenterCount(data, "") })
                    </Typography>
                  ) : ( "" )
                }
              </Grid>
              <Grid item xs={12} md={3}>
                { data && data.length > 0 ? (
                    <Typography variant="body1" style={{ textAlign: 'center' }}>
                      { getDistinctCountByBC(data, null, "Current Market") }
                    </Typography>
                  ) : ( "" ) 
                }
              </Grid>
              <Grid item xs={12} md={3}>
                { data && data.length > 0 ? (
                      <Typography variant="body1" style={{ textAlign: 'center' }}>
                        { getDistinctCountByBC(data, null, "ClientProject")}
                      </Typography> 
                  ) : ( "" ) 
                }
              </Grid>
              <Grid item xs={12} md={3}>
                { data && data.length > 0 ? (
                    <Typography variant="body1" style={{ textAlign: 'center' }}>
                      { getDistinctCountByBC(data, null, "Name") }
                    </Typography>  
                  ) : ( "" ) 
                }
              </Grid>
          </Grid>
          { (data && data.length > 0 && buildCenters.length >= 1) ? (
          <Grid container spacing={5}>
              <Grid item xs={12} md={3}>
                <Typography variant="body1" style={{ textAlign: 'center' }}> 
                    { buildCenters } ({ getBuildCenterCount(data, buildCenters) })
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body1" style={{ textAlign: 'center' }}>
                  { getDistinctCountByBC(data, buildCenters, "Current Market") }
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body1" style={{ textAlign: 'center' }}>
                  { getDistinctCountByBC(data, buildCenters, "ClientProject")}
                </Typography> 
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body1" style={{ textAlign: 'center' }}>
                  { getDistinctCountByBC(data, buildCenters, "Name") }
                </Typography>  
              </Grid>
          </Grid>
            ) : ( "" ) 
          }
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectStats;