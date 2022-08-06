import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import { IChat, IError, IMessage } from "../types";

// todo: get or create a new chatList
interface IUserId {
  userId: string;
}
const getOrCreateChat = async (userId: IUserId): Promise<IChat> => {
  const res = await axios.post(`/api/v1/chat/`, userId);
  return res.data;
};

export const useCreateChatMutation = () => {
  return useMutation<IChat, IError, IUserId>(getOrCreateChat);
};

// todo: fetch all chats of the current user
const getAllChats = async (): Promise<IChat[]> => {
  const { data } = await axios.get(`/api/v1/chat`);
  return data;
};

export const useChatQuery = () => {
  return useQuery<IChat[], IError>(["get-chats"], getAllChats, {
    enabled: false,
  });
};

// todo: fetch single Chat
const getSingleChat = async (
  chatId: string | undefined | null
): Promise<IChat> => {
  const { data } = await axios.get(`/api/v1/chat/${chatId}`);
  return data;
};

export const useSingleChatQuery = (chatId: string | undefined | null) => {
  return useQuery<IChat, IError>(
    ["get-single-chat", chatId],
    (context) => getSingleChat(chatId),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
};

// todo: create group

interface IGroupData {
  users: string[];
  chatName: string;
}

const createGroupChat = async (groupData: IGroupData): Promise<IChat> => {
  const { data } = await axios.post(`/api/v1/chat/group`, groupData);
  return data;
};

export const useGroupMutation = () => {
  const { refetch: fetchChats } = useChatQuery();
  return useMutation<IChat, IError, IGroupData>(createGroupChat, {
    onSuccess: () => {
      fetchChats();
    },
  });
};

// todo: update group name

interface INameData {
  chatName: string;
  groupId: string;
}

const updateGroupName = async (nameData: INameData): Promise<IChat> => {
  const { data } = await axios.patch(`/api/v1/chat/group`, nameData);
  return data;
};

export const useRenameMutation = () => {
  return useMutation<IChat, IError, INameData>(updateGroupName);
};

// todo: add user to group
interface IUserData {
  userId: string;
  groupId: string;
}
interface IRemoveResponse {
  message: string;
}
const addUserToGroup = async (
  userData: IUserData
): Promise<IChat | IRemoveResponse> => {
  const { data } = await axios.patch(`/api/v1/chat/group/add`, userData);
  return data;
};

export const useAddUserMutation = () => {
  return useMutation<IChat | IRemoveResponse, IError, IUserData>(
    addUserToGroup
  );
};

// todo: remove user from group
interface IUserData {
  userId: string;
  groupId: string;
}
const removeUserFromGroup = async (userData: IUserData): Promise<IChat> => {
  const { data } = await axios.patch(`/api/v1/chat/group/remove`, userData);
  return data;
};

export const useRemoveUserMutation = () => {
  return useMutation<IChat, IError, IUserData>(removeUserFromGroup);
};

// todo: get all messages of a single chat
const getAllMessages = async (chatId: string | null): Promise<IMessage[]> => {
  const { data } = await axios.get(`/api/v1/message/${chatId}`);
  return data;
};

export const useMessageQuery = (chatId: string | null) => {
  return useQuery<IMessage[], IError>(
    ["fetch-all-messages-by-chat", chatId],
    (context) => getAllMessages(chatId),
    {
      enabled: false,
    }
  );
};

// todo: send message
interface IMessageData {
  chat: string;
  content: string;
}

const sendMessage = async (messageData: IMessageData): Promise<IMessage> => {
  const { data } = await axios.post(`/api/v1/message/`, messageData);
  return data;
};

export const useMessageMutation = () => {
  return useMutation<IMessage, IError, IMessageData>(sendMessage);
};

// todo: delete group chat
interface IChatData {
  chatId: string;
}

const deleteGroupChat = async (chatData: IChatData): Promise<IChat> => {
  const { data } = await axios.delete(`/api/v1/chat/group`, { data: chatData });
  return data;
};

export const useDeleteChatMutation = () => {
  return useMutation<IChat, IError, IChatData>(deleteGroupChat);
};
