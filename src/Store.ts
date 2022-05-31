import { action, makeAutoObservable, observable } from 'mobx';
import persistentStore from './PersistentStore';

type RetrieveSettings = () => Promise<string>;

// @ts-ignore
const retrieveSettings: RetrieveSettings = async () => {
  let storedIP = await persistentStore.get('previousIP');
  // return a string until we have a proper type
  return storedIP;
};

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
  ip: string = '192.168.0.10';

  //previous id's
  previousIP = '';

  constructor() {
    makeAutoObservable(this);
    this.fetchSettings();
  }
  //you can add functions to manipulate data here
  fetchSettings() {
    retrieveSettings().then((ip) => {
      this.previousIP = ip;
    });
  }
}

export const store = new Store();
