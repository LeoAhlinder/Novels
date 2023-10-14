import React,{useEffect,useState} from "react";
import "./Libary.css"
import { useNavigate } from "react-router-dom"
import ErrorHandler from "../global/errorHandler";

const Library = () => {
  const [books, setBooks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userLibrary = async () => {
      try {

        const token = localStorage.getItem("authToken")


        const res = await fetch(`http://localhost:3001/api/library/`, {
          method: "GET",
          headers: {  
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: `Bearer ${token}`

          },
        });

        if (res.ok) {
          const response = await res.json();
          setBooks(response.data);
        } else {
          let error = ErrorHandler(res)
          alert(error.message)
          if (error.navigate.length > 0){
              navigate(error.navigate)
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    userLibrary();
  }, []);

  return (
    <div className="Library">
    {books.length > 0 ? (
        <ul>
            {books.map((book) => (
                <button className="BookList" onClick={() => openBook(book)} key={book.bookid}>
                    {book.title} - Page: {book.currentPage}
                </button>
            ))}
        </ul>
    ) : (
        <p id="noBooksText">Add your favorite books to your library so you never forget them!</p>
    )}
</div>

  );


  function openBook(book){
    navigate({pathname:"/book",search:`?id=${book.bookid}`})
  }

};

export default Library;

