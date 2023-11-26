import { use } from "chai";
import React, {useEffect ,useState}from "react";
import { useParams } from 'react-router-dom';


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
            }
            catch(err){
                console.log(err)
            }
        }
        fetchAuthorInfo()
        

    },[authorName])

    return(
        <div>
            
        </div>
    )
}


export default AuthorSite;