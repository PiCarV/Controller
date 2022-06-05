import { action, makeAutoObservable, observable } from 'mobx';
import { readFromPersistentStore } from './PersistentStore';
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

  //previous ip
  previousIP = '';

  constructor() {
    makeAutoObservable(this);
    this.fetchSettings();
  }
  //you can add functions to manipulate data here
  fetchSettings() {
    console.log('fetching settings');
    readFromPersistentStore('previousIP').then((value) => {
      console.log('retrieving previous ip');
      console.log(value);
      // @ts-ignore
      this.previousIP = Number(value);
    });
  }
}

export const store = new Store();
