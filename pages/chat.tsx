import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Socket, io } from "socket.io-client";
import {
  ChatBox,
  CreateGroupModal,
  AlertPrompt,
  Navbar,
  Profile,
  Search,
  SingleChat,
  AuthWrapper,
} from "../components";
import { useAppContext } from "../context/appContext";
import { useChatQuery } from "../hooks/chatHooks";

import { useLogout } from "../hooks/useLogout";
import { IOnlineUser, IUser } from "../types";
import { manageNotification } from "../utils/manageNotification";

const Chat = () => {
  // todo: states and context
  const {
    isSearch,
    profileId,
    alert,
    setAlert,
    selectedChat,
    setSelectedChat,
    user,
    messages,
    setMessages,
    notifications,
    setNotifications,
    setChats,
    chats,
  } = useAppContext();

  const logout = useLogout();

  const [isModal, setIsModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<IOnlineUser[]>();
  const [socket, setSocket] = useState<Socket>();

  // todo: queries and mutations
  const {
    data,
    isLoading: loadingChats,
    refetch: refetchChats,
    isRefetching: refetchingChats,
    error: chatsError,
  } = useChatQuery();

  // todo: useEffects

  // ? fetch all chats on initial render
  useEffect(() => {
    refetchChats();
  }, []);

  useEffect(() => {
    if (data) {
      setChats(data);
    }
  }, [data]);

  useEffect(() => {
    if (!socket) {
      setSocket(io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL as string));
    }
  }, [user]);

  // ? when new chat clicked join socket room
  useEffect(() => {
    if (selectedChat) {
      socket?.emit("create-room", selectedChat);
    }
  }, [selectedChat, socket]);

  // ? if sesstion has expired make user log in again
  useEffect(() => {
    if (chatsError && chatsError.response.status === 401) {
      setAlert("Your session has expired. Please log in.");
      setTimeout(() => {
        logout();
        socket?.emit("logout");
      }, 4000);
    }
  }, [chatsError]);

  // initial connection
  useEffect(() => {
    if (socket) {
      socket.emit("connected", user);
      socket.on("userOnline", (activeUsers) => setOnlineUsers(activeUsers));
    }
  }, [socket]);

  useEffect(() => {
    socket?.on("receive-message", (newMessage) => {
      if (newMessage.chat._id === selectedChat) {
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
      }
    });
    return () => {
      socket?.removeAllListeners("receive-message");
    };
  });

  useEffect(() => {
    if (!user) return;
    socket?.on("notification", (message) => {
      if (message.chat._id == selectedChat) return;
      const isUsersChat = message.chat.users.some(
        (u: IUser) => u._id === user.userId
      );
      if (!isUsersChat) return;

      const updatedNotifications = manageNotification(notifications, message);
      setNotifications({ ...updatedNotifications });
    });
    socket?.on("removed", ({ chat }) => {
      setAlert(`you have been removed from "${chat.chatName}" by the admin`);
      chat._id === selectedChat && setSelectedChat(null);
      refetchChats();
    });

    socket?.on("added", ({ chat }) => {
      setAlert(`you have been added to "${chat.chatName}"`);
      refetchChats();
    });
    socket?.on("chat deleted", (chat) => {
      refetchChats();
      chat._id === selectedChat && setSelectedChat(null);
      // remove notifications for the deleted chat
      const newItems = { ...notifications };
      delete newItems[chat._id];
      setNotifications(newItems);
      setAlert(`Group: "${chat.chatName}" was delted by the admin`);
    });

    socket?.on("updated chat name", () => {
      refetchChats();
    });

    socket?.on("refetch chats", () => {
      refetchChats();
    });

    return () => {
      socket?.removeAllListeners("notification");
      socket?.removeAllListeners("removed");
      socket?.removeAllListeners("added");
      socket?.removeAllListeners("chat deleted");
      socket?.removeAllListeners("refetch chats");
      socket?.removeAllListeners("updated chat name");
    };
  });

  return (
    <>
      <Head>
        <title>Chatty - Lets Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar socket={socket} />

      <AnimatePresence>{isSearch && <Search />}</AnimatePresence>
      <AnimatePresence>{profileId && <Profile />}</AnimatePresence>
      {alert && <AlertPrompt message={alert} />}
      <AnimatePresence>
        {isModal && (
          <CreateGroupModal setIsModal={setIsModal} socket={socket} />
        )}
      </AnimatePresence>
      <main className=" h-[92vh] w-full md:flex mx-auto max-w-[1600px]">
        {/* side bar for chatlist */}
        <div
          className={`chatList w-full md:w-2/5 min-w-[300px] md:max-w-[450px] md:flex flex-col bg-secondary px-3 py-6 gap-2 h-full ${
            selectedChat ? "hidden" : "flex"
          } overflow-y-scroll`}
        >
          {/* header */}
          <div className="flex justify-between items-center">
            <h3 className="md:text-center text-sm text-highlight font-bold ml-2 underline ">
              Recent Chats
            </h3>
            <motion.button
              className="create-group flex items-center gap-2"
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsModal(true)}
            >
              <span className="capitalize text-sm text-gray-300">
                create group
              </span>{" "}
              <AiOutlinePlus />
            </motion.button>
          </div>
          {chats &&
            chats.map((chat) => (
              <SingleChat
                chat={chat}
                key={chat._id}
                onlineUsers={onlineUsers}
                socket={socket}
              />
            ))}
        </div>
        {/* the chat box */}
        <ChatBox socket={socket} onlineUsers={onlineUsers} />
      </main>
    </>
  );
};

export default AuthWrapper(Chat);
