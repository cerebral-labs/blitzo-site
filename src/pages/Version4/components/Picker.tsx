import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";

/**
 * 惯性/回弹 Picker 组件 (React)
 * @param {Object} props
 * @param {string[]} props.options - 选项数组，例如 ['00','01',...]
 * @param {string} [props.value] - 当前选中值（受控）
 * @param {function} [props.onChange] - 选中变化回调，参数为选中项的值
 * @param {number} [props.itemHeight=60] - 每个选项的高度(px)
 * @param {number} [props.visibleCount=5] - 可见选项个数（影响容器高度）
 * @param {string} [props.className] - 附加容器类名
 */
const Picker = ({
  options,
  value,
  onChange,
  itemHeight = 120,
  visibleCount = options.length,
  className = "",
}) => {
  // --- 计算容器高度 ---
  //   const containerHeight = itemHeight * visibleCount;
  const containerHeight = itemHeight * visibleCount;

  // --- DOM refs ---
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const displayRef = useRef(null); // 用于显示当前选中值的元素

  // --- 动画/拖拽状态 refs (避免触发渲染) ---
  const rafIdRef = useRef(null);
  const animatingRef = useRef(false);
  const draggingRef = useRef(false);

  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);

  const currentOffsetRef = useRef(0); // 当前列表translateY

  // --- 边界计算 (依赖options长度、itemHeight) ---
  const { offsetMin, offsetMax, softMin, softMax, baseOffsetForIndex0 } =
    useMemo(() => {
      const total = options.length;
      // 高亮条位于容器正中央
      const highlightCenterY = containerHeight / 2; // 180
      const itemCenterOffset = itemHeight / 2; // 30
      // 索引0居中时的基准偏移
      const base = highlightCenterY - itemCenterOffset; // 150

      const min = base; // 最上面一项居中
      const max = base - (total - 1) * itemHeight; // 最下面一项居中

      const overflow = itemHeight; // 允许拉出的最大距离 (使用一个选项高度)
      const softMinLimit = min + overflow;
      const softMaxLimit = max - overflow;

      return {
        offsetMin: min,
        offsetMax: max,
        softMin: softMinLimit,
        softMax: softMaxLimit,
        baseOffsetForIndex0: base,
      };
    }, [options.length, itemHeight, containerHeight]);

  // --- 工具函数：限制在软边界内 (拖动时) ---
  const clampToSoft = useCallback(
    (offset) => Math.min(softMin, Math.max(softMax, offset)),
    [softMin, softMax],
  );

  // --- 工具函数：限制在硬边界内 (回弹目标) ---
  const clampToHard = useCallback(
    (offset) => Math.min(offsetMin, Math.max(offsetMax, offset)),
    [offsetMin, offsetMax],
  );

  // --- 根据偏移更新列表位置 和 显示文本 ---
  const setOffset = useCallback(
    (offset, updateDisplay = true) => {
      if (listRef.current) {
        listRef.current.style.transform = `translateY(${offset}px)`;
      }
      currentOffsetRef.current = offset;

      if (updateDisplay && displayRef.current) {
        const rawIndex = (baseOffsetForIndex0 - offset) / itemHeight;
        let index = Math.round(rawIndex);
        index = Math.max(0, Math.min(options.length - 1, index));
        displayRef.current.innerText = options[index];
      }
    },
    [baseOffsetForIndex0, itemHeight, options],
  );

  // --- 动画到指定偏移 (缓动) ---
  const animateTo = useCallback(
    (targetOffset, duration) => {
      if (animatingRef.current) {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        animatingRef.current = false;
      }

      animatingRef.current = true;
      const startOffset = currentOffsetRef.current;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const newOffset =
          startOffset + (targetOffset - startOffset) * easeProgress;
        setOffset(newOffset, true);

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(step);
        } else {
          setOffset(targetOffset, true);
          animatingRef.current = false;
          rafIdRef.current = null;
        }
      };

      rafIdRef.current = requestAnimationFrame(step);
    },
    [setOffset],
  );

  // --- 对齐到最近选项，或回弹边界 ---
  const snapOrBound = useCallback(() => {
    const current = currentOffsetRef.current;
    // 越界回弹
    if (current > offsetMin || current < offsetMax) {
      const target = clampToHard(current);
      animateTo(target, 200);
      return;
    }

    // 边界内，吸附到最近索引
    const rawIndex = (baseOffsetForIndex0 - current) / itemHeight;
    let targetIndex = Math.round(rawIndex);
    targetIndex = Math.max(0, Math.min(options.length - 1, targetIndex));
    const targetOffset = baseOffsetForIndex0 - targetIndex * itemHeight;

    if (Math.abs(targetOffset - current) < 0.5) {
      setOffset(targetOffset, true);
    } else {
      animateTo(targetOffset, 180);
    }

    // 触发外部onChange (最终选中)
    if (onChange) {
      onChange(options[targetIndex]);
    }
  }, [
    offsetMin,
    offsetMax,
    baseOffsetForIndex0,
    itemHeight,
    options,
    animateTo,
    clampToHard,
    setOffset,
    onChange,
  ]);

  // --- 惯性动画 ---
  const startInertia = useCallback(
    (initialVelocity) => {
      if (animatingRef.current) return;
      if (Math.abs(initialVelocity) < 0.05) {
        snapOrBound();
        return;
      }

      animatingRef.current = true;
      const deceleration = 0.97;
      const threshold = 0.1;
      let vel = initialVelocity * 16; // 粗略转换为 px/帧
      let lastTimestamp = performance.now();

      const step = (now) => {
        if (!animatingRef.current) return;
        const deltaTime = Math.min(30, now - lastTimestamp);
        lastTimestamp = now;

        let delta = vel * (deltaTime / 16);
        let newOffset = currentOffsetRef.current + delta;

        // 超出硬边界则停止惯性，回弹
        if (newOffset > offsetMin || newOffset < offsetMax) {
          animatingRef.current = false;
          if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
          const target = clampToHard(newOffset);
          animateTo(target, 250);
          return;
        }

        setOffset(newOffset, true);
        vel *= deceleration;

        if (
          Math.abs(vel) > threshold &&
          currentOffsetRef.current <= offsetMin &&
          currentOffsetRef.current >= offsetMax
        ) {
          rafIdRef.current = requestAnimationFrame(step);
        } else {
          animatingRef.current = false;
          if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
          snapOrBound();
        }
      };

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(step);
    },
    [offsetMin, offsetMax, snapOrBound, animateTo, clampToHard, setOffset],
  );

  // --- 事件处理 ---
  const handleStart = useCallback((e) => {
    e.preventDefault();
    // 取消进行中的动画
    if (animatingRef.current) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      animatingRef.current = false;
      rafIdRef.current = null;
    }

    draggingRef.current = true;
    const clientY = e.type === "mousedown" ? e.clientY : e.touches[0].clientY;
    startYRef.current = clientY;
    lastYRef.current = clientY;
    lastTimeRef.current = performance.now();
    startOffsetRef.current = currentOffsetRef.current;
    velocityRef.current = 0;
  }, []);

  const handleMove = useCallback(
    (e) => {
      if (!draggingRef.current) return;
      e.preventDefault();

      const clientY = e.type === "mousemove" ? e.clientY : e.touches[0].clientY;
      const now = performance.now();
      const deltaY = clientY - lastYRef.current;
      const deltaTime = now - lastTimeRef.current;

      if (deltaTime > 5) {
        velocityRef.current = deltaY / deltaTime; // px/ms
      }

      const totalDelta = clientY - startYRef.current;
      let newOffset = startOffsetRef.current + totalDelta;
      newOffset = clampToSoft(newOffset);

      setOffset(newOffset, true);

      lastYRef.current = clientY;
      lastTimeRef.current = now;
    },
    [clampToSoft, setOffset],
  );

  const handleEnd = useCallback(
    (e) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      draggingRef.current = false;

      if (Math.abs(velocityRef.current) > 0.1) {
        startInertia(velocityRef.current);
      } else {
        snapOrBound();
      }

      velocityRef.current = 0;
    },
    [snapOrBound, startInertia],
  );

  const handleCancel = useCallback(() => {
    if (draggingRef.current) {
      draggingRef.current = false;
      snapOrBound();
    }
  }, [snapOrBound]);

  // --- 移动到指定索引 (用于外部value变化) ---
  const goToIndex = useCallback(
    (index) => {
      if (!options.length) return;
      const validIndex = Math.max(0, Math.min(options.length - 1, index));
      const targetOffset = baseOffsetForIndex0 - validIndex * itemHeight;
      // 如果正在拖动/动画，立即取消动画并跳转
      if (animatingRef.current) {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        animatingRef.current = false;
        rafIdRef.current = null;
      }
      setOffset(targetOffset, true);
      if (onChange) onChange(options[validIndex]); // 可选：同步外部
    },
    [options, baseOffsetForIndex0, itemHeight, setOffset, onChange],
  );

  // --- 挂载事件监听 & 初始化 ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 初始化位置：根据外部value，如果没有则默认中间索引
    let initialIndex = 0;
    if (value !== undefined) {
      const idx = options.indexOf(value);
      if (idx !== -1) initialIndex = idx;
    } else {
      // 默认中间
      initialIndex = Math.floor(options.length / 2);
    }
    const initOffset = baseOffsetForIndex0 - initialIndex * itemHeight;
    setOffset(initOffset, true);

    // 添加事件监听
    container.addEventListener("mousedown", handleStart);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    container.addEventListener("mouseleave", handleEnd); // 鼠标离开容器结束

    container.addEventListener("touchstart", handleStart, { passive: false });
    container.addEventListener("touchmove", handleMove, { passive: false });
    container.addEventListener("touchend", handleEnd);
    container.addEventListener("touchcancel", handleCancel);

    // 禁止拖拽选中
    document.addEventListener("dragstart", (e) => e.preventDefault());

    return () => {
      container.removeEventListener("mousedown", handleStart);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      container.removeEventListener("mouseleave", handleEnd);

      container.removeEventListener("touchstart", handleStart);
      container.removeEventListener("touchmove", handleMove);
      container.removeEventListener("touchend", handleEnd);
      container.removeEventListener("touchcancel", handleCancel);

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [
    options,
    value,
    baseOffsetForIndex0,
    itemHeight,
    handleStart,
    handleMove,
    handleEnd,
    handleCancel,
    setOffset,
  ]);

  // --- 受控value变化时更新位置 ---
  useEffect(() => {
    if (value !== undefined) {
      const idx = options.indexOf(value);
      if (idx !== -1) {
        goToIndex(idx);
      }
    }
  }, [value, options, goToIndex]);

  // --- 动态样式 (使itemHeight和containerHeight生效) ---
  const styleTag = `
    .picker-container-${itemHeight} {
      height: ${containerHeight}px;
    }
    .picker-item-${itemHeight} {
      height: ${itemHeight}px;
      font-size: ${itemHeight * 0.4}px; /* 粗略适配字号 */
    }
    .picker-highlight-${itemHeight} {
      height: ${itemHeight}px;
    }
  `;

  return (
    <div className={`picker-card ${className}`}>
      <style>{styleTag}</style>
      <div
        ref={containerRef}
        className={`picker-container picker-container-${itemHeight}`}
        style={{
          position: "relative",
          width: "80px",
          background: "#ffffffdd",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.6)",
          touchAction: "none",
        }}
      >
        <div
          ref={listRef}
          className="picker-list"
          style={{
            position: "absolute",
            width: "100%",
            top: 0,
            left: 0,
            willChange: "transform",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt}
              className={`picker-item picker-item-${itemHeight} bg-red`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
                color: "#1e293b",
                borderBottom: "1px solid rgba(0,0,0,0.02)",
                borderTop: "1px solid rgba(255,255,255,0.7)",
                backdropFilter: "blur(2px)",
              }}
            >
              {opt}
            </div>
          ))}
        </div>
        {/* 高亮条 */}
        <div
          className={`picker-highlight picker-highlight-${itemHeight}`}
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            right: "10px",
            transform: "translateY(-50%)",
            background: "rgba(135, 206, 250, 0.15)",
            border: "1px solid rgba(0, 120, 255, 0.25)",
            pointerEvents: "none",
            zIndex: 2,
            boxSizing: "border-box",
          }}
        />
        {/* 上下渐隐遮罩 */}
        {/* <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: itemHeight * 1.5,
            background:
              "linear-gradient(to bottom, #ffffff 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 3,
            borderRadius: "32px 32px 0 0",
          }}
        /> */}
        {/* <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: itemHeight * 1.5,
            background: "linear-gradient(to top, #ffffff 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 3,
            borderRadius: "0 0 32px 32px",
          }}
        /> */}
      </div>
      {/* <div
        className="footer"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 0,
        }}
      >
        <span
          ref={displayRef}
          className="selected-value"
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            color: "#0b2b4a",
            background: "#ffffffaa",
            padding: "10px 30px",
            borderRadius: 40,
            backdropFilter: "blur(5px)",
          }}
        >
          {options[Math.floor(options.length / 2)]}
        </span>
      </div> */}
    </div>
  );
};

// 默认导出
export default Picker;

// 使用示例 (可单独运行)
/*
import React, { useState } from 'react';
import Picker from './Picker';

const App = () => {
  const options = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const [val, setVal] = useState('12');
  return (
    <Picker
      options={options}
      value={val}
      onChange={(v) => setVal(v)}
      itemHeight={60}
      visibleCount={5}
    />
  );
};
*/
