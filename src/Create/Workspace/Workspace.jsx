import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router";
import "./workspaceStyle.css"

import ChangeDocumentTitle from "../../Global/changeDocumentTitle";
import BookList from "../../Components/Books/bookListProfile";

import forest from "../../picturesForBooks/forestSmall.webp"
import forestHut from "../../picturesForBooks/hutInForestSmall.webp"
import Moon from "../../picturesForBooks/moonSmall.webp"
import pinkForest from "../../picturesForBooks/pinkForestSmall.webp"

const Workspace = () =>{

    const [books,setBooks] = useState([])
    const [loading,setLoading] = useState(true)

    const navigate = useNavigate()

    const bookCoverImages = {
        Moon: Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
    };

    ChangeDocumentTitle("Workspace | Novels")

    useEffect(()=>{
        try{
            const fetchNovelsCreated = async () =>{

                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/novelsCreated`,{
                    method:"GET",
                    headers:{    
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Allow-Credentials": "true",
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


    const openBook = (book) =>{
        const title = book.title.replaceAll(" ", '-');    
        navigate(`/workspace/${title}`);
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
                loading={loading}
            />
        </div>
    );
}

export default Workspace;