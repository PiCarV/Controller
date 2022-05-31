import { action, makeAutoObservable, observable } from 'mobx';
import { instanceOf } from 'prop-types';

//define store class which will be used to store data, add extra states here

class SettingsStore {
  //define your data here
  snapback: number = 1;
  steeringLimit: number = 90;
  steeringCenter: number = 90;
  powerLimit: number = 100;

  constructor() {
    this.snapback = 1;
    this.steeringLimit = 90;
    this.powerLimit = 100;
    this.steeringCenter = 90;
    makeAutoObservable(this);
  }
  //you can add functions to manipulate data here
}

export const settingsStore = new SettingsStore();
