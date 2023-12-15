import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router";
import "./workspaceStyle.css"

import ChangeDocumentTitle from "../../Global/changeDocumentTitle";
import BookList from "../../Components/Books/bookListProfile";
import Cookies from 'js-cookie'

import forest from "../../picturesForBooks/forestSmall.webp"
import forestHut from "../../picturesForBooks/hutInForestSmall.webp"
import Moon from "../../picturesForBooks/moonSmall.webp"
import pinkForest from "../../picturesForBooks/pinkForestSmall.webp"

const Workspace = () =>{

    const [books,setBooks] = useState([])

    const navigate = useNavigate()

    const bookCoverImages = {
        Moon: Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
    };

    ChangeDocumentTitle("Workspace")

    useEffect(()=>{
        try{
            const fetchNovelsCreated = async () =>{

                const token = Cookies.get("authToken")

                const res = await fetch(`${process.env.REACT_APP_API_URL}/novelsCreated`,{
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


    const openBook = (book) =>{
        navigate(`/workspace/${book.title}`)
    }

    return(
        <div id="workspaceContainer">
            <h1 id="workspaceTitle">Workspace</h1>
            <BookList 
                books={books}
                bookCoverImages={bookCoverImages}
                openBook={openBook}
                showPageProgress={false}
                showText={false}
                textIfEmpty="You have no novels created"
            />
        </div>
    );
}

export default Workspace;