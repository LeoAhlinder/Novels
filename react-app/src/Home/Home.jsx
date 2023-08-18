import React, { useEffect, useState } from "react";
import "./Homestyle.css";
import LibraryPicBig from "../Pictures/librarypic_3_1280x300.jpg";

const Home = () => {
  const [latestBooks, setLatestBooks] = useState([]);

  useEffect(() => {
    const fetchLatestReleases = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/latest", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const response = await res.json();
          setLatestBooks(response.books); // Store fetched data in state
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchLatestReleases();
  },[]);

  return (
    <div>
      <div className="homeIntro">
        <img src={LibraryPicBig} alt="" />
      </div>
      <ul className="homeWrapper">
        <ul className="grid-container">
          {latestBooks.map((book, index) => (
            <li key={index} className="grid-item">
              <img src={book.bookcover} alt="bookCover" className="grid-picture"/>
              {book.title} 
              <br />
              {book.totalpages}
              <br />
              {book.release_date}

            </li>
          ))}
        </ul>
      </ul>
    </div>
  );
};

export default Home;
