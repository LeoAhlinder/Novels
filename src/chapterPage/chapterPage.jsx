import React, {useEffect,useState} from "react";

import ChangeDocumentTitle from "../Global/changeDocumentTitle";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import "./chapterPageStyle.css"

const ChapterPage = () => {

    const navigate = useNavigate()

    const bookName = window.location.pathname.split("/")[2].replaceAll("-", " ");
    const chapterNumber = window.location.pathname.split("/")[3].replaceAll("-", " ");

    const [chapterText,setChapterText] = useState([]);
    const [loading,setLoading] = useState(true);
    const [chapterTitle,setChapterTitle] = useState("");
    const [viewCustomOptions,setViewCustomOptions] = useState(false);
    const [chapterTextSize,setChapterTextSize] = useState();
    const [chapterTheme,setChapterTheme] = useState();
    const [chapterFontType,setChapterFontType] = useState();

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

        setUserPreferences();
    },[])

    useEffect(()=>{
        const getChapterInfo = async () =>{

            const token = Cookies.get("authToken")

            try{
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chapterInfo?`,{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({bookName:bookName,chapterNumber:chapterNumber})
                });
                const response = await res.json();

                if (response.data){
                    setChapterText(response.data[0].chapterText);
                    setChapterTitle(response.data[0].chapterTitle);
                    setLoading(false);
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
            Cookies.set("textSize",Number(chapterTextSize + 2),{expires: 30, secure: true})
        }
        else if (Sign === "-" && chapterTextSize > 10){
            setChapterTextSize(chapterTextSize - 2)
            Cookies.set("textSize",Number(chapterTextSize - 2),{expires: 30, secure: true})
        }
    }

    function changeTheme(Theme){
        if (chapterTheme !== Theme)
            setChapterTheme(Theme)
            Cookies.set("theme",Theme,{expires: 30, secure: true});
    }

    function changeFontType(Font){
        if (chapterFontType !== Font)
            setChapterFontType(Font)
            Cookies.set("fontType",Font,{expires: 30, secure: true});
    }

    return(
        <>
            {loading === false ?
            <div id="chapterPageContainer">
                <a id="chapterPageBookTitle" href="/book">{bookName}</a>
                <h1 id="chapterPageTitle">
                    {chapterNumber}: {chapterTitle}
                </h1>
                {viewCustomOptions === false ? 
                    <button className="chapterPageCustomOptionsButton" onClick={() => setViewCustomOptions(true)}>
                        Custom Options
                    </button>
                :
                    <>
                        <button className="chapterPageCustomOptionsButton" onClick={() => setViewCustomOptions(false)}>
                            Custom Options
                        </button>
                        <div id="chapterPageCustomOptions">
                            <div id="chapterTextSizeContainer">
                                <button id="chapterTextSizeButton" onClick={() => changeTextSize("+")}>
                                    +
                                </button>
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
                   
                <p id="chapterText" style={chapterTextSize !== null ? {fontFamily:chapterFontType,fontSize:chapterTextSize + "px", backgroundColor:themeColors[chapterTheme].backgroundColor,color:themeColors[chapterTheme].color} : {}}>
                    {chapterText}
                </p>
                <div id="switchChapterContainer">
                    <button>
                        <a className="chapterSwitchButton" href={`/chapters/${bookName.replaceAll(" ", "-")}/${Number(chapterNumber) - 1}`}>Previous Chapter</a>
                    </button>
                    <button>
                        <a className="chapterSwitchButton" href="/book">Back to Book</a>
                    </button>
                    <button>
                        <a className="chapterSwitchButton" href={() => navigate(`/chapters/${bookName.replaceAll(" ", "-")}/${Number(chapterNumber) + 1}`)}>Next Chapter</a> 
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