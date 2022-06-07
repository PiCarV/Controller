import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { store } from '../Store';
import { settingsStore } from '../StoreSettings';
import { configure } from 'mobx';
import Gamepads from 'gamepads';
import { MdSettings } from 'react-icons/md';
import { ConnectionDisplay, VideoStream, Steering, Power } from '../Components';
import { TryConnect, socket } from '../Backend/Connector';
import {
  readFromPersistentStore,
  writeToPersistentStore,
} from '../PersistentStore';

Gamepads.start();
// Set's up the gampads event listener
Gamepads.addEventListener('connect', (e: any) => {
  console.log('Gamepad connected');
  e.gamepad.addEventListener(
    'joystickmove',
    (e: any) => {
      store.angle =
        Number(settingsStore.steeringCenter) +
        Number(e.gamepad.gamepad.axes[0]) * Number(settingsStore.steeringLimit);
      store.steeringDown = true;
      if (store.connected) {
        //socket.emit('steer', store.angle);
      }
    },
    [0],
  );
  e.gamepad.addEventListener(
    'joystickmove',
    (e: any) => {
      console.log(e.gamepad.gamepad.axes[3]);
      if (store.connected) {
        socket.emit('pan', e.gamepad.gamepad.axes[2] * -90 + 90);
        socket.emit('tilt', -e.gamepad.gamepad.axes[3] * 90 + 90);
      }
    },
    [2, 3],
  );
  e.gamepad.addEventListener('buttonvaluechange', (e: any) => {
    store.powerDown = true;
    store.power =
      e.gamepad.gamepad.buttons[7].value * settingsStore.powerLimit -
      e.gamepad.gamepad.buttons[6].value * settingsStore.powerLimit;
    if (store.connected) {
      //socket.emit('drive', store.power);
    }
  });
});

Gamepads.addEventListener('disconnect', (e: any) => {
  console.log('Gamepad disconnected');
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
  }
  if (
    e.keyCode === 65 ||
    e.keyCode === 68 ||
    e.keyCode === 37 ||
    e.keyCode === 39
  ) {
    store.steeringDown = false;
    store.angle = settingsStore.steeringCenter;
  }
};

const Home = observer(() => {
  // use effect better known as use foot gun
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    document.addEventListener('keyup', handleKeyUp, false);
    writeToPersistentStore('previousIP', '192.168.0.100');
    readFromPersistentStore('previousIP')
      .then((ip: any) => {
        console.log(ip);
      })
      .catch((err: any) => {
        console.log(err);
      });
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
            if (store.connected) {
              socket.emit('drive', store.power);
            }
          }
          if (store.steeringDown === false) {
            if (store.angle > settingsStore.steeringCenter) {
              store.angle--;
            } else if (store.angle < settingsStore.steeringCenter) {
              store.angle++;
            }
            if (store.connected) {
              socket.emit('steer', store.angle);
            }
          }
        }
      }
    }, 20);
  }, []);

  // Return the App component.
  return (
    <div className="">
      <Link to="/settings">
        <div className="absolute right-2 top-2 text-white text-4xl hover:rotate-45 transition-all">
          <MdSettings />
        </div>
      </Link>

      {/* IP connection code  top left*/}

      <ConnectionDisplay
        className="absolute left-2 top-2"
        tryConnect={TryConnect}
      />

      {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      {/* Steering Display Code Bottom Right */}
      <Steering socket={socket} />
      {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

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
