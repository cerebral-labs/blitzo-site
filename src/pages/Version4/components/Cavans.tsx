import React, { useEffect, useRef, useCallback } from "react";

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

import random1 from "@/assets/version4/stamp1.1.png";
import random2 from "@/assets/version4/stamp1.1.png";
import random3 from "@/assets/version4/stamp1.3.png";
import random4 from "@/assets/version4/stamp1.4.png";

type PickerItem = {
  img: string;
  title: string;
};

type StampGridCanvasProps = {
  /** 邮票尺寸，也就是网格尺寸 */
  stampSize?: number;
  /** 网格线颜色 */
  lineColor?: string;
  /** 网格线宽度（逻辑像素） */
  lineWidth?: number;
  /** 背景色 */
  backgroundColor?: string;
  /** 是否显示中心格高亮 */
  highlightCenter?: boolean;
  /** 中心格高亮色 */
  centerColor?: string;
  /** canvas 层级 */
  zIndex?: number;

  /** 是否开启随机图片淡入淡出 */
  enableRandomImages?: boolean;
  /** 图片资源列表 */
  images?: string[];
  /** 最大同时显示数量 */
  maxVisibleImages?: number;
  /** 每次生成新图片的间隔(ms) */
  spawnInterval?: number;
  /** 淡入时长(ms) */
  fadeInDuration?: number;
  /** 淡出时长(ms) */
  fadeOutDuration?: number;

  /** 是否开启 picker 展示列 */
  enablePicker?: boolean;
  /** picker 是否显示（true=显示，false=隐藏） */
  pickerVisible?: boolean;
  autoScrollRequest?: number;
  /** picker 邮票数据 */
  pickerItems?: PickerItem[];
  /** picker 单个邮票淡入时长 */
  pickerFadeInDuration?: number;
  /** picker 整列淡出时长 */
  pickerFadeOutDuration?: number;
  /** 从中心向两端依次入场的步进延迟 */
  pickerStepDelay?: number;

  /** picker index 改变时抛出 */
  onPickerChange?: (index: number, item: PickerItem | undefined) => void;
  /** picker 碰撞末尾边界时抛出 */
  onPickerEnd?: (index: number, item: PickerItem | undefined) => void;
};

type TileCache = {
  key: string;
  canvas: HTMLCanvasElement | OffscreenCanvas;
};

type LoadedImageMap = Map<string, HTMLImageElement>;

type AnimatedStamp = {
  id: number;
  src: string;
  img: HTMLImageElement;
  col: number;
  row: number;
  x: number;
  y: number;
  bornAt: number;
  fadeInStart: number;
  fadeOutStart: number | null;
  isFadingOut: boolean;
};

const DEFAULT_RANDOM_IMAGES = [random1, random2, random3, random4];

const DEFAULT_PICKER_ITEMS: PickerItem[] = [
  { title: "1", img: s1 },
  { title: "2", img: s2 },
  { title: "3", img: s3 },
  { title: "4", img: s4 },
  { title: "5", img: s5 },
  { title: "6", img: s6 },
  { title: "7", img: s7 },
  { title: "8", img: s8 },
  { title: "9", img: s9 },
  { title: "10", img: s10 },
  { title: "11", img: s1 },
  { title: "12", img: s2 },
  { title: "13", img: s3 },
  { title: "14", img: s4 },
  { title: "15", img: s5 },
  { title: "16", img: s6 },
  { title: "17", img: s7 },
  { title: "18", img: s8 },
  { title: "19", img: s9 },
  { title: "20", img: s10 },
];

