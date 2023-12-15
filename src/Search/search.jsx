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

    ChangeDocumentTitle("Search")

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
                                SetViewing(true)
                            }
                            else if (response.empty){
                                newBooks([])
                                SetViewing(true)
                            }
                        }
                        if (res.error === "error"){
                            console.log(res)

                            //navigate("/error")
                        }
  
                        }
                    }catch(err){
                        console.log(books)
                        console.log(err)
                        //navigate("/error")
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
                    viewingBooks={viewingBooks}
                /> 
                : ""}
            </ul>
        </>
    )
}

export default SearchBar;