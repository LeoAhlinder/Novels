const FetchComments = async ({bookId,changeComments,navigate,changeUsername,changeGivenFeedback,loadSet,onlyReturn,changeMoreCommentsExist}) => {
    try {
        const res = await fetch(`https://152.42.128.44:3001/api/comments?bookid=${bookId}&loadSet=${loadSet}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Allow-Credentials": "true",
            },
            credentials: "include"
        });
        if (res.ok) {
            const response = await res.json();
            if (response.noComment){
                changeComments([])
            }
            else if (response.error){
                changeComments([])
            }
            else if (response.comments.length > 0){
                if (onlyReturn){
                    changeMoreCommentsExist(response.moreComments)
                    return response.comments
                }
                changeComments(response.comments)
                changeUsername(response.userName)
                changeGivenFeedback(response.likedAndDislikedComments)
                changeMoreCommentsExist(response.moreComments)
            }
        } else {
            navigate("/error");
        }
    } catch (err) {
        navigate("/error");
    }
}

export default FetchComments;