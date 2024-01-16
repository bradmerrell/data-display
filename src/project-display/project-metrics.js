import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ProjectMetrics = ({ projectCount, builderCount, buildCenters }) => {
  var buildCenterDisplay = `Build Centers (${(buildCenters == null || buildCenters.length === 0 || buildCenters === "") ? "ALL" : buildCenters })`;

  const cardStyle = {
    marginTop: 'auto', // Push the card to the bottom
    marginLeft: 'auto', // Center the card horizontally
    marginRight: 'auto', // Center the card horizontally
    marginBottom: '20px', // Add space at the bottom
    background: 'rgba(255, 255, 255, 0.66)', // 50% transparent white background    
  };

  const containerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center', // Center the content horizontally
    padding: '0 20px 20px', // Add padding to the container
  };

  return (
    <div style={containerStyle} className="project-metrics">
      <Card style={cardStyle}>
        <CardContent>          
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            <strong>{projectCount} projects</strong> by <strong>{builderCount} builders</strong> from <strong>{buildCenterDisplay}</strong>
          </Typography>                    
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectMetrics;
