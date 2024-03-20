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
    const [userClickedEnter,SetUserClickedEnter] = useState(false)

    useEffect(() =>{
        try{
            if (userClickedEnter === true){
                return
            }
            if (search.length === 0){
                newBooks([])
                SetViewing(false)
            }
            const waitForInput = setTimeout(()=>{
                fetchBooks();
            },1100)
                return () => clearTimeout(waitForInput)
            }catch(err)
        {
            newBooks([])
            SetViewing(true)
        }
            
    },[search,navigate]);

    
    function HandleChange(event){
        setSearch(event.target.value)
        SetUserClickedEnter(false)
    }

    const goToBook = (book) =>{
        navigate({pathname:`/novel/${book.title}`})
    }

    const fetchBooks = async () =>{
        try{
            if (search !== "" && search.length > 2){
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/BooksBasedOnSearch`,{
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
                else{
                    SetViewing(true)
                    newBooks([])
                }
            }
        }catch(err){
            SetViewing(true)
            newBooks([])
        }
    }
    
    let isFetching = false;
    let searchValue = ""

    window.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !isFetching && searchValue !== search){
            fetchBooks()
            searchValue = search;
            isFetching = true;
            setTimeout(() => {
                isFetching = false;
            }, 1000);
            SetUserClickedEnter(true)
        }
    });

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