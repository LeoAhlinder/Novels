import Cookies from "js-cookie";

const setCookie = (name,value,milliseconds) =>{

    if (Cookies.get("cookieOption")){
        var cookieConsent = checkCookieConsent(name)
        if (cookieConsent === false){
            return
        }
    }

    let expiration = new Date();
    expiration.setTime(expiration.getTime() + (milliseconds * 60 * 60 * 1000)); // Convert milliseconds to hours
    let expires = "expires=" + expiration.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + "; " + expires + "; SameSite=Strict; Secure";
}

function checkCookieConsent(name){
    var cookieOptions = document.cookie.match(new RegExp("cookieOption" + '=([^;]+)'));
    cookieOptions && (cookieOptions = JSON.parse(cookieOptions[1]));
    switch (name) {
        case "Popular":
            return cookieOptions && cookieOptions.Popular === true;
        case "fontType":
            return cookieOptions && cookieOptions.FontType === true;
        case "textSize":
            return cookieOptions && cookieOptions.FontSize === true;
        case "theme":
            return cookieOptions && cookieOptions.Theme === true;
        default:
            return false;
    }
}

export default setCookie