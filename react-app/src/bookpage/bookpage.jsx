import React,{useEffect,useState} from "react";
import "./bookpageStyle.css"
import { useParams, useSearchParams } from "react-router-dom"; 


const BookPage = () =>{

    const {bookId} = useSearchParams()

        useEffect(() =>{

            const bookInfo = async (bookId) =>{
            console.log(bookId)
            const response = await fetch(`http://localhost:3001/api/Book/${bookId}`)
            }




            bookInfo(bookId)

        })
}

export default BookPage;