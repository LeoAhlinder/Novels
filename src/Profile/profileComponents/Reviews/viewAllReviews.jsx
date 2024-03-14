import React, {useEffect,useState} from "react";

import { useNavigate } from "react-router";
import ReviewsAndComments from "../../../Components/Profile/ReviewsAndComments"

import ChangeDocumentTitle from "../../../Global/changeDocumentTitle";


const ViewAllReviews = () => {

    ChangeDocumentTitle("Your Reviews | Novels")

    const navigate = useNavigate()

    const [reviews,changeReviews] = useState([])
    const [loading,changeLoading] = useState(true)
    const [noticeText,changeNoticeText] = useState("You have not reviewed any novels yet")
    const [loadSet,changeLoadSet] = useState(0)
    const [moreReviewsExists,changeMoreReviewsExists] = useState(false)

    useEffect(() => {
        fetchUsersReviews(loadSet)
    },[])

    const fetchUsersReviews = async (loadSet) => {
        try {
            const res = await fetch(`https://152.42.128.44:3001/api/getUsersReviews?loadSet=${loadSet}`, {
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
                    if (response.moreReviews === false){
                        changeMoreReviewsExists(false)
                    }
                    return response.reviews
                }
                if (response.message === "No reviews found"){
                    changeNoticeText("You have not reviewed any novels yet")
                }

                else if (response.error){
                    changeNoticeText("Something went wrong, please try again later")
                }
                else if (response.reviews.length > 0){
                    changeReviews(response.reviews)
                    changeMoreReviewsExists(response.moreReviews)
                }
                else{
                    changeReviews([])
                }
                changeLoading(false)

            }
            else{
                changeNoticeText("Something went wrong, please try again later")
            }
        } catch (err) {
            navigate("/error");
        }
    }

    async function fetchMoreReviews(loadSet){
        try{
            const newReviews = await fetchUsersReviews(loadSet)
            changeLoadSet(loadSet + 1)

            if (newReviews !== undefined){
                changeReviews(prevState => [
                    ...prevState,
                    ...newReviews
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
            contents={reviews}
            fetchMoreContent={fetchMoreReviews}
            goToBook={goToBook}
            noticeText={noticeText}
            moreCommentsExist={moreReviewsExists}
            loadSet={loadSet}
            loadMoreText="Load More Reviews"
            viewText="Your Reviews"
            review={true}
        />
    )
}

export default ViewAllReviews;