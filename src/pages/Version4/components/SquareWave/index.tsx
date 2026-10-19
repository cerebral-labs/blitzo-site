import React, { useState, useEffect } from "react";
import "./StampVideo.css";
import WhiteStamp from "@/assets/version4/CodeBubbyAssets/纯白邮票.svg";
import TextStamp from "@/assets/version4/CodeBubbyAssets/带字邮票.svg";

const easeOutBounce = (x) => {
  // 0→0.4: 放大到100%
  // 0.4→0.7: 缩到90%
  // 0.7→1.0: 回到100%
  if (x < 0.4) {
    const t = x / 0.4;
    return t;
  } else if (x < 0.7) {
    const t = (x - 0.4) / 0.3;
    return 1 - 0.1 * t;
  } else {
    const t = (x - 0.7) / 0.3;
    return 0.9 + 0.1 * t;
  }
};

const StampGrid = ({ animationStep }) => {
  const canvasRef = React.useRef(null);
  const stampSize = 53;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", resize);
    resize();

    let animationFrameId;

    if (animationStep < 7) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const morphStage = document.querySelector(".morph-stage");
      if (morphStage) morphStage.style.opacity = "1";
      return () => window.removeEventListener("resize", resize);
    }

    // 创建离屏画布并加载 SVG 图像（高分辨率）
    const createOffscreenCanvas = (src) => {
      return new Promise((resolve) => {
        const offscreen = document.createElement("canvas");
        offscreen.width = stampSize * dpr;
        offscreen.height = stampSize * dpr;
        const offscreenCtx = offscreen.getContext("2d");
        offscreenCtx.scale(dpr, dpr);
        const img = new Image();
        img.onload = () => {
          offscreenCtx.clearRect(0, 0, stampSize, stampSize);
          offscreenCtx.drawImage(img, 0, 0, stampSize, stampSize);
          resolve(offscreen);
        };
        img.src = src;
      });
    };

    const renderWithImages = async () => {
      const offscreenWhite = await createOffscreenCanvas(WhiteStamp);
      const offscreenText = await createOffscreenCanvas(TextStamp);

      const offscreenOrangeRect = document.createElement("canvas");
      offscreenOrangeRect.width = stampSize * dpr;
      offscreenOrangeRect.height = stampSize * dpr;
      const ctxOrange = offscreenOrangeRect.getContext("2d");
      ctxOrange.scale(dpr, dpr);

      // 绘制橙色背景
      ctxOrange.fillStyle = "#FF6400";
      ctxOrange.fillRect(0, 0, stampSize, stampSize);

      // 添加条纹图案
      for (let y = 0; y < stampSize; y++) {
        const mod = y % 26;
        if (mod >= 3 && mod < 10) {
          ctxOrange.fillStyle = "rgba(227, 227, 227, 0.08)";
          ctxOrange.fillRect(0, y, stampSize, 1);
        }
      }

      const getStateImg = (waveType, x, y) => {
        if (x === 0 && y === 0) return offscreenText;
        if (waveType === "stamp") {
          // 棋盘格交错：用坐标奇偶决定图片类型
          return (Math.abs(x) + Math.abs(y)) % 2 === 0
            ? offscreenText
            : offscreenWhite;
        }
        return offscreenOrangeRect;
      };

      // 隐藏morph-stage
      const morphStage = document.querySelector(".morph-stage");
      if (morphStage) morphStage.style.opacity = "0";

      const startTime = performance.now();
      const waveInterval = 3.5;
      const waveTypes = ["stamp", "orange"];

      const render = (time) => {
        const elapsed = (time - startTime) / 1000;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const realSize = stampSize;

        const maxDistX = Math.ceil(cx / realSize);
        const maxDistY = Math.ceil(cy / realSize);
        const maxDist = Math.max(maxDistX, maxDistY);

        for (let x = -maxDist - 2; x <= maxDist + 2; x++) {
          for (let y = -maxDist - 2; y <= maxDist + 2; y++) {
            const ax = Math.abs(x);
            const ay = Math.abs(y);
            // 混合距离：切比雪夫 + 欧几里得，形成圆角方形扩散
            const chebyshev = Math.max(ax, ay);
            const euclidean = Math.sqrt(ax * ax + ay * ay);
            const distance = chebyshev * 0.55 + euclidean * 0.45;
            if (chebyshev > maxDist + 2) continue;

            const delay = (distance - 1) * 0.1;
            const localTime = elapsed - delay;
            if (localTime < 0) continue;

            const waveIndex = Math.floor(localTime / waveInterval);
            // 中心位置也由canvas绘制，确保像素级对齐

            const animTime = localTime - waveIndex * waveInterval;
            let progress = animTime / 1.0;
            if (progress > 1) progress = 1;

            const currWaveType = waveTypes[waveIndex % waveTypes.length];
            const prevWaveType =
              waveIndex > 0
                ? waveTypes[(waveIndex - 1) % waveTypes.length]
                : null;
            const currImg = getStateImg(currWaveType, x, y);
            const prevImg = prevWaveType
              ? getStateImg(prevWaveType, x, y)
              : null;

            if (progress >= 1) {
              ctx.save();
              ctx.translate(cx + x * realSize, cy + y * realSize);
              ctx.globalAlpha = 1;
              ctx.drawImage(
                currImg,
                -stampSize / 2,
                -stampSize / 2,
                stampSize,
                stampSize,
              );
              ctx.restore();
            } else {
              if (prevImg) {
                ctx.save();
                ctx.translate(cx + x * realSize, cy + y * realSize);
                ctx.globalAlpha = 1 - progress;
                ctx.drawImage(
                  prevImg,
                  -stampSize / 2,
                  -stampSize / 2,
                  stampSize,
                  stampSize,
                );
                ctx.restore();
              }
              const currentScale = easeOutBounce(progress);
              const opacity = Math.min(1, progress * 2.0);
              if (opacity > 0) {
                ctx.save();
                ctx.translate(cx + x * realSize, cy + y * realSize);
                ctx.scale(currentScale, currentScale);
                ctx.globalAlpha = opacity;
                ctx.drawImage(
                  currImg,
                  -stampSize / 2,
                  -stampSize / 2,
                  stampSize,
                  stampSize,
                );
                ctx.restore();
              }
            }
          }
        }

        animationFrameId = requestAnimationFrame(render);
      };

      animationFrameId = requestAnimationFrame(render);
    };

    renderWithImages();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [animationStep]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
};

