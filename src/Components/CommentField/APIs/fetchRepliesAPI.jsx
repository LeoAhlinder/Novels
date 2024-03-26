import APIURL from "../../../Global/API-URL";

const FetchRepliesAPI = async ({bookId,changeReplies}) =>{
    try{
        const res = await fetch(`${APIURL}/api/getReplies?bookId=${bookId}`,{
            method :"GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Allow-Credentials": "true",
            },
            credentials: 'include',
        });
        const response = await res.json();
        if (response.error){
            changeReplies([])
        }
        else if (response.message === "No replies found"){
            changeReplies([])
        }
        else if (response.replies.length > 0){
            changeReplies(response.replies)
        }
        else{
            changeReplies([])
        }
    }catch(err){
        console.log(err);
        changeReplies([])
    }
}

export default FetchRepliesAPI;