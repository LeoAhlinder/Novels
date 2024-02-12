import downvotePicture from "../../Icons/downvote.svg"
import upvotePicture from "../../Icons/upvote.svg"

const Comment = ({dislikes,likes,commentText,Username}) =>{
    return(
        <div className="Comment">
            <h3 className="commentUsername">{Username}</h3>
            <p className="commentText">{commentText}</p>
            <div className="likeDislikeContainer">
                <button className="feedbackButton">
                    <span className="feedbackText">{likes === null ? 0 : likes}</span>
                    <img src={upvotePicture} className="voteButtons" alt="upvote comment image" />
                </button>
                <span>|</span>
                <button className="feedbackButton">
                    <span className="feedbackText">{dislikes === null ? 0 : dislikes}</span>
                    <img src={downvotePicture} className="voteButtons" alt="downvote comment image" />
                </button>                                    
                </div>
        </div>
    )
}

export default Comment;