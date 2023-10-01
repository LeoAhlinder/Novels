import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from "./NavBar/header"
import Profile from "./Profile/Profile"
import BookPage from "./bookpage/bookpage"
import LogIn from "./logIn/logIn"
import Home from "./Home/Home"
import Create from "./Create/create"
import CreateNew from "./Create/createNew"
import SearchBar from './Search/search';
import MostPopular from './mostPopular/mostPopular';

const App = () => {
  const [serverStatus, setServerStatus] = useState(null); // Initialize with null

  useEffect(() => {
      const fetchServerStatus = async () => {
          const status = await checkServerStatus();
          setServerStatus(status);
      };

      fetchServerStatus();
  }, []);

  const checkServerStatus = async () => {
      return await fetch("http://localhost:3001/api/ping")
          .then(response => response.ok)
          .catch(() => false);
  };

  return (
      <Router>
          <div>
              {serverStatus !== null ? (
                  serverStatus ? (
                      <>
                          <Header />
                          <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/Profile" element={<Profile />} />
                              <Route path="/book" element={<BookPage />} />
                              <Route path="/login" element={<LogIn />} />
                              <Route path="/Search" element={<SearchBar />} />
                              <Route path="/create" element={<Create />} />
                              <Route path="/createNovel" element={<CreateNew />} />
                              <Route path="/popular" element={<MostPopular/>}></Route>
                          </Routes>
                      </>
                  ) : (
                    <div className='wrapper'>
                      <div className='serverDown'>We apologize for the inconvenience, but the server is currently experiencing downtime. Your patience is greatly appreciated.</div>
                    </div>
                  )
              ) : (
                <div className='wrapper'>
                  <div className='loader'></div>
                </div>
              )}
          </div>
      </Router>
  );
};


export default App;