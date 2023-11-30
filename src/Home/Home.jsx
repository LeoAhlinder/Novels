import React, { useEffect, useState } from "react";
import "./Homestyle.css";
import { useNavigate } from "react-router";
import fantasy from "../Pictures/forest.webp"
import ErrorHandler from "../global/errorHandler";

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
          if (response.books == undefined){
            setLatestBooks([]); // Store fetched data in state
          }else{
            setLatestBooks(response.books); // Store fetched data in state

          }
        }
        else{
          let error = ErrorHandler(res)
          alert(error.message)
          if (error.navigate.length > 0){
            navigate(error.navigate)
          }
        }
      } catch (err) {
        let errorCatch = ErrorHandler(err)
        alert(errorCatch.message)
        if (errorCatch.navigate.length > 0){
          navigate(errorCatch.navigate)
        }
      }
    };

    fetchLatestReleases();
  },[navigate]);

  const goToBook = (book) =>{
    navigate({pathname:"/book",search:`?id=${book.bookid}`})
  }

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <h3 className="homeIntro">Welcome to the World of Books</h3>

      {latestBooks.length > 0 || latestBooks != null ? ( <>
            <ul className="gridContainerHome">
              {latestBooks.map((book, index) => (
                <li key={index} className="gridItem">
                  <div onClick={() => goToBook(book)} className="book">
                    <img src={fantasy} alt={book.title} className="bookCover"/>
                    <p id="bookTitle">{book.title}  <br /> <span>Chapters: {book.totalpages === null ? "0" : book.totalpages}</span></p>
                  </div>
                </li>
              ))}
            </ul>
          </>): <div className="loading">Loading...</div>}
    </>
  );
};

export default Home;
