import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";

import stamp from "@/assets/version4/stamp.svg";
import dollarsign from "@/assets/version4/dollarsign..svg";

interface MouseFollowerProps {
  /** 是否开启跟随 */
  enabled?: boolean;
  /** 自定义图片URL */
  image?: string;
  /** 图片宽度 (px) */
  width?: number;
  /** 图片高度 (px) */
  height?: number;
  /** 是否平滑跟随 */
  smooth?: boolean;
  /** 跟随速度 (1-20) */
  speed?: number;
  /** X轴偏移 (px) */
  offsetX?: number;
  /** Y轴偏移 (px) */
  offsetY?: number;
  /** 透明度 */
  opacity?: number;
  /** 色块颜色 (无图片时使用) */
  color?: string;
  /** 是否圆角 */
  rounded?: boolean;
  /** 是否显示边框 */
  border?: boolean;
  /** 自定义类名 */
  className?: string;
}

const MouseFollower: React.FC<MouseFollowerProps> = ({ enabled = true, image, width = 120, height = 120, smooth = true, speed = 20, offsetX = -10, offsetY = -40, opacity = 0.8, color = "", rounded = true, border = true, className = "" }) => {
  const followerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  // 鼠标位置
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  // 图片加载状态
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 重置位置当关闭时
  useEffect(() => {
    if (!enabled) {
      if (followerRef.current) {
        followerRef.current.style.opacity = "0";
      }
    }
  }, [enabled]);

  // 图片加载处理
  useEffect(() => {
    if (!image) {
      setImageLoaded(false);
      return;
    }

    const img = new Image();
    img.src = image;
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
  }, [image]);

  // 鼠标事件处理
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      mousePos.current = { x: touch.clientX, y: touch.clientY };
    };

    document.addEventListener("mousemove", handleMouseMove);
    // document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      // document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [enabled]);

  // 动画循环
  useEffect(() => {
    if (!enabled) return;

    const animate = () => {
      if (!followerRef.current) return;

      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      if (smooth) {
        // 平滑跟随
        const ease = Math.min(1, (speed / 10) * 0.15);
        currentPos.current.x += (targetX - currentPos.current.x) * ease;
        currentPos.current.y += (targetY - currentPos.current.y) * ease;
      } else {
        // 直接跟随
        currentPos.current.x = targetX;
        currentPos.current.y = targetY;
      }

      // 应用位置和偏移
      followerRef.current.style.left = `${currentPos.current.x}px`;
      followerRef.current.style.top = `${currentPos.current.y}px`;
      followerRef.current.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, smooth, speed, offsetX, offsetY]);

  if (!enabled) return null;

  return (
    <div
      ref={followerRef}
      className={`
        fixed pointer-events-none z-9999
        transition-opacity duration-200
        ${className}
      `}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        opacity: imageLoaded || !image ? opacity : 0.5,
        left: 0,
        top: 0,
        willChange: "transform, left, top",
      }}
    >
      {/* {image && imageLoaded && !imageError ? (
        // 自定义图片
        <motion.img
          src={image}
          alt="follower"
          className="w-full h-full object-contain select-none"
          draggable={false}
          animate={{ rotate: 360 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ) : (
        // 默认色块
        <div
          className={`
            w-full h-full
            ${rounded ? "rounded-full" : "rounded-md"}
            ${border ? "border-2 border-white" : ""}
            shadow-lg
          `}
          style={{
            backgroundColor: color,
            boxShadow: `0 4px 20px ${color}80`,
          }}
        />
      )} */}
      <div className="relative  flex-center">
        <motion.img
          src={stamp}
          alt="follower"
          className="absolute w-full h-full object-contain select-none"
          draggable={false}
          animate={{ rotate: 360 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.img src={dollarsign} className="  w-full h-full object-contain select-none" />
      </div>
    </div>
  );
};

export default MouseFollower;
