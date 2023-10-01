import React, { useEffect, useState } from "react";
import "./Homestyle.css";
import { useNavigate } from "react-router";
import fantasy from "../Pictures/fantasy.webp"

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
            <ul className="gridContainerHome">
 

              {latestBooks.map((book, index) => (
                <li key={index} className="gridItem">
                  <div onClick={() => goToBook(book)} className="book">
                    <img src={fantasy} alt={book.title} className="bookCover"/>
                    <p id="bookTitle">{book.title} <span>Pages: {book.totalpages === null ? "0" : book.totalpages}</span></p>
                  </div>
                </li>
              ))}
            </ul>
          </>): null}
    </>
  );
};

export default Home;
