import React, { useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { useChatQuery, useCreateChatMutation } from "../hooks/chatHooks";
import { IUser } from "../types";
import Spinner from "./Spinner";
import { motion } from "framer-motion";

interface IProps {
  user: IUser;
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleSearchedUser: React.FC<IProps> = ({ user, setIsSearch }) => {
  // todo: states and context
  const { setAlert } = useAppContext();

  // todo: query and mutations
  const {
    mutateAsync: createChat,
    isError,
    error,
    isLoading,
  } = useCreateChatMutation();

  const { refetch: fetchChats } = useChatQuery();

  // todo: functions
  const handleClick = async () => {
    await createChat({ userId: user._id });
    await fetchChats();
    setIsSearch(false);
  };

  // todo: useEffects
  useEffect(() => {
    if (isError) {
      setAlert(error.response.data.message);
    }
  }, [isError, error]);
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      className="singleSearchedUser py-2 px-3 flex items-center gap-5 bg-primary rounded-lg hover:bg-highlight cursor-pointer"
      onClick={handleClick}
    >
      <div className="avatar w-10 h-10 md:w-8 md:h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ">
        <img src={user.avatar} alt="" className="w-full object-cover" />
      </div>
      <div className="details flex flex-col gap-2 md:gap-1">
        <h3 className="name font-bold text-sm capitalize font-base">
          {user.name}
        </h3>
        <p className="email text-sm">
          {user.email.length > 20
            ? `${user.email.slice(0, 17)}...`
            : user.email}
        </p>
      </div>
    </motion.article>
  );
};

export default SingleSearchedUser;
