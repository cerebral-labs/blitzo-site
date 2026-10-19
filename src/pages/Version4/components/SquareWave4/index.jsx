import React, { useState, useEffect, useRef } from "react";
import "./StampVideo.css";
import WhiteStamp from "@/assets/version4/CodeBubbyAssets/纯白邮票-new.svg";
import TextStamp from "@/assets/version4/CodeBubbyAssets/带字邮票-new.svg";
import OrangeTextStamp from "@/assets/version4/CodeBubbyAssets/(橙色)带字邮票-new 1.svg";
import { loadIntroFrames } from "./introFrames";

const easeOutBounce = (x) => {
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

const StampGrid = ({ animationStep ,onAnimationComplete}) => {
  const canvasRef = React.useRef(null);
  const stampSize = 53;
  const gridSpacing = stampSize - 3;

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
      ctxOrange.fillStyle = "#FF6400";
      ctxOrange.fillRect(0, 0, stampSize, stampSize);

      const offscreenGridLine = document.createElement("canvas");
      offscreenGridLine.width = stampSize * dpr;
      offscreenGridLine.height = stampSize * dpr;
      const ctxGrid = offscreenGridLine.getContext("2d");
      ctxGrid.scale(dpr, dpr);
      ctxGrid.strokeStyle = "#F8F8F8";
      ctxGrid.lineWidth = 1;
      ctxGrid.strokeRect(0, 0, stampSize, stampSize);

      const offscreenOrangeText = await createOffscreenCanvas(OrangeTextStamp);

      const getStateImg = (waveType, x, y) => {
        if (waveType === "stamp") {
          if (x === 0 && y === 0) return offscreenText;
          return (Math.abs(x) + Math.abs(y)) % 2 === 0
            ? offscreenText
            : offscreenWhite;
        }
        if (x === 0 && y === 0) return offscreenText;
        return offscreenOrangeRect;
      };

      const shouldShowOrangeText = (elapsed, x, y) => {
        const orangePhaseElapsed = elapsed - waveInterval;
        return x === 0 && y === 0 && orangePhaseElapsed > waveInterval * 0.7;
      };

      const morphStage = document.querySelector(".morph-stage");
      if (morphStage) morphStage.style.opacity = "0";

      const startTime = performance.now();
      const waveInterval = 3.5;
      const waveTypes = ["stamp", "orange"];
      const stripesBg = document.querySelector(".stripes-bg");
      let bgChanged = false;

      const render = (time) => {
        const elapsed = (time - startTime) / 1000;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const realSize = gridSpacing;

        const maxDistX = Math.ceil(cx / realSize);
        const maxDistY = Math.ceil(cy / realSize);
        const maxDist = Math.max(maxDistX, maxDistY);

        let globalOrangeAlpha = 1;
        let gridLineAlpha = 0.1;
        const orangePhaseStartTime = waveInterval;
        const orangePhaseElapsed = elapsed - orangePhaseStartTime;
        if (orangePhaseElapsed > waveInterval * 0.65) {
          const fadeProgress =
            (orangePhaseElapsed - waveInterval * 0.65) / (waveInterval * 0.1);
          const clampedProgress = Math.min(1, fadeProgress);
          globalOrangeAlpha = Math.max(0, 1 - clampedProgress);
          gridLineAlpha = 0.1 + 0.9 * clampedProgress;

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
            const chebyshev = Math.max(ax, ay);
            const euclidean = Math.sqrt(ax * ax + ay * ay);
            const distance = chebyshev * 0.55 + euclidean * 0.45;
            if (chebyshev > maxDist + 2) continue;

            const delay = (distance - 1) * 0.1;
            const localTime = elapsed - delay;
            if (localTime < 0) continue;

            const waveIndex = Math.floor(localTime / waveInterval);
            if (waveIndex >= 2) {
              const isOrangeText = shouldShowOrangeText(elapsed, x, y);
              const finalSpacing = stampSize;

              ctx.save();
              ctx.translate(cx + x * finalSpacing, cy + y * finalSpacing);

              if (isOrangeText) {
                // onAnimationComplete?.()


                ctx.globalAlpha = 1;
                ctx.drawImage(
                  offscreenOrangeText,
                  -stampSize / 2,
                  -stampSize / 2,
                  stampSize,
                  stampSize,
                );
              } else {
                ctx.globalAlpha = globalOrangeAlpha;
                ctx.drawImage(
                  offscreenOrangeRect,
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

            const isOrangeText =
              shouldShowOrangeText(elapsed, x, y) && currWaveType === "orange";
            const currImg = isOrangeText
              ? offscreenOrangeText
              : getStateImg(currWaveType, x, y);
            const prevImg = prevWaveType
              ? getStateImg(prevWaveType, x, y)
              : null;

            const currSpacing =
              currWaveType === "orange" ? stampSize : gridSpacing;
            const prevSpacing =
              prevWaveType === "orange" ? stampSize : gridSpacing;

            if (progress >= 1) {
              ctx.save();
              ctx.translate(cx + x * currSpacing, cy + y * currSpacing);

              if (isOrangeText) {
                ctx.globalAlpha = 1;
                ctx.drawImage(
                  currImg,
                  -stampSize / 2,
                  -stampSize / 2,
                  stampSize,
                  stampSize,
                );
              } else if (currWaveType === "orange") {
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
                  ctx.globalAlpha = opacity;
                  ctx.drawImage(
                    currImg,
                    -stampSize / 2,
                    -stampSize / 2,
                    stampSize,
                    stampSize,
                  );
                } else if (currWaveType === "orange") {
                  const finalOpacity = opacity * globalOrangeAlpha;
                  ctx.globalAlpha = finalOpacity;
                  ctx.drawImage(
                    currImg,
                    -stampSize / 2,
                    -stampSize / 2,
                    stampSize,
                    stampSize,
                  );
                  ctx.globalAlpha = opacity * gridLineAlpha;
                  ctx.drawImage(
                    offscreenGridLine,
                    -stampSize / 2,
                    -stampSize / 2,
                    stampSize,
                    stampSize,
                  );
                } else {
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

const INTRO_DURATION = 1700;
const STRIPES_BACKGROUND = `repeating-linear-gradient(
  to bottom,
  transparent 0px,
  transparent 3px,
  rgba(227, 227, 227, 0.08) 3px,
  rgba(227, 227, 227, 0.08) 10px,
  transparent 10px,
  transparent 26px
)`;

const clearIntroPlayback = (introTimeoutRef, introPlaybackIntervalRef) => {
  if (introTimeoutRef.current) {
    clearTimeout(introTimeoutRef.current);
    introTimeoutRef.current = null;
  }

  if (introPlaybackIntervalRef.current) {
    clearInterval(introPlaybackIntervalRef.current);
    introPlaybackIntervalRef.current = null;
  }
};

const SquareWave4 = ({onAnimationComplete}) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [introFrameIndex, setIntroFrameIndex] = useState(0);
  const [frames, setFrames] = useState(null); // null = 加载中
  const introTimeoutRef = useRef(null);
  const introPlaybackIntervalRef = useRef(null);

  // 进入案例后加载序列帧
  useEffect(() => {
    let cancelled = false;
    loadIntroFrames().then((loadedFrames) => {
      if (!cancelled) {
        setFrames(loadedFrames);
        setAnimationStep(1); // 加载完成后才开始播放
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (animationStep !== 1 || !frames || frames.length === 0) return undefined;

    setIntroFrameIndex(0);

    if (frames.length > 1) {
      const frameDuration = INTRO_DURATION / frames.length;
      introPlaybackIntervalRef.current = setInterval(() => {
        setIntroFrameIndex((prev) => {
          if (prev >= frames.length - 1) {
            if (introPlaybackIntervalRef.current) {
              clearInterval(introPlaybackIntervalRef.current);
              introPlaybackIntervalRef.current = null;
            }
            return prev;
          }

          return prev + 1;
        });
      }, frameDuration);
    }

    introTimeoutRef.current = setTimeout(() => {
      handleIntroEnd();
    }, INTRO_DURATION);

    return () => {
      clearIntroPlayback(introTimeoutRef, introPlaybackIntervalRef);
    };
  }, [animationStep, frames]);

  const handleIntroEnd = () => {
    clearIntroPlayback(introTimeoutRef, introPlaybackIntervalRef);

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
    clearIntroPlayback(introTimeoutRef, introPlaybackIntervalRef);

    const stripesBg = document.querySelector(".stripes-bg");
    if (stripesBg) {
      stripesBg.style.transition = "";
      stripesBg.style.backgroundColor = "#FF6400";
      stripesBg.style.backgroundImage = STRIPES_BACKGROUND;
    }

    const videoContainer = document.querySelector(".video-container");
    if (videoContainer) {
      videoContainer.style.visibility = "visible";
      videoContainer.style.opacity = "1";
      videoContainer.style.display = "block";
    }

    const sequenceElement = document.querySelector(".stamp-video");
    if (sequenceElement) {
      sequenceElement.style.visibility = "visible";
      sequenceElement.style.opacity = "1";
      sequenceElement.style.display = "block";
    }

    const morphStage = document.querySelector(".morph-stage");
    if (morphStage) {
      morphStage.style.visibility = "visible";
      morphStage.style.opacity = "1";
      morphStage.style.display = "block";
    }

    setIntroFrameIndex(0);
    setAnimationStep(0);
    setAnimationStep(1);
  };

  const currentIntroFrame = frames
    ? (frames[introFrameIndex] ?? frames[0])
    : null;

  return (
    <div className="case-wrapper">
    

      <div className={`animation-container step-${animationStep}`}>
        <StampGrid animationStep={animationStep} onAnimationComplete={onAnimationComplete}/>

        <div className="morph-stage">
          <div className="video-container">
            {currentIntroFrame ? (
              <img
                className="stamp-video"
                style={{ borderRadius: 0 }}
                src={currentIntroFrame}
                alt="Splash animation frame"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquareWave4;
