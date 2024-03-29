import React, { useEffect, useState } from "react";
import "./novelsCreatedStyle.css"
import { useNavigate } from "react-router-dom";
import ChangeDocumentTitle from "../../../Global/changeDocumentTitle";

import forest from "../../../picturesForBooks/forestSmall.webp"
import forestHut from "../../../picturesForBooks/hutInForestSmall.webp"
import Moon from "../../../picturesForBooks/moonSmall.webp"
import pinkForest from "../../../picturesForBooks/pinkForestSmall.webp"

import BookList from "../../../Components/Books/bookListProfile";
import APIURL from "../../../Global/API-URL";

const NovelCreated = () =>{

    const bookCoverImages = {
        Moon: Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
      };

    ChangeDocumentTitle("Novels Created | Novels")

    const navigate = useNavigate()

    const [books,setBooks] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        try{
            const fetchNovelsCreated = async () =>{

                const res = await fetch(`${APIURL}/api/novelsCreated`,{
                    method:"GET",
                    headers:{    
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Allow-Credentials": "true"
                },
                credentials: 'include',
                });                
                if (res.ok)
                {
                    const response = await res.json()
                    setBooks(response.data)
                    setLoading(false)
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
        navigate({pathname:`/novel/${book.title}`})
    }

    return(
        <BookList
            books={books}
            openBook={openBook}
            bookCoverImages={bookCoverImages}
            showPageProgress={false}
            textIfEmpty="You have not created any novels yet"
            loading={loading}
        />
    )
}

export default NovelCreated;