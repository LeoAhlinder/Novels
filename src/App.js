import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";

import Header from "./NavBar/header";
import Profile from "./Profile/Profile";
import BookPage from "./bookpage/bookpage";
import LogIn from "./logIn/logIn";
import Home from "./Home/Home";
import Create from "./Create/create";
import CreateNew from "./Create/createNew";
import SearchBar from "./Search/search";
import MostPopular from "./mostPopular/mostPopular";
import AuthorSite from "./authorSite/authorSite";

const App = () => {
  const [serverStatus, setServerStatus] = useState(null);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const fetchServerStatus = async () => {
      const status = await checkServerStatus();
      setServerStatus(status);
    };

    fetchServerStatus();
    if (serverStatus == true) {
      checkToken();
    }
  }, []);

  const checkServerStatus = async () => {
    return await fetch("http://localhost:3001/api/ping")
      .then((response) => response.ok)
      .catch(() => false);
  };

  const checkToken = async () => {
    const token = Cookies.get("authToken");

    const res = await fetch("http://localhost:3001/api/protected", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await res.json();

    if (response.message === "this is protected") {
      setValidToken(true);
    } else {
      setValidToken(false);
    }
  };

  return (
    <Router>
      <div>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
                <Route
                  path="/create"
                  element={validToken ? <Create /> : <LogIn />}
                />
                <Route
                  path="/createNovel"
                  element={validToken ? <CreateNew /> : <LogIn />}
                />
                <Route path="/popular" element={<MostPopular />}></Route>
                <Route
                  path="/author/:authorName"
                  element={<AuthorSite />}
                ></Route>
              </Routes>
            </>
          ) : (
            <div className="wrapper">
              <div className="serverDown">
                We apologize for the inconvenience, but the server is currently
                experiencing downtime. Your patience is greatly appreciated.
              </div>
            </div>
          )
        ) : (
          <div className="wrapper">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
