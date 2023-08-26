import React, { useEffect, useState } from "react";



const ServerCheck = () =>{

    const [serverStatus,changeServerStatus] = useState("")

    useEffect(() => {
        const pingServer = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/ping", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    }
                });

                if (res.ok) {
                    const response = await res.json();
                    changeServerStatus("online");
                } else {
                    changeServerStatus("offline");
                }
            } catch (error) {
                console.error("Error:", error);
                changeServerStatus("offline");
            }
        };

        pingServer();
    }, []);

    return(
        <div>
            <h1>

            </h1>
        </div>
    )
}

const server = {serverStatus}
export default server
