import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./novelWorkSpaceStyle.css";

import Cookies from "js-cookie";
import ChangeDocumentTitle from "../../../Global/changeDocumentTitle";

export default function NovelWorkSpace() {

    const navigate = useNavigate();

    const bookNameEdited = window.location.pathname.split("/")[2];

    const bookTitle = window.location.pathname.split("/")[2].replaceAll("-", " ");

    ChangeDocumentTitle(`Novel Workspace | ${bookNameEdited}`)

    const [validUser, setValidUser] = useState(false);

    
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
        setIsLoaded(true);
        }, 100); 
    
        return () => clearTimeout(timer); 
    }, []);


    useEffect(()=>{
        async function checkIfUserValid() {
            const token = Cookies.get("authToken")

            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/checkOwnerOfBook`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body:JSON.stringify({bookName:bookNameEdited})
            });
            if (res.ok) {
                const response = await res.json();
                if (response.message === "valid") {
                    setValidUser(true)
                }
                else {
                    setValidUser(false)
                }
            }
            else {
                navigate("/error")
            }
        };

        checkIfUserValid()
    },[])


    return (
        <>  
        {isLoaded ? 
            <>
            {validUser === true ? 
                <>
                    <h2 id="novelWorkShopTitle">{bookTitle}</h2>

                    <div id="novelWorkShopContainer">

                    </div>
                </>
                : <h2>Invalid Token</h2>}
            </>
        : null}       
        </>
    );
}