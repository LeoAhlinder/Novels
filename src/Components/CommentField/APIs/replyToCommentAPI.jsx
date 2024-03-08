const ReplyToComment = async (commentId, replyText) => {
    console.log("Replying to comment")
    try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/replyToComment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Allow-Credentials": "true"
            },
            credentials: "include",
            body: JSON.stringify({
                commentId: commentId,
                replyText: replyText
            })
        });
        const response = await res.json();
        console.log(response);
        return response;
    }catch(err){
        console.log(err);
        return "Error"
    }
}

export default ReplyToComment;