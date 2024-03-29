import React, {useEffect,useState} from "react";
import "./chapterSelectionStyle.css"

import ChangeDocumentTitle from "../Global/changeDocumentTitle";
import { useNavigate } from "react-router";

import ChapterSelectionComponent from "../Components/ChapterSelection/chapterSelectionComponent"
import APIURL from "../Global/API-URL";

const ChapterSelection = () => {

    const navigate = useNavigate()

    const bookName = window.location.pathname.split("/")[2].replaceAll("-", " ").replaceAll("%20", " ");
    ChangeDocumentTitle("Chapter Selection" + " | " + `${bookName}`);

    const [chapters,setChapters] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {

        try{
          const fetchChapters = async () => {
            const res = await fetch(`${APIURL}/api/chapters/${bookName}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
            });
            const response = await res.json();
            if (res.ok) {
              setChapters(response.data);
              setLoading(false);
            } else {
              setLoading(false);
            }
          };
          fetchChapters(); 

        }catch(err){
          navigate("/error")
        }
    }, []);

    function goToChapterPage(chapterNumber){
        navigate(`/chapters/${bookName}/${chapterNumber}`)
    }

    return (
    <>
        <ChapterSelectionComponent
            chapters={chapters}
            goToChapterPage={goToChapterPage}
            loading={loading}
        />
    </>
    );
}

export default ChapterSelection;