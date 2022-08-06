import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  AlertPrompt,
  LoginFormikContainer,
  RegisterFormikContainer,
} from "../components";
import { useAppContext } from "../context/appContext";

const Auth = () => {
  // the loading state is just to prevent the initial render in some cases
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user, alert, setUser } = useAppContext();
  const router = useRouter();

  // todo: useEffects
  // ? if logged in send to chat page
  useEffect(() => {
    if (localStorage.getItem("userInfoChatty")) {
      const userInfo = JSON.parse(localStorage.getItem("userInfoChatty")!);
      setUser(userInfo);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/chat");
    }
  }, [user]);

  if (loading) {
    return null;
  }

  return (
    <div className="relative w-screen h-screen bg-primary">
      <video
        autoPlay
        muted
        controls={false}
        loop
        className="w-full h-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="absolute top-0 left-0 bg-modalDark w-full h-full flex justify-center">
        {alert && <AlertPrompt message={alert} />}
        <Head>
          <title>Login - Sign up</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {/* form starts */}
        <section className="w-full max-w-[400px] min-w-[330px] mt-5">
          <div
            className="
         
               max-w-[525px]
               mx-auto
               text-center
               bg-primary
               rounded-lg
               relative
               overflow-hidden
               py-5
               px-4
               sm:px-12
               md:px-[60px]
               "
          >
            {/* tabs to switch between login and register */}
            <div className="flex items-center justify-center mb-10">
              <div className="inline-flex gap-2 w-full" role="group">
                <button
                  type="button"
                  className={`w-3/6 rounded-r outline-none bg-accent text-white px-6 py-2 font-medium text-sm border border-accent leading-tight uppercase hover:bg-highlight hover:bg-opacity-70 focus:outline-none focus:ring-0
        transition
        duration-150
        ease-in-out ${activeTab === "login" && "bg-highlight"}`}
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>

                <button
                  type="button"
                  className={`w-3/6 rounded-r outline-none bg-accent text-white px-6 py-2 font-medium text-sm border border-accent leading-tight uppercase hover:bg-highlight hover:bg-opacity-70 focus:outline-none focus:ring-0
        transition
        duration-150
        ease-in-out ${activeTab === "register" && "bg-highlight"}`}
                  onClick={() => setActiveTab("register")}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* the actual form */}
            {activeTab === "register" ? (
              <RegisterFormikContainer />
            ) : (
              <LoginFormikContainer />
            )}

            {activeTab === "login" && (
              <Link href="/forgot-password">
                <a
                  className="
                  text-base
                  inline-block
                  mb-2
                  text-[#adadad]
                  hover:underline hover:text-primary
                  cursor-pointer
                  "
                >
                  Forget Password?
                </a>
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Auth;
