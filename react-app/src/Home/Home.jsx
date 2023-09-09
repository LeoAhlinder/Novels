import React, { useEffect, useState } from "react";
import "./Homestyle.css";
import LibraryPicBig from "../Pictures/librarypic_3_1280x300.jpg";
import { useNavigate } from "react-router";
import catPic from "../Pictures/coolcat.jpg"

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
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <h3 className="homeIntro">Welcome to the world of books</h3>

      {latestBooks.length > 0 ? ( <>
            <ul className="homeWrapper">
              <ul className="grid-container">
                {latestBooks.map((book, index) => (
                  <li key={index} className="grid-item">
                    <img src={catPic} alt="bookCover" type="button" className="bookCover" onClick={() =>goToBook(book)}/>
                    <br />
                    <button className="Title" onClick={() =>goToBook(book)}>{book.title} </button>
                  </li>
                ))}
              </ul>
            </ul>
            </>): null}
    </>
  );
};

export default Home;
