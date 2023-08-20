import React from "react";
import "./searchStyle.css"

const SearchBar = () =>{

    return(
        <div >
            <input type="text" className="searchBar" placeholder="Search for Book by Title"/>   
        </div>
    )
}

export default SearchBar;