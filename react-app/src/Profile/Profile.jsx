import "../Profile/profile.css"
import Library from "./Libary"
import { useNavigate } from "react-router-dom"

const Profile = () => {
    const navigate = useNavigate();

    if (!localStorage.getItem("authToken")){
        logOut()
    }

    function logOut(){
        localStorage.removeItem("authToken")
        localStorage.removeItem("userName")
        navigate("/")
    }

    const userName = localStorage.getItem("userName")

    return (
        <div>
            <div className='profileHeader'>
                <h1 className='profileHeader'>Profile Page</h1>
                <button onClick={logOut} className='logout'>Log Out</button>
                <p className='userName'>Welcome, {userName}</p>
                <button className="InfoButton">Info</button>
                <button className="TestButton">test</button>
                <button className="YesButton">test5</button>

            </div>
            <div>
                <Library/>
            </div>
        </div>
    );
}

export default Profile;
