import React, { useEffect, useState } from "react";
import "./mostPopularStyle.css"
import Cookies from 'js-cookie'
import { useNavigate } from "react-router";
import setCookie from "../Global/setCookie";
import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import forest from "../picturesForBooks/forest.webp"
import forestHut from "../picturesForBooks/hutInForest.webp"
import Moon from "../picturesForBooks/moon.webp"
import pinkForest from "../picturesForBooks/pinkForest.webp"


const MostPopular  = () =>{

    const [isLoaded, setIsLoaded] = useState(false);

    const bookCoverImages = {
        Moon: Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
    };

    ChangeDocumentTitle("Most Popular")

    const [books,setBooks] = useState([])
    const [type,setType] = useState("overall") 

    const navigate = useNavigate()

    useEffect(()=>{

        const ranking = async () =>{

            if (Cookies.get("books")){
    
                let cookieValue = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('books='))
                        .split('=')[1];
    
                let retrievedArray = JSON.parse(cookieValue);
                setBooks(retrievedArray)
                setIsLoaded(true)
            }
            else{
                try{
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/ranking?type=${type}`,{
                        method:"GET",
                        headers:{
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        }
                    });
                    if (res.ok){
                        const response = await res.json();
                        if (response.error === "error"){ 
                            setBooks([])
                        }
                        else if (response.books.length === 0){
                            setBooks([])
                        }
                        else{
                            setBooks(response.books.reverse())    
                            setCookie("books",response.books,3) //Name,data,expire date in hours
                        }
                        setIsLoaded(true)
                    }
                    else{
                        navigate("/error")
                    }
                }
                catch(err){
                    navigate("/error")
                }
            }
        }
        ranking()
    },[type])

    const goToBook = (book) =>{
        navigate({pathname:`/${book.title}`})
    }

    return(
        <>  {isLoaded ? (
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
                                    <img src={bookCoverImages[book.bookcover]} alt={book.title} className="bookCover"/>
                                    <p id="bookTitle">{book.title}</p>
                                </div>
                                </li>
                            ))}
                        </ul>
                    </>): <h2 id="errorText">We had an error fetching the most popular books. Please try again!</h2>}
                </div>
        ) : null  }
        </>
    )
}

export default MostPopular;