import React from "react";
import "./Homestyle.css"
import LibraryPicBig from "../Pictures/librarypic_3_1280x300.jpg"
import LibraryPicMedium from "../Pictures/librarypic_850x250.jpg";
import LibraryPicSmall from "../Pictures/librarypic_1_650x200.jpg";
import LibraryPicSmaller from "../Pictures/librarypic_2_450x175.jpg";
import LibraryPicMini from "../Pictures/librarypic_3_275x100.jpg";
import LibraryPicMicro from "../Pictures/librarypic_250x270.jpg";

const Home = () =>{
    return(
        <div>
            <div className="homeIntro">
                <img src={LibraryPicBig} alt="" />
            </div>
            <ul className="homeWrapper">
            <ul className="grid-container">
                <li className="grid-item">1</li>
                <li className="grid-item">2</li>
                <li className="grid-item">3</li>  
                <li className="grid-item">4</li>
                <li className="grid-item">5</li>
                <li className="grid-item">6</li>  
                <li className="grid-item">7</li>
                <li className="grid-item">8</li>
                <li className="grid-item">9</li>  
                <li className="grid-item">10</li>  
                <li className="grid-item">11</li>  
                <li className="grid-item">12</li>  
            </ul>
            </ul>
        </div>
    )
}

export default Home;