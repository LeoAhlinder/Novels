import React from "react";
import "./Homestyle.css"
import LibraryPic from "../Pictures/librarypic.jpg"

const Home = () =>{
    return(
        <div>
            <div className="homeIntro">
                <img src={LibraryPic} alt="Fantast Library" className="LibraryPic"/>
            </div>
            <div className="homeWrapper">
                <p>test</p>
            </div>
        </div>
    )
}

export default Home;