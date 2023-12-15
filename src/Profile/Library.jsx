import React,{useEffect,useState} from "react";
import "./libraryStyle.css"
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie';
import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import forest from "../picturesForBooks/forestSmall.webp"
import forestHut from "../picturesForBooks/hutInForestSmall.webp"
import Moon from "../picturesForBooks/moonSmall.webp"
import pinkForest from "../picturesForBooks/pinkForestSmall.webp"

import BookList from "../Components/Books/bookListProfile"

const Library = () => {

  const bookCoverImages = {
    Moon: Moon,
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

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/library/`, {
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
   <BookList
    books={books}
    openBook={openBook}
    bookCoverImages={bookCoverImages}
    showPageProgress={true}
    textIfEmpty="Add your favorite books to your library so you never forget them!"
   />
  );


  function openBook(book){
    navigate({pathname:"/book",search:`?id=${book.bookid}`})
  }

};

export default Library;

