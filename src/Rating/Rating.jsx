import React, {useEffect,useState} from "react"
import { useNavigate } from "react-router";

import "./Rating.css"

import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import forest from "../picturesForBooks/forest.webp"
import Moon from "../picturesForBooks/moon.webp"
import forestHut from "../picturesForBooks/hutInForest.webp"
import pinkForest from "../picturesForBooks/pinkForest.webp"

import whiteStar from "../Icons/star-white.svg"
import yellowStar from "../Icons/star-yellow.svg"

import trashcanOpen from "../Icons/trashcan-closed.svg"
import trashcanClosed from "../Icons/trashcan-open.svg" 

import APIURL from "../Global/API-URL"

const Rating = () => {

    const bookCoverImages = {
        Moon, Moon,
        Forest: forest,
        hutInForest: forestHut,
        pinkForest: pinkForest,
    };

    const navigate = useNavigate();

    const bookName = window.location.pathname.split("/")[2].replace(/%20/g, " ")
    const bookLink = "/novel/" + bookName.replace(/ /g, "%20")

    ChangeDocumentTitle(bookName + " Reviews | Novels")

    const [writeReviewView, changeWriteReviewView] = useState(false)
    const [reviewText, changePostCommentText] = useState("")
    const [addReviewStars, changeAddReviewStars] = useState([false,false,false,false,false])
    const [rating, changeRating] = useState(0)

    const [reviews, changeReviews] = useState([])
    const [loading, changeLoading] = useState(true)
    const [responseMessage, changeResponseMessage] = useState("")
    const [responseMessageColor, changeResponseMessageColor] = useState("red")
    const [bookCover, changeBookCover] = useState("")
    const [reviewsFullyViewed, changeReviewsFullyViewed] = useState([])
    const [userName, changeUserName] = useState("")
    const [trashCanHoverd, setTrashCanHoverd] = useState(false)
    const [reviewPosted, changeReviewPosted] = useState(false)

    const maxReviewLength = 650

    useEffect(() => {
        try{
            const getRatingAndInfo = async () => {
                const res = await fetch(`${APIURL}/api/getRatingAndInfo?bookName=${bookName}`,{
                    method:"GET",
                    headers: {  
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Allow-Credentials": "true",
                    },
                    credentials: "include"
                });
                const response = await res.json();
                if (response.error){
                    changeReviews([])
                    changeLoading(false)
                }
                else if (response.message === "No reviews found"){
                    changeReviews([])
                    changeLoading(false)
                    changeBookCover(response.bookCover)
                    changeRating(0)
                }
                else if (response.data){
                    if (response.data.length > 0 && response.message === "success"){
                        changeReviews(response.data)
                        changeUserName(response.userName)
                        changeLoading(false)
                        changeBookCover(response.bookCover)
                        let sumOfRatings = 0;
                        for (let i = 0; i < response.data.length; i++){
                            sumOfRatings += response.data[i].rating
                        }
                        sumOfRatings = sumOfRatings.toFixed(1)
                        const averageRating = (sumOfRatings/response.data.length).toFixed(1)
                        if (averageRating.split(".")[1] === "0"){
                            changeRating(averageRating.split(".")[0])
                        }
                        else{
                            changeRating(averageRating)
                        }
                    }
                }
                else{
                    changeReviews([])
                    changeLoading(false)
                }
            }
        getRatingAndInfo();

        }catch(err){
            navigate("/error")
        }
    },[])

    async function postReview(){
        try{
            if (reviewPosted){
                changeResponseMessageColor("red")
                changeResponseMessage("You have already posted a review")
                return
            }
            const review = addReviewStars.filter(star => star).length

            if (reviewText.length > 3 && reviewText.length < 2000 && review > 0 && review <= 5){
                const data = {
                    bookName: bookName,
                    review: reviewText,
                    rating: review
                }
                const res = await fetch(`${APIURL}/api/postReview`,{
                    method:"POST",
                    headers: {  
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Accept-Credentials": "include"
                    },
                    credentials: "include",
                    body: JSON.stringify(data)
                });
                const response = await res.json();
                if (response.message === "Review posted"){
                    changeResponseMessageColor("green")
                    changeReviewPosted(true)
                    changeResponseMessage("Review posted")
                    changePostCommentText("")
                    changeAddReviewStars([false,false,false,false,false])
                    changeWriteReviewView(false)
                    changeReviews([...reviews, {userName:"You", text:reviewText, rating:review}])
                }
                else if (response.error === "no token"){
                    changeResponseMessage("You need to be logged in to post a review")
                    changeResponseMessageColor("red")
                }
                else if (response.message === "User has reviewed already"){
                    changeResponseMessageColor("red")
                    changeResponseMessage("You have already reviewed this book")
                }
                else{
                    changeResponseMessageColor("red")
                    changeResponseMessage("Error posting review")
                }
            }else{
                if (reviewText.length < 3){
                    changeResponseMessageColor("red")
                    changeResponseMessage("Your review is too short")
                }
                else if (reviewText.length > 2000){
                    changeResponseMessageColor("red")
                    changeResponseMessage("Your review is too long")
                }
                else if (review === 0 || review > 5){
                    changeResponseMessageColor("red")
                    changeResponseMessage("Please give a valid rating")
                }
            }

        }catch(err){
            navigate("/error")
        }
    }

    function onChangeHandler(e){
        changePostCommentText(e.target.value)
        adjustHeight(e)
    }

    function adjustHeight(e) {
        e.target.style.height = "1px";
        e.target.style.height = (10+e.target.scrollHeight)+"px";
    }

    function addReviewStar(index){
        let newAddReviewStars = addReviewStars.map((star, i) => {
            if(i <= index){
                return true
            }
            return false
        })
        changeAddReviewStars(newAddReviewStars)
    }

    function readMoreReview(index){
        changeReviewsFullyViewed([...reviewsFullyViewed, index])
    }

    async function deleteReview(index){
       try{
        const res = await fetch(`${APIURL}/api/deleteReview`,{

            method:"DELETE",
            headers: {  
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Accept-Credentials": "include"
            },  
            credentials: "include",
            body: JSON.stringify({bookName:bookName})
        });
        const response = await res.json();
        if (response.message === "Review deleted"){
            changeReviewPosted(false)
            const newReviews = [...reviews];
            newReviews.splice(index, 1);
            changeReviews(newReviews);
        }
       }catch(err){
            console.log("Error deleting review")
       }
    }

    return (
        <div className="ratingContainer">
            <div id="ratingDescription">
                <div id="bookInfoRow">                      
                    <img id="bookCover" src={bookCoverImages[bookCover]} alt=""/>
                    <a id="bookLink" href={bookLink}>{bookName}</a>
                </div>
                <div id="starAndButtonRow">
                    <div>
                        <img className="star" src={rating >= 1 ? yellowStar : whiteStar} alt="star" />
                        <img className="star" src={rating >= 2 ? yellowStar : whiteStar} alt="star" />
                        <img className="star" src={rating >= 3 ? yellowStar : whiteStar} alt="star" />
                        <img className="star" src={rating >= 4 ? yellowStar : whiteStar} alt="star" />
                        <img className="star" src={rating >= 5 ? yellowStar : whiteStar} alt="star" />
                        <p id="reviewText">This book has a rating of {rating}/5</p>
                    </div>
                    <button className="reviewSiteButton" id="enableWriteReviewButton" onClick={() => changeWriteReviewView(!writeReviewView)}>{writeReviewView ? "Stop Writing Review" : "Write a Review"}</button>
                </div>
            </div>
            {writeReviewView ?
            <div id="addReviewContainer">
                <textarea id="addReviewInput" value={reviewText} onChange={(e) => onChangeHandler(e)} placeholder="Write your review!"/>
                <p style={{color:responseMessageColor}}>{responseMessage}</p>
                <div id="addReviewStarAndButtonRow">
                    
                    <button className="reviewSiteButton" id="addReviewButton" onClick={() => postReview()}>Add review</button>
                    <div>
                        <img className="addReviewStar" onClick={() => addReviewStar(0)} src={addReviewStars[0] ? yellowStar : whiteStar} alt="star" />
                        <img className="addReviewStar" onClick={() => addReviewStar(1)} src={addReviewStars[1] ? yellowStar : whiteStar} alt="star" />
                        <img className="addReviewStar" onClick={() => addReviewStar(2)} src={addReviewStars[2] ? yellowStar : whiteStar} alt="star" />
                        <img className="addReviewStar" onClick={() => addReviewStar(3)} src={addReviewStars[3] ? yellowStar : whiteStar} alt="star" />
                        <img className="addReviewStar" onClick={() => addReviewStar(4)} src={addReviewStars[4] ? yellowStar : whiteStar} alt="star" />
                    </div>
                </div>
            </div>
            : null
            }
            {loading ? <p style={{color:"white"}}>Loading reviews...</p> 
            :
                reviews.length > 0 ?  
                <>
                    {
                        reviews.map((review, index) => (
                            <div style={reviewsFullyViewed.includes(index) === true ? {height:"auto"}: {maxHeight:150+"px"}} className={`ratingItem ${review.text.length > 650 ? "loadMoreReviewText" : ""}`} key={index}>
                                <h3 className={`thisUsersComment ${review.userName === userName ? "reviewUser" : ""}`}>{review.userName !== null ? review.userName === userName ? "You" : review.userName : "Deleted user"}</h3>
                                {reviewsFullyViewed.includes(index) === false && review.text.length > maxReviewLength
                                ?
                                    <button className="loadMoreText" onClick={() => readMoreReview(index)}>Read More</button>
                                : null
                                }
                                <div id="reviewStarsRow">
                                    <img className="reviewStar" src={yellowStar} alt="star" />
                                    <img className="reviewStar" src={review.rating >= 2 ? yellowStar : whiteStar} alt="star" />
                                    <img className="reviewStar" src={review.rating >= 3 ? yellowStar : whiteStar} alt="star" />
                                    <img className="reviewStar" src={review.rating >= 4 ? yellowStar : whiteStar} alt="star" />
                                    <img className="reviewStar" src={review.rating === 5 ? yellowStar : whiteStar} alt="star" />
                                    <p id="ratingText">({`${review.rating}/5`})</p>
                                </div>
                                <p className="reviewText" >{review.text}</p>
                                {
                                    review.userName === userName ?
                                    <div className="TrashcanContainer">
                                        <img onMouseEnter={() => setTrashCanHoverd(true)} onMouseLeave={() => setTrashCanHoverd(false)} onClick={() => deleteReview(index)}
                                        className="Trashcan"  src={trashCanHoverd ? trashcanClosed : trashcanOpen} alt="Trash can" />
                                    </div>
                                    : null
                                }
                            </div>
                        ))
                    }
                </>
                :   
                <div className="ratingItem">
                    <p style={{color:"white"}}>No reviews yet</p>
                </div>
            }
        </div>
    );
}

export default Rating;