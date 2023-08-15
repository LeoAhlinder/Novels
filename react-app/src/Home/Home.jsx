import React from "react";
import "./Homestyle.css"
import LibraryPicBig from "../Pictures/librarypic_3_1280x300.jpg"
import LibraryPicMedium from "../Pictures/librarypic_850x250.jpg";
import LibraryPicSmall from "../Pictures/librarypic_1_650x200.jpg";
import LibraryPicSmaller from "../Pictures/librarypic_2_450x175.jpg";
import LibraryPicMini from "../Pictures/librarypic_3_275x100.jpg";
import LibraryPicMicro from "../Pictures/librarypic_4_150x75.jpg";

const Home = () =>{
    return(
        <div>
            <div className="homeIntro">
                <picture className="LibraryPic">
                <source media="(min-width: 1400px)" srcset={LibraryPicBig}/>
                <source media="(min-width: 900px)"srcset={LibraryPicMedium}/>
                <source media="(min-width: 750px)"srcset={LibraryPicSmall}/>
                <source media="(min-width: 750px)"srcset={LibraryPicSmall}/>
                <source media="(min-width: 525px)"srcset={LibraryPicSmaller}/>
                <source media="(min-width: 300px)"srcset={LibraryPicMini}/>


                <img src={LibraryPicMicro} alt="" />
                </picture>
            </div>
            <div className="homeWrapper">

                <p>New release</p>
            </div>
        </div>
    )
}

export default Home;