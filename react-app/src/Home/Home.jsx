import React, { useEffect } from "react";
import "./Homestyle.css"
import LibraryPicBig from "../Pictures/librarypic_3_1280x300.jpg"

const Home = () =>{


    useEffect(()=>{
        const latestReleases = async () =>{
            try{
                const res = await fetch("http://localhost:3001/api/latest",{
                    method:"GET",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    }
                });

                if (res.ok){
                    const response = await res.json()
                    console.log(response)
                }

            }catch(err){
                console.log(err)
            }
        }

        latestReleases();
    })




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