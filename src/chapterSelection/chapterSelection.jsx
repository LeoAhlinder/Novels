import React, {useEffect,useState} from "react";
import "./chapterSelectionStyle.css"

import ChangeDocumentTitle from "../Global/changeDocumentTitle";
import Cookies from "js-cookie";

const ChapterSelection = () => {

    const bookName = window.location.pathname.split("/")[2].replaceAll("-", " ");
    ChangeDocumentTitle("Chapter Selection" + " | " + `${bookName}`);

    const [chapters,setChapters] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {

        const token = Cookies.get("authToken");

        const fetchChapters = async () => {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chapters/${bookName}
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
            setLoading(false);
          } else {
            console.log(response.message);
            setLoading(false);
          }
        };
        fetchChapters(); 
    }, []);

    return (
<>
  <div id="chaptersContainer">
    {loading ? (
      <p>Loading...</p>
    ) : (
      chapters.map((chapter, index) => (
        <li key={index} id="chapterItem">
          Chapter {chapter.chapterNumber}: {chapter.chapterTitle}
        </li>
      ))
    )}
  </div>
</>
    );
}

export default ChapterSelection;