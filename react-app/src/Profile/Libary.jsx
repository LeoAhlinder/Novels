import React,{useEffect,useState} from "react";
import "./Libary.css"

const Library = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const userLibrary = async (userId) => {
      try {
        const res = await fetch(`http://localhost:3001/api/library/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const response = await res.json();
          // Assuming your response.data contains the array of books
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
      <ul>
        {books.map((book) => (
          <button className="BookList" onClick={() => openBook(book.bookid)} key={book.bookid}>
            {book.title} - Page: {book.currentPage}
          </button>
        ))}
      </ul>
    </div>
  );


  function openBook(id){
    console.log(id)
    
  }

};

//Logo,Title,TotalPages,CurrentPage
//Libary()


export default Library;

