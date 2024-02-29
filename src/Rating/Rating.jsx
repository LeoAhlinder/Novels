import React from "react"
import "./Rating.css"

import ChangeDocumentTitle from "../Global/changeDocumentTitle";

import forestPicture from "../picturesForBooks/forest.webp"

const Rating = () => {

    ChangeDocumentTitle("Rating")

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