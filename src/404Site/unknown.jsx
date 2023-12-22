import React from "react";
import "./unknownPageStyle.css";
import { useNavigate } from "react-router";

import ChangeDocumentTitle from "../Global/changeDocumentTitle";

const UnkownPage = () => {

    const navigate = useNavigate()

    ChangeDocumentTitle("Page not found | Light Novels")

    return(
        <div className="unknownPageContainer">
            <p id="errorText">404: Page not found</p>
            <button id="unknownPageHomepageButton" onClick={() => navigate("/")}>Go Homepage</button>
        </div>
    );
}

export default UnkownPage;