import React from 'react';
import { observer } from 'mobx-react-lite';

import { store } from '../Store';
import { settingsStore } from '../StoreSettings';

type SteeringProps = {
  className?: string;
  socket: any;
};

const Steering = observer((props: SteeringProps) => {
  return (
    <div className="text-center p-4 absolute bottom-2 right-2 text-white rounded-lg  text-sm shadow-black  max-w-sm border  shadow-md  bg-gray-800 border-gray-700">
      <p>Steering</p>
      <input
        className="shadow-black drop-shadow-lg my-2"
        type="range"
        min={
          Number(settingsStore.steeringCenter) -
          Number(settingsStore.steeringLimit)
        }
        max={
          Number(settingsStore.steeringCenter) +
          Number(settingsStore.steeringLimit)
        }
        value={store.angle}
        onMouseDown={() => {
          store.steeringDown = true;
        }}
        onMouseUp={() => {
          store.steeringDown = false;
        }}
        onTouchStart={() => {
          store.steeringDown = true;
        }}
        onTouchEnd={() => {
          store.steeringDown = false;
        }}
        onChange={(e) => {
          store.angle = Number(e.target.value);
          if (store.connected) {
            console.log('emit angle', store.angle);
            props.socket.emit('steer', Number(e.target.value));
          }
        }}
      />
      <p>{Number(store.angle).toFixed(0)}°</p>
    </div>
  );
});

export default Steering;
