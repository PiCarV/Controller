import io from 'socket.io-client';
import { store } from '../Store';
import { writeToPersistentStore } from '../PersistentStore';
import { settingsStore } from '../StoreSettings';
import { Store } from 'react-notifications-component';

let socket: any;

const TryConnect = () => {
  socket = io(`http://${store.ip}:3000`);
  socket.on('connect', function () {
    console.log('connected');
    store.connected = true;
    store.previousIP = store.ip;
    writeToPersistentStore('previousIP', store.ip);
    Store.addNotification({
      title: 'Connected!',
      message: 'Connected to ' + store.ip,
      type: 'success',
      insert: 'top',
      container: 'top-center',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 3000,
        onScreen: true,
      },
    });
  });
  socket.on('disconnect', function () {
    Disconnect();
    Store.addNotification({
      title: 'Disconnected!',
      message: "You've been disconnected from " + store.previousIP,
      type: 'danger',
      insert: 'top',
      container: 'top-center',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 3000,
        onScreen: true,
      },
    });
  });
};

const Disconnect = () => {
  socket.emit('drive', 0);
  socket.emit('steer', settingsStore.steeringCenter);
  store.ip = '';
  store.connected = false;
  socket.disconnect();
  socket = null; // destroy the socket
};

export { TryConnect, Disconnect, socket };
