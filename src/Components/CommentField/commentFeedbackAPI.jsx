const CommentFeedback= async ({commentId,feedback}) =>{
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
        console.log(response)
    }
}

export default CommentFeedback;