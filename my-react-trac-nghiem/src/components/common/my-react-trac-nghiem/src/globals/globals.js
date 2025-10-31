function getUserInfo() {
    return JSON.parse(localStorage.getItem("user"));
}

export { getUserInfo };