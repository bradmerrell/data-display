import React from 'react';
import { Card, CardContent, Typography, List, ListItem } from '@mui/material';

const BuilderCard = ({ builders }) => {
  const numColumns = builders.length > 10 ? 2 : 1;
  console.log("numColumns:",numColumns);

  const cardStyle = {
    marginTop: '16px',
    background: 'rgba(255, 255, 255, 0.66)', // 50% transparent white background
  };

  return (
    <div style={{ padding: '20px' }} >
        <Card style={cardStyle}>
            <CardContent>
                <Typography variant="h6" component="div" style={{ textAlign: 'center' }}>
                    Builders
                </Typography>
                <List style={{ columnCount: numColumns, textAlign: 'center' }}>
                {builders.map((builder, index) => (
                    <ListItem key={index} style={{ display: 'inline-block', width: '100%', breakInside: 'avoid-column' }}>
                    <Typography variant="body1">
                        {builder}
                    </Typography>
                    </ListItem>
                ))}
                </List>
            </CardContent>
        </Card>
    </div>
  );
};

export default BuilderCard;
