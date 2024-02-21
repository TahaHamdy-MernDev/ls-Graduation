import React from 'react';
import { Oval } from 'react-loader-spinner';

const LoadingOval = () => {
  return (
    <Oval
      strokeColor="white"
      strokeWidth={5}
      color="#4fa94d"
      ariaLabel="oval-loading"
      animationDuration={0.75}
      width={40}
      height={30}
      visible={true}
    />
  );
};

export default LoadingOval;