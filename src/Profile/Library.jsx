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

  ChangeDocumentTitle("Library | Novels")

  const [books, setBooks] = useState([]);
  const [loading, changeLoading] = useState(false);
  const [showPageProgress, changeShowPageProgress] = useState(true);

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
          if (response.data.length > 0){
            setBooks(response.data);
          }else{
            setBooks([])
            changeShowPageProgress(false)
          }
        } else {
          setBooks("error")
          changeShowPageProgress(false)
        }
        changeLoading(false)
      } catch (err) {
        navigate("/error")
      }
    };

    userLibrary();
  }, []);

  function openBook(book){
    navigate({pathname:`/novel/${book.title}`})
  }

  return (
    <>
      {loading === false ? 
        <BookList
          books={books}
          openBook={openBook}
          bookCoverImages={bookCoverImages}
          showPageProgress={showPageProgress}
          showText={showPageProgress}
          textIfEmpty="Add your favorite books to your library so you never forget them!"
          loading={loading}
        /> 
        : 
        null
    }
    </>
  );
};

export default Library;

