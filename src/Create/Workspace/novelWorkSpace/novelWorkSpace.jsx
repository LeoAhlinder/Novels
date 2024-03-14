import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./novelWorkSpaceStyle.css";

import ChangeDocumentTitle from "../../../Global/changeDocumentTitle";

import CreateChapter from "../../../Components/novelWorkspace/createNewChapter"
import ChaterSelectionComponent from "../../../Components/ChapterSelection/chapterSelectionComponent"

export default function NovelWorkSpace() {

    const navigate = useNavigate();

    const bookNameEdited = window.location.pathname.split("/")[2];
    const bookTitle = window.location.pathname.split("/")[2].replaceAll("-", " ");

    ChangeDocumentTitle(`Novel Workspace | ${bookNameEdited}`)

    const [currentSessionChapter, setCurrentSessionChapter] = useState(0);

    const [validUser, setValidUser] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [bookId, setBookID] = useState(""); 
    const [bookInfo	, setBookInfo] = useState([]);
    const [viewingMode, setViewingMode] = useState("viewChapters");
    const [chapterContentLength, setChapterContentLength] = useState(0);
    const [chapterContent, setChapterContent] = useState("");
    const [confirmation , setConfirmation] = useState(false);
    const [chapterTitle, setChapterTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [chapters, setChapters] = useState([]);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertMessageColor,setAlertMessageColor] = useState("");

    useEffect(() => {
        async function checkIfUserValid() {
          try {      
            const res = await fetch(`https://152.42.128.44:3001/api/checkOwnerOfBook`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Allow-Credentials": "true"
              },
              credentials:"include",
              body: JSON.stringify({ bookName: bookNameEdited }),
            });
            if (res.ok) {
              const response = await res.json();
              if (response.message === "valid") {
                setValidUser(true);
                setBookID(response.bookId)
                setCurrentSessionChapter(response.totalpages);
              } else {
                setValidUser(false);
              }
            } else {
              navigate("/error");
            }
          } catch (error) {
            navigate("/error");
          }
        }
        checkIfUserValid();
      }, []);
      
    useEffect(() => {
        if (validUser) {
          async function getBookInfo() {
            try {
              const res = await fetch(`https://152.42.128.44:3001/api/getBookInfo?id=${bookId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  "Allow-Credentials": "true"
                },
                credentials:"include"
              });
              const response = await res.json();
              if (response.data) {
                setBookInfo(response.data);
                setLoading(false)
              } else {
                setBookInfo([]);
                navigate("/error");
              }
              setIsLoaded(true)
            } catch (error) {
                navigate("/error");
            }
          }
          getBookInfo();
        }
    }, [validUser]);

    const publishChapter = async () => {
      try {
        const res = await fetch(`https://152.42.128.44:3001/api/publishChapter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Allow-Credentials": "true"
          },
          credentials:"include",
          body: JSON.stringify({ bookId: bookId, chapterContent: chapterContent, chapterTitle: chapterTitle, chapterNumber: Number(currentSessionChapter + 1)}),
        });
        const response = await res.json();
        if (response.error){
          setAlertMessage(`${response.error}`)
          setAlertMessageColor("rgb(202, 82, 82)")
        }
        else if (response.message === "success") {
          setAlertMessage("Chapter Published")
          setAlertMessageColor("Green")
          setChapterContent("");
          setChapterTitle("");
          setChapterContentLength(0);
          setConfirmation(false);
          setCurrentSessionChapter(Number(currentSessionChapter) + 1);
        }else if (response.message === "error"){
          setAlertMessage("Something went wrong, please try again later")
          setAlertMessageColor("rgb(202, 82, 82)")
        }else if (response.message === "To many chapters"){
          setAlertMessage("You have reached the maximum amount of chapters for your novel")
          setAlertMessageColor("rgb(202, 82, 82)")
        }
        else {
          navigate("/error");
        }
      } catch (error) {
        navigate("/error");
      }
    }

    useEffect(() => {

        const fetchChapters = async () => {
          try{
            const res = await fetch(`https://152.42.128.44:3001/api/chapters/${bookTitle}`, {
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
              console.log(response.message);
              setLoading(false);
            }
          }catch(err){
            navigate("/error")
          }
          };
          fetchChapters(); 
      }, []);

    const handleTextAreaLength = (e) => {
      setChapterContentLength(e.target.value.length);
      setChapterContent(e.target.value);
    }

    function goToChapterPage(chapterNumber){
      navigate(`/chapters/${bookNameEdited}/${chapterNumber}`)
  }

    return (
      <>  
        {isLoaded ?
          <>
            {validUser === true && bookInfo.length > 0 ?
              <>
                <h2 id="novelWorkShopTitle" onClick={() => navigate(`/novel/${bookNameEdited}`)}>{bookTitle}</h2>
                  <div id="novelWorkShopContainer">
                    <p id="novelWorkShopAlertMessage" style={{color:alertMessageColor}}>{alertMessage}</p>
                      <button id="novelWorkspaceNewChapterButton" onClick={() => setViewingMode(viewingMode === "viewChapters" ? "newChapter" : "viewChapters")}>
                        {viewingMode === "viewChapters" ? "Make New Chapter" : "View All Chapters"}
                      </button>
                      <p id="novelWorkSpaceTotalChapters">{viewingMode === "viewChapters" ? `Chapters: ${bookInfo[0].totalpages === null ? 0 : bookInfo[0].totalpages}` : null}</p>

                      <div id="novelWorkspaceViewingContainer">
                      {
                      viewingMode === "viewChapters" ? 
                      <div id="novelWorkspaceViewChapters">
                          <ChaterSelectionComponent
                            chapters={chapters}
                            goToChapterPage={goToChapterPage}
                            loading={loading}
                          />
                      </div>
                      : viewingMode === "newChapter" ? 
                      <CreateChapter
                        chapterContentLength={chapterContentLength}
                        handleTextAreaLength={handleTextAreaLength}
                        publishChapter={publishChapter}
                        setConfirmation={setConfirmation}
                        confirmation={confirmation}
                        handleTitleChange={(e) => setChapterTitle(e.target.value)}
                        chapterContent={chapterContent}
                        titleContent={chapterTitle}
                      />
                      : null
                      }
                    </div>
                </div>
               </>
            : <h2>Invalid User {bookInfo.length}</h2>}
           </>
      : null}       
    </>
    );
}