import { motion } from "motion/react";

import DynamicTxt from "./DynamicTxt";
export default function AnimateTxt(props: any) {
  const { currentIndex, fadeOut = false } = props;
  return (
    <motion.div
      className="fixed top-50% translate-y--50% z-50 w-full flex justify-center gap-120px items-center text-24px md:text-58px font-blod"
      animate={{
        opacity: fadeOut ? 0 : 1,
        // y: fadeOut ? -50 : 0,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
    >
      <motion.h1
        className="flex-1 text-right"
        initial={{ opacity: 0, x: "-100%" }} // 从左侧滑入
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        A New Way
      </motion.h1>
      <motion.h1
        className="flex-1 flex"
        initial={{ opacity: 0, x: "100%" }} // 从右侧滑入
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        to Pay <DynamicTxt activeIdx={currentIndex} />
      </motion.h1>
    </motion.div>
  );
}
