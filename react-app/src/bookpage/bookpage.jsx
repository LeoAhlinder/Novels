import React,{useEffect} from "react";
import "./bookpageStyle.css"
import { useLocation } from "react-router-dom";
import cat from "../Pictures/coolcat.jpg"
import { useState } from "react";
import { json } from "express";


const BookPage = () =>{

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bookId = queryParams.get("id");
    const [bookInfo, setBookInfo] = useState([])
    const [authorName,setauthor] = useState("")
    const [id,setID] = useState(0)

        useEffect(() =>{
            const bookInfo = async (bookId) =>{

            try
            {
                const res = await fetch(`http://localhost:3001/api/book?id=${bookId}`,{
                    method:"GET",
                    headers: {  
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                      }
                });
                if (res.ok){
                    const response = await res.json();
                    setBookInfo(response.data)
                    setauthor(response.author[0].userName)
                    console.log(response.data[0].bookid)
                    setID(response.data[0].bookid)
                }else{
                console.log("error")
                }
            }
            catch(err){
                console.log(err)
            }

        }
        bookInfo(bookId)
        },[]);

    const addToLibrary = (id) =>{
        useEffect(() =>{

            const token = localStorage.getItem("authToken")

            const addBookToLibrary = async () =>{
                const res = await fetch("http://localhost:3001/api/AddToLibrary",{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(id)
                });
            } 
            addBookToLibrary()
        })
    }


    return(
        <div className="Wrapper">
        {bookInfo.length > 0 ? (
            <>
                <picture>
                    <img src={cat} alt="cutecat" className="NovelCover" />
                </picture>
                <div className="BookInfo">
                    <h1 className="Title">{bookInfo[0].title}</h1>
                    <h5 className="Author">Author: {authorName}</h5>
                    <h5 className="Chapters">Chapters: {bookInfo[0].totalpages}</h5>
                    <button className="ReadButton" >Read</button>
                    <button className="AddButton" onClick={() => addToLibrary(id)}>Add to Library</button>
                </div>
            </>
        ) : null}
    </div>       
    );
}

export default BookPage;