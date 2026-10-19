import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
//img
import bg2 from "@/assets/version3/gradientBG.png";
import blitzoLogo3 from "@/assets/version3/blitzoLogo3.png";

//components
import Header from "../components/Header";
import Unboxing from "@/pages/Version3/components/Unboxing";

import RegistryDialog from "../components/RegistryDialog";
import VerifyCodeDialog from "../components/VerifyCodeDialog";
import VerifyPhoneDialog from "../components/VerifyPhoneDialog";
import PrizeDialog from "../components/PrizeDialog";

import { CDN_PRIFIX } from "@/constant";

export default function version3() {
  const [showUnboxing, setShowUnboxing] = useState(false); // 开箱动画

  const [registryDialogOpen, setRegitryDialogOpen] = useState(true);
  const [VerifyCodeDialogOpen, setVerifyCodeDialogOpen] = useState(false);
  const [VerifyCodeDialogParams, setVerifyCodeDialogParams] = useState({
    mode: "email",
    data: "",
  });

  const [VerifyPhoneDialogOpen, setVerifyPhoneDialogOpen] = useState(false); //手机验证弹窗

  const [PrizeDialogOpen, setPrizeDialogOpen] = useState(false); // 领奖弹窗
  const [userInfo, setUserInfo] = useState<any>(null); // 用于存储用户登录信息 登录后才可以开箱子

  const [showBlitzoBox, setShowBlitzoBox] = useState(false); // 控制盲盒是否显示

  const start = () => {
    setShowBlitzoBox(false);
    setTimeout(() => {
      sessionStorage.setItem("isOpen", "1");
      setShowUnboxing(true);
    }, 1000);
  };

  // 初始化校验是否登录
  useEffect(() => {
    if (!userInfo) {
      // 无用户信息 先强制唤起登录/注册弹窗
      setRegitryDialogOpen(true);
    } else {
      // 有用户登录
      const isBindPhone =
        userInfo.linked_accounts.filter((item: any) => item.type === "phone")
          .length > 0;
      // 绑定过手机号-->已领取了
      if (isBindPhone) {
        return setPrizeDialogOpen(true);
      } else {
        // 未绑定 判断本地临时变量是否有执行过开箱动画 有-->不在执行 无-->可以执行开箱动画
        const isOpen = sessionStorage.getItem("isOpen") === "1";
        if (isOpen) {
          return setPrizeDialogOpen(true);
        }
        return setShowBlitzoBox(true);
      }
    }
  }, [userInfo]);

  return (
    <div
      className="w100% h100vh overflow-hidden relative"
      style={{
        backgroundImage: `url(${CDN_PRIFIX + "/gradientBG.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 导航栏 */}
      <Header user={userInfo} />

      <div className="h97px sm:hidden"></div>

      <div className="absolute bottom-40px sm:bottom-0 ">
        <img className="h94px sm:h240px" src={blitzoLogo3} alt="" />
      </div>

      <AnimatePresence>
        {showBlitzoBox && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex justify-center sm:items-center sm:h100%"
          >
            <div className="text-[#f9f9f9] w-full mt-45px sm:mt-0">
              <div className="sm:hidden mt50px">
                <p className="text-22px text-center my10px neon-text">
                  WELCOME
                </p>
                <p className="text-22px text-center my10px neon-text">
                  REVEAL YOUR BLITZO CASE
                </p>
              </div>

              <div className="mx-auto mt96px sm:mt-0 w281px h216px sm:w11.07 sm:h9.19 relative">
                {/* ------------for pc start---------*/}
                <div className="absolute top-0 left--5.36 hidden sm:block">
                  <p className="text-22px  neon-text text-[#f9f9f9]">
                    REVEAL YOUR
                  </p>
                  <p className="text-22px  neon-text text-[#f9f9f9]">
                    BLITZO CASE
                  </p>
                  <div className="mt12px w5.2 h3.2 b-l-1px b-b-1px  b-solid b-l-[#f9f9f9] b-b-[#f9f9f9]"></div>
                </div>
                {/* ------------for pc end------------*/}
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full glow-white"
                  src={CDN_PRIFIX + "/box.png"}
                  alt=""
                />
              </div>

              <motion.div
                className="mx-auto mt50px flex gap-10px items-center justify-center w156px h65px rd-65px bg-[#373737B2] btn-particle cursor-pointer"
                onClick={start}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-22px neon-text">OPEN</span>
                <img
                  className="w20px h20px glow-white"
                  src={require("@/assets/version3/arrow_circle_right.png")}
                  alt=""
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 注册阶段 */}
      <RegistryDialog
        open={registryDialogOpen}
        onClose={() => setRegitryDialogOpen(false)}
        onEmail={(data) => {
          setRegitryDialogOpen(false);
          setVerifyCodeDialogParams({
            mode: "email",
            data,
          });
          setVerifyCodeDialogOpen(true);
        }}
        callback={(userData) => {
          setRegitryDialogOpen(false);
          setUserInfo(userData);

          // setPrizeDialogOpen(true);
        }}
      />

      {/* 开箱动画 */}
      <Unboxing
        open={showUnboxing}
        onClose={() => setShowUnboxing(false)}
        onCallback={() => {
          setPrizeDialogOpen(true);
        }}
      />

      {/* 手机/邮箱验证码阶段 */}
      <VerifyCodeDialog
        params={VerifyCodeDialogParams}
        open={VerifyCodeDialogOpen}
        onClose={() => setVerifyCodeDialogOpen(false)}
        // ⭐ 添加 onVerified 处理邮箱验证成功
        onVerified={(userData) => {
          setVerifyCodeDialogOpen(false);
          setUserInfo(userData);
        }}
      />

      {/* 奖品弹窗 */}
      <PrizeDialog
        open={PrizeDialogOpen}
        onClose={() => {}} //
        params={userInfo} //
        onVerified={() => {
          setPrizeDialogOpen(false);
          setVerifyPhoneDialogOpen(true);
        }}
      />

      {/* 手机号认证阶段*/}
      <VerifyPhoneDialog
        open={VerifyPhoneDialogOpen}
        onClose={() => setVerifyPhoneDialogOpen(false)}
        onSubmit={(data) => {
          setVerifyCodeDialogParams({
            mode: "phone",
            data,
          });
          setVerifyPhoneDialogOpen(false);
          setVerifyCodeDialogOpen(true); // 手机验证码验证
        }}
      ></VerifyPhoneDialog>
    </div>
  );
}
