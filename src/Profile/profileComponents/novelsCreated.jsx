import React, { useEffect, useState } from "react";
import "./novelsCreatedStyle.css"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import ChangeDocumentTitle from "../../Global/changeDocumentTitle";


const NovelCreated = () =>{

    ChangeDocumentTitle("Novels Created")

    const navigate = useNavigate()

    const [books,setBooks] = useState([])

    useEffect(()=>{
        try{
            const fetchNovelsCreated = async () =>{

                const token = Cookies.get("authToken")

                const res = await fetch("http://localhost:3001/api/novelsCreated",{
                    method:"GET",
                    headers:{    
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`}
                });                
                if (res.ok)
                {
                    const response = await res.json()
                    setBooks(response.data)
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

    function OpenBook(book){
        navigate({pathname:"/book",search:`?id=${book.bookid}`})
    }

    return(
        <>  <div id="tableHeadContainer">
                <div id="tableHead">
                    <p id="tableText">Novel Titles</p>
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