const SquareWave = () => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // 只执行到step 1，然后等待视频播放结束
    const timeout = setTimeout(() => setAnimationStep(1), 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleVideoEnd = () => {
    // 立即隐藏整个视频容器
    const videoContainer = document.querySelector(".video-container");
    if (videoContainer) {
      videoContainer.style.visibility = "hidden";
      videoContainer.style.opacity = "0";
      videoContainer.style.display = "none";
    }
    // 立即隐藏morph-stage
    const morphStage = document.querySelector(".morph-stage");
    if (morphStage) {
      morphStage.style.visibility = "hidden";
      morphStage.style.opacity = "0";
      morphStage.style.display = "none";
    }
    // 稍微延迟一下再设置animationStep，确保视频完全隐藏
    setTimeout(() => {
      setAnimationStep(7);
    }, 10);
  };

  const replay = () => {
    // 重新显示整个视频容器
    const videoContainer = document.querySelector(".video-container");
    if (videoContainer) {
      videoContainer.style.visibility = "visible";
      videoContainer.style.opacity = "1";
      videoContainer.style.display = "block";
    }
    // 重新显示视频元素并重新开始播放
    const videoElement = document.querySelector(".stamp-video");
    if (videoElement) {
      videoElement.style.visibility = "visible";
      videoElement.style.opacity = "1";
      videoElement.style.display = "block";
      videoElement.currentTime = 0;
      videoElement.play();
    }
    // 重新显示morph-stage
    const morphStage = document.querySelector(".morph-stage");
    if (morphStage) {
      morphStage.style.visibility = "visible";
      morphStage.style.opacity = "1";
      morphStage.style.display = "block";
    }
    setAnimationStep(0);
    setTimeout(() => {
      setAnimationStep(1);
    }, 300);
  };

  return (
    <div className="case-wrapper">
      <div className="stripes-bg"></div>

      <button className="replay-btn" onClick={replay}>
        ↻ 重播动画
      </button>

      <div className={`animation-container step-${animationStep}`}>
        <StampGrid animationStep={animationStep} />

        <div className="morph-stage">
          <div className="video-container">
            <video
              className="stamp-video"
              src="https://coze-coding-project.tos.coze.site/coze_storage_7598772423130906678/3Yue_15Ri_3c142544.mp4?sign=2089025914-aeaeeacaec-0-41ee7347fc1f4925ca37aa19c339226a59fa019eff493aa2e0e80c7741ec9d8e"
              autoPlay
              muted
              playsInline
              onEnded={(e) => handleVideoEnd()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquareWave;
