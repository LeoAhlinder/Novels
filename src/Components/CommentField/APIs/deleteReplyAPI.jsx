import APIURL from "../../../Global/API-URL";

const DeleteReply = async (replyText,replyUser,commentId) => {
    try{
        const res = await fetch(`${APIURL}/api/deleteReply`,{
            method :"DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Allow-Credentials": "true",
            },
            credentials: 'include',
            body: JSON.stringify({
                replyText: replyText,
                replyUser: replyUser,
                commentId: commentId
            })
        });
        const response = await res.json();
        if (response.message === "Reply Deleted"){
            return "Deleted"
        }
        else{
            return "Error"
        }
    }catch(err){
        return "Error"
    }
};

export default DeleteReply;