import React , {useState,useEffect} from "react"
import setCookie from "../../Global/setCookie";
import Cookies from "js-cookie";

import "./cookiesFormStyle.css"

const CookiesForm = () => {

    const [collectCookiesFormShow, setCollectCookiesFormState] = useState(false);
    const [cookiesSelectionState, setCookiesSelectionState] = useState(false);

    const storeCookies = (e) =>{
        if (e.target.innerText === "Accept All"){
            setCookie("cookiesAccepted",true,365)
        }
        else{
            setCookie("cookiesAccepted",false,7)
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
            <div id="cookieBanner">
                <div id="cookieFormContent">
                    <p id="cookieTitle">We respect your privacy</p>
                    <div id="cookiesInfoText">
                        Cookies are used for remembering your preferences for the website and storing books from the most popular.
                        The cookies are not used by any third party and are only used by Novels.se to make your experience better.
                        <br />
                        <br />
                        By clicking <span id="acceptAllText">"Accept All"</span> you accept that Novels.se will set cookies.
                        <div id="cookieBannerButtons">
                            <button className="bannerButton" id="AcceptButton" onClick={storeCookies}>Accept All</button>
                            <button className="bannerButton" id="RejectButton" onClick={storeCookies}>Reject</button>
                            <button className="bannerButton" onClick={() => setCookiesSelectionState(!cookiesSelectionState)}>Adjust</button>
                        </div>
                    </div>    
                </div>
                {cookiesSelectionState === true ? 
            <>
                <div id="ExtraCookiesOptions">
                    <div id="CookiesOptions">
                        <div id="cookiesOptionsTitle">
                            <p>Cookie Preferences</p>
                        </div>
                        <div id="cookiesOptionsContent">
                            <div id="cookieOption">
                                <input type="checkbox" id="cookieOption1" />
                                <label for="cookieOption1">Functional Cookies</label>
                            </div>
                            <div id="cookieOption">
                                <input type="checkbox" id="cookieOption2" />
                                <label for="cookieOption2">Analytics Cookies</label>
                            </div>
                            <div id="cookieOption">
                                <input type="checkbox" id="cookieOption3" />
                                <label for="cookieOption3">Marketing Cookies</label>
                            </div>
                        </div>
                    </div>
                </div>
            </> 
            : ""}
            </div> 
        </div>
    )
}   

export default CookiesForm;