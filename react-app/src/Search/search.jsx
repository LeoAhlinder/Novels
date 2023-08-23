import React, { useEffect, useState } from "react";
import "./searchStyle.css"
import { wait } from "@testing-library/user-event/dist/utils";

const SearchBar = () =>{

    const [search,setSearch] = useState("")
    const [searchTimer,setSearchTimer] = useState("");


    useEffect(() =>{
            const waitForInput = setTimeout(()=>{
                console.log(searchTimer )
            },2000)
                const fetchBooks = async () =>{

                    try{
                        if (search != ""){
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
                    fetchBooks();
                    return () => clearTimeout(waitForInput)

                },[search]);

    
    function HandleChange(event){
        setSearch(event.target.value)
        setSearchTimer(2000)
    }

    return(
        <div >
            <input type="text" className="searchBar" id="searchBar"
            value={search} onChange={HandleChange} placeholder="Search for Book by Title"/>   
        </div>
    )
}

export default SearchBar;