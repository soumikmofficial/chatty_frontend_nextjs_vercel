import { IUser } from "../types";

interface IParams {
  users: IUser[];
  self: string;
}

export const getFriend = (users: IUser[], self: string) => {
  const friend = users.find((user) => user._id !== self);
  return friend;
};
