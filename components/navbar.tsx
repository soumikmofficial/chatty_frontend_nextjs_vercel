import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineSearch, AiFillBell, AiOutlineDown } from "react-icons/ai";
import { Socket } from "socket.io-client";
import { useAppContext } from "../context/appContext";
import { useLogout } from "../hooks/useLogout";
import { INotifications } from "../types";
import { getFriend } from "../utils/getFriend";
import SingleNotification from "./singleNotification";

interface IProps {
  socket: Socket | undefined;
}

const notificationVariants = {
  hidden: {
    width: 0,
    height: 0,
  },
  visible: {
    width: "fit-content",
    height: "auto",
    transition: {
      type: "tween",
    },
  },
};

const wrapperVariants = {
  hidden: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const buttonVariants = {
  hidden: {
    x: "15vw",
  },
  visible: {
    x: 0,
    transition: {},
  },
};

const Navbar: React.FC<IProps> = ({ socket }) => {
  // todo: states and context
  const {
    setIsSearch,
    setProfileId,
    user,
    notifications,
    isNotification,
    setIsNotification,
    setSelectedChat,
  } = useAppContext();
  const [isMenu, setIsMenu] = useState(false);

  const logout = useLogout();
  // todo: functions

  const handleNotificationToggle = () => {
    if (Object.keys(notifications).length < 1) return;
    setIsNotification((prevState) => !prevState);
  };

  const handleLogout = async () => {
    await logout();
    socket?.emit("logout");
  };

  return (
    <nav className="h-[8vh] w-full flex items-center justify-between px-5 md:px-10 bg-secondary ">
      <motion.div
        whileTap={{ scale: 0.9, color: "gray" }}
        className="search flex items-center gap-3 cursor-pointer"
        onClick={() => setIsSearch(true)}
      >
        <AiOutlineSearch fontSize={22} />
        <p className="hidden md:block text-sm">Search Users</p>
      </motion.div>
      {/* brand */}
      <div
        className="text-lg cursor-pointer"
        onClick={() => setSelectedChat(null)}
      >
        <span className="text-highlight italic">C</span>hatt
        <span className="text-highlight italic">y</span>
      </div>
      {/* right buttons */}
      <div className="right-btns flex items-center gap-4 md:gap-8">
        {/* the notification expanded box */}
        <AnimatePresence>
          {isNotification && (
            <motion.div
              variants={notificationVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="max-w-[350px] right-[10%] md:right-[9%] bg-accent absolute top-[8vh] z-[200] max-h-[250px] overflow-scroll"
            >
              {user &&
                Object.keys(notifications).map((n) => (
                  <SingleNotification
                    key={n}
                    chatId={n}
                    setIsNotification={setIsNotification}
                    count={(notifications as INotifications)[n].length}
                    prefix={
                      (notifications as INotifications)[n][0].chat.chatType ===
                      "single"
                        ? "from"
                        : "in"
                    }
                    sender={
                      (notifications as INotifications)[n][0].chat.chatName
                        ? (notifications as INotifications)[n][0].chat.chatName
                        : getFriend(
                            (notifications as INotifications)[n][0].chat.users,
                            user.userId
                          )?.name
                    }
                  />
                ))}
            </motion.div>
          )}
        </AnimatePresence>
        {/* the notification button */}
        <div
          className="relative cursor-pointer"
          onClick={handleNotificationToggle}
        >
          <AiFillBell fontSize={16} />

          {Object.keys(notifications).length >= 1 && (
            <div className="absolute w-2 h-2 rounded-full bg-highlight top-0 right-0"></div>
          )}
        </div>
        <div
          className="more flex items-center gap-2 cursor-pointer"
          onClick={() => setIsMenu(!isMenu)}
        >
          <div className="avatar w-7 h-7 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
            {user && (
              <img
                src={user.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <AiOutlineDown fontSize={10} />
          <AnimatePresence>
            {isMenu && user && (
              <div className="menu absolute right-0 top-0 bottom-0 left-0  z-[100] bg-modal">
                <motion.div
                  variants={wrapperVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex flex-col gap-4 absolute top-[8vh] md:right-10 right-6"
                >
                  <motion.button
                    key={1}
                    variants={buttonVariants}
                    className="bg-highlight px-2 rounded-2xl text-base py-[2px] font-bold"
                    onClick={() => setProfileId(user.userId)}
                  >
                    Profile
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    className="bg-highlight px-2 rounded-2xl text-base py-[2px] font-bold"
                    onClick={handleLogout}
                  >
                    Logout
                  </motion.button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
