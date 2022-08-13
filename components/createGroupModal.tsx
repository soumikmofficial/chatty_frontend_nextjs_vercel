import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineClose } from "react-icons/ai";
import { Socket } from "socket.io-client";
import { useAppContext } from "../context/appContext";
import { useGroupMutation } from "../hooks/chatHooks";
import { useSearchQuery } from "../hooks/userHooks";
import { IUser } from "../types";
import Spinner from "./Spinner";

interface IProps {
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
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

const CreateGroupModal: React.FC<IProps> = ({ setIsModal, socket }) => {
  // todo: states and context
  const [chatName, setChatName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<IUser[] | []>([]);
  const { setAlert, user, setSelectedChat } = useAppContext();

  //   todo: query and mutation
  const {
    data: searchedUsers,
    isRefetching: refetchingUsers,
    refetch: searchUsers,
  } = useSearchQuery(search);

  const {
    data: createdChat,
    mutateAsync: createGroup,
    isLoading: creatingChat,
    isError,
    error,
  } = useGroupMutation();

  //   todo: functions
  const handleClose = () => {
    setSearch("");
    setChatName("");
    setSelectedUsers([]);
    setIsModal(false);
  };

  const handleAdd = (user: IUser) => {
    const alreadyAdded = selectedUsers.some((u) => u._id === user._id);
    !alreadyAdded && setSelectedUsers([...selectedUsers, user]);
    setSearch("");
  };

  const handleRemove = (user: IUser) => {
    const newList = selectedUsers.filter((u) => u._id !== user._id);
    setSelectedUsers(newList);
  };

  const handleSubmit = async () => {
    const users = selectedUsers.map((user) => user._id);
    if (users.length < 1) {
      setAlert("must add atleast one user to create group");
      return;
    }
    await createGroup({ chatName, users });
    if (!isError) {
      handleClose();
    }
    if (isError) {
      setAlert(error.response.data.message);
    }
  };

  //   todo: useEffects
  useEffect(() => {
    search && searchUsers();
  }, [search]);

  useEffect(() => {
    if (createdChat && user) {
      const users = createdChat.users
        .filter((u) => u._id !== user.userId)
        .map((u) => u._id);
      socket?.emit("added to group", {
        users,
        chat: createdChat,
      });
      setSelectedChat(createdChat._id);
    }
  }, [createdChat]);

  return (
    <div className="absolute w-full h-[92vh] bg-modal z-40 flex justify-center">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="modal-content bg-secondary w-full h-full sm:h-max rounded-sm py-4 px-6 flex flex-col gap-10 md:w-3/5 max-w-[600px] sm:mt-5 "
      >
        <div className="header capitalize text-highlight font-bold flex justify-between item-center">
          <h3>create group</h3>
          <AiOutlineArrowLeft
            className="cursor-pointer md:hidden block"
            onClick={handleClose}
          />
          <AiOutlineClose
            fontSize={20}
            className="cursor-pointer hidden md:block"
            onClick={handleClose}
          />
        </div>
        {/*  the inputs */}
        <div className="inputs flex flex-col gap-4">
          <input
            type="text"
            name="chatName"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            className="groupName w-full px-2 py-2 bg-secondary border-b-2 border-accent placeholder:text-gray-500 text-base outline-none text-highlight placeholder:capitalize"
            placeholder="group name"
          />
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="userName w-full px-2 py-2 bg-secondary border-b-2 border-accent placeholder:text-gray-500 text-base outline-none text-highlight placeholder:capitalize"
            placeholder="search user"
          />
        </div>
        {/* create button */}
        <button
          className="ml-auto bg-highlight capitalize text-base px-3 py-1 rounded-sm"
          onClick={handleSubmit}
        >
          {creatingChat ? "creating..." : "create chat"}
        </button>
        {/* search results */}
        {refetchingUsers ? (
          <Spinner />
        ) : (
          <div className="results w-full overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 gap-2 row-auto max-h-[220px]">
            {searchedUsers?.map((user) => (
              <article
                onClick={() => handleAdd(user)}
                key={user._id}
                className="singleSearchedUser py-2 px-3 flex items-center gap-5 bg-primary rounded-lg hover:bg-highlight cursor-pointer h-max"
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
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className="singleAdd flex items-center gap-2 bg-accent w-max rounded-xl px-2 py-1"
            >
              <div className="avatar w-5 h-5 md:w-4 md:h-4 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ">
                <img src={user.avatar} alt="" className="w-full object-cover" />
              </div>

              <p className="text-sm capitalize">{user.name}</p>
              <AiOutlineClose
                fontSize={12}
                className=" cursor-pointer"
                onClick={() => handleRemove(user)}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateGroupModal;
