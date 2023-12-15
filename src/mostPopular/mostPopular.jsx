import React, { useEffect, useState } from "react";
import "./mostPopularStyle.css"
import fantasy from "../Pictures/fantasy.webp"
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

    useEffect(() => {
        const timer = setTimeout(() => {
        setIsLoaded(true);
        }, 100); // 100 milliseconds = 0.1 seconds
    
        return () => clearTimeout(timer); // Clean up the timer
    }, []);

    const bookCoverImages = {
        Moon: Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
    };

    ChangeDocumentTitle("Most Popular")

    const [books,setBooks] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        ranking()
    },[])

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
                        return
                    }
                    if (response.books.length === 0){ //No books found
                        setBooks([])
                    }
                    else{
                        setBooks(response.books)    
                        setCookie("books",response.books,3) //Name,data,expire date in hours
                    }
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



    const goToBook = (book) =>{
        navigate({pathname:"/book",search:`?id=${book.bookid}`})
      }
    

    return(
        <>  {isLoaded ? (
                <div className="containerPopular">
                    <div className="categories">
                        <div className="button-container">
                            <button className="category-button" onClick={() => ranking("overall")}>Overall Ranking</button>
                            <button className="category-button" onClick={() => ranking("collections")}>Collections</button>
                            <button className="category-button" onClick={() => ranking("rating")}>Rating</button>
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