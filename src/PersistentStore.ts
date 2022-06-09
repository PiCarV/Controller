// @ts-ignore
const Store = require('electron-store');
// function that can be used to write key value pairs to the persistent store

function writeToPersistentStore(key: string, value: string) {
  let store = new Store();
  store.set(key, value);
}

async function readFromPersistentStore(key: string) {
  let store = new Store();
  return store.get(key);
}

export { writeToPersistentStore, readFromPersistentStore };
