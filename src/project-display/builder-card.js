import React from 'react';
import { Card, CardContent, Typography, List, ListItem } from '@mui/material';

const BuilderCard = ({ builders }) => {
  var numColumns = Math.ceil(builders.length / 10);
  if (numColumns > 4) {
    numColumns = 4;
  }
  console.log ("numColumns:", numColumns);

  const cardStyle = {
    marginTop: '16px',
    background: 'rgba(255, 255, 255, 0.66)', // 50% transparent white background
  };

  const listContainerStyle = {
    display: 'flex',
    justifyContent: 'center', // Center the content horizontally
  };

  return (
    <div style={{ padding: '30px' }}>
      <Card style={cardStyle}>
        <CardContent>
          <Typography variant="h5" component="div" style={{ textAlign: 'center' }}>
            Builders
          </Typography>
          <div style={listContainerStyle}> {/* Apply centering styles here */}
            <List style={{ columnCount: numColumns }}>
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
