import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Cookies from "js-cookie";
import ChangeDocumentTitle from "../../../Global/changeDocumentTitle";

export default function NovelWorkSpace() {

    const navigate = useNavigate();

    const bookName = window.location.pathname.split("/").pop(0);

    ChangeDocumentTitle(`Novel Workspace | ${bookName}`)

    const [validUser, setValidUser] = useState(false)

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
                body:JSON.stringify({bookName:bookName})
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
            {validUser === true ? <h2>Novel WorkSpace</h2> : <h2>Invalid Token</h2>}
        </>
    );
}