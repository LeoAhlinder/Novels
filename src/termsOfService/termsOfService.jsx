import React from "react";
import ChangeDocumentTitle from "../Global/changeDocumentTitle";
import "./termsOfServiceStyle.css"

const TermsOfService = () => {
    ChangeDocumentTitle("Terms of service | Novels")
    return(
        <div id="termsContainer">
            <h1 className="termsTitle">
                Terms of service
            </h1>
            <p className="termsText">
                By agreeing to the terms of services this website, you agree to the following:

                <br /><br />

                1. Cookie and Data Storage Notice:
                <br />
                - We will save cookies on your computer to keep you logged in and store your preferences for text style, theme, and font size. Additionally, your email, username, and encrypted password will be stored in our database for account management purposes.

                <br /><br />

                2. Data Sharing Assurance:
                <br />
                - Your information will not be shared with anyone else and will only be used for the services provided on this website.

                <br /><br />

                3. User Responsibility and Conduct:
                <br />
                - As a user, you are responsible for your actions. Failure to follow the <a href="/rules" target="_blank" id="rulesTag">rules</a> or posting inappropriate content may result in a ban from the website without warning.

                <br /><br />

                5. Limitation of Liability:
                <br />
                - We at Novels.se will not take responsibility for any damage to hardware or software or data breaches caused by the use of this website.

                <br /><br />

                6. Content Management:
                <br />
                - We at Novels.se reserve the right to remove, modify, or change any content posted on our website at any time without warning.
                <br /><br />
                            
                7. Copyright and DMCA Notice:   
                <br />
                - We respect the intellectual property rights of others. If you believe that your work has been used on our website in a way that constitutes copyright infringement, please provide our designated agent with the following information:
                    <br />
                    - A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.
                    <br />
                    - Identification of the copyrighted work claimed to have been infringed.
                    <br />
                    - Identification of the material that is claimed to be infringing or to be the subject of infringing activity.
                    <br />
                    - Contact information for the copyright owner, such as email address.
                    <br />
                    - A statement that the complaining party has a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
                    <br />
                    - A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.

                <br /><br />

                8. Counter-Notification:
                <br />
                - If you believe that your content was mistakenly removed or disabled due to a misidentification or error, you may submit a counter-notification. The counter-notification must include:
                    <br />
                    - Identification of the material that has been removed or to which access has been disabled. 
                    <br />
                    - A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification.
                    <br />
                    - Your username, email address and a statement that you consent to the jurisdiction of the federal district court for the judicial district in which your address is located, or if your address is outside of the United States, for any judicial district in which the service provider may be found, and that you will accept service of process from the person who provided the original notification of infringement.

                <br /><br />

                9. Designated Agent Contact Information:
                <br />
                - Our designated agent for copyright infringement claims can be reached at:

                <br />
                    - Email: novels@novels.se
                <br /><br />
                Extra information:
                Any changes to the terms of service will be notified on the front page of the website.
            </p>

        </div>
    )
}

export default TermsOfService