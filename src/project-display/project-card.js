import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const ProjectCard = ({ project }) => {
    const imageRef = useRef(null); // Create a ref for the image

    const handleImageError = (e) => {
        e.target.style.display = 'none'; // Hide the image if there's an error
    };

    useEffect(() => {
        if (imageRef.current) {
            imageRef.current.style.display = ''; // Reset the display property when project changes
        }
    }, [project]);

    const cardStyle = {
        marginTop: '16px',
        background: 'rgba(255, 255, 255, .90)', // 50% transparent white background
      };
    
    return (
        <div style={{ padding: '20px' }}>    
            <Card style={cardStyle}>         
                <CardContent>            
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box textAlign="center">
                                <img       
                                    ref={imageRef}                      
                                    src={`${process.env.REACT_APP_PUBLIC_URL}/logos/${project["Client"]}.png`} 
                                    alt="Logo" 
                                    onError={handleImageError}
                                    style={{
                                        maxWidth: '100%',
                                        height: '125px',
                                        opacity: 0.85, // Set the opacity to 50%
                                      }}
                                />
                            </Box>
                            <Typography variant="h4" style={{ textAlign: 'center' }}>
                                {project["Client"]}
                            </Typography>
                            <Typography variant="h6" style={{ textAlign: 'center' }}>{project["Project"]}</Typography>
                            <hr/>
                            <Typography variant="body1" style={{ textAlign: 'center' }}>Market: <strong>{project["Current Market"]}</strong>&nbsp;&nbsp;BPO: <strong>{project["Current Owner"]}</strong></Typography>                    
                            
                        </Grid>              
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectCard;
