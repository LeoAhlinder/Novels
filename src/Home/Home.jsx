import React, { useEffect, useState } from "react";
import "./homeStyle.css";
import { useNavigate } from "react-router";

import landscape from "../Pictures/fantasyLandscape.webp"

import BookListGrid from "../Components/Books/bookListGrid";
import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import forest from "../picturesForBooks/forest.webp"
import forestHut from "../picturesForBooks/hutInForest.webp"
import Moon from "../picturesForBooks/moon.webp"
import pinkForest from "../picturesForBooks/pinkForest.webp"

const Home = () => {

  const bookCoverImages = {
    Moon,
    Forest: forest,
    hutInForest: forestHut,
    pinkForest: pinkForest,
  };

  const [latestBooks, setLatestBooks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate()

  ChangeDocumentTitle("Light Novels")

  useEffect(() => {
    const fetchLatestReleases = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/latest`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const response = await res.json();
          if (response.books === undefined || response.error === "error"){
            setLatestBooks([]);
          }
          else{
            setLatestBooks(response.books); 
          }
          setIsLoaded(true)
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
    navigate({pathname:`novel/${book.title}`})
  }

  return (
    <>  
      {isLoaded ?
      <>
        <div id="introHeader">
          <h2 className="introText">Welcome to your online library!</h2>
          <h3 className="introText">A place to create and read novels online for free.</h3>
          <img src={landscape} alt="Fantasy Landscape" id="introImg"/>
        </div>

        <BookListGrid 
          books={latestBooks} 
          goToBook={goToBook} 
          bookCoverImages={bookCoverImages} 
          noBooksFoundText="We had an error fetching the books; please try again!"
        /> 
      </> 
      : null}
      
    </>
  );
};

export default Home;
