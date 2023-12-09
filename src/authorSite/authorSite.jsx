import React, {useEffect ,useState}from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router";

import "./authorSiteStyle.css"
import forestpic from "../picturesForBooks/forest.webp"
import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import forest from "../picturesForBooks/forest.webp"
import forestHut from "../picturesForBooks/hutInForest.webp"
import Moon from "../picturesForBooks/moon.webp"
import pinkForest from "../picturesForBooks/pinkForest.webp"


const AuthorSite = () =>{

    const navigate = useNavigate()

    const bookCoverImages = {
        Moon: Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
    };
    
    const [authorInfo,setAuthorInfo] = useState([])
    const { authorName } = useParams();
    const [authorFound,changeAuthorFound] = useState(true)  

    ChangeDocumentTitle(`Author site: ${authorName}`)

    useEffect(()=>{

        const fetchAuthorInfo = async () =>{
            try{
                const res = await fetch(`http://localhost:3001/api/authorInfo?authorName=${authorName}`,{
                    method:"GET",
                    headers:{    
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    }
                });
                if (res.ok){
                    const response = await res.json()
                    if (response.message === "no author found"){
                        changeAuthorFound(false)
                        setAuthorInfo([])
                    }
                    else{
                        setAuthorInfo(response.books)
                        changeAuthorFound(true)
                    }
                }
                else{
                    navigate("/error")
                }
            }
            catch(err){
                navigate("/error")
            }
        } 
        fetchAuthorInfo()
        

    },[authorName])

    const goToBook = (book) =>{
        navigate({pathname:"/book",search:`?id=${book.bookid}`})
    }

    return(
        <>

            <div className="authorInfoContainer">
            <h1 id="authorName">{authorFound === true ? `${authorName}'s complete collection available online` : ""}</h1>

            {authorFound === false ? <h1 id="noAuthorFound">No author found</h1> : authorInfo.map((book,index) => (
                <li key={index} className="authorBookItem" >
                    <h3 id="Title" onClick={() => goToBook(book)}>{book.title}</h3>
                    <h4 className="bookInfo" id="Chapters">{book.totalpages != null ? book.totalpages : "0"} chapters</h4>
                    <h4 className="bookInfo" id="totalInLibrary">{book.totalinlibrary} bookmarks</h4>
                    <h4 className="bookInfo" id="Genre">Genre: {book.genres}</h4>
                    <h4 className="bookInfo" id="PR" >PR: {book.warnings}</h4>

                    <div id="bookContainer" onClick={() => goToBook(book)}>
                        <img id="bookPicture" src={bookCoverImages[book.bookcover]} alt="Book picture" />
                    </div>

                    <p id="bookSynopsis">{book.synopsis}</p>

                </li>
            ))}
            </div>
        </>
      )
}


export default AuthorSite;