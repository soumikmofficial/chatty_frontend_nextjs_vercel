import { useEffect, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useAppContext } from "../context/appContext";
import { IMessage } from "../types";
import { isLastMessage } from "../utils/isLastMessage";
import SingleMessage from "./singleMessage";

interface IProps {
  isTyping: boolean;
  avatar: string;
}

const Conversation: React.FC<IProps> = ({ isTyping, avatar }) => {
  const { messages } = useAppContext();
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  // todo: useEffects
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isTyping]);

  return (
    <section className="messages overflow-y-scroll bg-primary pt-5 max-w-[1000px] mx-auto w-full flex-grow px-5 py-2 gap-4 flex flex-col">
      {!messages || messages.length < 1 ? (
        <div className="w-full h-full flex items-center justify-center text-secondary capitalize text-3xl ">
          start a conversation
        </div>
      ) : (
        <>
          {messages &&
            messages.map((message: IMessage, i) => (
              <SingleMessage
                isLast={isLastMessage(messages, i, message)}
                message={message}
                key={message._id}
              />
            ))}
          {isTyping && (
            <div ref={scrollRef} className="flex  items-end gap-3">
              <div
                className={`avatar w-5 h-5 rounded-full overflow-hidden flex-shrink-0 max-w-[300px] flex items-center justify-center `}
              >
                <img
                  src={avatar}
                  alt=""
                  className={`w-full h-full object-cover `}
                />
              </div>
              <div className="bg-secondary px-1 py-2 rounded-md">
                <ThreeDots color="hsl(345, 100%, 43%)" height={8} width={50} />
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Conversation;
