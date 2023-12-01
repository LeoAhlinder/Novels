import React, { useEffect, useState } from "react";
import "./mostPopularStyle.css"
import fantasy from "../Pictures/fantasy.webp"
import Cookies from 'js-cookie'
import { useNavigate } from "react-router";
import setCookie from "../Global/setCookie";
import ErrorHandler from "../Global/errorHandler";


const MostPopular  = () =>{

    const [books,setBooks] = useState([])
    const [type,setType] = useState("overall")
    const navigate = useNavigate()

    useEffect(()=>{
        ranking("overall")
    },[type])

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
                    if (response.books === undefined){
                        setBooks([]); // Store fetched data in state
                        return;
                    }    
                        setBooks(response.books)    
                        setCookie("books",response.books,3) //Name,data,expire date in hours
                }
                if (res.error === "error"){
                    console.log("error")
                    setBooks([])
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
                        <button className="category-button" onClick={() => setType("overall")}>Overall Ranking</button>
                        <button className="category-button" onClick={() => setType("collections")}>Collections</button>
                        <button className="category-button" onClick={() => setType("rating")}>Rating</button>
                    </div>
                        
                </div>

                <div className="popularDescription">
                    <h3 id="subTitle">Most popular novels</h3>
                    <h4 id="subText">The overall ranking is based on rating and collections.</h4>
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