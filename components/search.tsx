import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { SingleSearchedUser, Spinner } from ".";
import { useAppContext } from "../context/appContext";
import { useSearchQuery } from "../hooks/userHooks";

const sidebarVariants = {
  hidden: {
    x: "-100%",
    transition: {
      duration: 0.3,
    },
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const Search: React.FC = () => {
  const { setIsSearch, setAlert } = useAppContext();
  const [input, setInput] = useState("");
  const {
    isLoading,
    isRefetching,
    refetch: searchUsers,
    data: users,
    isError,
    error,
  } = useSearchQuery(input);
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  // ? when input is typed perform search
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (input !== "") {
      searchUsers();
    }
  }, [input]);

  // ? if there is an error set global error to show modal
  useEffect(() => {
    if (isError) {
      setAlert(error.response.data.message);
    }
  }, [isError, error]);

  return (
    <aside className=" absolute h-screen top-0 left-0 bottom-0 right-0 bg-modal z-[200]">
      {/* main inner container */}
      <motion.div
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className=" w-full h-full md:px-6 px-10 py-6 md:max-w-[300px] flex flex-col gap-5 z-10 bg-accent"
      >
        <header className="flex items-center justify-between">
          <h1>Search Users</h1>
          <AiOutlineArrowLeft
            onClick={() => setIsSearch(false)}
            className="cursor-pointer"
          />
        </header>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="type name or email..."
          className="w-full px-4 outline-none border-highlight border-2 text-white rounded-lg py-2 bg-accent
        text-md
        placeholder:text-md 
        placeholder:text-gray-400"
        />
        {/* the loader */}
        {isLoading || (isRefetching && <Spinner />)}
        {/* the results */}
        {users && (
          <div className="result flex flex-col gap-2 flex-grow overflow-y-scroll">
            {users.map((user) => {
              return (
                <SingleSearchedUser
                  user={user}
                  key={user._id}
                  setIsSearch={setIsSearch}
                />
              );
            })}
          </div>
        )}
      </motion.div>
    </aside>
  );
};

export default Search;
