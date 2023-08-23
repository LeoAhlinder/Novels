import React, { useEffect, useState } from "react";
import "./searchStyle.css"

const SearchBar = () =>{

    const [search,setSearch] = useState("")
    const [searchTimer,setSearchTimer] = useState("");
    const [books,newBooks] = useState([])


    useEffect(() =>{
            const waitForInput = setTimeout(()=>{
                fetchBooks();
            },1600)
                const fetchBooks = async () =>{
                    try{
                        if (search != "" && search.length > 2){
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
                        }
                        }
                    }catch(err){
                        console.log(err)
                    }
                }
                    return () => clearTimeout(waitForInput)

                },[search]);

    
    function HandleChange(event){
        setSearch(event.target.value)
        setSearchTimer(1600)
    }

    return(
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
            <div className="containWrapper">
                <ul className="Container">
                    {books.map((book)=>(
                        <li key={book.bookid} className="book">test</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default SearchBar;