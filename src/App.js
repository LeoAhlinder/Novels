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
import ChapterSelection from "./chapterSelection/chapterSelection";
import ChapterPage from "./chapterPage/chapterPage";
import Workspace from "./Create/Workspace/Workspace";
import NovelWorkSpace from "./Create/Workspace/novelWorkSpace/novelWorkSpace";
import UnkownPage from "./404Site/unknown";

import CookiesForm from "./Components/CookiesForm/cookiesForm";

const App = () => {
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    const fetchServerStatus = async () => {
      const status = await checkServerStatus();
      setServerStatus(status);
    };
    fetchServerStatus();
  }, []);

  useEffect(() => {
    document.title = "Loading...";
  }, []);

  const checkServerStatus = async () => {
    return await fetch(`${process.env.REACT_APP_API_URL}/api/ping`)
      .then((response) => response.ok)
      .catch(() => false);
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
                <Route path="/:title" element={<BookPage />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/search" element={<SearchBar />} />
                <Route path="/popular" element={<MostPopular />} />
                /* Create */
                <Route path="/create" element={<Create />} />
                <Route path="/createnovel" element={<CreateNew />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/workspace/:book" element={<NovelWorkSpace />} />
                <Route path="/author/:authorName" element={<AuthorSite />} />
                <Route
                  path="/chapters/:authorName"
                  element={<ChapterSelection />}
                />
                <Route
                  path="/chapters/:bookname/:chapterNumber"
                  element={<ChapterPage />}
                />
                /* Admin Panel */
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/adminpanel" element={<AdminPanel />} />
                /* Error Site */
                <Route path="/error" element={<ErrorSite />} />
                <Route path="*" element={<UnkownPage />} />
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
      <CookiesForm />
    </Router>
  );
};

export default App;
