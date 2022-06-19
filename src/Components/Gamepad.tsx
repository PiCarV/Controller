import React from 'react';
import { MdVideogameAsset, MdVideogameAssetOff } from 'react-icons/md';

type GamepadProps = {
  className?: string;
  connected: boolean;
};

const Gamepad = (props: GamepadProps) => {
  if (props.connected) {
    return (
      <div className={props.className}>
        <MdVideogameAsset className="text-white text-4xl" />
      </div>
    );
  }

  return (
    <div className={props.className}>
      <MdVideogameAssetOff className="text-white text-4xl" />
    </div>
  );
};
export default Gamepad;
