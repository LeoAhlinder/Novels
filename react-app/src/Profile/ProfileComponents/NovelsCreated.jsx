import React, { useEffect } from "react";
import "./NCstyle.css"

const NovelCreated = () =>{

    useEffect(()=>{
        const fetchNovelsCreated = async () =>{

            const token = localStorage.getItem("authToken")

            const res = await fetch("http://localhost:3001/api/novelsCreated",{
                method:"GET",
                headers:{    
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${token}`}
            });
            if (res.ok){
                const response = await res.json()
                console.log(response)
            }
        }
        fetchNovelsCreated();
    })


    return(
        <h1>novels Created</h1>
    )
}

export default NovelCreated;