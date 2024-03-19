import React, { useState } from "react";

import DeleteReply from "./APIs/deleteReplyAPI";

import trashcanOpen from "../../Icons/trashcan-open.svg"
import trashcanClosed from "../../Icons/trashcan-closed.svg"

const Replies = ({replies,goToAuthorSite,viewingUser,id}) => {

    const [trashCanHoveredStates, setTrashCanHoveredStates] = useState(
        replies.map(() => false)
    );

    async function deleteReview(replyText,replyUsername){
        try{
            await DeleteReply(replyText,replyUsername,id);
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <div className="commentReplies">
            {replies.length > 0 ? replies.map((reply, index) =>
                reply.relatedTo === id ?  
                    <div className="Reply" key={index}>
                        <h3 onClick={reply.userName === null ? () => goToAuthorSite(reply.userName) : null} className={reply.userName === viewingUser ? "replyUser thisUserComment" : "replyUser"}>
                            {reply.userName === null ? "Deleted User" : reply.userName === viewingUser ? "You" : reply.userName}
                        </h3>
                        <p className="replyText">{reply.comment}</p>
                        {
                            reply.userName === viewingUser ?
                            <div className="TrashcanContainerReply">
                            <img
                                onMouseEnter={() => {
                                    const updatedStates = [...trashCanHoveredStates];
                                    updatedStates[index] = true;
                                    setTrashCanHoveredStates(updatedStates);
                                }}
                                onMouseLeave={() => {
                                    const updatedStates = [...trashCanHoveredStates];
                                    updatedStates[index] = false;
                                    setTrashCanHoveredStates(updatedStates);
                                }}
                                onClick={() => deleteReview(reply.comment, reply.userName)}
                                className="Trashcan"
                                src={trashCanHoveredStates[index] ? trashcanOpen : trashcanClosed}
                                alt="Trash can"
                            />
                            </div>
                        : null
                        }
                    </div> : null
            ) : null}
        </div>
    )
}

export default Replies;