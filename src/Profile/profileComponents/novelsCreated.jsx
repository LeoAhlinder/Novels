import React, { useEffect, useState } from "react";
import "./novelsCreatedStyle.css"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import ChangeDocumentTitle from "../../Global/changeDocumentTitle";

import forest from "../../picturesForBooks/forestSmall.webp"
import forestHut from "../../picturesForBooks/hutInForestSmall.webp"
import Moon from "../../picturesForBooks/moonSmall.webp"
import pinkForest from "../../picturesForBooks/pinkForestSmall.webp"

import BookList from "../../Components/Books/bookListProfile";

const NovelCreated = () =>{


    const bookCoverImages = {
        Moon: Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
      };

    ChangeDocumentTitle("Novels Created")

    const navigate = useNavigate()

    const [books,setBooks] = useState([])

    useEffect(()=>{
        try{
            const fetchNovelsCreated = async () =>{

                const token = Cookies.get("authToken")

                const res = await fetch("http://localhost:3001/api/novelsCreated",{
                    method:"GET",
                    headers:{    
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`}
                });                
                if (res.ok)
                {
                    const response = await res.json()
                    setBooks(response.data)
                }
                else{
                    navigate("/error")
                }
                }
            fetchNovelsCreated();
        }
        catch(err){
            navigate("/error")
        }  
    },[])

    function openBook(book){
        navigate({pathname:"/book",search:`?id=${book.bookid}`})
    }

    return(
        <BookList
            books={books}
            openBook={openBook}
            bookCoverImages={bookCoverImages}
        />
    )
}

export default NovelCreated;