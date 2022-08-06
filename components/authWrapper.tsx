import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAppContext } from "../context/appContext";

const authWrapper = (Component: any) => {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    const router = useRouter();
    const { setUser, user } = useAppContext();
    useEffect(() => {
      if (!localStorage.getItem("userInfoChatty")) {
        router.push("/auth");
      } else {
        const userInfo = JSON.parse(localStorage.getItem("userInfoChatty")!);
        setUser(userInfo);
      }
    }, []);
    return user ? <Component {...props} /> : null;
  };
};

export default authWrapper;