export default function StampGridCanvas({
  stampSize = 80,
  lineColor = "#F8F8F8",
  lineWidth = 2,
  backgroundColor = "#fff",
  highlightCenter = false,
  centerColor = "rgba(0, 120, 255, 0.08)",
  zIndex = 1,

  enableRandomImages = false,
  images = DEFAULT_RANDOM_IMAGES,
  maxVisibleImages = 4,
  spawnInterval = 1000,
  fadeInDuration = 800,
  fadeOutDuration = 600,

  enablePicker = true,
  pickerVisible = true,
  autoScrollRequest = 0,
  pickerItems = DEFAULT_PICKER_ITEMS,
  pickerFadeInDuration = 400,
  pickerFadeOutDuration = 300,
  pickerStepDelay = 120,
  onPickerChange,
  onPickerEnd,
}: StampGridCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const tileCacheRef = useRef<TileCache | null>(null);

  const loadedImagesRef = useRef<LoadedImageMap>(new Map());
  const stampsRef = useRef<AnimatedStamp[]>([]);
  const lastSpawnTimeRef = useRef<number>(0);
  const stampIdRef = useRef<number>(0);

  const pickerImagesRef = useRef<LoadedImageMap>(new Map());

  /** picker 滚动物理状态（逻辑坐标系） */
  const pickerOffsetYRef = useRef<number>(0);
  const pickerVelocityYRef = useRef<number>(0);
  const pickerDraggingRef = useRef<boolean>(false);

  /** wheel 活动窗口：用于 Mac 触控板/滚轮持续输入时暂停吸附 */
  const wheelActiveUntilRef = useRef<number>(0);

  const lastTouchYRef = useRef<number>(0);
  const lastTouchTimeRef = useRef<number>(0);

  const lastFrameTimeRef = useRef<number>(0);
  const pickerSelectedIndexRef = useRef<number>(0);
  const pickerEndCollisionLockedRef = useRef<boolean>(false);
  const pickerStartCollisionLockedRef = useRef<boolean>(false);
  const pickerAutoScrollStateRef = useRef<"idle" | "running">("idle");
  const lastAutoScrollRequestRef = useRef<number>(autoScrollRequest);
  const onPickerChangeRef = useRef(onPickerChange);
  const onPickerEndRef = useRef(onPickerEnd);

  /** picker 展示阶段 */
  const pickerEnterStartAtRef = useRef<number>(performance.now());
  const pickerExitStartAtRef = useRef<number | null>(null);
  const pickerPhaseRef = useRef<"hidden" | "entering" | "visible" | "exiting">(
    pickerVisible ? "entering" : "hidden",
  );

  const getDpr = () => Math.max(1, window.devicePixelRatio || 1);

  useEffect(() => {
    onPickerChangeRef.current = onPickerChange;
  }, [onPickerChange]);

  useEffect(() => {
    onPickerEndRef.current = onPickerEnd;
  }, [onPickerEnd]);

  const resetRandomAnimationState = useCallback(() => {
    stampsRef.current = [];
    lastSpawnTimeRef.current = 0;
    stampIdRef.current = 0;
  }, []);

  const getGridInfo = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const centerX = vw / 2;
    const centerY = vh / 2;

    const originX = centerX - stampSize / 2;
    const originY = centerY - stampSize / 2;

    const cols = Math.ceil(vw / stampSize / 2) + 2;
    const rows = Math.ceil(vh / stampSize / 2) + 2;

    return {
      vw,
      vh,
      originX,
      originY,
      cols,
      rows,
      centerX,
      centerY,
    };
  }, [stampSize]);

  const getPickerCenterIndex = useCallback(() => {
    if (!pickerItems.length) return 0;
    return Math.floor((pickerItems.length - 1) / 2);
  }, [pickerItems.length]);

  /**
   * 只影响视觉绘制，不影响滚动逻辑
   * 目的：让初始时 picker 列从中间向两端铺开，而不是第 0 项直接占住中心
   */
  const getPickerRenderBaseOffset = useCallback(() => {
    return -getPickerCenterIndex() * stampSize;
  }, [getPickerCenterIndex, stampSize]);

  /**
   * 逻辑滚动范围：
   * 0 => 当前“视觉中心项”在中心
   * 往上滚可到第 0 项
   * 往下滚可到最后一项
   */
  const getPickerMinOffset = useCallback(() => {
    if (!pickerItems.length) return 0;
    const centerIndex = getPickerCenterIndex();
    return -(pickerItems.length - 1 - centerIndex) * stampSize;
  }, [pickerItems.length, stampSize, getPickerCenterIndex]);

  const getPickerMaxOffset = useCallback(() => {
    if (!pickerItems.length) return 0;
    const centerIndex = getPickerCenterIndex();
    return centerIndex * stampSize;
  }, [pickerItems.length, stampSize, getPickerCenterIndex]);

  const clampPickerOffset = useCallback(
    (value: number) => {
      const minOffset = getPickerMinOffset();
      const maxOffset = getPickerMaxOffset();
      return Math.max(minOffset, Math.min(maxOffset, value));
    },
    [getPickerMinOffset, getPickerMaxOffset],
  );

  const getClampedPickerIndex = useCallback(
    (index: number) => {
      if (!pickerItems.length) return 0;
      return Math.max(0, Math.min(pickerItems.length - 1, index));
    },
    [pickerItems.length],
  );

  const getSelectedIndexFromOffset = useCallback(
    (offset: number) => {
      const centerIndex = getPickerCenterIndex();
      return getClampedPickerIndex(
        centerIndex + Math.round(-offset / stampSize),
      );
    },
    [getPickerCenterIndex, getClampedPickerIndex, stampSize],
  );

  const getOffsetFromSelectedIndex = useCallback(
    (index: number) => {
      const centerIndex = getPickerCenterIndex();
      return -(index - centerIndex) * stampSize;
    },
    [getPickerCenterIndex, stampSize],
  );

  const setPickerSelectedIndex = useCallback(
    (nextIndex: number) => {
      const clampedIndex = getClampedPickerIndex(nextIndex);
      if (pickerSelectedIndexRef.current === clampedIndex) return;

      pickerSelectedIndexRef.current = clampedIndex;
      onPickerChangeRef.current?.(clampedIndex, pickerItems[clampedIndex]);
    },
    [getClampedPickerIndex, pickerItems],
  );

  const emitBoundaryCollision = useCallback(
    (direction: "start" | "end") => {
      if (!pickerItems.length) return;

      if (direction === "end") {
        if (pickerEndCollisionLockedRef.current) return;
        pickerEndCollisionLockedRef.current = true;
        onPickerEndRef.current?.(
          pickerItems.length - 1,
          pickerItems[pickerItems.length - 1],
        );
        return;
      }

      if (pickerStartCollisionLockedRef.current) return;
      pickerStartCollisionLockedRef.current = true;
    },
    [pickerItems],
  );

  const resetBoundaryCollisionLock = useCallback((position: number) => {
    if (position < 0) {
      pickerStartCollisionLockedRef.current = false;
    } else if (position > 0) {
      pickerEndCollisionLockedRef.current = false;
    } else {
      pickerStartCollisionLockedRef.current = false;
      pickerEndCollisionLockedRef.current = false;
    }
  }, []);

  const getPickerEnterDelay = useCallback(
    (index: number) => {
      if (!pickerItems.length) return 0;
      const centerIndex = Math.floor((pickerItems.length - 1) / 2);
      return Math.abs(index - centerIndex) * pickerStepDelay;
    },
    [pickerItems.length, pickerStepDelay],
  );

  const createTile = useCallback(
    (size: number, dpr: number) => {
      const cacheKey = `${size}_${dpr}_${lineColor}_${lineWidth}`;

      if (tileCacheRef.current?.key === cacheKey) {
        return tileCacheRef.current.canvas;
      }

      const pixelSize = Math.max(1, Math.round(size * dpr));

      let offscreen: HTMLCanvasElement | OffscreenCanvas;
      if (typeof OffscreenCanvas !== "undefined") {
        offscreen = new OffscreenCanvas(pixelSize, pixelSize);
      } else {
        const c = document.createElement("canvas");
        c.width = pixelSize;
        c.height = pixelSize;
        offscreen = c;
      }

      const ctx = offscreen.getContext("2d");
      if (!ctx) return null;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;

      const offset = lineWidth % 2 === 1 ? 0.5 : 0;
      const max = size - lineWidth / 2;

      ctx.beginPath();

      ctx.moveTo(max - offset, 0);
      ctx.lineTo(max - offset, size);

      ctx.moveTo(0, max - offset);
      ctx.lineTo(size, max - offset);

      ctx.stroke();

      tileCacheRef.current = {
        key: cacheKey,
        canvas: offscreen,
      };

      return offscreen;
    },
    [lineColor, lineWidth],
  );

  const loadImages = useCallback(async (srcList: string[]) => {
    const map = loadedImagesRef.current;

    const tasks = srcList.map((src) => {
      if (map.has(src)) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.onload = () => {
          map.set(src, img);
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = src;
      });
    });

    await Promise.all(tasks);
  }, []);

  const loadPickerImages = useCallback(async (items: PickerItem[]) => {
    const map = pickerImagesRef.current;

    const tasks = items.map((item) => {
      if (map.has(item.img)) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.onload = () => {
          map.set(item.img, img);
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = item.img;
      });
    });

    await Promise.all(tasks);
  }, []);

  const pickRandomCell = useCallback(() => {
    const { cols, rows, originX, originY } = getGridInfo();
    const active = stampsRef.current;

    const occupied = new Set(active.map((item) => `${item.col}_${item.row}`));

    const candidates: Array<{
      col: number;
      row: number;
      x: number;
      y: number;
    }> = [];

    for (let row = -rows; row <= rows; row++) {
      for (let col = -cols; col <= cols; col++) {
        const key = `${col}_${row}`;
        if (occupied.has(key)) continue;

        const x = originX + col * stampSize;
        const y = originY + row * stampSize;

        if (x >= window.innerWidth || x + stampSize <= 0) continue;
        if (y >= window.innerHeight || y + stampSize <= 0) continue;

        candidates.push({ col, row, x, y });
      }
    }

    if (!candidates.length) return null;

    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index];
  }, [getGridInfo, stampSize]);

  const spawnStamp = useCallback(
    (now: number) => {
      if (!enableRandomImages) return;
      if (!images.length) return;

      const loadedMap = loadedImagesRef.current;
      const availableSrcs = images.filter((src) => loadedMap.has(src));
      if (!availableSrcs.length) return;

      const cell = pickRandomCell();
      if (!cell) return;

      const src =
        availableSrcs[Math.floor(Math.random() * availableSrcs.length)];
      const img = loadedMap.get(src);
      if (!img) return;

      const nextList = [...stampsRef.current];

      const visibleNotFadingOut = nextList.filter((item) => !item.isFadingOut);
      if (visibleNotFadingOut.length >= maxVisibleImages) {
        const oldest = visibleNotFadingOut[0];
        oldest.isFadingOut = true;
        oldest.fadeOutStart = now;
      }

      nextList.push({
        id: ++stampIdRef.current,
        src,
        img,
        col: cell.col,
        row: cell.row,
        x: cell.x,
        y: cell.y,
        bornAt: now,
        fadeInStart: now,
        fadeOutStart: null,
        isFadingOut: false,
      });

      stampsRef.current = nextList;
    },
    [enableRandomImages, images, maxVisibleImages, pickRandomCell],
  );

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, dpr: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const tile = createTile(stampSize, dpr);
      if (!tile) return;

      const centerX = vw / 2;
      const centerY = vh / 2;

      const originX = centerX - stampSize / 2;
      const originY = centerY - stampSize / 2;

      const cols = Math.ceil(vw / stampSize / 2) + 2;
      const rows = Math.ceil(vh / stampSize / 2) + 2;

      for (let row = -rows; row <= rows; row++) {
        const y = originY + row * stampSize;
        if (y >= vh || y + stampSize <= 0) continue;

        for (let col = -cols; col <= cols; col++) {
          const x = originX + col * stampSize;
          if (x >= vw || x + stampSize <= 0) continue;
          ctx.drawImage(tile as CanvasImageSource, x, y, stampSize, stampSize);
        }
      }

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;

      const offset = lineWidth % 2 === 1 ? 0.5 : 0;

      const firstX =
        originX + Math.floor((0 - originX) / stampSize) * stampSize + offset;
      const firstY =
        originY + Math.floor((0 - originY) / stampSize) * stampSize + offset;

      ctx.beginPath();
      ctx.moveTo(firstX, 0);
      ctx.lineTo(firstX, vh);

      ctx.moveTo(0, firstY);
      ctx.lineTo(vw, firstY);
      ctx.stroke();

      if (highlightCenter) {
        ctx.fillStyle = centerColor;
        ctx.fillRect(originX, originY, stampSize, stampSize);
      }
    },
    [stampSize, lineColor, lineWidth, highlightCenter, centerColor, createTile],
  );

  const drawAnimatedStamps = useCallback(
    (ctx: CanvasRenderingContext2D, now: number) => {
      const nextStamps: AnimatedStamp[] = [];

      for (const item of stampsRef.current) {
        let alpha = 1;

        if (item.isFadingOut && item.fadeOutStart != null) {
          const progress = (now - item.fadeOutStart) / fadeOutDuration;
          alpha = Math.max(0, 1 - progress);

          if (progress >= 1) continue;
        } else {
          const progress = (now - item.fadeInStart) / fadeInDuration;
          alpha = Math.min(1, Math.max(0, progress));
        }

        nextStamps.push(item);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(item.img, item.x, item.y, stampSize, stampSize);
        ctx.restore();
      }

      stampsRef.current = nextStamps;
    },
    [fadeInDuration, fadeOutDuration, stampSize],
  );

  const getPickerItemAnimationAlpha = useCallback(
    (index: number, now: number) => {
      const phase = pickerPhaseRef.current;

      if (phase === "hidden") return 0;
      if (phase === "visible") return 1;

      if (phase === "entering") {
        const enterStart = pickerEnterStartAtRef.current;
        const delay = getPickerEnterDelay(index);
        const elapsed = now - enterStart - delay;
        const progress = elapsed / pickerFadeInDuration;
        return Math.max(0, Math.min(1, progress));
      }

      if (phase === "exiting") {
        const exitStart = pickerExitStartAtRef.current;
        if (exitStart == null) return 0;

        const progress = (now - exitStart) / pickerFadeOutDuration;
        return Math.max(0, 1 - progress);
      }

      return 1;
    },
    [getPickerEnterDelay, pickerFadeInDuration, pickerFadeOutDuration],
  );

  const updatePickerPhysics = useCallback(
    (delta: number, now: number) => {
      if (!enablePicker) return;
      if (!pickerItems.length) return;
      if (pickerPhaseRef.current === "hidden") return;
      if (pickerAutoScrollStateRef.current === "running") {
        const minOffset = getPickerMinOffset();
        const nextOffset = pickerOffsetYRef.current - delta * 1.6;

        if (nextOffset <= minOffset) {
          pickerOffsetYRef.current = minOffset;
          pickerVelocityYRef.current = 0;
          pickerAutoScrollStateRef.current = "idle";
          setPickerSelectedIndex(pickerItems.length - 1);
          emitBoundaryCollision("end");
          return;
        }

        pickerOffsetYRef.current = nextOffset;
        pickerVelocityYRef.current = 0;
        pickerEndCollisionLockedRef.current = false;
        pickerStartCollisionLockedRef.current = false;
        setPickerSelectedIndex(getSelectedIndexFromOffset(nextOffset));
        return;
      }
      if (pickerDraggingRef.current) return;
      if (now < wheelActiveUntilRef.current) return;

      const minOffset = getPickerMinOffset();
      const maxOffset = getPickerMaxOffset();

      const releaseCollisionLockByOffset = (offsetValue: number) => {
        if (offsetValue < maxOffset - 0.5) {
          pickerStartCollisionLockedRef.current = false;
        }

        if (offsetValue > minOffset + 0.5) {
          pickerEndCollisionLockedRef.current = false;
        }

        if (offsetValue < maxOffset - 0.5 && offsetValue > minOffset + 0.5) {
          pickerStartCollisionLockedRef.current = false;
          pickerEndCollisionLockedRef.current = false;
        }
      };

      let offset = pickerOffsetYRef.current;
      let velocity = pickerVelocityYRef.current;

      if (Math.abs(velocity) > 0.02) {
        offset += velocity * delta;

        if (offset > maxOffset || offset < minOffset) {
          velocity *= Math.pow(0.82, delta / 16.67);
        } else {
          velocity *= Math.pow(0.95, delta / 16.67);
        }

        pickerOffsetYRef.current = offset;
        pickerVelocityYRef.current = velocity;
        releaseCollisionLockByOffset(pickerOffsetYRef.current);
        setPickerSelectedIndex(
          getSelectedIndexFromOffset(pickerOffsetYRef.current),
        );
      }

      offset = pickerOffsetYRef.current;
      velocity = pickerVelocityYRef.current;

      if (offset > maxOffset) {
        const diff = maxOffset - offset;
        pickerOffsetYRef.current += diff * 0.18;
        releaseCollisionLockByOffset(pickerOffsetYRef.current);
        setPickerSelectedIndex(
          getSelectedIndexFromOffset(pickerOffsetYRef.current),
        );

        if (Math.abs(diff) < 0.5) {
          pickerOffsetYRef.current = maxOffset;
          pickerVelocityYRef.current = 0;
          setPickerSelectedIndex(0);
        }
        return;
      }

      if (offset < minOffset) {
        const diff = minOffset - offset;
        pickerOffsetYRef.current += diff * 0.18;
        releaseCollisionLockByOffset(pickerOffsetYRef.current);
        setPickerSelectedIndex(
          getSelectedIndexFromOffset(pickerOffsetYRef.current),
        );

        if (Math.abs(diff) < 0.5) {
          pickerOffsetYRef.current = minOffset;
          pickerVelocityYRef.current = 0;
          setPickerSelectedIndex(pickerItems.length - 1);
        }
        return;
      }

      if (Math.abs(velocity) <= 0.02) {
        const targetIndex = getSelectedIndexFromOffset(offset);
        const targetOffset = getOffsetFromSelectedIndex(targetIndex);
        const diff = targetOffset - offset;

        if (Math.abs(diff) > 0.01) {
          pickerOffsetYRef.current += diff * 0.18;
          setPickerSelectedIndex(targetIndex);

          if (Math.abs(diff) < 0.5) {
            pickerOffsetYRef.current = targetOffset;
            pickerVelocityYRef.current = 0;
            setPickerSelectedIndex(targetIndex);
          }
        } else {
          pickerOffsetYRef.current = targetOffset;
          pickerVelocityYRef.current = 0;
          setPickerSelectedIndex(targetIndex);
        }
      }
    },
    [
      enablePicker,
      pickerItems,
      getPickerMinOffset,
      getPickerMaxOffset,
      setPickerSelectedIndex,
      getSelectedIndexFromOffset,
      getOffsetFromSelectedIndex,
      emitBoundaryCollision,
    ],
  );

  const drawPickerStamps = useCallback(
    (ctx: CanvasRenderingContext2D, now: number) => {
      if (!enablePicker) return;
      if (!pickerItems.length) return;
      if (pickerPhaseRef.current === "hidden") return;

      const { centerX, centerY, vh } = getGridInfo();
      const renderBaseOffset = getPickerRenderBaseOffset();

      let allEntered = true;
      let allExited = true;

      for (let i = 0; i < pickerItems.length; i++) {
        const item = pickerItems[i];
        const img = pickerImagesRef.current.get(item.img);
        if (!img) continue;

        const animAlpha = getPickerItemAnimationAlpha(i, now);

        if (pickerPhaseRef.current === "entering" && animAlpha < 1) {
          allEntered = false;
        }

        if (pickerPhaseRef.current === "exiting" && animAlpha > 0) {
          allExited = false;
        }

        if (animAlpha <= 0.001) continue;

        const y =
          centerY -
          stampSize / 2 +
          i * stampSize +
          renderBaseOffset +
          pickerOffsetYRef.current;

        if (y >= vh || y + stampSize <= 0) continue;

        const itemCenterY = y + stampSize / 2;
        const distanceToCenter = Math.abs(itemCenterY - centerY);

        // 从中心向两端渐隐
        const fadeRadius = stampSize * 3.2;
        const t = Math.min(1, distanceToCenter / fadeRadius);

        // 中心亮，两端淡；指数越大，两端掉得越快
        const focusAlpha = Math.pow(1 - t, 1.8);
        const finalAlpha = 0.08 + focusAlpha * 0.92;

        // 同时轻微缩放，增强中心聚焦感
        const scale = 0.86 + Math.pow(1 - t, 1.6) * 0.14;

        const alpha = animAlpha * finalAlpha;

        const drawW = stampSize * scale;
        const drawH = stampSize * scale;
        const drawX = centerX - drawW / 2;
        const drawY = y + (stampSize - drawH) / 2;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      if (pickerPhaseRef.current === "entering" && allEntered) {
        pickerPhaseRef.current = "visible";
      }

      if (pickerPhaseRef.current === "exiting" && allExited) {
        pickerPhaseRef.current = "hidden";
      }
    },
    [
      enablePicker,
      pickerItems,
      stampSize,
      getGridInfo,
      getPickerItemAnimationAlpha,
      getPickerRenderBaseOffset,
    ],
  );

  const renderFrame = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = getDpr();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const prev = lastFrameTimeRef.current || now;
      const delta = Math.min(32, now - prev || 16.67);
      lastFrameTimeRef.current = now;

      if (
        canvas.width !== Math.round(vw * dpr) ||
        canvas.height !== Math.round(vh * dpr)
      ) {
        canvas.width = Math.round(vw * dpr);
        canvas.height = Math.round(vh * dpr);
        canvas.style.width = `${vw}px`;
        canvas.style.height = `${vh}px`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, vw, vh);

      drawGrid(ctx, dpr);

      if (enableRandomImages && images.length) {
        if (!lastSpawnTimeRef.current) {
          lastSpawnTimeRef.current = now;
          spawnStamp(now);
        } else if (now - lastSpawnTimeRef.current >= spawnInterval) {
          lastSpawnTimeRef.current = now;
          spawnStamp(now);
        }

        drawAnimatedStamps(ctx, now);
      }

      updatePickerPhysics(delta, now);
      drawPickerStamps(ctx, now);

      rafRef.current = requestAnimationFrame(renderFrame);
    },
    [
      backgroundColor,
      drawGrid,
      enableRandomImages,
      images.length,
      spawnInterval,
      spawnStamp,
      drawAnimatedStamps,
      updatePickerPhysics,
      drawPickerStamps,
    ],
  );

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (enableRandomImages && images.length) {
        await loadImages(images);
      }

      if (enablePicker && pickerItems.length) {
        await loadPickerImages(pickerItems);
      }

      if (!mounted) return;

      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(renderFrame);
    };

    init();

    const handleResize = () => {
      resetRandomAnimationState();
      lastFrameTimeRef.current = 0;

      pickerOffsetYRef.current = clampPickerOffset(pickerOffsetYRef.current);
      setPickerSelectedIndex(
        getSelectedIndexFromOffset(pickerOffsetYRef.current),
      );
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      mounted = false;
      window.removeEventListener("resize", handleResize);

      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [
    enableRandomImages,
    images,
    loadImages,
    renderFrame,
    enablePicker,
    pickerItems,
    loadPickerImages,
    clampPickerOffset,
    setPickerSelectedIndex,
    getSelectedIndexFromOffset,
    resetRandomAnimationState,
  ]);

  useEffect(() => {
    resetRandomAnimationState();
  }, [enableRandomImages, resetRandomAnimationState]);

  useEffect(() => {
    if (!enablePicker || !pickerItems.length) {
      pickerPhaseRef.current = "hidden";
      pickerExitStartAtRef.current = null;
      pickerEndCollisionLockedRef.current = false;
      pickerStartCollisionLockedRef.current = false;
      pickerAutoScrollStateRef.current = "idle";
      return;
    }

    const now = performance.now();

    if (pickerVisible) {
      pickerEndCollisionLockedRef.current = false;
      pickerStartCollisionLockedRef.current = false;
      pickerEnterStartAtRef.current = now;
      pickerExitStartAtRef.current = null;
      pickerPhaseRef.current = "entering";
    } else {
      pickerEndCollisionLockedRef.current = false;
      pickerStartCollisionLockedRef.current = false;
      pickerDraggingRef.current = false;
      pickerAutoScrollStateRef.current = "idle";
      pickerVelocityYRef.current = 0;
      wheelActiveUntilRef.current = 0;
      pickerExitStartAtRef.current = now;
      pickerPhaseRef.current = "exiting";
    }
  }, [enablePicker, pickerVisible, pickerItems.length]);

  useEffect(() => {
    pickerEndCollisionLockedRef.current = false;
    pickerStartCollisionLockedRef.current = false;
    pickerAutoScrollStateRef.current = "idle";
    pickerOffsetYRef.current = clampPickerOffset(pickerOffsetYRef.current);
    setPickerSelectedIndex(
      getSelectedIndexFromOffset(pickerOffsetYRef.current),
    );
  }, [
    pickerItems.length,
    stampSize,
    clampPickerOffset,
    setPickerSelectedIndex,
    getSelectedIndexFromOffset,
  ]);

  useEffect(() => {
    if (!enablePicker || !pickerVisible || !pickerItems.length) return;
    if (pickerPhaseRef.current === "hidden") return;
    if (autoScrollRequest === lastAutoScrollRequestRef.current) return;
    if (pickerAutoScrollStateRef.current === "running") return;

    lastAutoScrollRequestRef.current = autoScrollRequest;
    pickerDraggingRef.current = false;
    pickerVelocityYRef.current = 0;
    wheelActiveUntilRef.current = 0;
    pickerEndCollisionLockedRef.current = false;
    pickerStartCollisionLockedRef.current = false;
    pickerAutoScrollStateRef.current = "running";
  }, [autoScrollRequest, enablePicker, pickerVisible, pickerItems.length]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!enablePicker) return;
    if (!pickerItems.length) return;

    const applyPickerDelta = (dy: number) => {
      const minOffset = getPickerMinOffset();
      const maxOffset = getPickerMaxOffset();
      const current = pickerOffsetYRef.current;
      const next = current + dy;

      if (next > maxOffset) {
        const overflow = next - maxOffset;
        pickerOffsetYRef.current = maxOffset + overflow * 0.35;

        if (dy > 0 && current >= maxOffset - 0.5) {
          emitBoundaryCollision("start");
        }
      } else if (next < minOffset) {
        const overflow = minOffset - next;
        pickerOffsetYRef.current = minOffset - overflow * 0.35;

        if (dy < 0 && current <= minOffset + 0.5) {
          emitBoundaryCollision("end");
        }
      } else {
        pickerOffsetYRef.current = next;
        resetBoundaryCollisionLock(0);
      }

      if (pickerOffsetYRef.current < maxOffset - 0.5) {
        resetBoundaryCollisionLock(1);
      }

      if (pickerOffsetYRef.current > minOffset + 0.5) {
        resetBoundaryCollisionLock(-1);
      }

      setPickerSelectedIndex(
        getSelectedIndexFromOffset(pickerOffsetYRef.current),
      );
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!pickerVisible) return;
      if (pickerPhaseRef.current === "hidden") return;
      if (pickerAutoScrollStateRef.current === "running") {
        e.preventDefault();
        return;
      }
      if (!e.touches.length) return;

      const y = e.touches[0].clientY;
      const now = performance.now();

      pickerDraggingRef.current = true;
      pickerVelocityYRef.current = 0;
      wheelActiveUntilRef.current = 0;

      lastTouchYRef.current = y;
      lastTouchTimeRef.current = now;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pickerVisible) return;
      if (pickerPhaseRef.current === "hidden") return;
      if (pickerAutoScrollStateRef.current === "running") {
        e.preventDefault();
        return;
      }
      if (!pickerDraggingRef.current) return;
      if (!e.touches.length) return;

      e.preventDefault();

      const y = e.touches[0].clientY;
      const now = performance.now();

      const dy = y - lastTouchYRef.current;
      const dt = now - lastTouchTimeRef.current;

      applyPickerDelta(dy);

      if (dt > 0) {
        pickerVelocityYRef.current = dy / dt;
      }

      lastTouchYRef.current = y;
      lastTouchTimeRef.current = now;
    };

    const onTouchEnd = () => {
      pickerDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!pickerVisible) return;
      if (pickerPhaseRef.current === "hidden") return;
      if (pickerAutoScrollStateRef.current === "running") {
        e.preventDefault();
        return;
      }
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      e.preventDefault();

      const now = performance.now();
      const dy = -e.deltaY;

      applyPickerDelta(dy);

      wheelActiveUntilRef.current = now + 90;
      pickerVelocityYRef.current = dy / 18;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });
    el.addEventListener("touchcancel", onTouchEnd, { passive: false });
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, [
    enablePicker,
    pickerVisible,
    pickerItems.length,
    getPickerMinOffset,
    getPickerMaxOffset,
    getSelectedIndexFromOffset,
    setPickerSelectedIndex,
    emitBoundaryCollision,
    resetBoundaryCollisionLock,
  ]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex,
        touchAction: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100vh",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
