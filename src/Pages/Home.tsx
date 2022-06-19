import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { store } from '../Store';
import { settingsStore } from '../StoreSettings';
import { configure } from 'mobx';
import Gamepads from 'gamepads';
import {
  BsRecordCircle,
  BsFillStopCircleFill,
  BsGearFill,
} from 'react-icons/bs';
import {
  ConnectionDisplay,
  VideoStream,
  Steering,
  Power,
  Gamepad,
  Recorder,
} from '../Components';
import { TryConnect, socket } from '../Backend/Connector';
import {
  readFromPersistentStore,
  writeToPersistentStore,
} from '../PersistentStore';

// @ts-ignore
const ipcRenderer = require('electron').ipcRenderer;

console.log(readFromPersistentStore('previousIP'));

Gamepads.start();

// Set's up the gampads event listener
Gamepads.addEventListener('connect', (e: any) => {
  store.gamepadConnected = true;
  console.log('Gamepad connected');
  e.gamepad.addEventListener(
    'joystickmove',
    (e: any) => {
      store.angle =
        Number(settingsStore.steeringCenter) +
        Number(e.gamepad.gamepad.axes[0]) * Number(settingsStore.steeringLimit);
      store.steeringDown = true;
      if (store.connected) {
        socket.emit('steer', store.angle);
      }
    },
    [0],
  );
  //e.gamepad.addEventListener(
  //  'joystickmove',
  //  (e: any) => {
  //    console.log(e.gamepad.gamepad.axes[3]);
  //    if (store.connected) {
  //      socket.emit('pan', e.gamepad.gamepad.axes[3] * -90 + 90);
  //      socket.emit('tilt', -e.gamepad.gamepad.axes[2] * 90 + 90);
  //    }
  //  },
  //  [2, 3],
  //);
  e.gamepad.addEventListener('buttonvaluechange', (e: any) => {
    store.powerDown = true;
    store.power =
      e.gamepad.gamepad.buttons[7].value * settingsStore.powerLimit -
      e.gamepad.gamepad.buttons[6].value * settingsStore.powerLimit;
    if (store.connected) {
      socket.emit('drive', store.power);
    }
  });
});

Gamepads.addEventListener('disconnect', (e: any) => {
  console.log('Gamepad disconnected');
  store.gamepadConnected = false;
});

// tell mobx not to warn
configure({
  enforceActions: 'never',
});

const TurnSpeed: number = 10;
const PowerSpeed: number = 10;

const handleKeyDown = (e: any) => {
  if (e.keyCode === 87 || e.keyCode === 38) {
    store.powerDown = true;
    store.power = settingsStore.powerLimit;
    if (store.connected) {
      socket.emit('drive', settingsStore.powerLimit);
    }
  }
  if (e.keyCode === 83 || e.keyCode === 40) {
    store.powerDown = true;
    store.power = -settingsStore.powerLimit;
    if (store.connected) {
      socket.emit('drive', -settingsStore.powerLimit);
    }
  }
  if (e.keyCode === 65 || e.keyCode === 37) {
    store.steeringDown = true;
    store.angle = settingsStore.steeringCenter - settingsStore.steeringLimit;
    if (store.connected) {
      socket.emit(
        'steer',
        settingsStore.steeringCenter - settingsStore.steeringLimit,
      );
    }
  }
  if (e.keyCode === 68 || e.keyCode === 39) {
    store.steeringDown = true;
    store.angle = settingsStore.steeringCenter + settingsStore.steeringLimit;
    if (store.connected) {
      socket.emit(
        'steer',
        settingsStore.steeringLimit + settingsStore.steeringCenter,
      );
    }
  }
};

const handleKeyUp = (e: any) => {
  if (
    e.keyCode === 87 ||
    e.keyCode === 83 ||
    e.keyCode === 38 ||
    e.keyCode === 40
  ) {
    store.powerDown = false;
    store.power = 0;
    socket.emit('drive', 0);
  }
  if (
    e.keyCode === 65 ||
    e.keyCode === 68 ||
    e.keyCode === 37 ||
    e.keyCode === 39
  ) {
    store.steeringDown = false;
    store.angle = settingsStore.steeringCenter;
    socket.emit('steer', settingsStore.steeringCenter);
  }
};

const Home = observer(() => {
  // use effect better known as use foot gun
  // if we have issues and bugs look here
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    document.addEventListener('keyup', handleKeyUp, false);
  }, []);

  useEffect(() => {
    const ElasticControls = setInterval(() => {
      //if power is not 0 pull it back to 0
      if (socket !== undefined && store.connected) {
        {
          if (store.powerDown === false) {
            if (store.power > 0) {
              store.power--;
            } else if (store.power < 0) {
              store.power++;
            }
            if (store.connected && store.power !== 0) {
              socket.emit('drive', store.power);
            }
          }
          if (store.steeringDown === false) {
            if (store.angle > settingsStore.steeringCenter) {
              store.angle--;
            } else if (store.angle < settingsStore.steeringCenter) {
              store.angle++;
            }
            if (
              store.connected &&
              store.angle !== settingsStore.steeringCenter
            ) {
              socket.emit('steer', store.angle);
            }
          }
        }
      }
    }, 80);
  }, []);

  // Return the App component.
  return (
    <div className="">
      <div className="absolute right-2 top-2 text-white text-3xl  ">
        <div className="flex flex-row space-x-2">
          <Recorder
            recording={store.recording}
            onClick={() => {
              store.recording = !store.recording;
              if (store.connected) {
                ipcRenderer.send('recording', [
                  store.recording,
                  settingsStore.dataOutput,
                  store.ip,
                ]);
              }
              if (!store.connected) {
                ipcRenderer.send('recording', [
                  false,
                  settingsStore.dataOutput,
                  store.ip,
                ]);
              }
            }}
          />
          <Link to="/settings">
            <BsGearFill className="hover:rotate-45 transition-all" />
          </Link>
        </div>
      </div>

      {/* IP connection code  top left*/}

      <ConnectionDisplay
        className="absolute left-2 top-2"
        tryConnect={TryConnect}
      />

      {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      {/* Steering Display Code Bottom Right */}
      <Steering socket={socket} />
      {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      {/* Game Controller Display Center */}
      <Gamepad
        className="fixed bottom-2 left-1/2 -translate-x-1/2"
        connected={store.gamepadConnected}
      />

      {/* Power Display Code Bottom Left */}
      <Power socket={socket} />
      {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      {/* Video Stream Code */}
      <div className="flex w-full h-full justify-center align-middle">
        <VideoStream ip={store.ip} connected={store.connected} />
      </div>
      {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
    </div>
  );
});

export default Home;
