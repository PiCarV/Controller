import { action, makeAutoObservable, observable, autorun } from 'mobx';
import {
  readFromPersistentStore,
  writeToPersistentStore,
} from './PersistentStore';
//@ts-ignore
const ipcRenderer = require('electron').ipcRenderer;

//define store class which will be used to store data, add extra states here
class Store {
  //driving data
  angle: number = 90;
  power: number = 0;
  // snapback control when these are true the button is being held down
  // and the controls will not snap back to the center
  steeringDown: boolean = false;
  powerDown: boolean = false;
  //camera settings
  tilt: number = 90;
  pan: number = 90;
  // connection state
  connected = false;
  ip: string = '0.0.0.0';

  //recording
  recording = false;

  //previous ip
  previousIP = '';

  // gamepad connected
  gamepadConnected = false;

  constructor() {
    makeAutoObservable(this);
    this.fetchSettings();
    autorun(() => {
      ipcRenderer.send('steering', this.angle);
    });
  }

  //you can add functions to manipulate data here
  fetchSettings() {
    console.log('fetching settings');
    readFromPersistentStore('previousIP').then((value) => {
      console.log('retrieving previous ip');
      console.log(value);
      // @ts-ignore
      this.previousIP = String(value);
    });
  }
}

export const store = new Store();
