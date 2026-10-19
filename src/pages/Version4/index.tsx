import { AnimatePresence, motion } from "motion/react";
import Footer from "./components/Footer";
import Cavans from "./components/Cavans";
import Header from "./components/Header";
import AnimateTxt from "./components/AnimateTxt";
import CursorFollow from "./components/CursorFollow";

import applestore from "@/assets/version4/applestore.png";
import rotate from "@/assets/version4/rotate.png";

import SquareWave4 from "./components/SquareWave3";

import React, { useCallback, useEffect, useState } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    setIsMobile(mobileRegex.test(userAgent));
  }, []);

  return isMobile;
}

const StampGrid: React.FC = () => {
  const isMobile = useIsMobile();

  const [openScreenAnimate, setOpenScreenAnimate] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScrollRequest, setAutoScrollRequest] = useState(0);
  const [cursorFollowEnable, setCursorFloowEnable] = useState(true);
  const [showPicker, setShowPicker] = useState(true);
  const [showInputArea, setShowInputArea] = useState(false);
  const [enableRandomImages, setEnableRandomImages] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [hasLeftTop, setHasLeftTop] = useState(false);

  const handleJoin = () => {
    alert("joined");
  };

  const handlePickerChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handlePickerEnd = useCallback(() => {
    setShowPicker(false);
    setCursorFloowEnable(false);
    setShowInputArea(true);
    setHasLeftTop(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY || document.documentElement.scrollTop || 0;
      setIsAtTop(top <= 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showPicker]);

  useEffect(() => {
    if (!isAtTop && !hasLeftTop) {
      setHasLeftTop(true);
    }
  }, [hasLeftTop, isAtTop]);

  useEffect(() => {
    if (isAtTop && showFooter && hasLeftTop) {
      setShowFooter(false);
      setShowInputArea(false);
      setEnableRandomImages(false);
      setCursorFloowEnable(true);
      setHasLeftTop(false);
    }
  }, [hasLeftTop, isAtTop, showFooter]);

  useEffect(() => {
    if (isMobile || !showPicker || !cursorFollowEnable) return;

    const handleAutoScrollStart = () => {
      setAutoScrollRequest((prev) => prev + 1);
    };

    window.addEventListener("click", handleAutoScrollStart);

    return () => {
      window.removeEventListener("click", handleAutoScrollStart);
    };
  }, [cursorFollowEnable, isMobile, showPicker]);

  if (openScreenAnimate) {
    return (
      <SquareWave4
        onAnimationComplete={() => {
          setOpenScreenAnimate(false);
        }}
      />
    );
  }

  return (
    <div className="select-none">
      <Header />

      <div className="w-full h100vh relative overflow-x-hidden">
        <AnimateTxt fadeOut={!showPicker} currentIndex={currentIndex} />

        <Cavans
          pickerVisible={showPicker}
          enableRandomImages={enableRandomImages}
          autoScrollRequest={autoScrollRequest}
          stampSize={isMobile ? 52 : 80}
          onPickerChange={handlePickerChange}
          onPickerEnd={handlePickerEnd}
        />

        <AnimatePresence>
          {showInputArea && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
              className="text-center pt110px md:pt280px relative z-99 select-none"
              onAnimationComplete={() => {
                if (!showFooter) {
                  setEnableRandomImages(true);
                  return setShowFooter(true);
                }

                return setShowPicker(true);
              }}
            >
              <p className="hidden md:inline text-58px font-blod ">
                Small Money. Big Outcomes.
              </p>

              <div className="md:hidden font-blod">
                <p className="text28px line-height-28px">Small Money.</p>
                <p className="text32px line-height-32px">Big Outcomes.</p>
              </div>

              <p className="text-14px md:text-20px text-[#767676] mt10px">
                We made money fun.
              </p>

              <div className="w350px h64px md:w800px md:h80px flex items-center justify-between bg-[#EFEFEF] rd-100px mt80px box-border px20px md:px30px mx-auto gap-20px md:gap-50px">
                <input
                  className="text-14px md:text-20px flex-1"
                  type="text"
                  placeholder="Enter your email address"
                />

                <div
                  className="bg-black text-white rd-100px w110px h40px flex-center text-14px md:w160px md:h54px md:text-20px 
             hover:op-80 hover:scale-105 
             active:scale-95
             transition-all duration-200 cursor-pointer"
                  onClick={handleJoin}
                >
                  Join waitlist
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showInputArea && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
          className="absolute bottom-100px w-full flex-center z-99"
        >
          <img
            className="w129px h49px md:w217px md:h77px bg-white"
            src={applestore}
            alt=""
          />
        </motion.div>
      )}

      {showPicker && (
        <CursorFollow enabled={cursorFollowEnable} image={rotate} />
      )}

      {showFooter && <Footer />}
    </div>
  );
};

export default StampGrid;
