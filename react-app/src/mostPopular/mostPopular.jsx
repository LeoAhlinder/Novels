import React from "react";
import "./mostPopularStyle.css"
const MostPopular = () =>{
    return(
        <>
         <div class="containerPopular">
            <div class="categories">
                <div class="button-container">
                    <button class="category-button">Overall Ranking</button>
                    <button class="category-button">Collections</button>
                    <button class="category-button">Rating</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default MostPopular;