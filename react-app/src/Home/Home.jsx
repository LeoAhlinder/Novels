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
            <div className="homeWrapper">

                <p>New release</p>
            </div>
        </div>
    )
}

export default Home;