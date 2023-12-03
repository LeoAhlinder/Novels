import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Cookies from "js-cookie";

import Header from "./navbar/navbar";
import Profile from "./Profile/Profile";
import BookPage from "./bookPage/bookPage";
import LogIn from "./logIn/logIn";
import Home from "./Home/Home";
import Create from "./Create/create";
import CreateNew from "./Create/createNew";
import SearchBar from "./Search/search";
import MostPopular from "./mostPopular/mostPopular";
import AuthorSite from "./authorSite/authorSite";
import AdminLogin from "./Admin/adminLogin/adminLogin";
import AdminPanel from "./Admin/adminPanel/adminPanel";
import ErrorSite from "./errorSite/errorSite";

const App = () => {
  const [serverStatus, setServerStatus] = useState(null);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const fetchServerStatus = async () => {
      const status = await checkServerStatus();
      setServerStatus(status);
    };
    fetchServerStatus();
  }, []);

  useEffect(() => {
    if (serverStatus === true) {
      checkToken();
    }
  }, [serverStatus]);

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
                <Route path="/profile" element={<Profile />} />
                <Route path="/book" element={<BookPage />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/search" element={<SearchBar />} />
                <Route path="/create" element={<Create />} />
                <Route
                  path="/createnovel"
                  element={<CreateNew />}
                />
                <Route path="/popular" element={<MostPopular />}></Route>
                <Route
                  path="/author/:authorName"
                  element={<AuthorSite />}
                ></Route>
                /* Admin Panel */
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/adminpanel" element={<AdminPanel />} />

                /* Error Site */
                <Route path="/error" element={<ErrorSite />} />
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
