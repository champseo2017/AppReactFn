export const fetchUser = () => {
  const localStoreUser = localStorage.getItem("user");
  const userInfo =
    localStoreUser !== "undefined"
      ? JSON.parse(localStoreUser)
      : localStorage.clear();
  return userInfo;
};
