import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { useVerifyMutation } from "../hooks/authHooks";
import { VscVerified } from "react-icons/vsc";
import Link from "next/link";
import { Spinner } from "../components";

const Verify: React.FC = () => {
  const router = useRouter();
  const { setAlert, user } = useAppContext();
  const email = router.query.email as string;
  const token = router.query.token as string;

  const {
    mutateAsync: verify,
    data,
    isLoading: verifying,
  } = useVerifyMutation();

  const handleReload = () => {
    window.location.reload();
  };
  useEffect(() => {
    if (token && email) {
      verify({ token, email });
    }
  }, [token, email]);

  if (data && data.status === "success") {
    return <h2>Your account was verified successfully</h2>;
  }
  return (
    <div className="bg-primary w-full h-screen flex items-center justify-center flex-col gap-3">
      {verifying ? (
        <Spinner />
      ) : data && data.status === "success" ? (
        <>
          <VscVerified fontSize={50} className=" text-green-400 mb-4" />
          <p className="text-2xl">Congratulation</p>
          <p className="">
            Account was successfully verified.{" "}
            <Link href="/auth">
              <a className="underline px-2 py-1 rounded-lg text-green-400 text-base">
                Sing In
              </a>
            </Link>{" "}
            to use <span className="text-highlight">Chatty</span>
          </p>
        </>
      ) : (
        <>
          <p className="text-highlight text-3xl">Oops !</p>
          {/* <FaRegSadCry fontSize={30} className="text-red-500" /> */}
          <p className="text-gray-500 text-base italic">
            Sorry! the account could not be verified
          </p>
          <button
            className="text-md underline text-highlight"
            onClick={handleReload}
          >
            Try again
          </button>
        </>
      )}
    </div>
  );
};

export default Verify;
