import React, { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import {
  readFromPersistentStore,
  writeToPersistentStore,
} from './PersistentStore';

import './App.css';

//import the different pages from the pages folder
//add your own pages here
import { Home, Settings } from './Pages';

const App = () => {
  //writeToPersistentStore('previousIP', '192.168.0.100');
  //console.log(readFromPersistentStore('previousIP'));

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
