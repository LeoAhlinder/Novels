import React from 'react';
import "./ReviewsAndCommentsStyle.css"

import yellowstar from "../../Icons/star-yellow.svg"
import whitestar from "../../Icons/star-white.svg"

const ReviewsAndComments = ({loading,contents,fetchMoreContent,goToBook,noticeText,moreCommentsExist,loadSet,loadMoreText,viewText,review}) => {

    return (
        <div id="commentSectionContainer">
            <h1 id="commentProfileHeader">{viewText}</h1>
            {loading ? <p>Loading...</p> : 
            <>
                <div id="commentsContainer">
                    {contents.length > 0 ? contents.map((content,index) => {
                        return(
                            <div className="commentProfile" key={index}>
                                <h2>{content.title}</h2>
                                {review ? 
                                <div>
                                    <img className='reviewStar' src={yellowstar} alt="star" />
                                    <img className='reviewStar' src={content.rating >= 2 ? yellowstar : whitestar} alt="star" />
                                    <img className='reviewStar' src={content.rating >= 3 ? yellowstar : whitestar} alt="star" />
                                    <img className='reviewStar' src={content.rating >= 4 ? yellowstar : whitestar} alt="star" />
                                    <img className='reviewStar' src={content.rating >= 5 ? yellowstar : whitestar} alt="star" />
                                </div>
                                : 
                                null}
                                <p className="commentTextProfile">{review ? content.text : content.comment}</p>
                                <button className="navigateBookButton" onClick={() => goToBook(content.title)}>Go To Book</button>
                            </div>
                        )
                    })
                    : 
                    <div className="noComments">{noticeText}</div>}
                </div>
                <div>
                    {moreCommentsExist ? <button onClick={() => fetchMoreContent(loadSet + 1)} id="loadMoreComments">{loadMoreText}</button> : ""}
                </div>
            </>
            
            }
        </div>
    )
};

export default ReviewsAndComments;