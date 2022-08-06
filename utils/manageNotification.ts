import { INotifications, IMessage } from "../types";

export const manageNotification = (
  notifications: INotifications,
  message: IMessage
) => {
  notifications[message.chat._id]
    ? (notifications[message.chat._id] = [
        ...notifications[message.chat._id],
        message,
      ])
    : (notifications[message.chat._id] = [message]);

  return notifications;
};
