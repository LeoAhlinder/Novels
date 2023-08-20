import React, { useEffect, useState } from "react";
import "./Homestyle.css";
import LibraryPicBig from "../Pictures/librarypic_3_1280x300.jpg";
import { useNavigate } from "react-router";

const Home = () => {
  const [latestBooks, setLatestBooks] = useState([]);
  const navigate = useNavigate()

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

  const goToBook = (book) =>{
    navigate({pathname:"/book",search:`?id=${book.bookid}`})
  }

  return (
    <div>
      {latestBooks.length > 0 ? ( <>
            <div className="homeIntro">
              <img src={LibraryPicBig} alt="" />
            </div>
            <ul className="homeWrapper">
              <ul className="grid-container">
                {latestBooks.map((book, index) => (
                  <li key={index} className="grid-item">
                    <img src={book.bookcover} alt="bookCover" type="button"/>
                    <br />
                    <button className="Title" onClick={() =>goToBook(book)}>{book.title} </button>
                  </li>
                ))}
              </ul>
            </ul>
            </>): null}
    </div>
  );
};

export default Home;
