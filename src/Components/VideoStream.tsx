import React from 'react';

type VideoStreamProps = {
  ip: string;
  connected: boolean;
};

const VideoStream = (props: VideoStreamProps) => {
  if (props.connected) {
    return (
      <img
        className="bg-cover rounded-lg absolute -z-50 max-h-screen max-w-screen"
        src={'http://' + props.ip + ':8080/?action=stream'}
      />
    );
  } else {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-white absolute animate-pulse">Connect to a car</h1>
        <div className=" border-2 animate-ping border-white w-32 h-32 absolute rounded-full " />
        <div className=" border-2 animate-ping border-white w-36 h-36 absolute rounded-full " />
      </div>
    );
  }
};

export default VideoStream;
