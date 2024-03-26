import APIURL from "../../../Global/API-URL";

const DeleteComment = async (commentId) => {
    try{
        const res = await fetch(`${APIURL}/api/deleteComment?commentid}`, {
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