import { useRouter } from "next/router";
import { useAppContext } from "../context/appContext";
import { useLogoutMutation } from "./authHooks";

export const useLogout = () => {
  const { setUser } = useAppContext();
  const router = useRouter();
  const { mutateAsync: logout } = useLogoutMutation();
  return async () => {
    setUser(null);
    localStorage.removeItem("userInfoChatty");
    router.push("/auth");
    await logout();
  };
};
