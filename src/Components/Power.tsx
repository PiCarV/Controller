import React from 'react';
import { observer } from 'mobx-react-lite';

import { store } from '../Store';
import { settingsStore } from '../StoreSettings';

type PowerProps = {
  className?: string;
  socket: any;
};

const Power = observer((props: PowerProps) => {
  return (
    <div className="text-center rounded-md absolute bottom-2 left-2 text-white p-4  text-sm shadow-black  max-w-sm border  shadow-md  bg-gray-800 border-gray-700">
      <p>Power</p>
      <div className="flex flex-row space-x-2">
        <input
          type="checkbox"
          onChange={(e) => {
            if (store.connected) {
              if (e.target.checked) {
                store.powerDown = true;
                store.socket.emit('drive', 35);
              } else {
                store.socket.emit('drive', 0);
              }
            }
          }}
        />
        <label className="text-white">Constant Speed</label>
      </div>
      <div className="flex flex-row space-x-2">
        <input
          type="checkbox"
          onChange={(e) => {
            if (store.connected) {
              if (e.target.checked) {
                store.socket.emit('tilt', 45);
              } else {
                store.socket.emit('tilt', 90);
              }
            }
          }}
        />
        <label className="text-white">Tilt Down</label>
      </div>
      <input
        className="shadow-black drop-shadow-lg my-2"
        type="range"
        min={-settingsStore.powerLimit}
        max={settingsStore.powerLimit}
        value={store.power}
        onMouseDown={() => {
          store.powerDown = true;
        }}
        onMouseUp={() => {
          store.powerDown = false;
        }}
        onTouchStart={() => {
          store.powerDown = true;
        }}
        onTouchEnd={() => {
          store.powerDown = false;
        }}
        onChange={(e) => {
          store.power = Number(e.target.value);
          if (store.connected) {
            store.socket.emit('drive', store.power);
          }
        }}
      />
      <p>{store.power.toFixed(0)} %</p>
    </div>
  );
});

export default Power;
