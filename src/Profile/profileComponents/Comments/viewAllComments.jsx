import React, {useEffect,useState} from "react";
import "./viewAllCommentsStyle.css"

import { useNavigate } from "react-router";
import ReviewsAndComments from "../../../Components/Profile/ReviewsAndComments"

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
        try{
            const newComments = await fetchUsersComments(loadSet)
            changeLoadSet(loadSet + 1)

            if (newComments !== undefined){
                changeComments(prevState => [
                    ...prevState,
                    ...newComments
                ]);
            }
        }catch(err){
            navigate("/error")
        }
    }
    
    const goToBook = (bookName) => {
        navigate(`/novel/${bookName}`)
    }

    return (
        <ReviewsAndComments
            loading={loading}
            contents={comments}
            fetchMoreContent={fetchMoreComments}
            goToBook={goToBook}
            noticeText={noticeText}
            moreCommentsExist={moreCommentsExist}
            loadSet={loadSet}
            loadMoreText="Load More Comments"
            viewText="Your Comments"
        />
    )
}

export default ViewAllComments;