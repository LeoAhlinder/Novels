import React, { useEffect, useState } from "react";
import "./searchStyle.css"
import { useNavigate } from "react-router";

import ChangeDocumentTitle from "../Global/changeDocumentTitle";
import BookListGrid from "../Components/Books/bookListGrid";

import forest from "../picturesForBooks/forest.webp"
import forestHut from "../picturesForBooks/hutInForest.webp"
import Moon from "../picturesForBooks/moon.webp"
import pinkForest from "../picturesForBooks/pinkForest.webp"

const SearchBar = () =>{

    const bookCoverImages = {
        Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
    };

    ChangeDocumentTitle("Search | Novels")

    const navigate = useNavigate()

    const [search,setSearch] = useState("")
    const [books,newBooks] = useState([])
    const [viewingBooks,SetViewing] = useState(false)

    useEffect(() =>{
        try{
            if (search.length === 0){
                newBooks([])
                SetViewing(false)
            }
            const waitForInput = setTimeout(()=>{
                fetchBooks();
            },1600)
                const fetchBooks = async () =>{
                    if (search !== "" && search.length > 2){
                        const res = await fetch(`http://152.42.128.44:3001/api/BooksBasedOnSearch`,{
                            method:"POST",
                            headers:{
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                            },
                            body:JSON.stringify({data:search})
                        });
                        if (res.ok){
                            const response = await res.json();
                            if (response.books){
                                newBooks(response.books)
                            }
                            else if (response.empty){
                                newBooks([])
                            }
                            SetViewing(true)
                            }
                        if (res.error === "error"){
                            navigate("/error")
                        }
                    }
                }
                return () => clearTimeout(waitForInput)
            }catch(err){
            navigate("/error")
        }
            
    },[search,navigate]);

    
    function HandleChange(event){
        setSearch(event.target.value)
    }

    const goToBook = (book) =>{
        navigate({pathname:`/novel/${book.title}`})
    }

    return(
        <>
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
                {viewingBooks === true ? 
                <BookListGrid
                    books={books}
                    goToBook={goToBook}
                    bookCoverImages={bookCoverImages}
                    noBooksFoundText="No books with that title were found"
                /> 
                : ""}
            </ul>
        </>
    )
}

export default SearchBar;