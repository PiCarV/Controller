import { Store } from 'tauri-plugin-store-api';

// function that can be used to write key value pairs to the persistent store
async function writeToPersistentStore(key: string, value: string) {
  let store = new Store('.settings.dat');
  await store.set(key, value);
}

async function readFromPersistentStore(key: string) {
  let store = new Store('.settings.dat');
  return await store
    .get(key)
    .then((value) => {
      return value;
    })
    .catch((error) => {
      console.log(error);
      return '';
    });
}

export { writeToPersistentStore, readFromPersistentStore };
