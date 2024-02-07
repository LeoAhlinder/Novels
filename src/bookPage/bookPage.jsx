import React,{useEffect,useState} from "react";
import "./bookpageStyle.css"
import { useNavigate } from "react-router-dom";

import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import pinkForest from "../picturesForBooks/pinkForestBig.webp"
import Moon from "../picturesForBooks/moonBig.webp"
import forest from "../picturesForBooks/forestBig.webp"
import forestHut from "../picturesForBooks/hutInForestBig.webp"


const BookPage = () =>{

    const bookCoverImages = {
        Moon, Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
      };

    const navigate = useNavigate()

    const bookName = window.location.pathname.split("/")[2].replaceAll("-", " ");
 
    const [bookInfo, setBookInfo] = useState([])
    const [authorName,setAuthor] = useState("")
    const [bookId,setID] = useState(0)
    const [LibraryAddButton,LibraryChange] = useState("")
    const [buttonState,changeButtonState] = useState(true)
    const [checkBookInLibrary,changeCheckBookInLibrary] = useState(false)
    const [bookExtraInfo,changeBookExtraInfo] = useState([])
    const [tags,changeTags] = useState([])
    const [currentPage, changeCurrentPage] = useState(0);

    useEffect(() =>{
        const bookInfo = async (bookName) =>{
        try
        {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/book?title=${bookName}`,{
                method:"GET",
                headers: {  
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                  }
             });
            if (res.ok){
                const response = await res.json();
                setBookInfo(response.data)
                setAuthor(response.author[0].userName)
                setID(response.data[0].bookid)
                ChangeDocumentTitle(response.data[0].title + " - Book Page")
                changeCheckBookInLibrary(true)
                changeBookExtraInfo(response.bookInfoData[0])
                changeTags(response.bookInfoData[0].tags.split(" "))
            }else{
                navigate("/error")
            }
        }
        catch(err){
            navigate("/error")
        }
    }
        bookInfo(bookName)
    },[]);


    useEffect(() =>{
        const isBookInLibrary = async () =>{
            try
            {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/checkLibrary`,{
                    method:"POST",
                    headers: {  
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Allow-Credentials": "true"
                      },
                      credentials: 'include',
                        body: JSON.stringify({id:bookId})
                });
                if (res.ok){
                    const response = await res.json()
                        if (response.message === "no token"){
                        LibraryChange("Not Login in")
                    }
                    if (response.message === "exist"){
                        LibraryChange("Remove from Library")
                        if (response.currentPage !== 0){
                            changeCurrentPage(response.currentPage)
                        }
                    }
                    else if (response.message === "does not exist"){
                        LibraryChange("Add to Library")
                    }
                }else{
                    navigate("/error")
                }
            }
            catch(err){
                navigate("/error")
            }
        }
        if (checkBookInLibrary === true)
            isBookInLibrary();
    },[checkBookInLibrary])

    const addToLibrary = async () =>{
        if (buttonState === true){
            try{
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/AddToLibrary`,{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Allow-Credentials": "true"
                    },
                    credentials: 'include',
                    body: JSON.stringify({id:bookId})
                });

                if (res.ok){
                    LibraryChange("Success!")
                    buttonColdDown("add")
                }
                else{
                    navigate("/error")

                }
            }catch(err){
                navigate("/error")
            }
        }
    }
    
    const buttonColdDown = (action) => {
        document.getElementById("addButton").setAttribute("class", "bookCD");
        changeButtonState(false);
    
        setTimeout(() => {
            if (window.location.pathname.includes("book")){
                document.getElementById("addButton").classList.remove("bookCD");
                changeButtonState(true);
                
                if (action === "add") {
                    LibraryChange("Remove from Library");
                } else {
                    LibraryChange("Add to library");
                }
            }
        }, 8000);
    }

    const removeFromLibrary = async () =>{
        if (buttonState === true){
            try{
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/RemoveFromLibrary`,{
                    method:"DELETE",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Allow-Credentials": "true",
                        },
                    credentials: 'include',
                    body: JSON.stringify({id:bookId})
                });

                if (res.ok){
                    LibraryChange("Removed")
                    buttonColdDown("remove")
                }
                else{
                    navigate("/error")
                }
            }catch(err){
                navigate("/error")
            }
        }
    }

    const goToAuthor = () =>{
        if (authorName !== ""){
            navigate({pathname:`/author/${authorName}`})
        }    
    }

    const goToChapterPage = () => {
        navigate({pathname:`/chapters/${bookInfo[0].title}`})
    }

    const goToChapter = () => {
        navigate({pathname:`/chapters/${bookInfo[0].title}/${currentPage}`})
    }


    return(
        <>

        {bookInfo.length > 0 ? (
            <>  
            <img id="backgroundImage" src={bookCoverImages[bookInfo[0].bookcover]} alt={bookInfo.bookcove} />
                <div className="Wrapper">
                    <div id="desktop">
                        <div id="bookPagePictureContainer">
                            <img src={bookCoverImages[bookInfo[0].bookcover]} alt={bookInfo.bookcover} className="novelCover"/>
                        </div>
                        <div className="bookPagebookInfo">
                            <h1 className="title">{bookInfo[0].title}</h1>
                            <h2 className="genre">Genre: {bookExtraInfo.genres}</h2>
                            <h5 className="author"><button id="authorButton" onClick={() => goToAuthor()} >Author: {authorName} </button></h5>
                            <h5 className="chapters">Chapters: {bookInfo[0].totalpages === null ? "0" : bookInfo[0].totalpages}</h5>
                            <h3 className="rating">{bookInfo[0].rating === null ? "No rating" : bookInfo[0].rating}</h3>
                            <div id="buttonContainer">
                                <button className="readButton" onClick={() => goToChapter()}>{currentPage != 0 ? "Continue Reading: " + currentPage : "Start Reading"}</button>
                                <button className="readButton" onClick={() => goToChapterPage()}>View chapters</button>
                                <button id="addButton" className={LibraryAddButton === "Not Login in" ? "notLoginIn" : ""} onClick={LibraryAddButton === "Remove from Library" ? () => removeFromLibrary(): () => addToLibrary()}>{LibraryAddButton}</button>
                            </div>
                        </div>
                        <div className="bookExtraInfo">
                            <div className="bookExtraInfoText">
                                <h1>Summary</h1>
                                <p>{bookExtraInfo.synopsis}</p>
                            </div>
                            <div className="bookExtraInfoText">
                                <h2>Overall information</h2>
                                <div className="extraInfoRow">
                                    <p className="bookExtraRowText">PE:&nbsp;{bookExtraInfo.warnings}</p>
                                    <div className="bookExtraInfoTags">
                                        Tags:
                                        {tags.map((tag,index)=>{
                                            return <p key={index} className="bookExtraInfoTag" >{tag}</p>
                                        })}
                                    </div>
                                    <p className="bookExtraRowText">Language:&nbsp;{bookExtraInfo.language}</p>
                                </div>
                            </div>
                        </div>  
                    </div>
                        <div id="phone">
                            <div id="phoneItemsWrapper">
                                <div id="bookPagePictureContainer">
                                    <img src={bookCoverImages[bookInfo[0].bookcover]} alt="cutecat" id="novelCoverPhone" />
                                </div>
                                <div id="bookInfoPhone">
                                        <h1 className="titlePhone">{bookInfo[0].title}</h1>
                                        <h4 className="genrePhone">Genre: {bookExtraInfo.genres}</h4>
                                        <h5 id="authorPhone"><button id="authorButton" onClick={() => goToAuthor()} >Author: {authorName} </button></h5>
                                        <h5 id="chaptersPhone">Chapters: {bookInfo[0].totalpages === null ? "0" : bookInfo[0].totalpages}</h5>
                                        <h3 className="ratingPhone">{bookInfo[0].rating === null ? "No rating" : bookInfo[0].rating}</h3>
                                    <div id="phoneButtonContainer">
                                        <button className="readButtonPhone" onClick={() => goToChapter()}>{currentPage != 0 ? "Continue Reading: " + currentPage : "Start Reading"}</button>
                                        <button className="readButtonPhone" onClick={() => goToChapterPage()}>View chapters</button>
                                        <button id="addButtonPhone" className={LibraryAddButton === "Not Login in" ? "notLoginIn" : ""} onClick={LibraryAddButton === "Remove from Library" ? () => removeFromLibrary(): () => addToLibrary()}>{LibraryAddButton}</button>
                                    </div>
                                </div>
                                <div className="bookExtraInfo">
                                    <div className="bookExtraInfoText">
                                        <h1>Summary</h1>
                                        <p>{bookExtraInfo.synopsis}</p>
                                    </div>
                                    <div className="bookExtraInfoText">
                                        <h2>Overall information</h2>
                                        <div className="extraInfoRow">
                                            <p className="bookExtraRowText">PE:&nbsp;{bookExtraInfo.warnings}</p>
                                            <div className="bookExtraInfoTags">
                                                Tags:
                                                {tags.map((tag,index)=>{
                                                    return <p key={index} className="bookExtraInfoTag" >{tag}</p>
                                                })}
                                            </div>
                                            <p className="bookExtraRowText">Language:&nbsp;{bookExtraInfo.language}</p>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        </div>
                </div> 
            </>
        ) : null}
    </>    
    );
}

export default BookPage;