import React,{useEffect,useState} from "react";
import "./bookpageStyle.css"
import { useLocation } from "react-router-dom";
import cat from "../coolcat.jpg"


const BookPage = () =>{

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bookId = queryParams.get("id");

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
                    console.log(response.data)
                }else{
                console.log("error")
                }
            }
            catch(err){
                console.log(err)
            }

        }
        bookInfo(bookId)
        });


    return(
    <div>  
        <div className="wrapper">
            <img src={cat} alt="cat" className="logo"/>
        </div>       
            
        <div className="bookInfo">
            TeST
        </div>
    </div>   
        
    );
}

export default BookPage;