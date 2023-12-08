import React,{useEffect,useState} from "react";
import "./libraryStyle.css"
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie';
import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import forest from "../picturesForBooks/forestSmall.webp"
import forestHut from "../picturesForBooks/hutInForestSmall.webp"
import Moon from "../picturesForBooks/moonSmall.webp"
import pinkForest from "../picturesForBooks/pinkForestSmall.webp"


const Library = () => {

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // 100 milliseconds = 0.1 seconds
  
    return () => clearTimeout(timer); // Clean up the timer
  }, []);
  

  const bookCoverImages = {
    Moon,
    Forest: forest,
    hutInForest: forestHut,
    pinkForest: pinkForest,
  };

  ChangeDocumentTitle("Library")

  const [books, setBooks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userLibrary = async () => {
      try {
        const token = Cookies.get("authToken")

        const res = await fetch(`http://localhost:3001/api/library/`, {
          method: "GET",
          headers: {  
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const response = await res.json();
          setBooks(response.data);
        } else {
          setBooks("error");
        }
      } catch (err) {
        navigate("/error")
      }
    };

    userLibrary();
  }, []);

  return (
    <>
      {isLoaded ? (
        <>
          <div id="tableHeadContainer">
            <div id="tableHead">
              <p id="tableText">Novel Title</p>
              <p id="progessText"><span> Your Progess </span></p>
            </div>
          </div>
          
          <div className="Library">
          {books === "error" ? <p id="noBooksText">We had error fetching your books</p> :
            books.length > 0 ? (
              <ul>
                {books.map((book) => (
                  <button className="bookItem" onClick={() => openBook(book)} key={book.bookid}>
                    <div id="novelTitleAndPicture">
                      <img src={bookCoverImages[book.bookcover]} alt={book.bookcover} id="libraryBookPicture" />
                      <p id="libraryBookTitle">{book.title}</p>
                    </div>
                    <span id="pageInfo"> Page: {book.currentPage}/{book.totalpages === null ? "0" : book.totalpages}</span>
                  </button>
                ))}
              </ul>
            ) : (
              <p id="noBooksText">Add your favorite books to your library so you never forget them!</p>
            )
          }
          </div>
        </>
      ) : null}
    </>
  );


  function openBook(book){
    navigate({pathname:"/book",search:`?id=${book.bookid}`})
  }

};

export default Library;

