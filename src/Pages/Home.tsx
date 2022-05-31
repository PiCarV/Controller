import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { store } from '../Store';
import { settingsStore } from '../StoreSettings';
import { configure, autorun } from 'mobx';
import io from 'socket.io-client';
import Gamepads from 'gamepads';
import { MdSettings } from 'react-icons/md';
import { ConnectionDisplay, VideoStream, Steering, Power } from '../Components';

let socket: any;

const TryConnect = (setCookie: any) => {
  socket = io(`http://${store.ip}:3000`);
  socket.on('connect', function () {
    console.log('connected');
    store.connected = true;
    setCookie('ip', store.ip, { path: '/' });
  });
  socket.on('disconnect', function () {
    store.connected = false;
  });
};

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
      steeringDown = true;
      if (store.connected) {
        socket.emit('steer', store.angle);
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
    powerDown = true;
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
});

// tell mobx not to warn
configure({
  enforceActions: 'never',
});

var powerDown = false;
var steeringDown = false;
const ElasticControls = setInterval(() => {
  //if power is not 0 pull it back to 0
  if (powerDown === false) {
    if (store.power > 0) {
      store.power--;
    } else if (store.power < 0) {
      store.power++;
    }
    if (store.connected) {
      //socket.emit('drive', store.power);
    }
  }
  if (steeringDown === false) {
    if (store.angle > settingsStore.steeringCenter) {
      store.angle--;
    } else if (store.angle < settingsStore.steeringCenter) {
      store.angle++;
    }
    if (store.connected) {
      //store.socket.emit('steer', store.angle);
    }
  }
}, 20);

const TurnSpeed: number = 10;
const PowerSpeed: number = 10;

const handleKeyDown = (e: any) => {
  if (e.keyCode === 87 && store.power + PowerSpeed <= 100) {
    powerDown = true;
    store.power = store.power + PowerSpeed;
    if (store.connected) {
      store.socket.emit('drive', store.power);
    }
  }
  if (e.keyCode === 83 && store.power - PowerSpeed >= -100) {
    powerDown = true;
    store.power = store.power - PowerSpeed;
    if (store.connected) {
      store.socket.emit('drive', store.power);
    }
  }
  if (e.keyCode === 65 && store.angle - TurnSpeed >= 0) {
    steeringDown = true;
    store.angle = store.angle - TurnSpeed;
    if (store.connected) {
      store.socket.emit('steer', store.angle);
    }
  }
  if (e.keyCode === 68 && store.angle + TurnSpeed <= 180) {
    steeringDown = true;
    store.angle = store.angle + TurnSpeed;
    if (store.connected) {
      store.socket.emit('steer', store.angle);
    }
  }
};

const handleKeyUp = (e: any) => {
  if (e.keyCode === 87 || e.keyCode === 83) {
    powerDown = false;
  } else if (e.keyCode === 65 || e.keyCode === 68) {
    steeringDown = false;
  }
};

const Home = observer(() => {
  // use effect better known as use foot gun
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    document.addEventListener('keyup', handleKeyUp, false);
  });

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
        tryConnect={TryConnect()}
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
