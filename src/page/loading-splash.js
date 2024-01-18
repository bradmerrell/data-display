import React from 'react';
import { Typography, Box, Grid } from '@mui/material';

const LoadingSplash = ({ message }) => {

  return (
    <div style={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}>
        <Grid container spacing={2}>
        <Grid item xs={12}>
            <Box textAlign="center">
            <img                          
                src={`${process.env.REACT_APP_PUBLIC_URL}/images/Mark-CyanOnBlack-FIll.svg`} 
                alt="Slalom_build" 
                style={{
                    maxWidth: '100%',
                    height: '300px',                
                    }}
            />
            </Box>
            <Typography variant="h4" style={{ textAlign: 'center' }}>
                    &nbsp;
            </Typography>
            <Typography variant="h2" style={{ textAlign: 'center' }}>
              Project Showcase
            </Typography>
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              { message }
            </Typography>
        </Grid>
        </Grid>            
    </div>
  );
};

export default LoadingSplash;
