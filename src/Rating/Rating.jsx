import React, {useEffect} from "react"
import "./Rating.css"

import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import forestPicture from "../picturesForBooks/forest.webp"

const Rating = () => {

    const bookName = window.location.pathname.split("/")[2].replace(/%20/g, " ")

    ChangeDocumentTitle(bookName + " Reviews | Novels")


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

    return (
        <div className="ratingContainer">
            <div id="ratingDescription">
                <img src={forestPicture} alt="" />
            </div>
            <div className="ratingItem">
                <h3 className="commentUsername">1</h3>
                <p className="commentText">text</p>
            </div>
        </div>
    );
}

export default Rating;