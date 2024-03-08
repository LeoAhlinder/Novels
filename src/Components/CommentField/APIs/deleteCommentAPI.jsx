const DeleteComment = async (commentId) => {
    try{
        const res = await fetch(`http://152.42.128.44:3001/api/deleteComment?commentid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Allow-Credentials": "true",
            },
            body: JSON.stringify({ commentId: commentId }),
            credentials: 'include',
        });
        const response = await res.json();
    
        if (response.message === "Comment deleted"){
            return "Deleted";
        }
        else{
            return "Not Deleted";
        }
    }catch(err){
        return "Not Deleted";
    }
        
}

export default DeleteComment;