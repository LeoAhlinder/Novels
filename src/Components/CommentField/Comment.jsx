import React, {useState} from "react";

import downvotePicture from "../../Icons/downvote.svg"
import downvotePictureFill from "../../Icons/downvote-fill.svg"

import upvotePicture from "../../Icons/upvote.svg"
import upvotePicutreFill from "../../Icons/upvote-fill.svg"

const Comment = ({ id, dislikes, likes, commentText, Username, handleCommentFeedback, value, recievedFeedback }) => {
    const likedFeedback = recievedFeedback.filter(feedback => feedback.commentid === id && feedback.feedback === "likes");
    const dislikedFeedback = recievedFeedback.filter(feedback => feedback.commentid === id && feedback.feedback === "dislikes");

    const [commentLiked, setCommentLiked] = useState(likedFeedback.length > 0);
    const [commentDisliked, setCommentDisliked] = useState(dislikedFeedback.length > 0);

    const handleFeedbackClick = async (feedbackType) => {
        await handleCommentFeedback(value, feedbackType);
        if (feedbackType === "likes") {
            setCommentLiked(true);
            setCommentDisliked(false);
        } else if (feedbackType === "dislikes") {
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