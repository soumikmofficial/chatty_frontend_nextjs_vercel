import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import axios from "../api/axios";
import { useAppContext } from "../context/appContext";
import { IError, ILoginData, IRegData, ITokenUser } from "../types";

interface IAuthResponse {
  status: string;
  message: string;
}

// todo: register
const register = async (regData: IRegData): Promise<IAuthResponse> => {
  const res = await axios.post("/api/v1/auth/register", regData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const useRegisterMutation = () => {
  const { setAlert } = useAppContext();
  return useMutation<IAuthResponse, IError, IRegData>(register, {
    onSuccess: (data) => {
      setAlert(data.message);
    },
    onError: (error) => {
      setAlert(error.response.data.message);
    },
  });
};

// todo: login
const login = async (loginData: ILoginData): Promise<ITokenUser> => {
  const res = await axios.post("/api/v1/auth/login", loginData);
  return res.data;
};

export const useLoginMutation = () => {
  const { setUser, setAlert } = useAppContext();
  const router = useRouter();
  return useMutation<ITokenUser, IError, ILoginData>(login, {
    onSuccess: (data) => {
      localStorage.setItem("userInfoChatty", JSON.stringify(data));
      setUser(data);
    },
    onError: (error) => {
      setAlert(error.response.data.message);
    },
  });
};

// todo: Logout
const logout = async (): Promise<IAuthResponse> => {
  const res = await axios.delete("/api/v1/auth/logout");
  return res.data;
};

export const useLogoutMutation = () => {
  const router = useRouter();
  return useMutation<IAuthResponse, IError>(logout, {
    onError: (error) => {
      console.log(error);
      if (
        error.response.data.message ===
        "authentication failed... try logging in"
      ) {
        localStorage.removeItem("userInfoChatty");
        router.push("/auth");
      }
    },
  });
};

// todo: verify email
interface IVerificationResponse {
  status: string;
  message: string;
}

interface IVerificationData {
  token: string | string[];
  email: string;
}
const verifyEmail = async (
  data: IVerificationData
): Promise<IVerificationResponse> => {
  const res = await axios.post("/api/v1/auth/verify-email", data);
  return res.data;
};

export const useVerifyMutation = () => {
  const router = useRouter();
  return useMutation<IVerificationResponse, IError, IVerificationData>(
    verifyEmail
  );
};

// todo: forgot password
interface IForgotResponse {
  status: string;
  message: string;
}

interface IForgotData {
  email: string;
}
const forgotPassword = async (data: IForgotData): Promise<IForgotResponse> => {
  const res = await axios.post("/api/v1/auth/forgot-password", data);
  return res.data;
};

export const useForgotMutation = () => {
  const { setAlert } = useAppContext();
  const router = useRouter();
  return useMutation<IForgotResponse, IError, IForgotData>(forgotPassword, {
    onSuccess: (data) => {
      console.log("success");
      setAlert(data.message);
    },
    onError: (data) => {
      setAlert(data.message);
    },
  });
};

// todo: reset password

interface IResetResponse {
  status: string;
  message: string;
}

interface IResetData {
  email: string;
  token: string;
  password: string;
}
const resetPassword = async (data: IResetData): Promise<IResetResponse> => {
  const res = await axios.post("/api/v1/auth/reset-password", data);
  return res.data;
};

export const useResetMutation = () => {
  const { setAlert } = useAppContext();
  const router = useRouter();
  return useMutation<IResetResponse, IError, IResetData>(resetPassword, {
    onSuccess: (data) => {
      setTimeout(() => {
        router.push("/auth");
      }, 8000);
    },
    onError: (data) => {
      setAlert(data.message);
    },
  });
};
