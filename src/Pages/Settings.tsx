import React from 'react';
import { observer } from 'mobx-react-lite';
import { MdArrowBack } from 'react-icons/md';
import { GiSteeringWheel, GiElectric, GiOpenFolder } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { settingsStore } from '../StoreSettings';
// @ts-ignore
const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('selectedDirectory', (event: any, message: string) => {
  settingsStore.dataOutput = message;
});

const Settings = observer(() => {
  return (
    <div className="m-4">
      <h1 className="text-white mb-4 ml-4 text-lg font-semibold">Settings</h1>
      <div className="w-full text-white bg-gray-700 rounded-lg border border-gray-600">
        <Link to="/">
          <button
            type="button"
            className="inline-flex relative items-center py-2 px-4 w-full text-sm font-medium rounded-t-lg border-b border-gray-600 hover:bg-gray-800 transition-all"
          >
            <MdArrowBack className="mr-2 text-lg" />
            Back
          </button>
        </Link>

        <div className="inline-flex transition-all relative items-center py-2 px-4 w-full text-sm font-medium border-b border-gray-600 hover:bg-gray-800">
          <GiSteeringWheel className="mr-2 text-lg" />
          Steering Limits
          <input
            className="ml-auto"
            min={0}
            max={90}
            value={settingsStore.steeringLimit}
            onChange={(e) =>
              (settingsStore.steeringLimit = Number(e.target.value))
            }
            type="range"
          />
          <label className="ml-2">{settingsStore.steeringLimit}°</label>
        </div>
        <div className="inline-flex transition-all relative items-center py-2 px-4 w-full text-sm font-medium border-b border-gray-600 hover:bg-gray-800">
          <GiSteeringWheel className="mr-2 text-lg" />
          Steering Center
          <input
            type="range"
            min={0}
            max={180}
            value={settingsStore.steeringCenter}
            onChange={(e) => {
              settingsStore.steeringCenter = Number(e.target.value);
            }}
            className="ml-auto"
          />
          <label className="ml-2">{settingsStore.steeringCenter}</label>
        </div>
        <div className="inline-flex transition-all relative items-center border-b border-gray-600 py-2 px-4 w-full text-sm font-medium hover:bg-gray-800">
          <GiElectric className="mr-2 text-lg" />
          Power Limit
          <input
            min={0}
            max={100}
            type="range"
            className="ml-auto"
            value={settingsStore.powerLimit}
            onChange={(e) => {
              settingsStore.powerLimit = Number(e.target.value);
            }}
          />
          <label className="ml-2">{settingsStore.powerLimit} %</label>
        </div>
        <div className="inline-flex transition-all relative items-center border-b border-gray-600 py-2 px-4 w-full text-sm font-medium hover:bg-gray-800">
          <GiElectric className="mr-2 text-lg" />
          Capture Rate
          <input
            min={200}
            max={2000}
            type="range"
            className="ml-auto"
            value={settingsStore.captureRate}
            onChange={(e) => {
              settingsStore.captureRate = Number(e.target.value);
            }}
          />
          <label className="ml-2">{settingsStore.captureRate} ms</label>
        </div>
        <div
          className="inline-flex transition-all relative items-center py-2 px-4 w-full text-sm font-medium rounded-b-lg hover:bg-gray-800"
          onClick={() => {
            ipcRenderer.send('selectDirectory');
          }}
        >
          <div className="flex w-full">
            <GiOpenFolder className="mr-2 text-lg" />
            Data Output
          </div>
          <div className="text-right w-full flex justify-end">
            <div className="border rounded-md border-gray-600 w-auto p-1">
              {settingsStore.dataOutput}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Settings;
