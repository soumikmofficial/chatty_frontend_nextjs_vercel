import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/appContext";
import { IMessage } from "../types";
import { format } from "timeago.js";
import { motion } from "framer-motion";

interface IProps {
  message: IMessage;
  isLast: boolean;
}

const messageVariants = {
  hidden: {
    scale: 0,
    transition: {
      duration: 0.3,
    },
  },
  visible: {
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const SingleMessage: React.FC<IProps> = ({ message, isLast }) => {
  const [isHover, setIsHover] = useState(false);
  const { user: self } = useAppContext();
  const scrollRef = useRef() as React.MutableRefObject<HTMLElement>;

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <article
      ref={scrollRef}
      className={`flex gap-3 items-end  ${
        self?.userId === message.sender._id && "justify-end"
      }`}
    >
      <div
        className={`avatar w-5 h-5 rounded-full overflow-hidden flex-shrink-0 max-w-[300px] flex items-center justify-center  ${
          self?.userId === message.sender._id && "order-[3] "
        }`}
      >
        <img
          src={message.sender.avatar}
          alt=""
          className={`w-full h-full object-cover ${
            isLast ? "block" : "hidden"
          }`}
        />
      </div>
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={`content text-base italic text-gray-300 bg-secondary px-2 py-1 rounded-md max-w-[300px] md:max-w-[400px] w-max  
      ${self?.userId === message.sender._id && "bg-accent order-[2]"}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {message.content}
      </motion.div>
      {isHover && (
        <p
          className={`text-gray-500 text-xs ${
            self?.userId === message.sender._id && "order-[1]"
          }`}
        >
          {format(message?.updatedAt)}
        </p>
      )}
    </article>
  );
};

export default SingleMessage;
