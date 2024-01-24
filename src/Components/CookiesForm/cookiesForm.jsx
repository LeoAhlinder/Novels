import React from "react"

import "./cookiesFormStyle.css"

const CookiesForm = ({collectCookiesFormShow}) => {
    return (
        <div id={collectCookiesFormShow === false ? "" : "cookieForm"}>
            <div id="cookieFormContent">
                <h1>Cookie Policy for Novels.com</h1>
                <p id="cookiesInfoText">By accepting this you have allows Novels.com to set cookies.</p>
            </div>
        </div>
    )
}   

export default CookiesForm;