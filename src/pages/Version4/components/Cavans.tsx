import React, { useCallback, useEffect, useRef, useState } from "react";

// 导入本地图片资源
import s1 from "@/assets/version4/s1.png";
import s2 from "@/assets/version4/s2.png";
import s3 from "@/assets/version4/s3.png";
import s4 from "@/assets/version4/s4.png";
import s5 from "@/assets/version4/s5.png";
import s6 from "@/assets/version4/s6.png";
import s7 from "@/assets/version4/s7.png";
import s8 from "@/assets/version4/s8.png";
import s9 from "@/assets/version4/s9.png";
import s10 from "@/assets/version4/s10.png";

const localImages = [
  { img: s1, title: "A" },
  { img: s2, title: "B" },
  { img: s3, title: "C" },
  { img: s4, title: "D" },
  { img: s5, title: "E" },
  { img: s6, title: "F" },
  { img: s7, title: "G" },
  { img: s8, title: "H" },
  { img: s9, title: "I" },
  { img: s10, title: "J" },
  { img: s1, title: "K" },
  { img: s2, title: "L" },
  { img: s3, title: "M" },
  { img: s4, title: "N" },
  { img: s5, title: "O" },
  { img: s6, title: "P" },
  { img: s7, title: "Q" },
  { img: s8, title: "R" },
  { img: s9, title: "S" },
  { img: s10, title: "T" },
];

interface StampGridProps {
  stampSize?: number;
  fadeEffect?: boolean;
  fadeDuration?: number;
  fadeDelay?: number;
  highlightCenter?: boolean;
  onChange?: (index: number) => void;
  initialFadeDuration?: number;
  onEnd?: () => void;
  showStampBorder?: boolean;
  showStampIndex?: boolean;

  friction?: number;
  spring?: number;
  damping?: number;
  wheelForce?: number;
  touchForce?: number;
  endTriggerDistance?: number;
  exitDuration?: number;

  snapForce?: number;
  snapVelocityThreshold?: number;
  snapDistanceThreshold?: number;
  wheelSnapDelay?: number;
}

interface GridInfo {
  cols: number;
  rows: number;
  centerCol: number;
  centerRow: number;
  offsetX: number;
  offsetY: number;
  cellSize: number;
}

interface RandomCell {
  col: number;
  row: number;
  stampIndex: number;
}

type FadeStateType = "fadeIn" | "show" | "fadeOut";

interface FadeItem {
  id: number;
  cell: RandomCell;
  alpha: number;
  state: FadeStateType;
  timer: number;
}

interface ScrollLimits {
  minScroll: number;
  maxScroll: number;
}

interface MotionState {
  scrollOffset: number;
  velocity: number;
  isDragging: boolean;
  isSnapping: boolean;
  snapTarget: number;
  endOverscroll: number;
  lastWheelTime: number;
  lastTouchY: number;
  lastTouchTime: number;
}

interface ExitState {
  progress: number;
  isExiting: boolean;
  isFinished: boolean;
}

interface InitialFadeState {
  startTime: number;
  isComplete: boolean;
}

interface FadePoolState {
  items: FadeItem[];
  lastSpawnTime: number;
  nextId: number;
}

const MAX_FADE_ITEMS = 4;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getNow() {
  return performance.now();
}

function createInitialGrid(cellSize: number): GridInfo {
  return {
    cols: 9,
    rows: 9,
    centerCol: 4,
    centerRow: 4,
    offsetX: 0,
    offsetY: 0,
    cellSize,
  };
}

function createInitialMotion(): MotionState {
  return {
    scrollOffset: 0,
    velocity: 0,
    isDragging: false,
    isSnapping: false,
    snapTarget: 0,
    endOverscroll: 0,
    lastWheelTime: 0,
    lastTouchY: 0,
    lastTouchTime: 0,
  };
}

function createInitialExit(): ExitState {
  return {
    progress: 0,
    isExiting: false,
    isFinished: false,
  };
}

function createInitialFadeState(): InitialFadeState {
  return {
    startTime: 0,
    isComplete: false,
  };
}

