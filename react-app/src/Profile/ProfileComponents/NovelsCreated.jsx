import React, { useEffect, useState } from "react";
import "./NCstyle.css"

const NovelCreated = () =>{

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
            }
        }
        fetchNovelsCreated();
    })


    return(
        <div className="Library">
        {books.length > 0 ? (
            <ul>
                {books.map((book) => (
                    <button className="BookList" key={book.bookid}>
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