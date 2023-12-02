import React, {useEffect ,useState}from "react";
import { useParams } from 'react-router-dom';
import "./authorSiteStyle.css"

const AuthorSite = () =>{


    const { authorName } = useParams();

    useEffect(()=>{

        const fetchAuthorInfo = async () =>{
            try{
                const res = await fetch(`http://localhost:3001/api/authorInfo?authorName=${authorName}`,{
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
                else{
                    navigate("/error")
                }
            }
            catch(err){
                navigate("/error")
            }
        }
        fetchAuthorInfo()
        

    },[authorName])

    return(
        <div className="authorInfoContainer">
            <h2>t</h2>
        </div>
    )
}


export default AuthorSite;