function createInitialFadePool(): FadePoolState {
  return {
    items: [],
    lastSpawnTime: 0,
    nextId: 1,
  };
}

async function loadStampImages() {
  const imagePromises = localImages.map(
    (item) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = String(item.img);
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`图片加载失败: ${item.title}`));
      }),
  );

  return Promise.all(imagePromises);
}

const StampGrid: React.FC<StampGridProps> = ({
  stampSize = 80,
  fadeEffect = false,
  fadeDuration = 800,
  fadeDelay = 1200,
  highlightCenter = false,
  initialFadeDuration = 2000,
  onChange,
  onEnd,
  showStampBorder = true,
  showStampIndex = true,

  friction = 0.92,
  spring = 0.08,
  damping = 0.82,
  wheelForce = 0.42,
  touchForce = 1,
  endTriggerDistance = 110,
  exitDuration = 800,

  snapForce = 0.1,
  snapVelocityThreshold = 0.12,
  snapDistanceThreshold = 0.8,
  wheelSnapDelay = 120,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const exitRafRef = useRef<number | null>(null);

  const [stamps, setStamps] = useState<HTMLImageElement[]>([]);

  const gridRef = useRef<GridInfo>(createInitialGrid(stampSize));
  const motionRef = useRef<MotionState>(createInitialMotion());
  const exitRef = useRef<ExitState>(createInitialExit());
  const initialFadeRef = useRef<InitialFadeState>(createInitialFadeState());
  const fadePoolRef = useRef<FadePoolState>(createInitialFadePool());

  const isFinishingRef = useRef(false);
  const lastHitIndexRef = useRef(-999);
  const wheelLockRef = useRef(false);

  const cancelRafs = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (exitRafRef.current !== null) {
      cancelAnimationFrame(exitRaf.current);
      exitRafRef.current = null;
    }
  }, []);

  const isLocked = useCallback(() => {
    return isFinishingRef.current || exitRef.current.isFinished;
  }, []);

  const computeGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const w = canvas?.clientWidth || window.innerWidth;
    const h = canvas?.clientHeight || window.innerHeight;

    let cols = Math.ceil(w / stampSize);
    let rows = Math.ceil(h / stampSize);

    if (cols % 2 === 0) cols += 1;
    if (rows % 2 === 0) rows += 1;

    gridRef.current = {
      cols,
      rows,
      centerCol: Math.floor(cols / 2),
      centerRow: Math.floor(rows / 2),
      offsetX: (w - cols * stampSize) / 2,
      offsetY: (h - rows * stampSize) / 2,
      cellSize: stampSize,
    };
  }, [stampSize]);

  const getScrollLimits = useCallback((): ScrollLimits => {
    if (stamps.length === 0) {
      return { minScroll: 0, maxScroll: 0 };
    }

    const grid = gridRef.current;
    const cell = grid.cellSize;

    const hitCenterY = grid.offsetY + (grid.centerRow + 0.5) * cell;
    const firstStampCenterY = grid.offsetY + 0.5 * cell;
    const lastStampCenterY = grid.offsetY + (stamps.length - 0.5) * cell;

    return {
      minScroll: Math.min(0, firstStampCenterY - hitCenterY),
      maxScroll: Math.max(0, lastStampCenterY - hitCenterY),
    };
  }, [stamps.length]);

  const getNearestSnapOffset = useCallback(
    (offset: number) => {
      const { minScroll, maxScroll } = getScrollLimits();
      const snapped = Math.round(offset / stampSize) * stampSize;
      return clamp(snapped, minScroll, maxScroll);
    },
    [getScrollLimits, stampSize],
  );

  const getHitStampIndex = useCallback(
    (scrollOffset: number) => {
      if (stamps.length === 0) return -1;

      const grid = gridRef.current;
      const hitGridCenterY = grid.offsetY + (grid.centerRow + 0.5) * stampSize;
      const rawIndex =
        (hitGridCenterY - grid.offsetY + scrollOffset) / stampSize;
      const index = Math.floor(rawIndex);

      return index >= 0 && index < stamps.length ? index : -1;
    },
    [stamps.length, stampSize],
  );

  const emitHitChange = useCallback(
    (offset: number) => {
      const index = getHitStampIndex(offset);
      if (index !== lastHitIndexRef.current) {
        lastHitIndexRef.current = index;
        onChange?.(index);
      }
    },
    [getHitStampIndex, onChange],
  );

  const resetRuntimeState = useCallback(() => {
    motionRef.current = createInitialMotion();
    exitRef.current = createInitialExit();
    initialFadeRef.current = createInitialFadeState();
    fadePoolRef.current = createInitialFadePool();
    isFinishingRef.current = false;
    lastHitIndexRef.current = -999;
    wheelLockRef.current = false;
  }, []);

  const triggerExit = useCallback(() => {
    if (isFinishingRef.current || exitRef.current.isFinished) return;

    isFinishingRef.current = true;

    const motion = motionRef.current;
    const exit = exitRef.current;

    motion.velocity = 0;
    motion.isDragging = false;
    motion.isSnapping = false;

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    exit.progress = 0;
    exit.isExiting = true;
    exit.isFinished = false;

    const startTime = getNow();

    const animateExit = (time: number) => {
      const elapsed = time - startTime;
      exit.progress = Math.min(1, elapsed / exitDuration);

      if (elapsed < exitDuration) {
        exitRafRef.current = requestAnimationFrame(animateExit);
        return;
      }

      exit.progress = 1;
      exit.isExiting = false;
      exit.isFinished = true;
      exitRafRef.current = null;
      onEnd?.();
    };

    exitRafRef.current = requestAnimationFrame(animateExit);
  }, [exitDuration, onEnd]);

  const createRandomFadeCell = useCallback((): RandomCell | null => {
    if (stamps.length === 0) return null;

    const { cols, rows } = gridRef.current;
    const occupied = new Set(
      fadePoolRef.current.items.map(
        (item) => `${item.cell.col}-${item.cell.row}`,
      ),
    );

    const totalCells = cols * rows;
    const maxTry = Math.min(totalCells, 100);

    for (let i = 0; i < maxTry; i += 1) {
      const col = Math.floor(Math.random() * cols);
      const row = Math.floor(Math.random() * rows);
      const key = `${col}-${row}`;

      if (!occupied.has(key)) {
        return {
          col,
          row,
          stampIndex: Math.floor(Math.random() * stamps.length),
        };
      }
    }

    return {
      col: Math.floor(Math.random() * cols),
      row: Math.floor(Math.random() * rows),
      stampIndex: Math.floor(Math.random() * stamps.length),
    };
  }, [stamps.length]);

  const spawnRandomFadeItem = useCallback(
    (spawnTime?: number) => {
      if (!fadeEffect || stamps.length === 0) return;

      const now = spawnTime ?? getNow();
      const pool = fadePoolRef.current;

      // 当前还在屏幕上的项（show + fadeIn）
      const visibleItems = pool.items.filter(
        (item) => item.state === "show" || item.state === "fadeIn",
      );

      // 如果已满，先让最老的 show 项淡出
      if (visibleItems.length >= MAX_FADE_ITEMS) {
        const oldestShowItem = pool.items.find((item) => item.state === "show");

        if (oldestShowItem) {
          oldestShowItem.state = "fadeOut";
          oldestShowItem.timer = now;
        }
      }

      const cell = createRandomFadeCell();
      if (!cell) return;

      pool.items.push({
        id: pool.nextId,
        cell,
        alpha: 0,
        state: "fadeIn",
        timer: now,
      });

      pool.nextId += 1;
      pool.lastSpawnTime = now;
    },
    [fadeEffect, stamps.length, createRandomFadeCell],
  );

  const syncCanvasSize = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      return { width, height };
    },
    [],
  );

  const drawGridLines = useCallback(
    (ctx: CanvasRenderingContext2D, grid: GridInfo) => {
      const { cols, rows, offsetX, offsetY, cellSize } = grid;

      ctx.strokeStyle = "rgba(200, 220, 240, 0.3)";
      ctx.lineWidth = 1;

      for (let c = 0; c <= cols; c += 1) {
        const x = offsetX + c * cellSize;
        ctx.beginPath();
        ctx.moveTo(x, offsetY);
        ctx.lineTo(x, offsetY + rows * cellSize);
        ctx.stroke();
      }

      for (let r = 0; r <= rows; r += 1) {
        const y = offsetY + r * cellSize;
        ctx.beginPath();
        ctx.moveTo(offsetX, y);
        ctx.lineTo(offsetX + cols * cellSize, y);
        ctx.stroke();
      }
    },
    [],
  );

  const drawCenterHighlight = useCallback(
    (ctx: CanvasRenderingContext2D, grid: GridInfo) => {
      const { offsetX, offsetY, centerCol, centerRow, cellSize } = grid;

      ctx.fillStyle = "rgba(255, 215, 100, 0.2)";
      ctx.fillRect(
        offsetX + centerCol * cellSize,
        offsetY + centerRow * cellSize,
        cellSize,
        cellSize,
      );

      ctx.strokeStyle = "#ff6b6b";
      ctx.lineWidth = 3;
      ctx.strokeRect(
        offsetX + centerCol * cellSize,
        offsetY + centerRow * cellSize,
        cellSize,
        cellSize,
      );
    },
    [],
  );

  const drawStamp = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      x: number,
      y: number,
      size: number,
      index: number,
      alpha: number,
    ) => {
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, x, y, size, size);

      if (showStampIndex) {
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${size * 0.2}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`#${index + 1}`, x + size / 2, y + size / 2);
      }

      if (showStampBorder) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);
      }

      ctx.globalAlpha = 1;
    },
    [showStampBorder, showStampIndex],
  );

  const updateInitialFadeAlpha = useCallback(
    (time: number) => {
      const state = initialFadeRef.current;
      if (state.isComplete || state.startTime <= 0) return 1;

      const elapsed = time - state.startTime;
      const alpha = Math.min(1, elapsed / initialFadeDuration);

      if (elapsed >= initialFadeDuration) {
        state.isComplete = true;
        return 1;
      }

      return alpha;
    },
    [initialFadeDuration],
  );

  const updateFadePool = useCallback(
    (time: number) => {
      const pool = fadePoolRef.current;

      // 定时补一个新的
      if (pool.lastSpawnTime === 0 || time - pool.lastSpawnTime >= fadeDelay) {
        spawnRandomFadeItem(time);
      }

      for (let i = pool.items.length - 1; i >= 0; i -= 1) {
        const item = pool.items[i];
        const elapsed = time - item.timer;

        if (item.state === "fadeIn") {
          item.alpha = Math.min(1, elapsed / fadeDuration);

          if (elapsed >= fadeDuration) {
            item.alpha = 1;
            item.state = "show";
            item.timer = time;
          }
          continue;
        }

        if (item.state === "show") {
          // show 状态常驻，不自动淡出
          item.alpha = 1;
          continue;
        }

        if (item.state === "fadeOut") {
          item.alpha = Math.max(0, 1 - elapsed / fadeDuration);

          if (elapsed >= fadeDuration) {
            pool.items.splice(i, 1);
          }
        }
      }
    },
    [fadeDelay, fadeDuration, spawnRandomFadeItem],
  );

  const updatePhysics = useCallback(() => {
    const motion = motionRef.current;
    const { minScroll, maxScroll } = getScrollLimits();

    // 仅 touch 拖拽结束后继续走物理系统
    if (!motion.isDragging && !exitRef.current.isFinished) {
      if (motion.isSnapping) {
        const dist = motion.snapTarget - motion.scrollOffset;

        motion.velocity += dist * snapForce;
        motion.velocity *= 0.82;
        motion.scrollOffset += motion.velocity;

        if (
          Math.abs(dist) < snapDistanceThreshold &&
          Math.abs(motion.velocity) < snapVelocityThreshold
        ) {
          motion.scrollOffset = motion.snapTarget;
          motion.velocity = 0;
          motion.isSnapping = false;
        }
      } else if (Math.abs(motion.velocity) > 0.001) {
        motion.scrollOffset += motion.velocity;
        motion.velocity *= friction;

        if (Math.abs(motion.velocity) < 0.03) {
          motion.velocity = 0;
        }
      }
    }

    // 仅在 touch 场景下做边界回弹
    if (
      !motion.isDragging &&
      !motion.isSnapping &&
      Math.abs(motion.velocity) > 0
    ) {
      if (motion.scrollOffset < minScroll) {
        const dist = minScroll - motion.scrollOffset;
        motion.velocity += dist * spring;
        motion.velocity *= damping;
      } else if (motion.scrollOffset > maxScroll) {
        const dist = maxScroll - motion.scrollOffset;
        motion.velocity += dist * spring;
        motion.velocity *= damping;
      }
    }

    const hardMin = minScroll - stampSize * 0.4;
    const hardMax = maxScroll + stampSize * 0.4;
    motion.scrollOffset = clamp(motion.scrollOffset, hardMin, hardMax);

    emitHitChange(motion.scrollOffset);
  }, [
    damping,
    emitHitChange,
    friction,
    getScrollLimits,
    snapDistanceThreshold,
    snapForce,
    snapVelocityThreshold,
    spring,
    stampSize,
  ]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const images = await loadStampImages();
        if (!mounted) return;

        setStamps(images);
        resetRuntimeState();
        initialFadeRef.current.startTime = getNow();
      } catch (error) {
        console.error(error);
      }
    };

    init();

    return () => {
      mounted = false;
      cancelRafs();
    };
  }, [cancelRafs, resetRuntimeState]);

  useEffect(() => {
    const pool = fadePoolRef.current;
    pool.items = [];
    pool.lastSpawnTime = 0;

    if (fadeEffect && stamps.length > 0) {
      spawnRandomFadeItem();
    }
  }, [fadeEffect, stamps.length, spawnRandomFadeItem]);

  useEffect(() => {
    const handleResize = () => {
      computeGrid();

      const motion = motionRef.current;
      const { minScroll, maxScroll } = getScrollLimits();

      motion.scrollOffset = clamp(motion.scrollOffset, minScroll, maxScroll);
      motion.velocity = 0;
      motion.isSnapping = false;
      motion.snapTarget = motion.scrollOffset;

      emitHitChange(motion.scrollOffset);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [computeGrid, emitHitChange, getScrollLimits]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stamps.length === 0) return;

    const handleWheel = (e: WheelEvent) => {
      if (isLocked()) return;
      e.preventDefault();

      // 防止某些鼠标/触控板一次滚动触发多次，导致连续跳多格
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      requestAnimationFrame(() => {
        wheelLockRef.current = false;
      });

      const motion = motionRef.current;
      const { minScroll, maxScroll } = getScrollLimits();

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextOffset = clamp(
        motion.scrollOffset + direction * stampSize,
        minScroll,
        maxScroll,
      );

      const isAtEnd = motion.scrollOffset >= maxScroll - 0.5;

      // 关键：wheel 不再进入物理系统
      motion.velocity = 0;
      motion.isSnapping = false;
      motion.snapTarget = nextOffset;
      motion.lastWheelTime = getNow();
      motion.scrollOffset = nextOffset;

      if (isAtEnd && direction > 0) {
        motion.endOverscroll += stampSize;
        if (motion.endOverscroll >= endTriggerDistance) {
          triggerExit();
          return;
        }
      } else {
        motion.endOverscroll = 0;
      }

      emitHitChange(motion.scrollOffset);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isLocked() || e.touches.length === 0) return;

      const motion = motionRef.current;
      motion.isDragging = true;
      motion.isSnapping = false;
      motion.velocity = 0;
      motion.endOverscroll = 0;
      motion.lastTouchY = e.touches[0].clientY;
      motion.lastTouchTime = getNow();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      e.preventDefault();

      if (isLocked()) return;

      const motion = motionRef.current;
      if (!motion.isDragging) return;

      const now = getNow();
      const currentY = e.touches[0].clientY;
      const dy = motion.lastTouchY - currentY;
      const dt = Math.max(1, now - motion.lastTouchTime);

      const { minScroll, maxScroll } = getScrollLimits();
      const proposed = motion.scrollOffset + dy * touchForce;

      const isAtEnd = motion.scrollOffset >= maxScroll - 0.5;
      if (isAtEnd && dy > 0) {
        motion.endOverscroll += dy;
        if (motion.endOverscroll >= endTriggerDistance) {
          triggerExit();
          return;
        }
      } else {
        motion.endOverscroll = 0;
      }

      const dragMin = minScroll - stampSize * 0.35;
      const dragMax = maxScroll + stampSize * 0.35;

      motion.scrollOffset = clamp(proposed, dragMin, dragMax);
      motion.velocity = (dy / dt) * 16;
      motion.lastTouchY = currentY;
      motion.lastTouchTime = now;

      emitHitChange(motion.scrollOffset);
    };

    const handleTouchEnd = () => {
      if (isLocked()) return;

      const motion = motionRef.current;
      motion.isDragging = false;
      motion.snapTarget = getNearestSnapOffset(motion.scrollOffset);
      motion.isSnapping = true;
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
    canvas.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [
    emitHitChange,
    endTriggerDistance,
    getNearestSnapOffset,
    getScrollLimits,
    isLocked,
    stamps.length,
    stampSize,
    touchForce,
    triggerExit,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stamps.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (time: number) => {
      const { width, height } = syncCanvasSize(ctx, canvas);
      ctx.clearRect(0, 0, width, height);

      updatePhysics();

      const grid = gridRef.current;
      const motion = motionRef.current;
      const exit = exitRef.current;
      const initialAlpha = updateInitialFadeAlpha(time);

      drawGridLines(ctx, grid);

      const { rows, centerCol, offsetX, offsetY, cellSize } = grid;
      const mainColumnX = offsetX + centerCol * cellSize;

      const shouldRenderMainColumn = !exit.isFinished;
      const shouldRenderRandomFade = fadeEffect && !exit.isExiting;

      const mainAlpha = exit.isExiting ? 1 - exit.progress : 1;

      if (shouldRenderMainColumn) {
        const visibleTop = motion.scrollOffset - cellSize;
        const visibleBottom = motion.scrollOffset + rows * cellSize + cellSize;

        const startIndex = Math.max(0, Math.floor(visibleTop / cellSize));
        const endIndex = Math.min(
          stamps.length - 1,
          Math.ceil(visibleBottom / cellSize),
        );

        for (let index = startIndex; index <= endIndex; index += 1) {
          const img = stamps[index];
          const topY = offsetY + index * cellSize - motion.scrollOffset;

          if (topY > height || topY + cellSize < 0) continue;

          drawStamp(
            ctx,
            img,
            mainColumnX,
            topY,
            cellSize,
            index,
            mainAlpha * initialAlpha,
          );
        }
      }

      if (highlightCenter && shouldRenderMainColumn) {
        drawCenterHighlight(ctx, grid);
      }

      if (shouldRenderRandomFade) {
        updateFadePool(time);

        for (const item of fadePoolRef.current.items) {
          if (item.alpha <= 0) continue;

          const { col, row, stampIndex } = item.cell;
          const x = offsetX + col * cellSize;
          const y = offsetY + row * cellSize;

          if (x > width || x + cellSize < 0 || y > height || y + cellSize < 0) {
            continue;
          }

          drawStamp(
            ctx,
            stamps[stampIndex],
            x,
            y,
            cellSize,
            stampIndex,
            item.alpha,
          );
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [
    drawCenterHighlight,
    drawGridLines,
    drawStamp,
    fadeEffect,
    stamps,
    syncCanvasSize,
    updateFadePool,
    updateInitialFadeAlpha,
    updatePhysics,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute z-10 w-full h-full"
      style={{
        touchAction: !fadeEffect ? "none" : "auto",
        pointerEvents: !fadeEffect ? "auto" : "none",
      }}
    />
  );
};

export default StampGrid;
