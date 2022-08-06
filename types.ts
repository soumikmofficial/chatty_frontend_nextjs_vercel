export interface IFormProps {
  type: string;
  name: string;
  label: string;
  control: string;
}

export interface IError extends Error {
  response: any;
  statusText?: string;
}

export interface IRegData {
  name: string;
  email: string;
  password: string;
  avatar: File | string;
}

export interface ITokenUser {
  userId: string;
  name: string;
  role: string;
  avatar: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface IChat {
  _id: string;
  chatName?: string;
  chatType: "single" | "group";
  users: IUser[];
  createdAt: Date;
  updatedAt: Date;
  groupAdmin?: string;
  latestMessage?: IMessage;
  __v: number;
}

export interface IGroupChat {
  _id: string;
  chatName: string;
  chatType: string;
  users: IUser[];
  groupAdmin: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IMessage {
  _id: string;
  sender: IUser;
  content: string;
  chat: IChat;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IOnlineUser {
  socketId: string;
  userId: string;
}

export interface INotifications {
  [key: string]: IMessage[];
}
