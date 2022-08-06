import { createContext, useContext, useEffect, useState } from "react";

import { useMessageQuery } from "../hooks/chatHooks";
import { IChat, IMessage, INotifications, ITokenUser } from "../types";

interface IProps {
  children: React.ReactNode;
}

interface IAppContext {
  isSearch: boolean;
  user: ITokenUser | null;
  messages: [] | IMessage[];
  alert: string | null;
  selectedChat: string | null;
  notifications: INotifications | {};
  profileId: string | null;
  chats: IChat[] | [];
  isNotification: boolean;
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<ITokenUser | null>>;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | []>>;
  setAlert: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
  setNotifications: React.Dispatch<React.SetStateAction<{} | INotifications>>;
  setProfileId: React.Dispatch<React.SetStateAction<string | null>>;
  setChats: React.Dispatch<React.SetStateAction<IChat[] | []>>;
  setIsNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<IAppContext>({
  isSearch: false,
  user: null,
  alert: null,
  selectedChat: null,
  notifications: {},
  messages: [],
  profileId: null,
  chats: [],
  isNotification: false,
  setIsSearch: () => {},
  setUser: () => {},
  setAlert: () => {},
  setSelectedChat: () => {},
  setMessages: () => {},
  setNotifications: () => {},
  setProfileId: () => {},
  setChats: () => {},
  setIsNotification: () => {},
});

const AppProvider = ({ children }: IProps) => {
  const [isSearch, setIsSearch] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [user, setUser] = useState<ITokenUser | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const [notifications, setNotifications] = useState<INotifications | {}>({});
  const [chats, setChats] = useState<IChat[] | []>([]);
  const [isNotification, setIsNotification] = useState(false);

  // todo: queries
  const { data: currentChatMessages, refetch: fetchMessages } =
    useMessageQuery(selectedChat);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      // remove notifications for the currently selected chat
      const newItems = { ...notifications };
      delete newItems[selectedChat];
      setNotifications(newItems);
      setIsNotification(false);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (currentChatMessages) {
      setMessages(currentChatMessages);
    }
  }, [currentChatMessages]);

  // ? if alert display it
  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, 6000);
    }
  }, [alert]);

  const value = {
    isSearch,
    setIsSearch,
    user,
    setUser,
    alert,
    setAlert,
    selectedChat,
    setSelectedChat,
    messages,
    setMessages,
    notifications,
    setNotifications,
    profileId,
    setProfileId,
    chats,
    setChats,
    isNotification,
    setIsNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => useContext(AppContext);
export default AppProvider;
