const removeHttpCookie = async () => {
  try {
    const res = await fetch(`http://152.42.128.44:3001/api/removecookie`, {
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
