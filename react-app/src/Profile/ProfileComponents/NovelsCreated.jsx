import React, { useEffect, useState } from "react";
import "./NCstyle.css"
import { useNavigate } from "react-router-dom";
import ErrorHandler from "../../global/errorHandler";
import Cookies from 'js-cookie'
import setCookie from "../../global/setCookie";


const NovelCreated = () =>{

    const navigate = useNavigate()

    const [books,setBooks] = useState([])

    useEffect(()=>{
        if (Cookies.get("createdBooks")){

            let cookieValue = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('createdBooks='))
                    .split('=')[1];

            let retrievedArray = JSON.parse(cookieValue);
            setBooks(retrievedArray)
        }
        else{
            const fetchNovelsCreated = async () =>{

                const token = Cookies.getItem("authToken")

                const res = await fetch("http://localhost:3001/api/novelsCreated",{
                    method:"GET",
                    headers:{    
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`}
                });
                if (res.ok){
                    const response = await res.json()
                    setBooks(response.data)
                    setCookie("createdBooks",response.data,0.1)

                }
                else{

                    let error = ErrorHandler(res)
                    alert(error.message)
                    if (error.navigate.length > 0){
                        navigate(error.navigate)
                    }
                }
            }
            fetchNovelsCreated();
        }
    },[navigate])

    function OpenBook(book){
        navigate({pathname:"/book",search:`?id=${book.bookid}`})
    }

    return(
        <>  <div id="tableHeadContainer">
                <div id="tableHead">
                    <p id="tableText">Novels Title</p>
                </div>
            </div>
            <div className="Novels">
                
                {books.length > 0 ? (
                    <ul>
                        {books.map((book) => (
                            <button className="BookList" key={book.bookid} onClick={() => OpenBook(book)}>
                                {book.title} - Page: {book.currentPage}
                            </button>
                        ))}
                    </ul>
                ) : (
                    <p>No books</p>
                )}
            </div>
        </>
    )
}

export default NovelCreated;