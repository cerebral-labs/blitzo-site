import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import coinImg from "@/assets/coin.png";
import AnimateDialog from "./components/Animate";

import he from "@/assets/he.webm";

import h2t from "@/assets/coins/h2t.webm";
import t2h from "@/assets/coins/t2h.webm";
import call_h2h from "@/assets/coins/call_h2h.webm";
import call_h2t from "@/assets/coins/call_h2t.webm";
import call_t2h from "@/assets/coins/call_t2h.webm";
import call_t2t from "@/assets/coins/call_t2t.webm";

type Coin = {
  /**
   * 唯一标识，用作 React 列表渲染的 key，同时可用于追踪/匹配硬币
   */
  id: number;
  /**
   * 最终停留点的横坐标（以视口左上为原点，单位 px），用于 motion 的 x 属性
   */
  finalX: number;
  /**
   * 最终停留点的纵坐标（以视口左上为原点，单位 px），用于 motion 的 y 属性
   */
  finalY: number;
  /**
   * 硬币渲染尺寸（宽和高相等，单位 px），也用于碰撞检测
   */
  size: number;
  /**
   * 动画开始延时（单位为秒），用于让多枚硬币错开落下，表现更自然
   */
  delay: number;
  /**
   * 初始或目标旋转角度（单位：度），用于丰富落下时的旋转表现，hover 动画也会基于此做微调
   */
  rotate: number;
  /**
   * 可选：指示该硬币使用哪个视频资源（例如 0 -> h2t, 1 -> t2h）
   */
  video?: 0 | 1;
};

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function DemoCoins() {
  const [coins, setCoins] = useState<Coin[]>([]); // 悬浮边缘的硬币

  const [clickCoinDerection, setClickCoinDerection] = useState<0 | 1>(); //点击的硬币初始化朝向 0 反 1正

  const [open, setOpen] = React.useState(false); // 执行硬币翻转动画的开关

  const pauseInterval = 1000; // loop动画间隔

  const generateCoins = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const total = 12; //  移动生成多少个硬币
    const topCount = Math.round(total * 0.5); // 顶部的硬币
    const sideCount = total - topCount; // 左右两侧的硬币

    const arr: Coin[] = [];
    let id = 0;

    const padding = 6; // px extra space between coins
    const maxAttempts = 40; // attempts to place a coin without overlap

    const isOverlap = (x: number, y: number, size: number) => {
      const r = size / 2;
      for (const other of arr) {
        const or = other.size / 2;
        const dx = x + r - (other.finalX + or);
        const dy = y + r - (other.finalY + or);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < r + or + padding) return true;
      }
      return false;
    };

    const placeCoin = (
      minX: number,
      maxX: number,
      minY: number,
      maxY: number,
      sizeRange: [number, number],
      delayRange: [number, number],
      rotateRange: [number, number]
    ) => {
      let attempt = 0;
      let sx = 0,
        sy = 0,
        size = 0;
      while (attempt < maxAttempts) {
        size = Math.round(getRandom(sizeRange[0], sizeRange[1]));
        sx = getRandom(minX, Math.max(minX + 1, maxX - size));
        sy = getRandom(minY, Math.max(minY + 1, maxY - size));
        if (!isOverlap(sx, sy, size)) break;
        attempt++;
      }
      const delay = getRandom(delayRange[0], delayRange[1]);
      const rotate = getRandom(rotateRange[0], rotateRange[1]);
      arr.push({
        id: id++,
        finalX: sx,
        finalY: sy,
        size,
        delay,
        rotate,
        video: Math.random() < 0.5 ? 0 : 1,
      });
    };

    // top-distributed coins
    for (let i = 0; i < topCount; i++) {
      placeCoin(w * 0.05, w * 0.95, 8, 96, [36, 56], [0, 0.8], [-45, 45]);
    }

    // left & right side coins
    for (let i = 0; i < sideCount; i++) {
      const isLeft = i % 2 === 0;
      if (isLeft) {
        placeCoin(
          6,
          Math.max(24, w * 0.08),
          h * 0.12,
          h * 0.88,
          [48, 100],
          [0.2, 1.2],
          [-60, 60]
        );
      } else {
        // right side: bounds are relative to coin size inside placeCoin
        placeCoin(
          w - Math.max(24, w * 0.08) - 48,
          w - 6,
          h * 0.12,
          h * 0.88,
          [48, 100],
          [0.2, 1.2],
          [-60, 60]
        );
      }
    }

    setCoins(arr);
  };

  const startFor = (coin: Coin) => {
    const startX = coin.finalX + getRandom(-160, 160);
    const startY = -getRandom(80, 520); // start above
    const startRotate = coin.rotate + getRandom(-90, 90);
    return { x: startX, y: startY, rotate: startRotate };
  };

  const loadRotateAnimate = () => {
    if (clickCoinDerection === 0) {
      //反面朝上
      const arr = [call_t2h, call_t2t];
      return arr[Math.floor(Math.random() * arr.length)];
    } else if (clickCoinDerection === 1) {
      //正面朝上
      const arr = [call_h2h, call_h2t];
      return arr[Math.floor(Math.random() * arr.length)];
    }
  };

  useEffect(() => {
    generateCoins();
  }, []);

  return (
    <div className="">
      <div className="fixed inset-0 pointer-events-auto">
        {/* container is full viewport, coins are absolutely positioned using motion x/y */}
        <div
          style={{ position: "relative", width: "100%", height: "100%" }}
          className="bg-black"
        >
          {coins.map((c) => {
            const start = startFor(c);
            return (
              <motion.div
                key={c.id}
                initial={{
                  x: start.x,
                  y: start.y,
                  rotate: start.rotate,
                  scale: 0.8,
                  opacity: 0,
                }}
                animate={{
                  x: c.finalX,
                  y: c.finalY,
                  rotate: 0,
                  scale: [1.04, 0.96, 1],
                  opacity: 1,
                }}
                whileHover={{
                  scale: 1.25,
                  rotate: c.rotate * 0.3,
                  zIndex: 10000,
                  filter: "brightness(1.1)",
                }}
                transition={{
                  x: {
                    type: "spring",
                    stiffness: 120,
                    damping: 14,
                    delay: c.delay,
                  },
                  y: {
                    type: "spring",
                    stiffness: 90,
                    damping: 12,
                    delay: c.delay,
                  },
                  rotate: { duration: 0.8, delay: c.delay },
                  scale: { times: [0, 0.5, 1], duration: 0.9, delay: c.delay },
                  opacity: { duration: 0.2, delay: c.delay },
                  // Hover animation config
                  hover: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: c.size,
                  height: c.size,
                  borderRadius: 9999,
                  transformOrigin: "center",
                  cursor: "pointer",
                }}
                onMouseEnter={() => {
                  const v = document.getElementById(
                    `coin-video-${c.id}`
                  ) as HTMLVideoElement | null;
                  if (v) {
                    v.playbackRate = 1;
                    // 如果处于 loop 的间隔期，hover 也应立即恢复播放
                    v.play().catch(() => {});
                  }
                }}
                onMouseLeave={() => {
                  const v = document.getElementById(
                    `coin-video-${c.id}`
                  ) as HTMLVideoElement | null;
                  if (v) v.playbackRate = 0.5;
                }}
                onClick={() => {
                  setClickCoinDerection(c.video);
                  setOpen(true);
                }}
              >
                <video
                  id={`coin-video-${c.id}`}
                  className="w-full h-full opacity-85"
                  autoPlay
                  muted
                  src={c.video === 0 ? h2t : t2h}
                  onLoadedMetadata={(e) => {
                    // 初始设置为 0.5 倍速
                    e.currentTarget.playbackRate = 0.5;
                  }}
                  onEnded={(e) => {
                    // 在每次播放结束后等待 1 秒再重播，制造 loop 间隔
                    const v = e.currentTarget as HTMLVideoElement;
                    // 保持当前速率（如果 hover 切换了速率，这里仍保留）
                    setTimeout(() => {
                      v.play().catch(() => {});
                    }, pauseInterval);
                  }}
                >
                  <source src={c.video === 0 ? h2t : t2h} type="video/mp4" />
                  Your browser does not support the audio element.
                </video>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div>
        <AnimateDialog isOpen={open} onClose={() => setOpen(false)}>
          <div>
            <div className="video-container" id="videoContainer">
              <video
                className="w-full"
                autoPlay
                muted
                src={loadRotateAnimate()}
              >
                <source src={loadRotateAnimate()} type="video/mp4" />
              </video>
            </div>
          </div>
        </AnimateDialog>
      </div>
    </div>
  );
}
