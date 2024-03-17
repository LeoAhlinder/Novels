import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CommentFeedback from "./APIs/commentFeedbackAPI";
import DeleteComment from "./APIs/deleteCommentAPI";
import ReplyToComment from "./APIs/replyToCommentAPI";

import downvotePicture from "../../Icons/downvote.svg";
import downvotePictureFill from "../../Icons/downvote-fill.svg";
import upvotePicture from "../../Icons/upvote.svg";
import upvotePicutreFill from "../../Icons/upvote-fill.svg";

import trashcanOpen from "../../Icons/trashcan-open.svg"
import trashcanClosed from "../../Icons/trashcan-closed.svg"

const Comment = ({bookid,id, dislikes: initialDislikes, likes: initialLikes, commentText, Username, value, recievedFeedback,viewingUser,thisUserComment }) => {

    const [typeReplyState, setTypeReplyState] = useState(false);
    const [replyText, setReplyText] = useState("");

    const navigate = useNavigate()

    let likedFeedback = [];
    let dislikedFeedback = [];

    if (recievedFeedback !== undefined) {
        likedFeedback = recievedFeedback.filter(feedback => feedback.commentid === id && feedback.feedback === "likes");
        dislikedFeedback = recievedFeedback.filter(feedback => feedback.commentid === id && feedback.feedback === "dislikes");
    }

    const [trashCanHoverd, setTrashCanHoverd] = useState(false);
    const [commentDeleted, setCommentDeleted] = useState(false);

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
        if (viewingUser !== undefined){
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
        }
    };

    const deleteComment = async (commentId) => {
        let commentDeleted = await DeleteComment(commentId);
        if (commentDeleted === "Deleted") {
            setCommentDeleted(true); 
        }
    }

    if (commentDeleted) {
        return null;
    }

    function adjustHeight(e) {
        e.target.style.height = "1px";
        e.target.style.height = (25+e.target.scrollHeight)+"px";
    }

    const replyToComment = async (value) => {
        try{
            console.log(bookid)
            const response = await ReplyToComment(value, replyText,bookid);
            console.log(response)
        }catch(err){
            console.log(err);
        }
    }

    const goToAuthorSite = (username) => {
        navigate(`/author/${username}`)
    }

    function handleChange(e){
        adjustHeight(e);
        setReplyText(e.target.value);
    }

    return (
        <div>
            <div className="Comment">
                <h3 className={thisUserComment ? "thisUserComment commentUsername" : "commentUsername"} onClick={() => goToAuthorSite(Username)}>{Username}</h3>
                <p className="commentText">{commentText}</p>
                {
                    thisUserComment ?
                    <div className="TrashcanContainer">
                        <img onMouseEnter={() => setTrashCanHoverd(true)} onMouseLeave={() => setTrashCanHoverd(false)} onClick={() => deleteComment(value)}
                        className="Trashcan"  src={trashCanHoverd ? trashcanOpen : trashcanClosed} alt="Trash can" />
                    </div>
                : null
                }
                <div className="bottomContainerComment">
                    <div className="replyContainer">
                        <button className="replyButton" onClick={() => setTypeReplyState(!typeReplyState)}>Reply</button>
                    </div>
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
                <div>
                    {typeReplyState ? 
                        <div className="replyTextContainer">
                            <textarea maxLength={1500} type="text" placeholder="Reply to comment" className="replyInput" onChange={(e) => handleChange(e)} />
                            <div className="replyButtonsContainer">
                                <button className="replyInputButton cancelReply" onClick={() => setTypeReplyState(false)}>Cancel</button>
                                <button className="replyInputButton sendReply" onClick={() => replyToComment(value)}>Reply</button>
                            </div>
                        </div>
                    : null}
                </div>
            </div>
            <div className="commentReplies">
                <div className="Reply">
                    <h3 className="replyUser">Username</h3>
                    <p className="replyText">Reply Text</p>
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
            </div>
        </div>
    );
};

export default Comment;
