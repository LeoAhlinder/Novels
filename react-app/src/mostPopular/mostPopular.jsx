import React, { useEffect } from "react";
import "./mostPopularStyle.css"
import fantasy from "../Pictures/fantasy.webp"

const MostPopular  = () =>{


    useEffect(()=>{
    },[])

    const ranking = async (type) =>{


        const token = localStorage.getItem("authToken")

        try{

            const res = await fetch(`http://localhost:3001/api/ranking?type=${type}`,{
                method:"GET",
                headers:{
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok){
                const response = await res.json()
                console.log(response)
            }
            else{
                console.log("something went wrong")
            }
        }
        catch(err){
            console.log(err)
        }
    }


    return(
        <>
            <div className="containerPopular">
                <div className="categories">
                    <div className="button-container">
                        <button className="category-button" onClick={() => ranking("overall")}>Overall Ranking</button>
                        <button className="category-button" onClick={() => ranking("collections")}>Collections</button>
                        <button className="category-button" onClick={() => ranking("rating")}>Rating</button>
                    </div>
                        
                </div>
                <ul className="gridContainer">
                    <li className="gridItem"> 
                        <div>
                            <img src={fantasy} style={{height:100}} alt="" />
                            <p>test</p>
                        </div>
                    </li>
                    <li className="gridItem">
                        <div> 
                            <img src={fantasy} style={{height:100}} alt="" />
                            <p>test</p>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default MostPopular;