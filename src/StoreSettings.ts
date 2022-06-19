import { action, makeAutoObservable, observable, autorun } from 'mobx';
import { instanceOf } from 'prop-types';
import {
  readFromPersistentStore,
  writeToPersistentStore,
} from './PersistentStore';

//define store class which will be used to store data, add extra states here

class SettingsStore {
  //define your data here
  snapback: number = 1;
  steeringLimit: number = 90;
  steeringCenter: number = 90;
  powerLimit: number = 100;
  dataOutput: string = '';
  captureRate: number = 600;

  constructor() {
    makeAutoObservable(this);
    this.fetchSettings();

    // monitor changes to the settings and write them to the persistent store when they change
    autorun(() => {
      console.log('autorun');
      writeToPersistentStore('steeringLimit', this.steeringLimit.toString());
      writeToPersistentStore('steeringCenter', this.steeringCenter.toString());
      writeToPersistentStore('powerLimit', this.powerLimit.toString());
      writeToPersistentStore('dataOutput', this.dataOutput);
      writeToPersistentStore('captureRate', this.captureRate.toString());
    });
  }
  //you can add functions to manipulate data here

  fetchSettings() {
    readFromPersistentStore('steeringLimit').then((value) => {
      if (value) {
        this.steeringLimit = Number(value);
      } else {
        this.steeringLimit = 90;
      }
    });
    readFromPersistentStore('steeringCenter').then((value) => {
      if (value) {
        this.steeringCenter = Number(value);
      } else {
        this.steeringCenter = 90;
      }
    });
    readFromPersistentStore('powerLimit').then((value) => {
      if (value) {
        this.powerLimit = Number(value);
      } else {
        this.powerLimit = 100;
      }
    });
    readFromPersistentStore('dataOutput').then((value) => {
      if (value) {
        this.dataOutput = value;
      } else {
        this.dataOutput = '';
      }
    });
    readFromPersistentStore('captureRate').then((value) => {
      if (value) {
        this.captureRate = Number(value);
      } else {
        this.captureRate = 600;
      }
    });
  }
}

export const settingsStore = new SettingsStore();
