import React , {useState,useEffect} from "react"
import setCookie from "../../Global/setCookie";
import Cookies from "js-cookie";

import "./cookiesFormStyle.css"

const CookiesForm = () => {

    const [collectCookiesFormShow, setCollectCookiesFormState] = useState(false);

    const storeCookies = (e) =>{
        if (e.target.innerText === "Accept All"){
            setCookie("cookiesAccepted",true,365)
        }
        setCollectCookiesFormState(false)
    }

    useEffect(() =>{
        if (Cookies.get("cookiesAccepted")){
            setCollectCookiesFormState(false)
        }
        else{
            setCollectCookiesFormState(true)
        }
    },[])

    return (
        <div id={collectCookiesFormShow === false ? "doNotShow" : "cookieForm"}>
            <div id="cookieFormContent">
                <p id="cookieTitle">We respect your privacy</p>
                <div id="cookiesInfoText">
                    Cookies are used for remembering your preferences for the website and storing books in most popular, aswell as storing your authentication token to keep you logged in.
                    The cookies are not used by any third party and are only used by Novels.com to make your experience better.
                    <br />
                    <br />
                    By clicking <span id="acceptAllText">"Accept All"</span> you accept that Novels.com will set cookies.
                    <div id="cookieBannerButtons">
                        <button className="bannerButton" onClick={storeCookies}>Accept All</button>
                        <button className="bannerButton" onClick={storeCookies}>Reject</button>
                    </div>
                </div>    
            </div>
        </div>
    )
}   

export default CookiesForm;