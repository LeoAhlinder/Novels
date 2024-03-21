const ReplyToComment = async (commentId, replyText,bookId) => {
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
                replyText: replyText,
                bookId: bookId
            })
        });
        const response = await res.json();
        return response;
    }catch(err){
        console.log(err);
        return "Error"
    }
}

export default ReplyToComment;