import React, {useEffect,useState} from "react";
import "./viewAllCommentsStyle.css"

import { useNavigate } from "react-router";

const ViewAllComments = () => {

    const navigate = useNavigate()

    const [comments,changeComments] = useState([])
    const [loading,changeLoading] = useState(true)

    useEffect(() => {
        const fetchAllComments = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/getUsersComments`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Allow-Credentials": "true"
                    },
                    credentials: "include"
                });
                if (res.ok) {
                    const response = await res.json();
                    console.log(response)
                    if (response.error){
                        console.log("Error fetching comments")
                    }
                    else if (response.comments.length > 0){
                        changeComments(response.comments)
                        changeLoading(false)
                    }
                    else{
                        changeComments([])
                        changeLoading(false)
                    }
                }
                else{
                    console.log("Error fetching comments")
                }
            } catch (err) {
                console.log(err)
                //navigate("/error");
            }
        }
        fetchAllComments()
    },[])

    return (
        <div id="commentSectionContainer">
            <h1>Your Comments</h1>
            {loading ? <p>Loading...</p> : 
            <div id="commentsContainer">
                {comments.length > 0 ? comments.map((comment,index) => {
                    return(
                        <div className="commentProfile" key={index}>
                            <h2>Book</h2>
                            <p className="commentText">{comment.comment}</p>
                        </div>
                    )
                })
                : 
                <div className="noComments">You have not commented on any novels</div>}
            </div>}
        </div>
    )
}

export default ViewAllComments;