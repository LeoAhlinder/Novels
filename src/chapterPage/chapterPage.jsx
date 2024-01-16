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
    const [chapterTextSize,setChapterTextSize] = useState(18);
    const [chapterTheme,setChapterTheme] = useState("light");

    ChangeDocumentTitle(`${bookName} - Chapter ${chapterNumber}`);

    const themeColors = {
        dark:{
            backgroundColor:"#0e1111",
            color:"#ffffff"
        },
        light:{
            backgroundColor:"#ffffff",
            color:"#000000"
        }
    
    }

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
        }
        else if (Sign === "-" && chapterTextSize > 10){
            setChapterTextSize(chapterTextSize - 2)
        }
    }

    function changeTheme(theme){
        if (chapterTheme !== theme)
            setChapterTheme(theme)
    }

    return(
        <>
            {loading === false ?
            <div id="chapterPageContainer">
                <h1 id="chapterPageTitle">
                    {chapterTitle}
                </h1>
                <div id="chapterTextSizeContainer">
                    <button id="chapterTextSizeButton" onClick={() => changeTextSize("+")}>
                        +
                    </button>
                    <button id="chapterTextSizeButton" onClick={() => changeTextSize("-")}>
                        -
                    </button>
                </div>
                <div id="chapterPageThemeButtons">
                    <button id="chapterThemeButton" onClick={() => changeTheme("dark")}>
                        Dark Mode
                    </button>
                    <button id="chapterThemeButton" onClick={() => changeTheme("light")}>
                        Light Mode
                    </button>
                </div>
                <p id="chapterText" style={{fontSize:chapterTextSize + "px", backgroundColor:themeColors[chapterTheme].backgroundColor,color:themeColors[chapterTheme].color}}>
                    {chapterText}
                </p>
            </div>
            : 
            <div>
            </div>
            }
        </>
    )
}

export default ChapterPage;