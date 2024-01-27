import React from 'react';
import { Card, CardContent, Typography, List, ListItem } from '@mui/material';

const BuilderCard = ({ builders }) => {
  const cardStyle = {
    marginTop: '16px',
    background: 'rgba(255, 255, 255, 0.80)', // 50% transparent white background
  };

  const listContainerStyle = {
    display: 'flex',
    justifyContent: 'center', // Center the content horizontally
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card style={cardStyle}>
        <CardContent>
          <Typography variant="h5" component="div" style={{ textAlign: 'center' }}>
            Builders
          </Typography>
          <div style={listContainerStyle}> {/* Apply centering styles here */}
            <List>
              {builders.map((builder, index) => (
                <ListItem key={index} style={{ display: 'inline-block', width: '100%', breakInside: 'avoid-column' }}>
                  <Typography variant="body1">
                    <strong>{builder}</strong>
                  </Typography>
                </ListItem>
              ))}
            </List>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuilderCard;
