import React, {useEffect,useState} from "react";
import "./chapterSelectionStyle.css"

import ChangeDocumentTitle from "../Global/changeDocumentTitle";
import Cookies from "js-cookie";

const ChapterSelection = () => {

    const bookName = window.location.pathname.split("/")[2].replaceAll("-", " ");
    ChangeDocumentTitle("Chapter Selection" + " | " + `${bookName}`);

    const [chapters,setChapters] = useState([]);

    useEffect(() => {

        const token = Cookies.get("authToken");

        const fetchChapters = async () => {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/Chapters/${bookName}
          `, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const response = await res.json();
          if (res.ok) {
            setChapters(response.data);
          } else {
            console.log(response.message);
          }
        };
      
        fetchChapters(); 
    }, []);

    useEffect(() => {
        console.log(chapters)
    }, [chapters]);



    return (
        <>
            <div id="chaptersContainer">
                <li id="chapterItem">Yo</li>
                <li id="chapterItem">Yo</li>
                <li id="chapterItem">Yo</li>
                <li id="chapterItem">Yo</li>

                
            </div>
        </>
    );
}

export default ChapterSelection;