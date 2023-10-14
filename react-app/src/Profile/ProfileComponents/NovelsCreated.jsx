import React, { useEffect, useState } from "react";
import "./NCstyle.css"
import { useNavigate } from "react-router";

const NovelCreated = () =>{

    const navigate = useNavigate()

    const [books,setBooks] = useState([])

    useEffect(()=>{
        const fetchNovelsCreated = async () =>{

            const token = localStorage.getItem("authToken")

            const res = await fetch("http://localhost:3001/api/novelsCreated",{
                method:"GET",
                headers:{    
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${token}`}
            });
            if (res.ok){
                const response = await res.json()
                setBooks(response.data)
                console.log(response.data)
            }
        }
        fetchNovelsCreated();
    },[])

    function OpenBook(book){
        navigate({pathname:"/book",search:`?id=${book.bookid}`})
    }

    return(
        <div className="Novels">
        {books.length > 0 ? (
            <ul>
                {books.map((book) => (
                    <button className="BookList" key={book.bookid} onClick={() => OpenBook(book)}>
                        {book.title} - Page: {book.currentPage}
                    </button>
                ))}
            </ul>
        ) : (
            <p>No books</p>
        )}
    </div>
    )
}

export default NovelCreated;