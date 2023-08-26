import React, { useEffect, useState } from "react";



const ServerCheck = () =>{

    const [serverStatus,changeServerStatus] = useState("")

    useEffect(()=>{
        const pingServer  = async () =>{
            const res = await fetch("http://localhost:3001/api/ping",{
                method:"GET",
                headers:{
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            if (res.ok){
                const response = await res.json()
                console.log(response)
                changeServerStatus("online")
            }else
            {
                console.log("server not working")
                changeServerStatus("offline")
            }
        }
        pingServer()
    },[])

    return(
        <div>
            <h1>

            </h1>
        </div>
    )
}


export default ServerCheck;