import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineClose } from "react-icons/ai";
import { Socket } from "socket.io-client";
import { useAppContext } from "../context/appContext";
import {
  useAddUserMutation,
  useChatQuery,
  useRemoveUserMutation,
  useRenameMutation,
  useSingleChatQuery,
} from "../hooks/chatHooks";

import { useSearchQuery } from "../hooks/userHooks";
import { IChat, IUser } from "../types";
import Spinner from "./Spinner";

interface IProps {
  setIsEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  chat: IChat | undefined;
  socket: Socket | undefined;
}

const modalVariants = {
  hidden: {
    scale: 0,
    transition: {
      duration: 0.3,
    },
  },
  visible: {
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const EditGroupModal: React.FC<IProps> = ({ setIsEditModal, chat, socket }) => {
  // todo: context and states
  const { user, setSelectedChat, setAlert } = useAppContext();
  const [chatName, setChatName] = useState<string | undefined>(
    chat ? chat.chatName : ""
  );
  const [search, setSearch] = useState("");
  const router = useRouter();

  //   todo: query and mutation
  const { data: searchedUsers, isRefetching: refetchingUsers } =
    useSearchQuery(search);

  const { refetch: refetchChats } = useChatQuery();

  const { refetch: fetchChat } = useSingleChatQuery(chat?._id);

  const { mutateAsync: updateName } = useRenameMutation();

  const { mutateAsync: addUser } = useAddUserMutation();

  const { mutateAsync: removeUser, error: removeError } =
    useRemoveUserMutation();

  // todo: functions
  const handleAdd = async (user: IUser) => {
    if (!chat) return;
    const alreadyAdded = chat.users.some((u) => u._id === user._id);
    if (alreadyAdded) return;
    await addUser({ groupId: chat._id, userId: user._id });
    await fetchChat();
    setSearch("");
    socket?.emit("added to group", {
      users: [user._id],
      chat,
    });
  };

  const handleRemove = async (user: IUser) => {
    if (!chat) return;
    await removeUser({ groupId: chat._id, userId: user._id });
    socket?.emit("removed from group", {
      userId: user._id,
      chat,
    });
    await fetchChat();
  };

  const handleLeave = async () => {
    if (!chat || !user) return;
    await removeUser({ groupId: chat._id, userId: user.userId });
    setIsEditModal(false);
    setSelectedChat(null);
    router.push("/auth");
  };

  const handleUpdate = async () => {
    if (chat && chatName) {
      await updateName({ chatName, groupId: chat._id });
      socket?.emit("updated chat name", chat.users);
      await refetchChats();
      await fetchChat();
      setIsEditModal(false);
    }
  };

  useEffect(() => {
    if (removeError) {
      setAlert(removeError.response.data.message);
    }
  }, [removeError]);

  return (
    <div className="absolute w-full h-[92vh] bg-modal z-40 flex justify-center">
      {/* the central container */}
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="modal-content bg-secondary w-full h-full sm:h-max rounded-sm py-4 px-6 flex flex-col gap-10 md:w-3/5 max-w-[600px] sm:mt-5 "
      >
        <div className="header capitalize text-highlight font-bold flex gap-6 justify-end items-end">
          <button
            className="capitalize underline text-sm h-max"
            onClick={handleLeave}
          >
            <span>leave group</span>
          </button>
          <AiOutlineArrowLeft
            className="cursor-pointer md:hidden"
            onClick={() => setIsEditModal(false)}
          />
          <AiOutlineClose
            fontSize={20}
            className="cursor-pointer hidden md:block"
            onClick={() => setIsEditModal(false)}
          />
        </div>
        {/*  the inputs */}
        <div className="inputs flex flex-col gap-4">
          {/* update name of group  */}

          <div className="flex justify-end items-end gap-6">
            <input
              type="text"
              name="chatName"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              className="groupName w-full px-2 py-2 bg-secondary border-b-2 border-accent placeholder:text-gray-500 text-base outline-none text-highlight placeholder:capitalize"
              placeholder="group name"
            />
            {/* create button */}
            <button
              className="ml-auto bg-highlight capitalize text-base px-3 py-1 rounded-sm"
              onClick={handleUpdate}
            >
              update
            </button>
          </div>
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="userName w-full px-2 py-2 bg-secondary border-b-2 border-accent placeholder:text-gray-500 text-base outline-none text-highlight placeholder:capitalize"
            placeholder="search user"
          />
        </div>

        {/* search results */}
        {refetchingUsers ? (
          <Spinner />
        ) : (
          <div className="results w-full overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 gap-2 row-auto max-h-[220px]">
            {searchedUsers?.map((user) => (
              <article
                onClick={() => handleAdd(user)}
                key={user._id}
                className="singleSearchedUser py-2 px-3 flex items-center gap-5 bg-primary rounded-lg hover:bg-highlight cursor-pointer h-max w-full"
              >
                {/* the avatar */}
                <div className="avatar w-10 h-10 md:w-8 md:h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ">
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-full object-cover"
                  />
                </div>
                {/* the details */}
                <div className="details flex flex-col gap-2 md:gap-1">
                  <h3 className="name font-bold text-sm capitalize font-base">
                    {user.name}
                  </h3>
                  <p className="email text-sm">
                    {user.email.length > 25
                      ? `${user.email.slice(0, 24)}...`
                      : user.email}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
        {/* selected users */}
        <div className="selectedUsers w-full max-h-20 overflow-y-scroll flex gap-2 flex-wrap justify-center">
          {chat?.users.map((person) => (
            <div
              key={person._id}
              className="singleAdd flex items-center gap-2 bg-accent w-max rounded-xl px-2 py-1"
            >
              <div className="avatar w-5 h-5 md:w-4 md:h-4 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ">
                <img
                  src={person.avatar}
                  alt=""
                  className="w-full object-cover"
                />
              </div>

              <p className="text-sm capitalize">{person.name}</p>
              {chat?.groupAdmin === user?.userId &&
                chat?.groupAdmin !== person._id && (
                  <AiOutlineClose
                    fontSize={12}
                    className=" cursor-pointer"
                    onClick={() => handleRemove(person)}
                  />
                )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EditGroupModal;
