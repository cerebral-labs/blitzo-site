import { Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { AnimatePresence, motion } from "motion/react";
import logoImg from "@/assets/version2/blitzoLogo.png";
import tap from "@/assets/version2/tap.png";
import card from "@/assets/version2/card.png";
import success from "@/assets/version2/success.png";

import t2h from "@/assets/version2/h2t_v2.webm";
import call_h2h from "@/assets/version2/call_h2t.webm";

import Lottie from "lottie-react";
import confettiAnimation from "@/assets/lottie/confetti (2).json";
import successcheck from "@/assets/lottie/Success.json";

import { PropsWithChildren, useState } from "react";

export type ActionSheetProps = {
  open: boolean;
  onClose: () => void;
  onFlip?: () => void;
};

export default function ActionSheet(
  props: PropsWithChildren<ActionSheetProps>
) {
  const { open, onClose, onFlip } = props;

  const [step, setStep] = useState(0); // 0 init 1 执行翻转动画 2 执行中奖烟花动画 3 终结状态

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1300,
            }}
          />
          {/* Bottom Sheet */}
          <motion.div
            className=""
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 36,
              mass: 0.6,
            }}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1301,
            }}
          >
            <Box
              className="bg-modalbg box-border p30px rd-30px h470px"
              sx={{
                mx: "auto",
                width: "92%",
                maxWidth: 420,
                color: "#f5f5f5",
                overflow: "hidden",
                mb: "max(env(safe-area-inset-bottom), 8px)",
              }}
            >
              {/* 文字方案 目前pass */}
              {/* <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >

                <div className="flex-center ">
                  <span className="font-[Jacquard12-Regular] text-40px neon-text-orange text-[#FFB861]">
                    Blitzo
                  </span>
                </div>
                <span className="text-14px">DOUBLE OR FREE</span>
              </Box> */}

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <div className="flex-center glow-fire fire-flicker-animation">
                  <img src={logoImg} alt="blitzo" className="h27px" />
                </div>
                <span className="text-14px">DOUBLE OR FREE</span>
              </Box>

              <Box
                className="mb22px mt30px"
                display="flex"
                justifyContent="center"
              >
                {![2, 3].includes(step) && (
                  <video
                    className="w122px h127px"
                    src={(function () {
                      if (step === 0) return t2h;
                      else if (step == 1) return call_h2h;
                    })()}
                    muted
                    autoPlay
                    playsInline
                    webkit-playsinline
                    loop={step == 0} // 初始阶段一直循环
                    onEnded={() => {
                      //如果点击后 当前阶段其实在翻转硬币 硬币翻转完后 执行lottie动画
                      if (step === 1) {
                        setStep(step + 1);
                      }
                    }}
                  ></video>
                )}

                {step == 2 && (
                  <div className="relative h262px mt30px">
                    <div className="w112px h107px  absolute left-1/2 top-0 translate-x--1/2 ">
                      <img
                        className="w-full h-full"
                        src={require("@/assets/version2/goldcoin.png")}
                        alt=""
                      />
                    </div>

                    <div className="h107px  absolute left-1/2 top-200px translate-x--1/2">
                      <p className="neon-text"> You WON FREE!</p>
                    </div>

                    {/* lottie动画调整向上位置一些 */}
                    <Lottie
                      className="translate-y--100px"
                      animationData={confettiAnimation}
                      loop={false}
                      onComplete={() => {
                        setStep(step + 1);
                      }}
                    />
                  </div>
                )}

                {step == 3 && (
                  <div className="flex-center mb50px mt30px">
                    <div className="w112px h107px ">
                      <img
                        className="w-full h-full"
                        src={require("@/assets/version2/goldcoin.png")}
                        alt=""
                      />
                    </div>
                  </div>
                )}
              </Box>

              {/* card */}
              <Box
                className="bg-[#313131] p12px box-border rd-15px mb13px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    className="w58px h36px"
                    component="img"
                    src={card}
                    alt="card"
                  />
                  <span className="text-14px">BLITZO CARD</span>
                </Box>

                <span className="text-14px">**** 0000</span>
              </Box>

              {![3, 2].includes(step) && (
                <Box
                  className="bg-[#313131] p12px box-border rd-15px "
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography fontSize={14} color="#cfcfcf">
                      Blitz Payment
                    </Typography>
                    <Box display="flex" alignItems="baseline" gap={1} mt={0.5}>
                      <Typography fontSize={22} fontWeight={800}>
                        $99
                      </Typography>
                      <Typography fontSize={14} color="#cfcfcf">
                        OR
                      </Typography>
                      <Typography fontSize={22} fontWeight={800}>
                        FREE
                      </Typography>
                    </Box>
                  </Box>
                  <ChevronRightIcon />
                </Box>
              )}

              {/* 按钮区域状态 */}
              {step == 0 && (
                <div className="mt24px relative flex-center btn-particle">
                  <div className="w36px h36px">
                    <img src={tap} alt="" />
                  </div>
                  <p
                    className="absolute neon-text text-10px"
                    onClick={() => setStep(1)}
                  >
                    Tap to Flip
                  </p>
                </div>
              )}

              {step == 1 && (
                <div className="mt24px relative flex-center">
                  <div className="w50px h50px">
                    <Lottie
                      className="bg-transparent"
                      animationData={successcheck}
                      loop={false}
                      onComplete={() => {
                        setStep(step + 1);
                      }}
                    />
                  </div>
                </div>
              )}

              {step == 3 && (
                <div
                  className="bg-[#313131] p12px py20px box-border rd-15px mt25px flex-center btn-particle"
                  onClick={onFlip}
                >
                  <p className="neon-text">CLAIM SPECIAL REWARDS!</p>
                </div>
              )}
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
