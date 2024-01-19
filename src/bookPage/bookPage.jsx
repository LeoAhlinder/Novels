import React,{useEffect,useState} from "react";
import "./bookpageStyle.css"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

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

    const bookName = window.location.pathname.split("/")[1].replaceAll("-", " ");
 
    const [bookInfo, setBookInfo] = useState([])
    const [authorName,setAuthor] = useState("")
    const [bookId,setID] = useState(0)
    const [LibraryAddButton,LibraryChange] = useState("")
    const [buttonState,changeButtonState] = useState(true)
    const [checkBookInLibrary,changeCheckBookInLibrary] = useState(false)

        //Get bookinfo
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
                    console.log(response.data)
                    setID(response.data[0].bookid)
                    ChangeDocumentTitle(response.data[0].title + " - Book Page")
                    changeCheckBookInLibrary(true)
                }else{
                    // navigate("/error")
                }
            }
            catch(err){
                // navigate("/error")
            }

        }
        bookInfo(bookName)
        },[]);


        useEffect(() =>{
            const isBookInLibrary = async () =>{

                const token = Cookies.get("authToken")

                console.log(bookId)

                try
                {
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/checkLibrary`,{
                        method:"POST",
                        headers: {  
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            Authorization: `Bearer ${token}`
                          },
                          body: JSON.stringify({id:bookId})
                    });
                    if (res.ok){
                        const response = await res.json()
                        console.log(response.message)
                        if (response.message === "no token"){
                            LibraryChange("Not Login in")
                        }
                        if (response.message === "exist"){
                            LibraryChange("Remove from Library")
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
            const token = Cookies.get("authToken")

            try{
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/AddToLibrary`,{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                        },
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
        const token = Cookies.get("authToken")
        if (buttonState === true){
            try{
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/RemoveFromLibrary`,{
                    method:"DELETE",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                        },
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

    return(
        <div className="Wrapper">
        {bookInfo.length > 0 ? (
            <>  <div id="desktop">
                    <div id="bookPagePictureContainer">
                        <img src={bookCoverImages[bookInfo[0].bookcover]} alt={bookInfo.bookcover} className="novelCover"/>
                    </div>
                    <div className="bookPagebookInfo">
                        <h1 className="title">{bookInfo[0].title}</h1>
                        <h5 className="author"><button id="authorButton" onClick={() => goToAuthor()} >Author: {authorName} </button></h5>
                        <h5 className="chapters">Chapters: {bookInfo[0].totalpages === null ? "0" : bookInfo[0].totalpages}</h5>
                        <h3 className="rating">{bookInfo[0].rating === null ? "No rating" : bookInfo[0].rating}</h3>
                        <div id="test">
                            <button className="readButton" onClick={() => goToChapterPage()}>Read</button>
                            <button id="addButton" className={LibraryAddButton === "Not Login in" ? "notLoginIn" : ""} onClick={LibraryAddButton === "Remove from Library" ? () => removeFromLibrary(): () => addToLibrary()}>{LibraryAddButton}</button>
                        </div>
                    </div>
                </div>
                <div id="phone">
                    <div id="phoneItemsWrapper">
                        <div id="bookPagePictureContainer">
                            <img src={bookCoverImages[bookInfo[0].bookcover]} alt="cutecat" id="novelCoverPhone" />
                        </div>
                        <div id="bookInfoPhone">
                            <h1 id="titlePhone">{bookInfo[0].title}</h1>
                            <h5 id="authorPhone"><button id="authorButton" onClick={() => goToAuthor()} >Author: {authorName} </button></h5>
                            <h5 id="chaptersPhone">Chapters: {bookInfo[0].totalpages === null ? "0" : bookInfo[0].totalpages}</h5>
                            <h3 className="ratingPhone">{bookInfo[0].rating === null ? "No rating" : bookInfo[0].rating}</h3>
                            <div id="phoneButtonContainer">
                                <button id="readButtonPhone" onClick={() => goToChapterPage()}>Read</button>
                                <button id="addButtonPhone" className={LibraryAddButton === "Not Login in" ? "notLoginIn" : ""} onClick={LibraryAddButton === "Remove from Library" ? () => removeFromLibrary(): () => addToLibrary()}>{LibraryAddButton}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) : null}
    </div>       
    );
}

export default BookPage;