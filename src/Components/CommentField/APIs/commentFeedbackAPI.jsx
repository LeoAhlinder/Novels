const CommentFeedback= async ({commentId,feedback,navigate}) =>{
    try{
        const res = await fetch(`https://152.42.128.44:3001/api/commentFeedback`, {
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
            if (response.error || response.message === "Already given feedback"){
                return false
            }
            if (response.insertedType === "Updated"){
                return "Updated"
            }
            else if (response.insertedType === "Deleted"){
                return "Deleted"
            }
            else if (response.message === "Feedback posted"){
                return "New"
            }
            
        }
    }catch(err){
        navigate("error")
    }
        
}

export default CommentFeedback;