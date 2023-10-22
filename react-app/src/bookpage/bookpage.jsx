import React,{useEffect} from "react";
import "./bookpageStyle.css"
import { useLocation } from "react-router-dom";
import cat from "../Pictures/coolcat.jpg"
import { useState } from "react";
import ErrorHandler from "../global/errorHandler";
import { useNavigate } from "react-router-dom";



const BookPage = () =>{

    const navigate = useNavigate()

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bookId = queryParams.get("id");
    const [bookInfo, setBookInfo] = useState([])
    const [authorName,setauthor] = useState("")
    const [id,setID] = useState(0)
    const [LibraryAddButton,LibraryChange] = useState("")
    const [buttonState,changeButtonState] = useState(true)



        function errorFunction(err){
            let error = ErrorHandler(err)
            alert(error.message)
            if (error.navigate.length > 0){
                navigate(error.navigate)
            }
        }


        //Get bookinfo
        useEffect(() =>{
            const bookInfo = async (bookId) =>{

            const token = localStorage.getItem("authToken")

            try
            {
                const res = await fetch(`http://localhost:3001/api/book?id=${bookId}`,{
                    method:"GET",
                    headers: {  
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                      }
                });
                if (res.ok){
                    const response = await res.json();
                    setBookInfo(response.data)
                    setauthor(response.author[0].userName)
                    setID(response.data[0].bookid)
                }else{
                    errorFunction(res)
                }
            }
            catch(err){
                console.log(err)
            }

        }
        bookInfo(bookId)
        },[]);


        useEffect(() =>{
            const isBookInLibrary = async () =>{

                const token = localStorage.getItem("authToken")

                try
                {
                    const res = await fetch(`http://localhost:3001/api/checkLibrary`,{
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
                        if (response.message === "exist"){
                            LibraryChange("Remove from Library")
                        }
                        else if (response.message === "does not exist"){
                            LibraryChange("Add to Library")

                        }
                    }else{

                        errorFunction(res)
                    }
                }
                catch(err){
                    errorFunction(err)
                }
            }
            isBookInLibrary();
        },[])

    const addToLibrary = async (id) =>{
        if (buttonState === true){
            const token = localStorage.getItem("authToken")

            try{
                const res = await fetch("http://localhost:3001/api/AddToLibrary",{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                        },
                    body: JSON.stringify({id:id})
                });

                if (res.ok){
                    LibraryChange("Success!")
                    buttonColdDown("add")
                }
                else{
                    errorFunction("res")

                }
            }catch(err){
                errorFunction("cath")
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
    

    const removeFromLibrary = async (id) =>{
        const token = localStorage.getItem("authToken")
        if (buttonState === true){
            try{
                const res = await fetch("http://localhost:3001/api/RemoveFromLibrary",{
                    method:"DELETE",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                        },
                    body: JSON.stringify({id:id})
                });

                if (res.ok){
                    LibraryChange("Removed")
                    buttonColdDown("remove")
                }
                else{
                    errorFunction(res)
                }
            }catch(err){
                errorFunction(err)
            }
        }
    }


    return(
        <div className="Wrapper">
        {bookInfo.length > 0 ? (
            <>  <div id="desktop">
                    <picture>
                        <img src={cat} alt="cutecat" className="novelCover"/>
                    </picture>
                    <div className="bookInfo">
                        <h1 className="title">{bookInfo[0].title}</h1>
                        <h5 className="author">Author: {authorName}</h5>
                        <h5 className="chapters">Chapters: {bookInfo[0].totalpages === null ? "0" : bookInfo[0].totalpages}</h5>
                        <button className="readButton" >Read</button>
                        <button id="addButton" onClick={LibraryAddButton === "Remove from Library" ? () => removeFromLibrary(id): () => addToLibrary(id)}>{LibraryAddButton}</button>
                    </div>
                </div>
                <div id="phone">
                    <div id="phoneItemsWrapper">
                        <picture>
                            <img src={cat} alt="cutecat" id="novelCoverPhone" />
                        </picture>
                        <div id="bookInfoPhone">
                            <h1 id="titlePhone">{bookInfo[0].title}</h1>
                            <h5 id="authorPhone">Author: {authorName}</h5>
                            <h5 id="chaptersPhone">Chapters: {bookInfo[0].totalpages === null ? "0" : bookInfo[0].totalpages}</h5>
                            <div id="phoneButtonContainer">
                                <button id="readButtonPhone" >Read</button>
                                <button id="addButtonPhone" onClick={LibraryAddButton === "Remove from Library" ? () => removeFromLibrary(id): () => addToLibrary(id)}>{LibraryAddButton}</button>
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