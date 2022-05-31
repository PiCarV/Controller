// set up componment
import React from 'react';
import { observer } from 'mobx-react-lite';
import { store } from '../Store';
import isIP from 'validator/lib/isIP';

type ConnectionProps = {
  className?: string;
  tryConnect: () => void;
};

const ConnectionDisplay = observer((props: ConnectionProps) => {
  return (
    <div className={props.className}>
      <form className="p-2 flex flex-col text-white rounded-lg  text-sm shadow-black  max-w-sm border  shadow-md  bg-gray-800 border-gray-700">
        <div className="flex flex-row justify-between">
          <label>IP</label>
          <label>Connected: {String(store.connected)}</label>
        </div>
        <input
          className="my-1 outline-none border bg-gray-700 border-gray-600 ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-1"
          placeholder="IP"
          type="text"
          disabled={store.connected}
          value={store.ip}
          onClick={() => {
            console.log('clicked');
          }}
          onChange={(e) => {
            store.ip = e.target.value;
            if (isIP(store.ip)) {
              console.log('valid ip');
              props.tryConnect();
            }
          }}
        />
        <fieldset
          disabled={store.previousIP === '' || store.connected}
          className="disabled:hidden flex flex-col"
        >
          <label className="mt-2">Previous Connection</label>
          <input
            type="button"
            className="bg-gray-700 rounded-md p-1 text-left border-gray-600 border mt-1 hover:bg-gray-800 transition-all"
            placeholder="Previous Connection"
            value={store.previousIP}
            onClick={() => {
              store.ip = store.previousIP;
              props.tryConnect();
            }}
          />
        </fieldset>
        <input
          type="button"
          value="Disconnect"
          className="bg-gray-700 rounded-md p-1 border-gray-600 border disabled:hidden mt-1 hover:bg-gray-800 transition-all"
          disabled={!store.connected}
          onClick={() => {
            store.connected = false;
            store.ip = '';
          }}
        />
      </form>
    </div>
  );
});

export default ConnectionDisplay;
