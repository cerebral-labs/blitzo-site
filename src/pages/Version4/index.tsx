import { AnimatePresence, motion } from "motion/react";
import bg from "@/assets/version4/bg.png";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
import Cavans from "./components/Cavans";
import Header from "./components/Header";
import AnimateTxt from "./components/AnimateTxt";
import CursorFollow from "./components/CursorFollow";

import applestore from "@/assets/version4/applestore.png";
import rotate from "@/assets/version4/rotate.png";

import FlowerStamp from "./components/FlowerStamp";
import SquareWave from "./components/SquareWave";
import StampVideo from "./components/StampVideo";

import React, { useRef, useEffect, useState, useCallback } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // 常见的移动端正则匹配
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    setIsMobile(mobileRegex.test(userAgent));
  }, []);

  return isMobile;
}

const StampGrid: React.FC = ({}) => {
  const isMobile = useIsMobile();

  const [cursorFollowEnable, setCursorFloowEnable] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeEffect, setFadeEffect] = useState(false);
  return (
    <div className="select-none">
      <Header></Header>

      <AnimateTxt fadeOut={fadeEffect} currentIndex={currentIndex}></AnimateTxt>

      <div className="w-full h100vh relative overflow-x-hidden">
        <Cavans
          stampSize={isMobile ? 52 : 80}
          fadeEffect={fadeEffect}
          onChange={(e) => {
            console.log(e);
            setCurrentIndex(e);
          }}
          onEnd={() => {
            setFadeEffect(true);
            setCursorFloowEnable(false);
          }}
        ></Cavans>

        <AnimatePresence>
          {fadeEffect && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
              className="text-center pt110px md:pt280px relative z-99"
            >
              {/* for pc */}
              <p className="hidden md:inline text-58px font-blod ">
                Small Money. Big Outcomes.
              </p>
              {/* for pc */}

              {/* for mobile--- */}
              <div className="md:hidden font-blod">
                <p className="text28px line-height-28px">Small Money.</p>
                <p className="text32px line-height-32px">Big Outcomes.</p>
              </div>
              {/* for mobile--- */}

              <p className="text-14px md:text-20px text-[#767676] mt10px">
                We made money fun.
              </p>

              <div className="w350px h64px md:w800px md:h80px flex items-center justify-between bg-[#EFEFEF] rd-100px mt80px box-border px20px md:px30px mx-auto">
                <input
                  className="text-14px md:text-20px"
                  type="text"
                  placeholder="Enter your email address"
                />

                <div className="bg-black text-white rd-100px w110px h40px  flex-center text-14px md:w160px md:h54px md:text-20px">
                  Join waitlist
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {fadeEffect && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
          className="absolute bottom-100px w-full flex-center z-99"
        >
          <img
            className="w129px h49px md:w217px md:h77px"
            src={applestore}
            alt=""
          />
        </motion.div>
      )}

      {!fadeEffect && (
        <CursorFollow
          enabled={cursorFollowEnable}
          image={rotate}
        ></CursorFollow>
      )}

      {fadeEffect && <Footer></Footer>}
    </div>
  );
  // return <StampVideo></StampVideo>;
};

export default StampGrid;
