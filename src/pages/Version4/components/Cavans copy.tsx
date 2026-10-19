import React, { useEffect, useRef, useState } from "react";

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

const images = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];

interface Props {
  stampSize?: number;
  fadeDuration?: number;
  fadeHold?: number;
  scrollEase?: number;
  onEnd?: () => void;
}

interface RandomStamp {
  col: number;
  row: number;
  index: number;
  start: number;
}

export default function StampGrid({
  stampSize = 80,
  fadeDuration = 600,
  fadeHold = 800,
  scrollEase = 0.15,
  onEnd,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stampsRef = useRef<HTMLImageElement[]>([]);

  const gridRef = useRef({
    cols: 9,
    rows: 9,
    centerCol: 4,
    centerRow: 4,
    offsetX: 0,
    offsetY: 0,
  });

  const scrollRef = useRef({
    value: 0,
    target: 0,
    min: 0,
    max: 0,
  });

  const clockRef = useRef({
    time: 0,
    last: 0,
  });

  const randomRef = useRef<RandomStamp | null>(null);

  const exitRef = useRef({
    active: false,
    start: 0,
    duration: 800,
  });

  const [, forceUpdate] = useState(0);

  /* ------------------- load images ------------------- */

  useEffect(() => {
    Promise.all(
      images.map((src) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
        });
      }),
    ).then((imgs) => {
      stampsRef.current = imgs;
      computeGrid();
      computeScrollLimit();
      forceUpdate((v) => v + 1);
    });
  }, []);

  /* ------------------- grid ------------------- */

  function computeGrid() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    let cols = Math.ceil(w / stampSize);
    let rows = Math.ceil(h / stampSize);

    if (cols % 2 === 0) cols++;
    if (rows % 2 === 0) rows++;

    const offsetX = (w - cols * stampSize) / 2;
    const offsetY = (h - rows * stampSize) / 2;

    gridRef.current = {
      cols,
      rows,
      centerCol: Math.floor(cols / 2),
      centerRow: Math.floor(rows / 2),
      offsetX,
      offsetY,
    };
  }

  /* ------------------- scroll limit ------------------- */

  function computeScrollLimit() {
    const stamps = stampsRef.current;
    const grid = gridRef.current;

    const cell = stampSize;

    const hitCenter = grid.offsetY + (grid.centerRow + 0.5) * cell;

    const first = grid.offsetY + 0.5 * cell;
    const last = grid.offsetY + (stamps.length - 0.5) * cell;

    scrollRef.current.min = first - hitCenter;
    scrollRef.current.max = last - hitCenter;
  }

  /* ------------------- random stamp ------------------- */

  function spawnRandom(time: number) {
    const grid = gridRef.current;
    const stamps = stampsRef.current;

    randomRef.current = {
      col: Math.floor(Math.random() * grid.cols),
      row: Math.floor(Math.random() * grid.rows),
      index: Math.floor(Math.random() * stamps.length),
      start: time,
    };
  }

  /* ------------------- exit animation ------------------- */

  function startExit(time: number) {
    exitRef.current.active = true;
    exitRef.current.start = time;
  }

  /* ------------------- input ------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wheel = (e: WheelEvent) => {
      e.preventDefault();

      const scroll = scrollRef.current;

      scroll.target += e.deltaY * 0.8;

      scroll.target = Math.max(scroll.min, Math.min(scroll.max, scroll.target));

      if (scroll.target >= scroll.max) {
        startExit(clockRef.current.time);
      }
    };

    canvas.addEventListener("wheel", wheel, { passive: false });

    return () => canvas.removeEventListener("wheel", wheel);
  }, []);

  /* ------------------- render loop ------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    function render(time: number) {
      const clock = clockRef.current;

      if (!clock.last) clock.last = time;

      const delta = time - clock.last;
      clock.last = time;
      clock.time += delta;

      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      ctx.clearRect(0, 0, width, height);

      const grid = gridRef.current;
      const stamps = stampsRef.current;

      /* scroll */

      const scroll = scrollRef.current;

      scroll.value += (scroll.target - scroll.value) * scrollEase;

      /* exit alpha */

      let columnAlpha = 1;

      if (exitRef.current.active) {
        const p =
          (clock.time - exitRef.current.start) / exitRef.current.duration;

        columnAlpha = 1 - Math.min(1, p);

        if (p >= 1) {
          exitRef.current.active = false;
          onEnd?.();
        }
      }

      /* grid */

      ctx.strokeStyle = "rgba(200,220,240,0.3)";

      for (let c = 0; c <= grid.cols; c++) {
        const x = grid.offsetX + c * stampSize;
        ctx.beginPath();
        ctx.moveTo(x, grid.offsetY);
        ctx.lineTo(x, grid.offsetY + grid.rows * stampSize);
        ctx.stroke();
      }

      for (let r = 0; r <= grid.rows; r++) {
        const y = grid.offsetY + r * stampSize;
        ctx.beginPath();
        ctx.moveTo(grid.offsetX, y);
        ctx.lineTo(grid.offsetX + grid.cols * stampSize, y);
        ctx.stroke();
      }

      /* stamp column */

      const colX = grid.offsetX + grid.centerCol * stampSize;

      ctx.save();
      ctx.globalAlpha = columnAlpha;

      for (let i = 0; i < stamps.length; i++) {
        const y = grid.offsetY + i * stampSize - scroll.value;

        if (y > -stampSize && y < height + stampSize) {
          ctx.drawImage(stamps[i], colX, y, stampSize, stampSize);
        }
      }

      ctx.restore();

      /* random stamp */

      if (!randomRef.current) spawnRandom(clock.time);

      const r = randomRef.current!;

      const life = clock.time - r.start;

      const total = fadeDuration * 2 + fadeHold;

      let alpha = 0;

      if (life < fadeDuration) alpha = life / fadeDuration;
      else if (life < fadeDuration + fadeHold) alpha = 1;
      else if (life < total)
        alpha = 1 - (life - fadeDuration - fadeHold) / fadeDuration;
      else spawnRandom(clock.time);

      if (alpha > 0) {
        ctx.save();

        ctx.globalAlpha = alpha;

        ctx.drawImage(
          stamps[r.index],
          grid.offsetX + r.col * stampSize,
          grid.offsetY + r.row * stampSize,
          stampSize,
          stampSize,
        );

        ctx.restore();
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        touchAction: "none",
      }}
    />
  );
}
