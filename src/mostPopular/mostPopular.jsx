import React, { useEffect, useState } from "react";
import "./mostPopularStyle.css"
import { useNavigate } from "react-router";
import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import forest from "../picturesForBooks/forest.webp"
import forestHut from "../picturesForBooks/hutInForest.webp"
import Moon from "../picturesForBooks/moon.webp"
import pinkForest from "../picturesForBooks/pinkForest.webp"

import yellowStar from "../Icons/star-yellow.svg"
import whiteStar from "../Icons/star-white.svg"


const MostPopular  = () =>{

    const [isLoaded, setIsLoaded] = useState(false);

    const bookCoverImages = {
        Moon: Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
    };

    ChangeDocumentTitle("Most Popular | Novels")

    const [books,setBooks] = useState([])
    const [type,changeType] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        ranking("overall")
    },[])


    const ranking = async (type) =>{
        
        try{
            const res = await fetch(`https://152.42.128.44:3001/api/ranking?type=${type}`,{
                method:"GET",
                headers:{
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            if (res.ok){
                const response = await res.json();
                changeType(type)
                if (response.error === "error"){ 
                    setBooks([])
                }
                else if (response.message === "No books found"){
                    setBooks([])
                }
                else if (response.books.length === 0){
                    setBooks([])
                }
                else{
                    setBooks(response.books)
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

    const goToBook = (book) =>{
        navigate({pathname:`/novel/${book.title}`})
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
                        <h4 id="subText">{type === "overall" ? "The overall ranking is based on rating and collections." : type === "rating" ? "The ranking is based on rating" : "The ranking is based on bookmarks" }</h4>
                    </div>

                    {books.length > 0 ? ( <>
                        <ul className="gridContainerPopular">
                        {books.slice(0,12).map((book, index) => (
                                <li key={index} className="gridItem">
                                <div onClick={() => goToBook(book)} className="book">
                                    <img src={bookCoverImages[book.bookcover]} alt={book.title} className="bookCover"/>
                                    <div>
                                        <img className="starRating" src={book.average_rating != null ? yellowStar : whiteStar} alt="" />
                                        <img className="starRating" src={book.average_rating >= 2 ? yellowStar : whiteStar} alt="" />
                                        <img className="starRating" src={book.average_rating >= 3 ? yellowStar : whiteStar} alt="" />
                                        <img className="starRating" src={book.average_rating >= 4 ? yellowStar : whiteStar} alt="" />
                                        <img className="starRating" src={book.average_rating >= 5 ? yellowStar : whiteStar} alt="" />
                                    </div>
                                    <p id="bookTitle">{book.title}</p>
                                </div>
                              
                                </li>
                            ))}
                        </ul>
                    </>): <h2 id="errorText">{type === "rating" ? "No books with any rating were found!" : "No books were found!"}</h2>}
                </div>
        ) : null  }
        </>
    )
}

export default MostPopular;