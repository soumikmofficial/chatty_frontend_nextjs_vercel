import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { TiGroup } from "react-icons/ti";
import { useAppContext } from "../context/appContext";
import {
  useChatQuery,
  useDeleteChatMutation,
  useMessageMutation,
  useSingleChatQuery,
} from "../hooks/chatHooks";
import { IOnlineUser, IUser } from "../types";
import { getFriend } from "../utils/getFriend";
import Conversation from "./conversation";
import EditGroupModal from "./editGroupModal";
import Spinner from "./Spinner";
import { Socket } from "socket.io-client";
import { useLogout } from "../hooks/useLogout";
import { AnimatePresence, motion } from "framer-motion";

let timeout: any;

interface IProps {
  socket: Socket | undefined;
  onlineUsers?: IOnlineUser[];
}

const containerVariants = {
  hidden: {
    height: 0,
    transition: {},
  },
  visible: {
    height: "100%",
    transition: {},
  },
};

const ChatBox: React.FC<IProps> = ({ socket, onlineUsers }) => {
  // todo: context and states
  const {
    user,
    selectedChat,
    setSelectedChat,
    setAlert,
    messages,
    setMessages,
    setProfileId,
  } = useAppContext();
  const [isEditModal, setIsEditModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isInputting, setIsInputting] = useState(false);
  const [senderAvatar, setSenderAvatar] = useState("");
  const [friend, setFriend] = useState<IUser>();
  const [content, setContent] = useState("");
  const [online, setOnline] = useState(false);

  const logout = useLogout();

  const typingTimeout = () => {
    setIsInputting(false);
    socket?.emit("idle", selectedChat);
  };

  // todo: query and mutatioin
  const {
    data: chat,
    isLoading,
    isRefetching,
    refetch: refetchChat,
    error,
  } = useSingleChatQuery(selectedChat);

  const {
    isLoading: sendingMessage,
    mutateAsync: sendMessage,
    error: sendError,
    isSuccess: sent,
    data: sentMessage,
  } = useMessageMutation();

  const { mutateAsync: deleteChat, isSuccess: chatDeleted } =
    useDeleteChatMutation();

  const { refetch: refetchChats } = useChatQuery();

  // todo: functions
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedChat || !content || sendingMessage) return;
    await sendMessage({ chat: selectedChat, content });
    if (sent) {
      setContent("");
    }
  };

  const handleExit = async () => {
    await refetchChats();
    selectedChat && socket?.emit("leave-room", selectedChat);
    setSelectedChat(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    if (!isInputting) {
      setIsInputting(true);
      socket?.emit("typing", { chat: selectedChat, avatar: user?.avatar });
      timeout = setTimeout(typingTimeout, 1500);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(typingTimeout, 1500);
    }
  };

  const handleDelete = async () => {
    if (!chat) return;
    await deleteChat({ chatId: chat._id });
  };

  // todo: useEffects
  useEffect(() => {
    socket?.on("typing", (avatar) => {
      if (!isTyping) {
        setIsTyping(true);
        setSenderAvatar(avatar);
      }
    });
    socket?.on("idle", (user) => {
      setIsTyping(false);
    });
  }, [socket]);

  // ? fetch chat manually on initial load
  useEffect(() => {
    selectedChat !== null && refetchChat();
  }, [selectedChat]);

  // ? get the name of the other person
  useEffect(() => {
    if (user && chat && chat.chatType !== "group") {
      setFriend(getFriend(chat.users, user.userId));
    }
  }, [chat]);

  // ? if error while sending chat
  useEffect(() => {
    if (sendError) {
      if (sendError.response.status === 401) {
        setAlert("Your session has expired. Please log in.");
        setTimeout(() => {
          logout();
          socket?.emit("logout");
        }, 4000);
      } else {
        setAlert(sendError.response.data.message);
      }
    }
  }, [sendError]);

  // ? after successfully sent message
  useEffect(() => {
    if (sent) {
      socket?.emit("notify", sentMessage);
      socket?.emit("idle", selectedChat);
      setContent("");
      socket?.emit("new-message", sentMessage);

      messages
        ? setMessages([...messages, sentMessage])
        : setMessages([sentMessage]);
    }
  }, [sent]);

  useEffect(() => {
    if (onlineUsers && friend) {
      const isOnline = onlineUsers.some((user) => user.userId === friend._id);
      setOnline(isOnline);
    }
  }, [onlineUsers, friend]);

  useEffect(() => {
    if (chatDeleted) {
      socket?.emit("chat deleted", chat);
      refetchChats();
      setSelectedChat(null);
    }
  }, [chatDeleted]);

  return (
    <>
      <AnimatePresence>
        {isEditModal && (
          <EditGroupModal
            setIsEditModal={setIsEditModal}
            chat={chat}
            socket={socket}
          />
        )}
      </AnimatePresence>
      <div
        className={`chatBox ${
          selectedChat ? "flex" : "hidden"
        } py-2 md:flex w-full flex-col h-full relative`}
      >
        {!selectedChat ? (
          <p className="mx-auto text-gray-600 opacity-[.4] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] capitalize text-center">
            select or create a chat to start conversation
          </p>
        ) : error ? (
          <p className="mx-auto text-highlight absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            {error.response.data.message}
          </p>
        ) : isLoading || !user || isRefetching ? (
          <Spinner />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="innerWrapper w-full px-2 flex flex-col"
          >
            {/* header */}
            <div className="chatHeader  bg-accent py-2 sm:px-20 px-8 flex justify-between w-full items-center">
              <div className="left flex gap-5 items-center">
                <AiOutlineArrowLeft
                  onClick={() => handleExit()}
                  className="cursor-pointer md:hidden"
                />
                <h3 className="text-xl capitalize text-gray-300 tracking-widest">
                  {chat.chatName ? chat.chatName : friend?.name}
                </h3>
                {online && !chat.chatName && (
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                )}
              </div>
              {/* right header */}
              <div className="right flex items-center gap-5">
                {chat.groupAdmin === user.userId && (
                  <button
                    className="text-sm capitalize text-highlight underline"
                    onClick={handleDelete}
                  >
                    delete group
                  </button>
                )}
                {chat.chatType === "single" && friend ? (
                  <CgProfile
                    className="text-highlight cursor-pointer"
                    fontSize={20}
                    onClick={() => setProfileId(friend._id)}
                  />
                ) : (
                  <TiGroup
                    className="text-highlight cursor-pointer"
                    fontSize={20}
                    onClick={() => setIsEditModal(true)}
                  />
                )}
              </div>
            </div>
            {/* main box */}
            <AnimatePresence>
              <Conversation isTyping={isTyping} avatar={senderAvatar} />
            </AnimatePresence>
            {/* the form */}
            <form
              className="bg-primary w-full py-2 flex gap-4 px-2 md:px-6 items-center"
              onSubmit={(e) => handleSend(e)}
            >
              <input
                className="h-full w-full text-gray-300 bg-secondary px-5 text-base outline-none py-3 rounded-md required placeholder:text-gray-500"
                placeholder="start typing your message..."
                name="content"
                onChange={(e) => handleChange(e)}
                required
                value={content}
              />
              <motion.button
                type="submit"
                whileTap={{ color: "gray", scale: 0.95 }}
                className={`px-2 py-1 rounded-md h-max  font-bold capitalize ${
                  sendingMessage
                   
                   
                    ? "bg-gray-500 text-sm"
                    : "bg-highlight text-base"
                }`}
              >
                {sendingMessage ? "sending..." : "send"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ChatBox;
