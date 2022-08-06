import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import { IError, IUser } from "../types";

// todo: search users
const searchUsers = async (searchQuery: string): Promise<IUser[]> => {
  const res = await axios.get(`/api/v1/user?search=${searchQuery}`);
  return res.data;
};

export const useSearchQuery = (searchQuery: string) => {
  return useQuery<IUser[], IError>(
    ["search-users", searchQuery],
    (context) => searchUsers(searchQuery),
    {
      enabled: !!searchQuery,
    }
  );
};

// todo: get single user profile
const getProfile = async (userId: string | null): Promise<IUser> => {
  const { data } = await axios.get(`/api/v1/user/${userId}`);
  return data;
};

export const useProfileQuery = (userId: string | null) => {
  return useQuery<IUser, IError>(
    ["get-profile", userId],
    (context) => getProfile(userId),
    {
      refetchOnWindowFocus: false,
      enabled: !!userId,
    }
  );
};
