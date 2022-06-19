import React from 'react';
import { BsRecordCircle, BsFillStopCircleFill } from 'react-icons/bs';

type RecorderProps = {
  recording: boolean;
  onClick?: () => void;
};

const Recorder = (props: RecorderProps) => {
  if (!props.recording) {
    return (
      <BsRecordCircle className="text-white text-3xl" onClick={props.onClick} />
    );
  }
  return (
    <BsFillStopCircleFill
      className="text-red-500 animate-pulse text-3xl"
      onClick={props.onClick}
    />
  );
};

export default Recorder;
