import React from "react";
import "./mostPopularStyle.css"
import cat from "../Pictures/coolcat.jpg"

const MostPopular = () =>{

    const overallRanking = () =>{
        console.log("w")
    }


    return(
        <>
         <div className="containerPopular">
            <div className="categories">
                <div className="button-container">
                    <button className="category-button" onClick={overallRanking}>Overall Ranking</button>
                    <button className="category-button">Collections</button>
                    <button className="category-button">Rating</button>
                </div>
                <ul className="books">
                    <li> <img src={cat} style={{height:100}} alt="" /></li>
                </ul>
            </div>
        </div>
        </>
    )
}

export default MostPopular;