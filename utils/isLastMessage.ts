import { IMessage } from "../types";

export const isLastMessage = (
  messages: IMessage[],
  index: number,
  currentMessage: IMessage
) => {
  if (index >= messages.length - 1) {
    return true;
  }
  if (messages[index + 1].sender._id !== currentMessage.sender._id) {
    return true;
  }
  return false;
};
