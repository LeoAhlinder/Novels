import React, {useEffect,useState} from "react";

import ChangeDocumentTitle from "../Global/changeDocumentTitle";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import "./chapterPageStyle.css"
import gearIcon from "../Icons/gear.svg"

import setCookie from "../Global/setCookie";

import DOMPurify from 'dompurify';

const ChapterPage = () => {

    const navigate = useNavigate()

    const bookName = window.location.pathname.split("/")[2].replaceAll("-", " ").replaceAll("%20", " ");
    const chapterNumber = window.location.pathname.split("/")[3].replaceAll("-", " ");

    const [chapterText,setChapterText] = useState([]);
    const [loading,setLoading] = useState(true);
    const [chapterTitle,setChapterTitle] = useState("");
    const [viewCustomOptions,setViewCustomOptions] = useState(false);
    const [chapterTextSize,setChapterTextSize] = useState(18);
    const [chapterTheme,setChapterTheme] = useState("dark");
    const [chapterFontType,setChapterFontType] = useState("Roboto");
    const [totalChapters,setTotalChapters] = useState(0);

    ChangeDocumentTitle(`${bookName} - Chapter ${chapterNumber}`);

    const themeColors = {
        dark:{
            backgroundColor:"#28282B",
            color:"#ffffff"
        },
        light:{
            backgroundColor:"#ffffff",
            color:"#000000"
        }
    }

    useEffect(() => {
        const setUserPreferences = async () => {
            const preferredTheme = Cookies.get("theme");
            const preferredTextSize = Cookies.get("textSize");
            const preferredFontType = Cookies.get("fontType");

            if (preferredTheme || preferredTextSize || preferredFontType){

                if (preferredTheme === "dark" || preferredTheme === "light"){
                    setChapterTheme(preferredTheme)
                }
                else{
                    setChapterTheme("light")
                }

                if (preferredTextSize){
                    setChapterTextSize(Number(preferredTextSize))
                }
                else{
                    setChapterTextSize(16)
                }

                if (preferredFontType){
                    setChapterFontType(preferredFontType)
                }else{
                    setChapterFontType("Roboto")
                }
            }
            else{
                setChapterTheme("light")
                setChapterTextSize(16)
                setChapterFontType("Roboto")
            }
        }

        if (Cookies.get("cookiesAccepted") === "true"){
            setUserPreferences();
        }
    },[])

    useEffect(() => {
        const setLatestReadChapter = async () => {

            try{
                await fetch(`${process.env.REACT_APP_API_URL}/api/setLatestReadChapter`,{
                    method:"POST",
                      headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Allow-Credentials": "true"
                    },
                    credentials:"include",
                    body: JSON.stringify({bookName:bookName,chapterNumber:chapterNumber,totalPages:totalChapters})
                });
            }catch(err){
                console.log(err)
            }
            }
        if (loading === false){
            const timeoutId = setTimeout(() => {
                if (chapterNumber <= totalChapters && chapterNumber > 0)
                    {
                        setLatestReadChapter();
                    }
            }, 2000);
            
            return () => {
                clearTimeout(timeoutId);
            };
        }
    },[loading])

    useEffect(()=>{
        const getChapterInfo = async () =>{

            try{
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chapterInfo`,{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({bookName:bookName,chapterNumber:chapterNumber})
                });
                const response = await res.json();

                if (response.data){
                    setChapterText(response.data[0].chapterText);
                    setChapterTitle(response.data[0].chapterTitle);
                    setLoading(false);
                    setTotalChapters(response.totalPages)
                }
                else if (response.error){
                    setChapterTitle("A error occured");
                    setLoading(false);
                }
                else if (response.message === "Nothing found"){
                    setChapterTitle("Nothing found");
                    setLoading(false);
                }
                else {
                    navigate("/error")
                }
            }catch(error){
                navigate("/error")
            }
        }

        getChapterInfo();
    },[])

    function changeTextSize(Sign){
        if (Sign === "+" && chapterTextSize < 36){
            setChapterTextSize(chapterTextSize + 2)
            setCookie("textSize",Number(chapterTextSize + 2),720)
        }
        else if (Sign === "-" && chapterTextSize > 10){
            setChapterTextSize(chapterTextSize - 2)
            setCookie("textSize",Number(chapterTextSize - 2),720)
        }
    }

    function changeTheme(Theme){
        if (chapterTheme !== Theme)
            setChapterTheme(Theme)
            setCookie("theme",Theme,720)
    }

    function changeFontType(Font){
        if (chapterFontType !== Font)
            setChapterFontType(Font)
            setCookie("fontType",Font,720)
    }

    return(
        <>
            {loading === false ?
            <div id="chapterPageContainer" style={{backgroundColor:themeColors[chapterTheme].backgroundColor}}>
                <a id="chapterPageBookTitle" href={`/novel/${bookName}`} style={{color:themeColors[chapterTheme].color}}>{bookName}</a>
                <h1 id="chapterPageTitle" style={{color:themeColors[chapterTheme].color}}>
                    Chapter {chapterNumber}: {chapterTitle}
                </h1>
                {viewCustomOptions === false ? 
                    <button className="chapterPageCustomOptionsButton" onClick={() => setViewCustomOptions(true)}>
                        <img className="gearIcon" src={gearIcon} alt="custom settings"/>
                    </button>
                :
                    <>
                        <button className="chapterPageCustomOptionsButton" onClick={() => setViewCustomOptions(false)}>
                        <img className="gearIcon" src={gearIcon} alt="custom settings"/>
                        </button>
                        <div id="chapterPageCustomOptions">
                            <div id="chapterTextSizeContainer">
                                <button id="chapterTextSizeButton" onClick={() => changeTextSize("+")}>
                                    +
                                </button>
                                <p id="chapterTextSizeText" style={{fontFamily:chapterFontType,backgroundColor:themeColors[chapterTheme].backgroundColor,color:themeColors[chapterTheme].color}}>{chapterTextSize}</p>
                                <button id="chapterTextSizeButton" onClick={() => changeTextSize("-")}>
                                    -
                                </button>
                            </div>
                            <div>
                                <div id="chapterPageFontType">
                                    <button className="changeFontTypeButton" onClick={() => changeFontType("Roboto")}>Roboto</button>
                                    <button className="changeFontTypeButton" onClick={() => changeFontType("Inter")}>Inter</button>
                                    <button className="changeFontTypeButton" onClick={() => changeFontType("Arial")}>Arial</button>
                                    <button className="changeFontTypeButton" onClick={() => changeFontType("Lora")}>Lora</button>

                                </div>
                                <div id="chapterPageThemeButtons">
                                    <button id="chapterThemeButton" onClick={() => changeTheme("dark")}>
                                        Dark Mode
                                    </button>
                                    <button id="chapterThemeButton" onClick={() => changeTheme("light")}>
                                        Light Mode
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                }
                   
                <p id="chapterText" style={chapterTextSize !== null ? 
                    {fontFamily:chapterFontType,fontSize:chapterTextSize + "px", color:themeColors[chapterTheme].color} : {}}
                    dangerouslySetInnerHTML={{
                        __html: chapterText.length === 0 ? "" : DOMPurify.sanitize(chapterText.replace(/\n/g, '<br>'))
                      }}
                      >
                </p>
                <div id="switchChapterContainer">
                    <button>
                            <a
                                className="chapterSwitchButton"
                                id={Number(chapterNumber) === 1 || Number(chapterNumber) > totalChapters || Number(chapterNumber) === 0 ? "inActiveButton" : ""}
                                href={Number(chapterNumber) === 1 || Number(chapterNumber) > totalChapters ? "" 
                                : `/chapters/${bookName.replaceAll(" ", "-")}/${Number(chapterNumber) - 1}`}
                                onClick={(e) => {
                                    if (Number(chapterNumber) === 1) {
                                    e.preventDefault();
                                    }
                                }}
                                >
                                Previous&nbsp;Chapter
                            </a>
                    </button>
                    <button>
                        <a className="chapterSwitchButton" id="backToBookButton" href={`/novel/${bookName}`}>Back&nbsp;to&nbsp;Book</a>
                    </button>
                    <button>
                    <a
                                className="chapterSwitchButton"
                                id={Number(chapterNumber) === totalChapters || Number(chapterNumber) > totalChapters ? "inActiveButton" : ""}
                                href={Number(chapterNumber) === totalChapters || Number(chapterNumber) > totalChapters ? "" 
                                : `/chapters/${bookName.replaceAll(" ", "-")}/${Number(chapterNumber) + 1}`}
                                onClick={(e) => {
                                    if (Number(chapterNumber) === totalChapters) {
                                    e.preventDefault();
                                    }
                                }}
                                >
                                Next&nbsp;Chapter
                            </a>
                    </button>
                </div>
            </div>
            : 
            <div>
            </div>
            }
        </>
    )
}

export default ChapterPage;