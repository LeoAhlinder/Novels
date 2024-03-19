
import React, { useState, useEffect } from "react";

import DeleteReply from "./APIs/deleteReplyAPI";

import trashcanOpen from "../../Icons/trashcan-open.svg"
import trashcanClosed from "../../Icons/trashcan-closed.svg"

const Replies = ({ replies, goToAuthorSite, viewingUser, id }) => {

  const [repliesWithUniqueIds, setRepliesWithUniqueIds] = useState([]);
  const [trashCanHoveredStates, setTrashCanHoveredStates] = useState({});

  const generateUniqueIdentifier = (reply) => {
    return `${reply.userName}-${reply.comment}`; 
  };

  console.log(replies);

  useEffect(() => {
    if (replies.length === 0) {
        return;
    }
    const updatedReplies = replies.map((reply) => {
      const uniqueId = reply.replyId || generateUniqueIdentifier(reply);
      return { ...reply, uniqueId }; 
    });
    setRepliesWithUniqueIds(updatedReplies);
    setTrashCanHoveredStates(updatedReplies.reduce((acc, reply) => {
      acc[reply.uniqueId] = false;
      return acc;
    }, {}));
  }, [replies]);

  async function deleteReview(reply) {
    try {
      await DeleteReply(reply.comment, reply.userName, id); 
      const updatedReplies = repliesWithUniqueIds.filter(
        (r) => r.uniqueId !== reply.uniqueId
      );
      setRepliesWithUniqueIds(updatedReplies);
      setTrashCanHoveredStates((prevStates) => ({
        ...prevStates,
        [reply.uniqueId]: false,
      }));
    } catch (err) {
      console.error("Error deleting reply:", err);
    }
  }

  return (
    <div className="commentReplies">
      {repliesWithUniqueIds.length > 0 ? (
        repliesWithUniqueIds.map((reply) => (
          reply.relatedTo === id ? (
            <div className="Reply" key={reply.uniqueId}>
              <h3
                onClick={reply.userName === null? () => goToAuthorSite(reply.userName): null}
                className={reply.userName === viewingUser ? "replyUser thisUserComment" : "replyUser"}
                >
                {reply.userName === null
                  ? "Deleted User"
                  : reply.userName === viewingUser
                    ? "You"
                    : reply.userName}
              </h3>
              <p className="replyText">{reply.comment}</p>
              {viewingUser === reply.userName && (
                <div className="TrashcanContainerReply">
                  <img
                    onMouseEnter={() =>
                      setTrashCanHoveredStates((prevStates) => ({
                        ...prevStates,
                        [reply.uniqueId]: true,
                      }))
                    }
                    onMouseLeave={() =>
                      setTrashCanHoveredStates((prevStates) => ({
                        ...prevStates,
                        [reply.uniqueId]: false,
                      }))
                    }
                    onClick={() => deleteReview(reply)}
                    className="Trashcan"
                    src={trashCanHoveredStates[reply.uniqueId] ? trashcanOpen : trashcanClosed}
                    alt="Trash can"
                  />
                </div>
              )}
            </div>
          ) : null
        ))
      ) : null}
    </div>
  );
};

export default Replies;
