import React from "react";
import "./mostPopularStyle.css"
import cat from "../Pictures/coolcat.jpg"

const MostPopular = () =>{

    const ranking = async (type) =>{
        console.log("test")

        try{

            const res = await fetch(`http://localhost:3001/api/ranking?type=${type}`,{
                method:"GET",
                headers:{
                    "Content-Type": "application/json",
                    "Accept": "application/json"
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
                    <ul className="bookList">
                        <li className="book"> <img src={cat} style={{height:100}} alt="" />test</li>
                        <li className="book"> <img src={cat} style={{height:100}} alt="" /></li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default MostPopular;