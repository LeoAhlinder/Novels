import React, { useEffect, useState } from "react";
import "./searchStyle.css"

const SearchBar = () =>{

    const [search,setSearch] = useState("")
    const [searchTimer,setSearchTimer] = useState("");


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
                            console.log(response)
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
        <div >
            <input type="text" className="searchBar" id="searchBar"
            value={search} onChange={HandleChange} placeholder="Search for Book by Title"/>   
        </div>
    )
}

export default SearchBar;