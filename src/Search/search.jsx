import React, { useEffect, useState } from "react";
import "./searchStyle.css"
import ErrorHandler from "../Global/errorHandler"
import { useNavigate } from "react-router";
import forestSmall from "../Pictures/forestsmall.webp"

const SearchBar = () =>{

    const navigate = useNavigate()

    const [search,setSearch] = useState("")
    const [books,newBooks] = useState([])
    const [viewingBooks,SetViewing] = useState(false)


    useEffect(() =>{
            if (search.length === 0){
                newBooks([])
                SetViewing(false)
            }
            const waitForInput = setTimeout(()=>{
                fetchBooks();
            },1600)
                const fetchBooks = async () =>{
                    try{
                        if (search !== "" && search.length > 2){
                        const res = await fetch("http://localhost:3001/api/BooksBasedOnSearch",{
                            method:"POST",
                            headers:{
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                            },
                            body:JSON.stringify({data:search})
                        });
                    
                        if (res.ok){
                            const response = await res.json();
                            newBooks(response.data)
                            SetViewing(true)
                        }
                        else{
                            let error = ErrorHandler(res)
                            alert(error.message)
                            if (error.navigate.length > 0){
                                navigate(error.navigate)
                            }
                        }
                        }
                    }catch(err){
                        let errorCatch = ErrorHandler(err)
                        alert(errorCatch.message)
                        if (errorCatch.navigate.length > 0){
                            navigate(errorCatch.navigate)
                        }  
                    }
                }
            return () => clearTimeout(waitForInput)
    },[search,navigate]);

    
    function HandleChange(event){
        setSearch(event.target.value)
    }

    const goToBook = (book) =>{
        navigate({pathname:"/book",search:`?id=${book.bookid}`})
    }

    return(
        <>
            <div>
                <div>
                    <input 
                        type="text"
                        className="searchBar"
                        id="searchBar"
                        value={search} 
                        onChange={HandleChange} 
                        placeholder="Search for Book by Title"
                    />   
                </div>
                    <ul className={viewingBooks === true ? "containerSearch" : ""}>
                        {books.map((book)=>(
                            <li key={book.bookid} className="bookSearch">
                                <button onClick={() => goToBook(book)}>
                                    <img src={forestSmall} alt="" />
                                    <span id="bookText">{book.title.length > 15 ? book.title.substring(0,10):book.title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
            </div>
        </>
    )
}

export default SearchBar;