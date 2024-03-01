import React, {useEffect,useState} from "react"
import "./Rating.css"

import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import forestPicture from "../picturesForBooks/forest.webp"

import whiteStar from "../Icons/star-white.svg"
import yellowStar from "../Icons/star-yellow.svg"

const Rating = () => {

    const bookName = window.location.pathname.split("/")[2].replace(/%20/g, " ")
    const bookLink = "/novel/" + bookName.replace(/ /g, "%20")

    ChangeDocumentTitle(bookName + " Reviews | Novels")

    const [writeReviewView, changeWriteReviewView] = useState(false)

    const [reviewText, changePostCommentText] = useState("")
    
    const [addReviewStars, changeAddReviewStars] = useState([false,false,false,false,false])


    useEffect(() => {
        const getRatingAndInfo = async () => {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/getRaingAndInfo?bookName=${bookName}`,{
                method:"GET",
                headers: {  
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
            const response = await res.json();
            console.log(response)
        }
        getRatingAndInfo();
    },[])

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


    return (
        <div className="ratingContainer">
            <div id="ratingDescription">
                <div id="bookInfoRow">                      
                    <img id="bookCover" src={forestPicture} alt=""/>
                    <a id="bookLink" href={bookLink}>{bookName}</a>
                </div>
                <div id="starAndButtonRow">
                    <div>
                        <img className="star" src={yellowStar} alt="star" />
                        <img className="star" src={yellowStar} alt="star" />
                        <img className="star" src={whiteStar} alt="star" />
                        <img className="star" src={whiteStar} alt="star" />
                        <img className="star" src={whiteStar} alt="star" />
                        <p id="reviewText">This book has a rating of 5/5</p>
                    </div>
                    <button id="enableWriteReviewButton" onClick={() => changeWriteReviewView(!writeReviewView)}>{writeReviewView ? "Stop Writing Review" : "Write a Review"}</button>
                </div>
            </div>
            {writeReviewView ?
            <div id="addReviewContainer">
                <textarea id="addReviewInput" onChange={(e) => onChangeHandler(e)} placeholder="Write your review!"/>
                <div id="addReviewStarAndButtonRow">
                    <button id="addReviewButton">Add review</button>
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
            
            <div className="ratingItem">
                <h3 className="commentUsername">1</h3>
                <p className="commentText">text</p>
            </div>
        </div>
    );
}

export default Rating;