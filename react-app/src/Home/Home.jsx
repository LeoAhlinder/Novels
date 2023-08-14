import React from "react";
import "./Homestyle.css"
import LibraryPic from "../Pictures/librarypic_3_1280x300.jpg"

const Home = () =>{
    return(
        <div>
            <div className="homeIntro">
                <img src={LibraryPic} alt="Fantast Library" className="LibraryPic"/>
            </div>
            <div className="homeWrapper">

                <p>New release</p>
            </div>
        </div>
    )
}

export default Home;