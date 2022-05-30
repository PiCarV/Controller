import { Store } from 'tauri-plugin-store-api';

const persistentStore = new Store('.settings.dat');
export default persistentStore;
