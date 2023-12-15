import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import checkToken from "../../../Global/checkToken";
import ChangeDocumentTitle from "../../../Global/changeDocumentTitle";

export default function NovelWorkSpace() {

    const location = useLocation();
    const bookName = window.location.pathname.split("/").pop(0);

    ChangeDocumentTitle(`Novel Workspace | ${bookName}`)

    const [validToken, setValidToken] = useState(false)

    useEffect(()=>{
        (async () =>{
            const validToken = await checkToken()
            setValidToken(validToken === "valid" ? true : false)
        })()
    
    },[])


    return (
        <div>
        <h1>Novel Work Space</h1>
        </div>
    );
}