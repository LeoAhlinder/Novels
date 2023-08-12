import React,{useEffect,useState} from "react";
import "./Libary.css"
import { useNavigate } from "react-router-dom"


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
          // Assuming your response.data contains the array of books
          console.log(response.data)
          setBooks(response.data);
        } else {
          console.log("error");
        }
      } catch (err) {
        console.log(err);
      }
    };

    userLibrary(1); // Replace 1 with the actual userId
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
        <p>No books</p>
    )}
</div>

  );


  function openBook(book){
    console.log(book)
    navigate({pathname:"/book",search:`?id=${book.bookid}`})
  }

};

//Logo,Title,TotalPages,CurrentPage
//Libary()


export default Library;

