import React,{useEffect} from "react";
import "./bookpageStyle.css"
import { useLocation } from "react-router-dom";
import cat from "../Pictures/coolcat.jpg"
import { useState } from "react";


const BookPage = () =>{

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bookId = queryParams.get("id");
    const [bookInfo, setBookInfo] = useState([])
    const [authorName,setauthor] = useState("")

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


    return(
        <div className="Wrapper">
            {console.log(bookInfo[0].title)}

            <picture>
                <img src={cat} alt="cutecat" className="NovelCover"/>
            </picture>
            <div className="BookInfo">
                <h1 className="Title">{console.log(bookInfo[0])}</h1>
                <h5 className="Author">Author: {authorName}</h5>
            </div>
        </div>    
            
    );
}

export default BookPage;