import React, { useState } from "react";
import CommentFeedback from "./APIs/commentFeedbackAPI";
import downvotePicture from "../../Icons/downvote.svg";
import downvotePictureFill from "../../Icons/downvote-fill.svg";
import upvotePicture from "../../Icons/upvote.svg";
import upvotePicutreFill from "../../Icons/upvote-fill.svg";

const Comment = ({ id, dislikes: initialDislikes, likes: initialLikes, commentText, Username, value, recievedFeedback }) => {

    const likedFeedback = recievedFeedback.filter(feedback => feedback.commentid === id && feedback.feedback === "likes");
    const dislikedFeedback = recievedFeedback.filter(feedback => feedback.commentid === id && feedback.feedback === "dislikes");


    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);

    // Check if the user has already liked or disliked the comment
    const [commentLiked, setCommentLiked] = useState(likedFeedback.length > 0 ? true : false);
    const [commentDisliked, setCommentDisliked] = useState(dislikedFeedback.length > 0 ? true : false);

    async function handleCommentFeedback(commentId, feedback) {
        let feedbackPosted = await CommentFeedback({ commentId: commentId, feedback: feedback });
        return feedbackPosted;
    }

    const handleFeedbackClick = async (feedbackType) => {
        let feedbackPosted = await handleCommentFeedback(value, feedbackType);
        if (feedbackPosted === "Updated"){
            if (feedbackType === "likes") {
                setLikes(prevLikes => prevLikes + 1); 
                setDislikes(prevDislikes => prevDislikes - 1);
                setCommentLiked(true);
                setCommentDisliked(false);
            }
            else{
                setLikes(prevLikes => prevLikes - 1); 
                setDislikes(prevDislikes => prevDislikes + 1);
                setCommentLiked(false);
                setCommentDisliked(true);
            }
        }
        else if (feedbackPosted === "Deleted"){
            setCommentLiked(false);
            setCommentDisliked(false);
            if (feedbackType === "likes") {
                setLikes(prevLikes => prevLikes - 1);
            } else if (feedbackType === "dislikes") {
                setDislikes(prevDislikes => prevDislikes - 1); 
            }
        } else if (feedbackType === "likes") {
            setLikes(prevLikes => prevLikes + 1); 
            setCommentLiked(true);
            setCommentDisliked(false);
        } else if (feedbackType === "dislikes") {
            setDislikes(prevDislikes => prevDislikes + 1); 
            setCommentLiked(false);
            setCommentDisliked(true);
        }
    };

    return (
        <div className="Comment">
            <h3 className="commentUsername">{Username}</h3>
            <p className="commentText">{commentText}</p>
            <div className="likeDislikeContainer">
                <div className="feedbackButton">
                    <span className="feedbackText">{likes === null ? 0 : likes}</span>
                    <button onClick={() => handleFeedbackClick("likes")}>
                        <img src={commentLiked ? upvotePicutreFill : upvotePicture} className="voteButtons" alt="upvote comment image" />
                    </button>
                </div>
                <span>|</span>
                <div className="feedbackButton">
                    <span className="feedbackText">{dislikes === null ? 0 : dislikes}</span>
                    <button onClick={() => handleFeedbackClick("dislikes")}>
                        <img src={commentDisliked ? downvotePictureFill : downvotePicture} className="voteButtons" alt="downvote comment image" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Comment;
