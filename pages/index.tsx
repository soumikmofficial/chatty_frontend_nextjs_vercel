import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {} from "../components";
import { featureList1, featureList2 } from "../utils/homePageData";

const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 1.5,
    },
  },
};
const secondSectionVariants = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
    transition: {
      delay: 7,
      staggerChildren: 1.5,
      when: "beforeChildren",
    },
  },
};

const messageVariants = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
  },
};

const mainVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 10,
    },
  },
};

const Home: React.FC = () => {
  const router = useRouter();

  const isEven = (num: number) => {
    if (num === 0) return true;
    if (num % 2 === 0) return true;
    return false;
  };

  const handleClick = () => {
    router.push("/chat");
  };

  return (
    <div className="w-screen h-screen bg-primary flex justify-center bg-no-repeat bg-cover">
      <Head>
        <title>Chatty - The MERN Chat </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-primary w-full h-full grid grid-rows-3">
        {/* info */}

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5 w-full h-full mx-auto max-w-[400px] pt-4"
        >
          {featureList1.map((f, i) => {
            return (
              <motion.div
                variants={messageVariants}
                key={i}
                className={` text-sm md:text-base w-max px-2 py-1 max-w-[280px] rounded-md ${
                  isEven(i) ? "ml-auto bg-gray-800" : "bg-secondary"
                }`}
              >
                {f}
              </motion.div>
            );
          })}
        </motion.section>
        {/* brand  and button */}
        <motion.section
          variants={mainVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex items-center flex-col gap-3 justify-center"
        >
          <div className="text-[3rem] cursor-pointer ">
            <span className="text-highlight italic">C</span>hatt
            <span className="text-highlight italic">y</span>
          </div>
          <motion.button
            className="px-2 py-1 bg-highlight rounded-2xl text-base"
            onClick={handleClick}
            whileTap={{ scale: 0.8 }}
          >
            Let's Chat
          </motion.button>
        </motion.section>

        <motion.section
          variants={secondSectionVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5 w-full h-full mx-auto max-w-[400px]"
        >
          {featureList2.map((f, i) => {
            return (
              <motion.div
                variants={messageVariants}
                key={i}
                className={` text-sm md:text-base w-max px-2 py-1 max-w-[280px] rounded-md ${
                  isEven(i) ? "ml-auto bg-gray-800" : "bg-secondary"
                }`}
              >
                {f}
              </motion.div>
            );
          })}
        </motion.section>
      </main>
    </div>
  );
};

export default Home;
