import React, { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
//import persistentStore from './PersistentStore';

import './App.css';

//import the different pages from the pages folder
//add your own pages here
import { Home, Settings } from './Pages';

const App = () => {
  //useEffect(() => {
  //  persistentStore.load();
  //}, []);

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
