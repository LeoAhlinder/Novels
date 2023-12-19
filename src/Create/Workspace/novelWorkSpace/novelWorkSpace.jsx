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
    const [bookId, setBookId] = useState(""); 
    const [bookInfo	, setBookInfo] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
        setIsLoaded(true);
        }, 100); 
    
        return () => clearTimeout(timer); 
    }, []);

    useEffect(() => {
        async function checkIfUserValid() {
          try {
            const token = Cookies.get("authToken");
      
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/checkOwnerOfBook`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ bookName: bookNameEdited }),
            });
      
            if (res.ok) {
              const response = await res.json();
              if (response.message === "valid") {
                setValidUser(true);
                setBookId(response.bookId)
              } else {
                setValidUser(false);
              }
            } else {
              navigate("/error");
            }
          } catch (error) {
            console.error(error);
            navigate("/error");
          }
        }
        checkIfUserValid();
      }, []);
      
    useEffect(() => {
        if (validUser) {
          async function getBookInfo() {
            const token = Cookies.get("authToken");

            try {
              const res = await fetch(`${process.env.REACT_APP_API_URL}/api/getBookInfo?id=${bookId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
              const response = await res.json();
              if (response.data) {
                setBookInfo(response.data);
                console.log(response.data);
              } else {
                setBookInfo([]);
                navigate("/error");
              }
            } catch (error) {
                navigate("/error");
            }
          }
          getBookInfo();
        }
    }, [validUser]);

    return (
        <>  
            {isLoaded ?
                <>
                {validUser === true && bookInfo.length > 0 ?
                    <>
                        <h2 id="novelWorkShopTitle">{bookTitle}</h2>

                        <div id="novelWorkShopContainer">
                            <p id="novelWorkSpaceTotalChapters">Chapters: {bookInfo[0].totalpages === null ? 0 : bookInfo[0].totalpages}</p>
                            <button id="novelWorkspaceNewChapterButton">Make New Chapter</button>
                            <div id="novelWorkshopChapters">

                            </div>
                        </div>
                    </>
                    : <h2>Invalid Token</h2>}
                </>
            : null}       
        </>
    );
}