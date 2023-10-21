import React, { useEffect, useState } from "react";
import "./mostPopularStyle.css"
import fantasy from "../Pictures/fantasy.webp"
import Cookies from 'js-cookie'
import { useNavigate } from "react-router";
import setCookie from "../global/setCookie";
import ErrorHandler from "../global/errorHandler";


const MostPopular  = () =>{

    const [books,setBooks] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        ranking()
    })

    const ranking = async (type) =>{

        if (Cookies.get("books")){

            let cookieValue = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('books='))
                    .split('=')[1];

            let retrievedArray = JSON.parse(cookieValue);
            setBooks(retrievedArray)
        }
        else{
            try{


                const res = await fetch(`http://localhost:3001/api/ranking?type=${type}`,{
                    method:"GET",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    }
                });
    
                if (res.ok){
                    const response = await res.json();
                    setBooks(response.books)    
                    setCookie("books",response.books,3) //Name,data,expire date in hours
                }
                else{
                    let error = ErrorHandler(res)
                    alert(error.message)
                    if (error.navigate.length > 0){
                        navigate(error.navigate)
                    }
                }
            }
            catch(err){
                let errorCatch = ErrorHandler(err)
                alert(errorCatch.message)
                if (errorCatch.navigate.length > 0){
                    navigate(errorCatch.navigate)
                }   
            }
        }
    }



    const goToBook = (book) =>{
        navigate({pathname:"/book",search:`?id=${book.bookid}`})
      }
    

    return(
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <div className="containerPopular">
                <div className="categories">
                    <div className="button-container">
                        <button className="category-button" onClick={() => ranking("overall")}>Overall Ranking</button>
                        <button className="category-button" onClick={() => ranking("collections")}>Collections</button>
                        <button className="category-button" onClick={() => ranking("rating")}>Rating</button>
                    </div>
                        
                </div>
                {books.length > 0 ? ( <>
                    <ul className="gridContainerPopular">
                    {books.slice(0,12).map((book, index) => (
                            <li key={index} className="gridItem">
                            <div onClick={() => goToBook(book)} className="book">
                                <img src={fantasy} alt={book.title} className="bookCover"/>
                                <p id="bookTitle">{book.title}</p>
                            </div>
                            </li>
                        ))}
                    </ul>
                </>): null}

            </div>
        </>
    )
}

export default MostPopular;