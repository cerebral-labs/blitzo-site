import { motion, AnimatePresence } from "motion/react";

import DynamicTxt from "./DynamicTxt";
export default function AnimateTxt(props: any) {
  const { currentIndex, fadeOut = false } = props;
  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div className="pointer-events-none z-100 absolute inset-0 m-auto z-50 w-full h-0 flex justify-center gap-70px md:gap-120px items-center text-24px md:text-58px font-blod bg-red">
          <motion.h1
            className="flex-1 text-right"
            initial={{ opacity: 0, x: "20%", scaleX: 0.8 }} // 从左侧滑入
            animate={{ opacity: 1, x: 0, scaleX: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="hidden md:inline">A New Way</span>
            <span className="md:hidden">New Way to</span>
          </motion.h1>
          <motion.h1
            className="flex-1 flex"
            initial={{ opacity: 0, x: "-20%", scaleX: 0.8 }} // 从右侧滑入
            animate={{ opacity: 1, x: 0, scaleX: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span>
              <span className="hidden md:inline">to </span>
              Pay&nbsp;
            </span>
            <DynamicTxt activeIdx={currentIndex} />
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
