const removeHttpCookie = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/removecookie`, {
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
