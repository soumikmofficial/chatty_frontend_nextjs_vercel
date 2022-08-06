import { useAppContext } from "../context/appContext";

interface IProps {
  count: number;
  sender: string | undefined;
  prefix: string;
  chatId: string;
  setIsNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleNotification: React.FC<IProps> = ({
  count,
  sender,
  prefix,
  chatId,
  setIsNotification,
}) => {
  const { notifications, setNotifications, setSelectedChat } = useAppContext();

  const clearNotification = () => {
    const newItems = { ...notifications };
    delete newItems[chatId];
    setSelectedChat(chatId);
    setNotifications(newItems);
    setIsNotification(false);
  };

  return (
    <div
      className="px-6 py-3 border-b border-gray-500 text-sm cursor-pointer"
      onClick={clearNotification}
    >
      <span className="text-highlight font-bold">{count}</span> new message{" "}
      {prefix} <span className="text-highlight font-bold">{sender}</span>
    </div>
  );
};

export default SingleNotification;
