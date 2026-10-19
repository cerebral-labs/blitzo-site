import React, { useState, useEffect } from "react";
import "./StampVideo.css";
import WhiteStamp from "@/assets/version4/CodeBubbyAssets/纯白邮票-new.svg";
import TextStamp from "@/assets/version4/CodeBubbyAssets/带字邮票-new.svg";
import OrangeTextStamp from "@/assets/version4/CodeBubbyAssets/(橙色)带字邮票-new 1.svg";

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

const StampGrid = ({ animationStep,onAnimationComplete }) => {
  const canvasRef = React.useRef(null);
  const stampSize = 53;
  const gridSpacing = stampSize - 3; // 负间距效果：每个格子间距减少3px（四边各-1.5px）

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

      // 创建橙色方块（只有橙色填充，没有描边）
      const offscreenOrangeRect = document.createElement("canvas");
      offscreenOrangeRect.width = stampSize * dpr;
      offscreenOrangeRect.height = stampSize * dpr;
      const ctxOrange = offscreenOrangeRect.getContext("2d");
      ctxOrange.scale(dpr, dpr);

      // 只填充橙色，不绘制描边
      ctxOrange.fillStyle = "#FF6400";
      ctxOrange.fillRect(0, 0, stampSize, stampSize);

      // 创建只有描边的方块（用于所有场景）
      const offscreenGridLine = document.createElement("canvas");
      offscreenGridLine.width = stampSize * dpr;
      offscreenGridLine.height = stampSize * dpr;
      const ctxGrid = offscreenGridLine.getContext("2d");
      ctxGrid.scale(dpr, dpr);
      ctxGrid.strokeStyle = "#F8F8F8";
      ctxGrid.lineWidth = 1;
      ctxGrid.strokeRect(0, 0, stampSize, stampSize);

      // 加载橙色带字邮票
      const offscreenOrangeText = await createOffscreenCanvas(OrangeTextStamp);

      const getStateImg = (waveType, x, y) => {
        if (waveType === "stamp") {
          if (x === 0 && y === 0) return offscreenText;
          // 棋盘格交错：用坐标奇偶决定图片类型
          return (Math.abs(x) + Math.abs(y)) % 2 === 0
            ? offscreenText
            : offscreenWhite;
        }
        // 橙色状态下，中心位置显示白色带字邮票（70%之前）
        if (x === 0 && y === 0) return offscreenText;
        return offscreenOrangeRect;
      };

      // 检查是否应该显示橙色带字邮票（70%时替换中心位置）
      const shouldShowOrangeText = (elapsed, x, y) => {
        const orangePhaseElapsed = elapsed - waveInterval;
        return x === 0 && y === 0 && orangePhaseElapsed > waveInterval * 0.7;
      };

      // 隐藏morph-stage
      const morphStage = document.querySelector(".morph-stage");
      if (morphStage) morphStage.style.opacity = "0";

      const startTime = performance.now();
      const waveInterval = 3.5;
      const waveTypes = ["stamp", "orange"];

      // 背景颜色管理
      const stripesBg = document.querySelector(".stripes-bg");
      let bgChanged = false;

      const render = (time) => {
        const elapsed = (time - startTime) / 1000;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const realSize = gridSpacing; // 使用 gridSpacing 实现负间距效果

        const maxDistX = Math.ceil(cx / realSize);
        const maxDistY = Math.ceil(cy / realSize);
        const maxDist = Math.max(maxDistX, maxDistY);

        // 计算全局透明度：当橙色扩散阶段完成65%时开始降低透明度，75%时完成
        let globalOrangeAlpha = 1;
        let gridLineAlpha = 0.1; // 描边透明度：橙色背景时10%，白色背景时100%
        const orangePhaseStartTime = waveInterval;
        const orangePhaseElapsed = elapsed - orangePhaseStartTime;
        if (orangePhaseElapsed > waveInterval * 0.65) {
          // 将65%-75%的时间映射到透明度1→0
          const fadeProgress =
            (orangePhaseElapsed - waveInterval * 0.65) / (waveInterval * 0.1);
          const clampedProgress = Math.min(1, fadeProgress);
          globalOrangeAlpha = Math.max(0, 1 - clampedProgress);
          // 描边透明度从10%渐变到100%
          gridLineAlpha = 0.1 + 0.9 * clampedProgress;

          // 同时将背景改为白色并移除横杠
          if (!bgChanged) {
            bgChanged = true;
            if (stripesBg) {
              stripesBg.style.transition = "background-color 0.5s ease";
              stripesBg.style.backgroundColor = "#FFFFFF";
              stripesBg.style.backgroundImage = "none";
            }
          }
        }

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
            // 限制只执行两次扩散：白色(0) → 橙色(1)，然后停止
            if (waveIndex >= 2) {
              // 停留在橙色状态，使用全局透明度
              const finalWaveType = waveTypes[1]; // "orange"
              // 70%后中心位置显示橙色带字邮票
              const isOrangeText = shouldShowOrangeText(elapsed, x, y);
              const finalSpacing = stampSize;

              ctx.save();
              ctx.translate(cx + x * finalSpacing, cy + y * finalSpacing);

              if (isOrangeText) {

                onAnimationComplete?.()

                
                // 橙色带字邮票保持不透明
                ctx.globalAlpha = 1;
                ctx.drawImage(
                  offscreenOrangeText,
                  -stampSize / 2,
                  -stampSize / 2,
                  stampSize,
                  stampSize,
                );
              } else {
                // 先绘制橙色方块（会随透明度降低）
                ctx.globalAlpha = globalOrangeAlpha;
                ctx.drawImage(
                  offscreenOrangeRect,
                  -stampSize / 2,
                  -stampSize / 2,
                  stampSize,
                  stampSize,
                );
                // 再绘制描边（透明度从10%渐变到100%）
                ctx.globalAlpha = gridLineAlpha;
                ctx.drawImage(
                  offscreenGridLine,
                  -stampSize / 2,
                  -stampSize / 2,
                  stampSize,
                  stampSize,
                );
              }

              ctx.restore();
              continue;
            }

            const animTime = localTime - waveIndex * waveInterval;
            let progress = animTime / 1.0;
            if (progress > 1) progress = 1;

            const currWaveType = waveTypes[waveIndex % waveTypes.length];
            const prevWaveType =
              waveIndex > 0
                ? waveTypes[(waveIndex - 1) % waveTypes.length]
                : null;

            // 70%后中心位置显示橙色带字邮票
            const isOrangeText =
              shouldShowOrangeText(elapsed, x, y) && currWaveType === "orange";
            const currImg = isOrangeText
              ? offscreenOrangeText
              : getStateImg(currWaveType, x, y);
            const prevImg = prevWaveType
              ? getStateImg(prevWaveType, x, y)
              : null;

            // 根据当前状态选择间距：橙色用 stampSize，白色用 gridSpacing
            const currSpacing =
              currWaveType === "orange" ? stampSize : gridSpacing;
            const prevSpacing =
              prevWaveType === "orange" ? stampSize : gridSpacing;

            if (progress >= 1) {
              ctx.save();
              ctx.translate(cx + x * currSpacing, cy + y * currSpacing);

              if (isOrangeText) {
                // 橙色带字邮票保持不透明
                ctx.globalAlpha = 1;
                ctx.drawImage(
                  currImg,
                  -stampSize / 2,
                  -stampSize / 2,
                  stampSize,
                  stampSize,
                );
              } else if (currWaveType === "orange") {
                // 橙色方块：先绘制橙色填充（会随透明度降低），再绘制描边（透明度渐变）
                ctx.globalAlpha = globalOrangeAlpha;
                ctx.drawImage(
                  currImg,
                  -stampSize / 2,
                  -stampSize / 2,
                  stampSize,
                  stampSize,
                );
                ctx.globalAlpha = gridLineAlpha;
                ctx.drawImage(
                  offscreenGridLine,
                  -stampSize / 2,
                  -stampSize / 2,
                  stampSize,
                  stampSize,
                );
              } else {
                // 白色邮票保持不透明
                ctx.globalAlpha = 1;
                ctx.drawImage(
                  currImg,
                  -stampSize / 2,
                  -stampSize / 2,
                  stampSize,
                  stampSize,
                );
              }

              ctx.restore();
            } else {
              if (prevImg) {
                ctx.save();
                ctx.translate(cx + x * prevSpacing, cy + y * prevSpacing);
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
                ctx.translate(cx + x * currSpacing, cy + y * currSpacing);
                ctx.scale(currentScale, currentScale);

                if (isOrangeText) {
                  // 橙色带字邮票
                  ctx.globalAlpha = opacity;
                  ctx.drawImage(
                    currImg,
                    -stampSize / 2,
                    -stampSize / 2,
                    stampSize,
                    stampSize,
                  );
                } else if (currWaveType === "orange") {
                  // 橙色方块：先绘制橙色填充（考虑全局透明度），再绘制描边（透明度渐变）
                  const finalOpacity = opacity * globalOrangeAlpha;
                  ctx.globalAlpha = finalOpacity;
                  ctx.drawImage(
                    currImg,
                    -stampSize / 2,
                    -stampSize / 2,
                    stampSize,
                    stampSize,
                  );
                  // 描边透明度：动画透明度 * 全局描边透明度
                  ctx.globalAlpha = opacity * gridLineAlpha;
                  ctx.drawImage(
                    offscreenGridLine,
                    -stampSize / 2,
                    -stampSize / 2,
                    stampSize,
                    stampSize,
                  );
                } else {
                  // 白色邮票
                  ctx.globalAlpha = opacity;
                  ctx.drawImage(
                    currImg,
                    -stampSize / 2,
                    -stampSize / 2,
                    stampSize,
                    stampSize,
                  );
                }

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

const SquareWave = ({onAnimationComplete}) => {
  const [animationStep, setAnimationStep] = useState(0);

  // If the video can't play (failed to load, autoplay blocked), skip the
  // splash rather than leave the visitor on the orange screen
  const skipTimeout = React.useRef(null);
  useEffect(() => {
    skipTimeout.current = setTimeout(() => onAnimationComplete?.(), 10000);
    return () => clearTimeout(skipTimeout.current);
  }, []);

  useEffect(() => {
    // 只执行到step 1，然后等待视频播放结束
    const timeout = setTimeout(() => setAnimationStep(1), 500);
    return () => clearTimeout(timeout);
  }, []);

  const handleVideoEnd = (e) => {
    clearTimeout(skipTimeout.current);
    const video = e.target;
    console.log("[DEBUG] Video ended:", {
      currentTime: video.currentTime,
      duration: video.duration,
      ended: video.ended,
      paused: video.paused,
      timestamp: performance.now(),
    });

    const videoContainer = document.querySelector(".video-container");
    if (videoContainer) {
      videoContainer.style.visibility = "hidden";
      videoContainer.style.opacity = "0";
      videoContainer.style.display = "none";
    }
    const morphStage = document.querySelector(".morph-stage");
    if (morphStage) {
      morphStage.style.visibility = "hidden";
      morphStage.style.opacity = "0";
      morphStage.style.display = "none";
    }
    setAnimationStep(7);
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
    }, 500);
  };

  return (
    <div className="case-wrapper">
      <div className="stripes-bg"></div>

      {/* <button className="replay-btn" onClick={replay}>
        ↻ 重播动画
      </button> */}

      <div className={`animation-container step-${animationStep}`}>
        <StampGrid animationStep={animationStep} onAnimationComplete={onAnimationComplete} />

        <div className="morph-stage">
          <div className="video-container">
            <video
              className="stamp-video"
              style={{ borderRadius: 0 }}
              src="https://coze-coding-project.tos.coze.site/coze_storage_7598772423130906678/3Yue_21Ri_1_a8e1560f.mp4?sign=2089454161-47a4909ab1-0-b36a7cf2901206e0076b8b0325a1000650e57d57506eea688108cd32a6403657"
              autoPlay
              muted
              playsInline
              onLoadedMetadata={(e) => {
                console.log("[DEBUG] Video loaded:", {
                  duration: e.target.duration,
                  videoWidth: e.target.videoWidth,
                  videoHeight: e.target.videoHeight,
                });
              }}
              onPlay={(e) => {
                console.log("[DEBUG] Video play started:", {
                  currentTime: e.target.currentTime,
                  timestamp: performance.now(),
                });
              }}
              onEnded={(e) => handleVideoEnd(e)}
              onError={() => onAnimationComplete?.()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquareWave;
