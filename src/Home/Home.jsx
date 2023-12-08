import React, { useEffect, useState } from "react";
import "./homeStyle.css";
import { useNavigate } from "react-router";

import landscape from "../Pictures/fantasyLandscape.webp"

import ChangeDocumentTitle from "../Global/changeDocumentTitle";

//Different images for the books
import forest from "../picturesForBooks/forest.webp"
import forestHut from "../picturesForBooks/hutInForest.webp"
import moon from "../picturesForBooks/moon.webp"
import pinkForest from "../picturesForBooks/pinkForest.webp"



const Home = () => {
  const [latestBooks, setLatestBooks] = useState([]);
  const navigate = useNavigate()

  ChangeDocumentTitle("Light Novels")


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
          if (response.books === undefined){
            setLatestBooks([]); // Store fetched data in state
          }else{
            setLatestBooks(response.books); // Store fetched data in state

          }
        }
        else{
          navigate("/error")
        }
      } catch (err) {
        navigate("/error")
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

      <div id="introHeader">
        <h2 className="introText">Welcome to your online library!</h2>
        <h3 className="introText">A place to create and read books online for free.</h3>
        <img src={landscape} alt="Fantasy Landscape" id="introImg"/>
      </div>

      {latestBooks.length > 0 ? ( <>
            <ul className="gridContainerHome">
              {latestBooks.map((book, index) => (
                <li key={index} className="gridItem">
                  <div onClick={() => goToBook(book)} className="book">
                    <img src={pinkForest} alt={book.title} className="bookCover"/>
                    <p id="bookTitle">{book.title}<br/><span>Chapters: {book.totalpages === null ? "0" : book.totalpages}</span></p>
                  </div>
                </li>
              ))}
            </ul>
          </>): 
          <div id="Error">
           <p id="errorTextHome">We had an error fetching the books; please try again!</p>
          </div>}
    </>
  );
};

export default Home;
