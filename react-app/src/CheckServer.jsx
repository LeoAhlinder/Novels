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
}

export default {
    status: ServerCheck.serverStatus
}