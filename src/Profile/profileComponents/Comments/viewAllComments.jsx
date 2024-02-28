import React, {useEffect,useState,useMemo} from "react";
import "./viewAllCommentsStyle.css"

import { useNavigate } from "react-router";

const ViewAllComments = () => {

    const navigate = useNavigate()

    const [comments,changeComments] = useState([])
    const [loading,changeLoading] = useState(true)
    const [noticeText,changeNoticeText] = useState("You have not commented on any novels")
    const [loadSet,changeLoadSet] = useState(0)
    const [moreCommentsExist,changeMoreCommentsExist] = useState(false)

    useEffect(() => {
        fetchUsersComments(loadSet)
    },[])

    const fetchUsersComments = async (loadSet) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/getUsersComments?loadSet=${loadSet}`, {
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
                if (loadSet > 0){
                    if (response.moreComments === false){
                        changeMoreCommentsExist(false)
                    }
                    return response.comments
                }
                if (response.error){
                    changeNoticeText("Something went wrong, please try again later")
                }
                else if (response.comments.length > 0){
                    changeComments(response.comments)
                    changeLoading(false)
                    if (response.moreComments === true){
                        changeMoreCommentsExist(true)
                    }
                }
                else{
                    changeComments([])
                    changeLoading(false)
                }
            }
            else{
                changeNoticeText("Something went wrong, please try again later")
            }
        } catch (err) {
            navigate("/error");
        }
    }

    async function fetchMoreComments(loadSet){
        const newComments = await fetchUsersComments(loadSet)
        changeLoadSet(loadSet + 1)

        if (newComments !== undefined){
            changeComments(prevState => [
                ...prevState,
                ...newComments
            ]);
        }
    }
    
    const goToBook = (bookName) => {
        navigate(`/novel/${bookName}`)
    }

    return (
        <div id="commentSectionContainer">
            <h1 id="commentProfileHeader">Your Comments</h1>
            {loading ? <p>Loading...</p> : 
            <>
                <div id="commentsContainer">
                    {comments.length > 0 ? comments.map((comment,index) => {
                        return(
                            <div className="commentProfile" key={index}>
                                <h2>{comment.title}</h2>
                                <p className="commentTextProfile">{comment.comment}</p>
                                <button className="navigateBookButton" onClick={() => goToBook(comment.title)}>Go To Book</button>
                            </div>
                        )
                    })
                    : 
                    <div className="noComments">{noticeText}</div>}
                </div>
                <div>
                    {moreCommentsExist ? <button onClick={() => fetchMoreComments(loadSet + 1)} id="loadMoreComments">Load More Comments</button> : ""}
                </div>
            </>
            
            }
        </div>
    )
}

export default ViewAllComments;