const PostComment = async ({bookId,postCommentText,navigate,changePostCommentAlert}) => {
    try{
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
            if (response.message === "Commented posted"){
                changePostCommentAlert("Comment posted")
                return true
            }else{
                changePostCommentAlert("Error posting comment")
            }
        }
        else{
            navigate("/error")
        }
    }catch(err){
        navigate("/error")
    }
}

export default PostComment;