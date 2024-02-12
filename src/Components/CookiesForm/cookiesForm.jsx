import React , {useState,useEffect} from "react"
import setCookie from "../../Global/setCookie";
import Cookies from "js-cookie";

import "./cookiesFormStyle.css"

const CookiesForm = () => {
    
    const [cookieOptions,setCookieOptions] = useState({
        FontSize:false,
        FontType:false,
        Theme:false,
        Popular:false
    })

    const [collectCookiesFormShow, setCollectCookiesFormState] = useState(false);
    const [cookiesSelectionState, setCookiesSelectionState] = useState(false);

    const storeCookieOptions = () =>{
        setCookie("cookieOption",cookieOptions,30)
        setCollectCookiesFormState(false)
    }

    const storeCookies = (e) =>{
        setCookie("cookiesAccepted",true,365)
        setCollectCookiesFormState(false)
    }

    const doNotStoreCookies = () =>{
        setCookie("cookiesAccepted",false,7)
        setCollectCookiesFormState(false)
    }

    useEffect(() =>{
        if (Cookies.get("cookiesAccepted") || Cookies.get("cookieOption")){
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
                            <button className="bannerButton" id="RejectButton" onClick={doNotStoreCookies}>Reject</button>
                            <button className="bannerButton" onClick={() => setCookiesSelectionState(!cookiesSelectionState)}>Adjust</button>
                        </div>
                    </div>    
                </div>
                {cookiesSelectionState === true ? 
            <>
                <div id="ExtraCookiesOptions">
                    <div id="CookiesOptions">
                        <div id="cookiesOptionsTitle">
                            <h2>Cookie Preferences</h2>
                        </div>
                        <div id="cookiesOptionsContent">
                            <div className="cookieOption">Chapter Page Font Size: <input className="cookieInput" type="checkbox" onChange={() => setCookieOptions(prevState => ({...prevState, FontSize: !prevState.FontSize}))}/></div>
                            <div className="cookieOption">Chapter Page Font Type: <input className="cookieInput" type="checkbox" onChange={() => setCookieOptions(prevState => ({...prevState, FontType: !prevState.FontType}))} /></div>
                            <div className="cookieOption">Chapter Page Theme: <input className="cookieInput" type="checkbox" onChange={() => setCookieOptions(prevState => ({...prevState, Theme: !prevState.Theme}))} /></div>
                            <div className="cookieOption">Most popular books: <input className="cookieInput" type="checkbox" onChange={() => setCookieOptions(prevState => ({...prevState, Popular: !prevState.Popular}))} /></div>
                        </div>
                        <button className="acceptOptionsButton" id="AcceptButton" onClick={storeCookieOptions}>Accept these cookies</button>
                    </div>
                </div>
            </> 
            : ""}
            </div> 
        </div>
    )
}   

export default CookiesForm;