import React from 'react';

const BackgroundImage = ({ image }) => {
  const style = {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100vw'
  };

  return <div style={style}></div>;
};

export default BackgroundImage;
