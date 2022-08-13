import { useAppContext } from "../context/appContext";
import { AiOutlineClose } from "react-icons/ai";
import { useProfileQuery } from "../hooks/userHooks";
import Spinner from "./Spinner";
import { motion } from "framer-motion";

const modalVariants = {
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

const Profile = () => {
  const { user, setProfileId, profileId } = useAppContext();

  const { data: profile, isLoading } = useProfileQuery(profileId);

  return (
    <div className="absolute bg-modal top-0 left-0 bottom-0 right-0 z-[200] flex items-center justify-center">
      <motion.article
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="top-0 left-0 w-full md:w-max bg-secondary px-4 md:px-8 py-5 rounded-md flex flex-col gap-10 md:gap-4 items-center h-screen md:h-max md:min-w-[300px] z-[500]"
      >
        {/* close button */}
        <div className="ml-auto cursor-pointer mt-4">
          <AiOutlineClose fontSize={20} onClick={() => setProfileId(null)} />
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {" "}
            {/* name */}
            <h3 className="font-bold capitalize text-1xl md:text-base">
              {profile?.name}
            </h3>
            {/* the avatar */}
            <div className="avatar w-[12rem] md:w-[9rem] h-[12rem] md:h-[9rem] flex items-center justify-center overflow-hidden bg-red-500 rounded-full">
              {profile && (
                <img
                  src={profile.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {/* email */}
            <p className="mt-5 text-2xl md:text-lg font-extralight">
              {profile?.email}{" "}
            </p>
          </>
        )}
      </motion.article>
    </div>
  );
};

export default Profile;
