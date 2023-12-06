import React from "react";
import "./errorSiteStyle.css";

import ChangeDocumentTitle from "../Global/changeDocumentTitle";

const ErrorSite = () => {

    ChangeDocumentTitle("Error")

    return(
        <>
            <div className="errorBox">
                <h1 id="errorText">Looks like you've encountered an error!</h1>
                <p id="errorReason">This could be because of several reasons:</p>
                <p className="reasons"><span className="dot"></span> The servers are too busy for us to handle.</p>
                <p className="reasons"><span className="dot"></span> Your device may be experiencing connectivity issues.</p>
                <p className="reasons"><span className="dot"></span> An unexpected error occurred during the request processing.</p>
                <p className="reasons"><span className="dot"></span> The page failed to load properly; try reloading the page again.</p>
            </div>
        </>
    )
}

export default ErrorSite;