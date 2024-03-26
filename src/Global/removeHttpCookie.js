import APIURL from "./API-URL";

const removeHttpCookie = async () => {
  try {
    const res = await fetch(`${APIURL}/api/removecookie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Allow-Credentials": "true",
      },
      credentials: "include",
    });
    const response = await res.json();
    if (response.success) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export default removeHttpCookie;
