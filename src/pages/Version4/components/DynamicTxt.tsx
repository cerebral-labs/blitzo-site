import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  activeIdx: number;
};

const items = [
  { title: "Anything" },
  { title: "Anything" },
  { title: "Anything" },
  { title: "Anything" },
  { title: "Anything" },
  { title: "Treat" },
  { title: "Shopping" },
  { title: "Dining" },
  { title: "travel" },
  { title: "Anything" },
  { title: "Friends" },
  { title: "Coffee" },
  { title: "Groceries" },
  { title: "Movies" },
  { title: "Anything" },
  { title: "Anything" },
  { title: "Anything" },
  { title: "Anything" },
  { title: "Anything" },
  { title: "Anything" },
  { title: "Anything" },
];

export default function DynamicTxt({ activeIdx }: Props) {
  const prevIdxRef = useRef(activeIdx);
  const [direction, setDirection] = useState<"up" | "down">("down");

  useEffect(() => {
    const prevIdx = prevIdxRef.current;

    if (activeIdx > prevIdx) {
      setDirection("up");
    } else if (activeIdx < prevIdx) {
      setDirection("down");
    }

    prevIdxRef.current = activeIdx;
  }, [activeIdx]);

  const variants = useMemo(() => {
    if (direction === "up") {
      return {
        initial: { opacity: 0, rotateX: -70, y: 20 },
        animate: { opacity: 1, rotateX: 0, y: 0 },
        exit: { opacity: 0, rotateX: 70, y: -20 },
      };
    }

    return {
      initial: { opacity: 0, rotateX: 70, y: -20 },
      animate: { opacity: 1, rotateX: 0, y: 0 },
      exit: { opacity: 0, rotateX: -70, y: 20 },
    };
  }, [direction]);

  return (
    <div className="relative  " style={{ perspective: 1000 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeIdx}
          className="absolute inset-0  "
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {items[activeIdx]?.title}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
