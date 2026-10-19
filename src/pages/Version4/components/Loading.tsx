import petal from "@/assets/version4/petal.svg";
import petal2 from "@/assets/version4/petal2.svg";

import { motion, useCycle } from "motion/react";

// const LoadingSpinner = () => {
//   return (
//     <div className="fixed inset-0 m-auto flex items-center justify-center">
//       <motion.div
//         className="grid grid-cols-2 gap-10px w-60px h-60px rotate-45"
//         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//       >
//         <motion.div
//           className="w-26px h-26px flex items-center justify-center "
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{
//             duration: 0.5,
//             delay: 0.5,
//             ease: "easeOut",
//           }}
//         >
//           <img
//             src={petal}
//             alt=""
//             className="w-full h-full object-contain origin-top-bottom rotate-45"
//           />
//         </motion.div>

//         <motion.div
//           className="w-26px h-26px flex items-center justify-center "
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
//         >
//           <img
//             src={petal2}
//             alt=""
//             className="w-full h-full object-contain origin-top-bottom rotate-45"
//           />
//         </motion.div>

//         {/* 0 */}
//         <motion.div
//           className="w-26px h-26px flex items-center justify-center "
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5, delay: 0.0, ease: "easeOut" }}
//         >
//           <img
//             src={petal}
//             alt=""
//             className="w-full h-full object-contain origin-top-bottom rotate--45"
//           />
//         </motion.div>

//         <motion.div
//           className="w-26px h-26px flex items-center justify-center"
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
//         >
//           <img
//             src={petal2}
//             alt=""
//             className="w-full h-full object-contain origin-top-bottom rotate--45"
//           />
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default LoadingSpinner;

// 依次显示 依稀消失 循环
// import { motion } from "motion/react";
// import petal from "@/assets/version4/petal.svg";
// import petal2 from "@/assets/version4/petal2.svg";

// const LoadingSpinner = () => {
//   const petals = [
//     { img: petal, rotate: "rotate-45", delay: 0.5 },
//     { img: petal2, rotate: "rotate-45", delay: 1 },
//     { img: petal, rotate: "rotate--45", delay: 0 },
//     { img: petal2, rotate: "rotate--45", delay: 1.5 },
//   ];

//   return (
//     <div className="fixed inset-0 m-auto flex items-center justify-center">
//       <motion.div className="grid grid-cols-2 gap-10px w-60px h-60px rotate-45">
//         {petals.map((petal, index) => (
//           <motion.div
//             key={index}
//             className="w-26px h-26px flex items-center justify-center"
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={{
//               opacity: [0, 1, 1, 0], // 0->1->保持1->0
//               scale: [0.5, 1, 1, 0.5], // 0.5->1->保持1->0.5
//             }}
//             transition={{
//               duration: 3, // 总周期时长
//               delay: petal.delay,
//               repeat: Infinity,
//               ease: "easeInOut",
//               times: [0, 0.2, 0.8, 1], // 分配时间：0%透明，20%不透明，80%保持，100%消失
//             }}
//           >
//             <img
//               src={petal.img}
//               alt=""
//               className={`w-full h-full object-contain origin-top-bottom ${petal.rotate}`}
//             />
//           </motion.div>
//         ))}
//       </motion.div>
//     </div>
//   );
// };

// export default LoadingSpinner;

// const LoadingSpinner = () => {
//   return (
//     <div className="fixed inset-0 m-auto flex items-center justify-center">
//       <motion.div className="relative w-26px h-26px bg-red">
//         <motion.div
//           className="absolute w-26px h-26px  left--65%"
//
//         >
//           <img
//             src={petal}
//             alt=""
//             className={`w-full h-full object-contain  `}
//           />
//         </motion.div>

//         <motion.div
//           className="absolute w-26px h-26px  top--65%"
//
//         >
//           <img
//             src={petal2}
//             alt=""
//             className={`w-full h-full object-contain  `}
//           />
//         </motion.div>

//         <motion.div
//           className="absolute w-26px h-26px right--65%"
//
//         >
//           <img
//             src={petal}
//             alt=""
//             className={`w-full h-full object-contain  `}
//           />
//         </motion.div>

//         <motion.div
//           className="absolute w-26px h-26px bottom--65%"
//
//         >
//           <img
//             src={petal2}
//             alt=""
//             className={`w-full h-full object-contain  `}
//           />
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default LoadingSpinner;

import { useState, useEffect } from "react";

const petals = [
  { img: petal, style: { left: "-65%" } },
  { img: petal2, style: { top: "-65%" } },
  { img: petal, style: { right: "-65%" } },
  { img: petal2, style: { bottom: "-65%" } },
];

export const LoadingSpinner = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < 4) {
          return prev + 1;
        }
        return 0; // 重置为0，重新开始
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-[26px] h-[26px]">
        {petals.map((p, index) => (
          <div
            key={index}
            className="absolute w-[26px] h-[26px] transition-all duration-300"
            style={{
              ...p.style,
              opacity: index < step ? 1 : 0,
              transform: index < step ? "scale(1)" : "scale(0.5)",
            }}
          >
            <img src={p.img} alt="" className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
