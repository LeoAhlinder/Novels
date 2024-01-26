import React,{useEffect,useState} from "react";
import "./libraryStyle.css"
import { useNavigate } from "react-router-dom"
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
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userLibrary = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/library/`, {
          method: "GET",
          headers: {  
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Allow-Credentials": "true"
          },
          credentials: 'include',
        });
        if (res.ok) {
          const response = await res.json();
          setBooks(response.data);
        } else {
          setBooks("error");
        }
        setIsLoaded(true)
      } catch (err) {
        navigate("/error")
      }
    };

    userLibrary();
  }, []);

  function openBook(book){
    navigate({pathname:`/${book.title}`})
  }

  return (
    <>
      {isLoaded ? 
        <BookList
          books={books}
          openBook={openBook}
          bookCoverImages={bookCoverImages}
          showPageProgress={true}
          textIfEmpty="Add your favorite books to your library so you never forget them!"
          isLoaded={isLoaded}
        /> 
        : 
        null
    }
    </>
  );
};

export default Library;

