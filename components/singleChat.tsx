import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { format } from "timeago.js";
import { useAppContext } from "../context/appContext";
import { IChat, IOnlineUser, IUser } from "../types";
import displayLatest from "../utils/displayLatest";
import { getFriend } from "../utils/getFriend";

interface IProps {
  chat: IChat;
  onlineUsers?: IOnlineUser[];
  socket?: Socket;
}
const oneHour = 1000 * 60 * 60;

const SingleChat: React.FC<IProps> = ({ chat, onlineUsers, socket }) => {
  const { user, setSelectedChat, selectedChat } = useAppContext();

  const [friend, setFriend] = useState<IUser>();
  const [online, setOnline] = useState(false);

  // todo: functions
  const handleSelect = (chatId: string) => {
    selectedChat && socket?.emit("leave-room", selectedChat);
    setSelectedChat(chatId);
  };

  // todo: useEffects
  // ? get the name of the other person
  useEffect(() => {
    if (user && chat && chat.chatType !== "group") {
      setFriend(getFriend(chat.users, user.userId));
    }
  }, [chat]);

  // ? check if current user is online
  useEffect(() => {
    if (onlineUsers && friend) {
      const isOnline = onlineUsers.some((user) => user.userId === friend._id);
      setOnline(isOnline);
    }
  }, [onlineUsers, friend]);

  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      className={`singleSearchedUser py-2 px-3 flex items-center gap-5 rounded-lg hover:bg-highlight cursor-pointer h-14 overflow-hidden   ${
        online && "border-r-2 border-green-500"
      } ${selectedChat === chat._id ? "bg-highlight" : "bg-primary"}`}
      onClick={() => handleSelect(chat._id)}
    >
      {/* the avatar */}
      <div className="avatar w-10 h-10 md:w-8 md:h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ">
        <img
          src={
            chat.chatType === "group"
              ? "https://openclipart.org/image/800px/274308"
              : friend?.avatar
          }
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      {/* the details */}
      <div className="details flex flex-col gap-2 md:gap-1 h-full">
        <h3 className="name font-bold text-sm capitalize font-base">
          {friend ? friend.name.slice(0, 22) : chat.chatName?.slice(0, 22)}
        </h3>
        <p className="latest text-sm text-gray-400 overflow-hidden">
          {chat.latestMessage ? displayLatest(chat.latestMessage.content) : ``}
        </p>
      </div>
      {/* last message */}
      {chat.latestMessage && (
        <small className="text-xs opacity-[.3] ml-auto">
          {Date.now() - new Date(chat.latestMessage.updatedAt).getTime() >
          oneHour
            ? format(chat.latestMessage.updatedAt)
            : "less than 1 hour"}
        </small>
      )}
    </motion.article>
  );
};

export default SingleChat;
