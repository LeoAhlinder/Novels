const PostComment = async ({bookId,postCommentText,navigate,changePostCommentAlert}) => {
    try{
        if (postCommentText === "" || postCommentText.length <= 0) return changePostCommentAlert("Comment cannot be empty")
        if (postCommentText.length > 1500) return changePostCommentAlert("Comment cannot be longer than 1500 characters")
        if (bookId === "") return navigate("/error")
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/postComment`, {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Allow-Credentials": "true",
            },
            credentials:"include",
            body: JSON.stringify({bookid:bookId,comment:postCommentText})
        });
        if (res.ok){
            const response = await res.json()
            if (response.message === "Not logged in"){
                changePostCommentAlert("You need to be logged in to post a comment")
            }
            else if (response.message === "Commented posted"){
                changePostCommentAlert("Comment posted")
                return true
            }else if (response.message === "Comment is to short"){
                changePostCommentAlert("Comment is to short")
            }
            else if (response.message === "Comment is to long"){
                changePostCommentAlert("Comment is to long")
            }
            else{
                changePostCommentAlert("Error posting comment")
            }
            
            return false
        }
        else{
            navigate("/error")
        }
    }catch(err){
        navigate("/error")
    }
}

export default PostComment;