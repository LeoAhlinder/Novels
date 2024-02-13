const CommentFeedback= async ({commentId,feedback,navigate}) =>{
    try{
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/commentFeedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Allow-Credentials": "true",
            },
            body: JSON.stringify({commentId: commentId, feedback: feedback}),
            credentials: "include"
        });
        if (res.ok) {
            const response = await res.json();
            if (response.error){
                return false
            }
            else if (response.message === "Feedback posted"){
                return true
            }
        }
    }catch(err){
        navigate("error")
    }
        
}

export default CommentFeedback;