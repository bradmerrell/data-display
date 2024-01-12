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
    

    return (
        <div style={{ padding: '20px' }}>    
            <Card style={{ marginTop: '16px' }}>            
                <CardContent>            
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box textAlign="center">
                                <img       
                                    ref={imageRef}                      
                                    src={`${process.env.PUBLIC_URL}/logos/${project["Client"]}.png`} 
                                    alt="Logo" 
                                    onError={handleImageError}
                                    style={{ maxWidth: '100%', height: '150px' }}
                                />
                            </Box>
                            <Typography variant="h4" style={{ textAlign: 'center' }}>
                                {project["Client"]}
                            </Typography>
                            <Typography variant="h6" style={{ textAlign: 'center' }}>{project["Project"]}</Typography>
                            <hr/>
                            <Typography variant="body1" style={{ textAlign: 'center' }}>Market: <strong>{project["Primary Market"]}</strong></Typography>                    
                            <Typography variant="body1" style={{ textAlign: 'center' }}>BPO: <strong>{project["Primary Owner"]}</strong></Typography>                    
                        </Grid>              
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectCard;
