import "./index.less";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimate } from "motion/react";
import { Link } from "umi";
import clsx from "clsx";

import coffee from "@/assets/coffee.png";
import hamburger from "@/assets/hamburger.png";
import bear from "@/assets/bear.png";
import coin from "@/assets/coin.png";
import tiger from "@/assets/tiger.png";
import union from "@/assets/union.png";
import x from "@/assets/x.png";
import watch from "@/assets/watch.png";
import phone from "@/assets/phone.png";
import headphones from "@/assets/headphones.png";

import CoinAnimateDialog from "@/components/CoinAnimateDialog";
import RegistryDialog from "@/components/RegistryDialog";
import VerifyCodeDialog from "@/components/VerifyCodeDialog";
import EndingDialog from "@/components/EndingDialog";

import h2t from "@/assets/mov/h2t.mp4";
import t2h from "@/assets/mov/t2h.mp4";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Tooltip } from "@mui/material";

interface ReelProps {
  items: string[];
  width: number;
  height: number;
  intervalMs?: number;
}

function Reel({ items, width, height, intervalMs = 800 }: ReelProps) {
  const [scope, animate] = useAnimate();
  const stepRef = useRef(0);

  useEffect(() => {
    let isUnmounted = false;
    const tick = async () => {
      if (isUnmounted) return;
      if (items.length === 0) return;
      const nextStep = stepRef.current + 1; // 目标帧（包含克隆帧）
      // 实际滚动时淡入淡出
      await animate(scope.current, { opacity: 0.4 }, { duration: 0.06 });
      await animate(scope.current, { y: -height * nextStep, opacity: 1 }, { duration: 0.45, ease: "easeInOut" });
      if (nextStep === items.length) {
        // 到达克隆帧，瞬时复位到首帧（同画面），实现无缝循环
        await animate(scope.current, { y: 0 }, { duration: 0 });
        stepRef.current = 0;
      } else {
        stepRef.current = nextStep;
      }
    };

    const id = setInterval(tick, intervalMs);
    return () => {
      isUnmounted = true;
      clearInterval(id);
    };
  }, [animate, height, intervalMs, items.length, scope]);

  // 复制首项作为尾部克隆，确保到尾部后可无缝回环
  const renderList = items.length > 0 ? [...items, items[0]] : items;

  return (
    <div className="shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.06)] shadow-lg rd-20px overflow-hidden flex-center bg-white" style={{ width, height }}>
      <div style={{ height, width: "100%", position: "relative" }}>
        <motion.div ref={scope} style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
          {renderList.map((src: string, i: number) => (
            <div key={i} className="flex-center" style={{ width: "100%", height }}>
              <img src={src} alt="" className="h77px" style={{ objectFit: "contain" }} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  const arr = [coffee, hamburger, bear, watch, phone, headphones];

  const [dereaction, setDerection] = useState<String>("heads");

  const [coinAnimateDialogOpen, setCoinAnimateDialogOpen] = useState(false);
  const [registryDialogOpen, setRegitryDialogOpen] = useState(false);
  const [VerifyCodeDialogOpen, setVerifyCodeDialogOpen] = useState(false);
  const [VerifyCodeDialogParams, setVerifyCodeDialogParams] = useState({
    mode: "email",
    data: "",
  });

  const [EndingDialogOpen, setEndingDialogOpen] = useState(false);
  const [EndingDialogParams, setEndingDialogParams] = useState(null); // ⭐ 添加参数状态

  const headsVideoRef = useRef<HTMLVideoElement>(null);
  const tailsVideoRef = useRef<HTMLVideoElement>(null);
  const headsVideoMobileRef = useRef<HTMLVideoElement>(null);
  const tailsVideoMobileRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Restart the visible video when switching
    if (dereaction === "heads") {
      if (headsVideoRef.current) {
        headsVideoRef.current.currentTime = 0;
        headsVideoRef.current.play().catch(() => {});
      }
      if (headsVideoMobileRef.current) {
        headsVideoMobileRef.current.currentTime = 0;
        headsVideoMobileRef.current.play().catch(() => {});
      }
    } else {
      if (tailsVideoRef.current) {
        tailsVideoRef.current.currentTime = 0;
        tailsVideoRef.current.play().catch(() => {});
      }
      if (tailsVideoMobileRef.current) {
        tailsVideoMobileRef.current.currentTime = 0;
        tailsVideoMobileRef.current.play().catch(() => {});
      }
    }
  }, [dereaction]);

  return (
    <div className="box-border py40px bg-[#F5F5F5] bg-white min-h-100vh flex flex-col">
      <div className="flex-1">
      <div className="text-center mt-10px sm:mt-30px">
        <p className="text-36px sm:text-48px text-[#FF731C]" style={{ fontFamily: 'Tomorrow', fontWeight: 700, fontStyle: 'italic' }}>Blitzo.xyz</p>
        <p className="text-18px sm:text-24px" style={{ fontFamily: 'Tomorrow', fontWeight: 500, fontStyle: 'italic' }}>Gamifying Payments.</p>
      </div>

      {!EndingDialogOpen && !coinAnimateDialogOpen && !registryDialogOpen && (
        <div className="flex-center gap30px mt30px sm:mt50px text-24px lg:text-40px font-bold">
          <div>BUY A</div>
          <Reel items={arr} width={134} height={134} intervalMs={3000} />
          <div className="text-[#F25906]">PAY <span className="font-black">$0</span></div>
        </div>
      )}

      {!EndingDialogOpen && !coinAnimateDialogOpen && !registryDialogOpen && (
        <div className="flex-center mt80px hidden sm:flex ">
        <div
          className="w256px h91px px50px rd-68px flex-center gap10px b-1px b-solid b-black/40 cursor-pointer hover:bg-orange-50 hover:border-[#FF731C] transition-colors"
          onClick={() => {
            setDerection("heads");
          }}
        >
          <img className="w43px h43px" src={tiger} alt="" />
          <span className="font-blod">Heads</span>
        </div>
        <div
          className="w423px h423px relative"
          onClick={() => {
            setCoinAnimateDialogOpen(true);
          }}
        >
          <video
            ref={headsVideoRef}
            className="w-full h-full absolute top-0 left-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: dereaction === "heads" ? 1 : 0, pointerEvents: "none" }}
            src={t2h}
            autoPlay
            muted
            playsInline
          ></video>
          <video
            ref={tailsVideoRef}
            className="w-full h-full absolute top-0 left-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: dereaction === "tails" ? 1 : 0, pointerEvents: "none" }}
            src={h2t}
            autoPlay
            muted
            playsInline
          ></video>
        </div>
        <div
          className="w256px h91px px50px rd-68px flex-center gap10px b-1px b-solid b-black/40 cursor-pointer hover:bg-orange-50 hover:border-[#FF731C] transition-colors"
          onClick={() => {
            setDerection("tails");
          }}
        >
          <img className="w43px h43px" src={union} alt="" />
          <span className="font-bold">TAILS</span>
        </div>
      </div>
      )}

      {/* m */}
      {!EndingDialogOpen && !coinAnimateDialogOpen && !registryDialogOpen && (
      <div className="block sm:hidden mt40px">
        <div
          className="w228px h228px mx-auto relative"
          onClick={() => {
            setCoinAnimateDialogOpen(true);
          }}
        >
          <video
            ref={headsVideoMobileRef}
            className="w-full h-full absolute top-0 left-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: dereaction === "heads" ? 1 : 0, pointerEvents: "none" }}
            src={t2h}
            autoPlay
            muted
            playsInline
          ></video>
          <video
            ref={tailsVideoMobileRef}
            className="w-full h-full absolute top-0 left-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: dereaction === "tails" ? 1 : 0, pointerEvents: "none" }}
            src={h2t}
            autoPlay
            muted
            playsInline
          ></video>
        </div>
        <div className="w230px h70px bg-[#FF731C] mx-auto rd-100px flex relative mt70px" style={{ WebkitTapHighlightColor: "transparent" }}>
          <div
            className="absolute top-0 left-0 w-1/2 h-full bg-white rd-100px transition-transform duration-300 ease-in-out shadow-md"
            style={{ transform: dereaction === "tails" ? "translateX(100%)" : "translateX(0)" }}
          ></div>
          <div
            className={clsx("flex-center flex-1 rd-100px z-1 transition-colors duration-300 cursor-pointer outline-none select-none", {
              "font-bold": dereaction === "heads"
            })}
            style={{ color: dereaction == "heads" ? "#FF731C" : "white", WebkitTapHighlightColor: "transparent" }}
            onClick={() => {
              setDerection("heads");
            }}
          >
            Heads
          </div>
          <div
            className={clsx("flex-center flex-1 rd-100px z-1 transition-colors duration-300 cursor-pointer outline-none select-none", {
              "font-bold": dereaction === "tails"
            })}
            style={{ color: dereaction == "tails" ? "#FF731C" : "white", WebkitTapHighlightColor: "transparent" }}
            onClick={() => {
              setDerection("tails");
            }}
          >
            Tails
          </div>
        </div>
      </div>
      )}

      {!EndingDialogOpen && !coinAnimateDialogOpen && !registryDialogOpen && (
      <div className="flex-center mt20px flex-col gap-8px">
        <div className="text-[#FF731C] text-13px sm:text-14px font-medium animate-pulse">
          ↑ Click the coin to play ↑
        </div>
        <Tooltip
          title="Pick a side (Heads or Tails) and then click on the coin in the middle to play!"
          placement="top"
          arrow
          enterTouchDelay={0}
          leaveTouchDelay={3000}
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: 'rgba(50, 50, 50, 0.95)',
                backdropFilter: 'blur(10px)',
                fontSize: '14px',
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                fontWeight: 500,
              },
            },
            arrow: {
              sx: {
                color: 'rgba(50, 50, 50, 0.95)',
              },
            },
          }}
        >
          <div className="text-[#adadad] text-14px cursor-pointer flex items-center gap-2 outline-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
            <span>How it works</span>
            <HelpOutlineIcon sx={{ fontSize: 18 }}></HelpOutlineIcon>
          </div>
        </Tooltip>
      </div>
      )}
      </div>

      <div className="flex-center mt-auto pb1px text-14px text-[#adadad] gap-3">
        <a href="https://x.com/blitzo_xyz" target="_blank" rel="noopener noreferrer">
          <img src={x} alt="X (Twitter)" className="w20px h20px" />
        </a>
        <span>·</span>
        <Link to="/terms" className="text-[#adadad]">Terms of Service</Link>
        <span>·</span>
        <span>© 2025 Blitzo</span>
      </div>

        <CoinAnimateDialog
            derection={dereaction}
            open={coinAnimateDialogOpen}
            onClose={() => setCoinAnimateDialogOpen(false)}
            callback={() => {
                setCoinAnimateDialogOpen(false);
                setRegitryDialogOpen(true);
            }}
        />

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
            // ⭐ 添加 callback 处理 Google/Twitter 登录成功
            callback={(userData) => {
                setRegitryDialogOpen(false);
                setEndingDialogParams(userData);
                setEndingDialogOpen(true);
            }}
        />

        <VerifyCodeDialog
            params={VerifyCodeDialogParams}
            open={VerifyCodeDialogOpen}
            onClose={() => setVerifyCodeDialogOpen(false)}
            // ⭐ 添加 onVerified 处理邮箱验证成功
            onVerified={(userData) => {
                setVerifyCodeDialogOpen(false);
                setEndingDialogParams(userData);
                setEndingDialogOpen(true);
            }}
        />

        <EndingDialog
            open={EndingDialogOpen}
            onClose={() => {}} // ⭐ 改为空函数，阻止关闭
            params={EndingDialogParams} // ⭐ 传递参数
        />
    </div>
  );
}
