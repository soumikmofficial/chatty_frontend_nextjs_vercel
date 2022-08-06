import { MdError } from "react-icons/md";

interface IProps {
  message: string;
}
const AlertPrompt: React.FC<IProps> = ({ message }) => {
  return (
    <div className="absolute bottom-8 w-full z-[500]">
      <div className="bg-accent flex items-center gap-4 w-max px-3 py-2 rounded-md mx-auto max-w-[300px]">
        <MdError className="text-highlight flex-shrink-0" fontSize={20} />
        <p className="text-base text-center">{message}</p>
      </div>
    </div>
  );
};

export default AlertPrompt;
