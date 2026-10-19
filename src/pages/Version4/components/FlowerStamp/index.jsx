import React, { useState, useEffect } from 'react';
import './FlowerStamp.css';
import WhiteStamp from '../../../assets/CodeBubbyAssets/纯白邮票.svg';
import TextStamp from '../../../assets/CodeBubbyAssets/带字邮票.svg';

const easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

const CanvasGrid = ({ animationStep }) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener('resize', resize);
    resize();

    let animationFrameId;
    
    if (animationStep < 7) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const morphStage = document.querySelector('.morph-stage');
      if (morphStage) morphStage.style.opacity = '1';
      return () => window.removeEventListener('resize', resize);
    }

    const stampSize = 53;
    
    // 创建离屏画布并加载 SVG 图像（高分辨率）
    const createOffscreenCanvas = (src) => {
      return new Promise((resolve) => {
        const offscreen = document.createElement('canvas');
        offscreen.width = stampSize * dpr;
        offscreen.height = stampSize * dpr;
        const offscreenCtx = offscreen.getContext('2d');
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

    // 加载 SVG 图像并开始渲染
    const renderWithImages = async () => {
      const offscreenWhite = await createOffscreenCanvas(WhiteStamp);
      const offscreenText = await createOffscreenCanvas(TextStamp);

      const offscreenOrangeRect = document.createElement('canvas');
      offscreenOrangeRect.width = stampSize * dpr;
      offscreenOrangeRect.height = stampSize * dpr;
      const ctxOrangeRect = offscreenOrangeRect.getContext('2d');
      ctxOrangeRect.scale(dpr, dpr);
      ctxOrangeRect.fillStyle = '#FF6705';
      ctxOrangeRect.fillRect(0, 0, stampSize, stampSize);

      const offscreenOrangeCenter = document.createElement('canvas');
      offscreenOrangeCenter.width = stampSize * dpr;
      offscreenOrangeCenter.height = stampSize * dpr;
      const ctxOrangeCenter = offscreenOrangeCenter.getContext('2d');
      ctxOrangeCenter.scale(dpr, dpr);
      ctxOrangeCenter.fillStyle = '#FF6705';
      ctxOrangeCenter.fillRect(0, 0, stampSize, stampSize);
      
      // 对于橙色中心，我们直接使用纯色背景，因为我们没有 SVG 路径信息
      // 这里简化处理，直接使用橙色背景

      const getStateImg = (waveType, dist) => {
        // 中心位置始终显示带字邮票
        if (dist === 0) {
          return offscreenText;
        }
        
        if (waveType === 'stamp') {
          return dist % 2 === 0 ? offscreenText : offscreenWhite;
        } else {
          return offscreenOrangeRect;
        }
      };

      const startTime = performance.now();
      const waveInterval = 3.5;
      const waveTypes = ['stamp', 'orange'];

      const render = (time) => {
        const elapsed = (time - startTime) / 1000;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        
        const scale = 1;
        const realSize = stampSize * scale;
        
        const maxDistX = Math.ceil(cx / realSize);
        const maxDistY = Math.ceil(cy / realSize);
        const maxDist = maxDistX + maxDistY;

        let isAnimating = true;

        const centerDelay = -0.05;
        const centerLocalTime = elapsed - centerDelay;
        const centerWaveIndex = Math.floor(centerLocalTime / waveInterval);
        const morphStage = document.querySelector('.morph-stage');
        if (morphStage) {
          if (centerWaveIndex >= 1) {
            morphStage.style.opacity = '0';
          } else {
            morphStage.style.opacity = '1';
          }
        }

        for(let x = -maxDistX - maxDistY; x <= maxDistX + maxDistY; x++) {
          for(let y = -maxDistY - maxDistX; y <= maxDistY + maxDistX; y++) {
            
            const distance = Math.abs(x) + Math.abs(y);
            if (distance > maxDist + 2) continue;
            
            const delay = (distance - 1) * 0.05;
            const localTime = elapsed - delay;
            
            if (localTime < 0) continue;

            const waveIndex = Math.floor(localTime / waveInterval);
            
            // 中心位置始终渲染，无论waveIndex是多少
            // if (x === 0 && y === 0 && waveIndex === 0) continue;

            const animTime = localTime - waveIndex * waveInterval;
            let progress = animTime / 0.3; // 加快动画速度，从0.6秒改为0.3秒
            if (progress > 1) progress = 1;

            const currWaveType = waveTypes[waveIndex % waveTypes.length];
            const prevWaveType = waveIndex > 0 ? waveTypes[(waveIndex - 1) % waveTypes.length] : null;

            const currImg = getStateImg(currWaveType, distance);
            const prevImg = prevWaveType ? getStateImg(prevWaveType, distance) : null;

            if (progress >= 1) {
              ctx.save();
              ctx.translate(cx + x * realSize, cy + y * realSize);
              ctx.scale(scale, scale);
              // 确保完全不透明
              ctx.globalAlpha = 1;
              // 稍微放大绘制，让虚线边框重叠
              ctx.drawImage(currImg, -stampSize/2 - 1, -stampSize/2 - 1, stampSize + 2, stampSize + 2);
              ctx.restore();
            } else {
              // 恢复颜色过渡效果，同时绘制前一个状态和当前状态
              if (prevImg) {
                ctx.save();
                ctx.translate(cx + x * realSize, cy + y * realSize);
                ctx.scale(scale, scale);
                ctx.globalAlpha = 1 - progress;
                // 稍微放大绘制，让虚线边框重叠
                ctx.drawImage(prevImg, -stampSize/2 - 1, -stampSize/2 - 1, stampSize + 2, stampSize + 2);
                ctx.restore();
              }

              // 弹性效果：先放大到1.05倍，然后缩回到1倍
              const currentScale = 0.2 + 0.85 * easeOutBack(progress);
              const opacity = Math.min(1, progress * 1.5);
              
              if (opacity > 0) {
                ctx.save();
                ctx.translate(cx + x * realSize, cy + y * realSize);
                ctx.scale(scale * currentScale, scale * currentScale);
                ctx.globalAlpha = opacity;
                // 稍微放大绘制，让虚线边框重叠
                ctx.drawImage(currImg, -stampSize/2 - 1, -stampSize/2 - 1, stampSize + 2, stampSize + 2);
                ctx.restore();
              }
            }
          }
        }

        if (isAnimating) {
          animationFrameId = requestAnimationFrame(render);
        }
      };

      animationFrameId = requestAnimationFrame(render);
  };

  // 调用渲染函数
  renderWithImages();

  return () => {
    window.removeEventListener('resize', resize);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
  }, [animationStep]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }} />;
};

const FlowerStamp = () => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const sequence = [
      { step: 1, delay: 300 },
      { step: 2, delay: 600 },
      { step: 3, delay: 900 },
      { step: 4, delay: 1200 },
      { step: 5, delay: 1550 },
      { step: 6, delay: 1900 },
      { step: 7, delay: 2250 },
    ];

    const timeouts = sequence.map(({ step, delay }) => 
      setTimeout(() => setAnimationStep(step), delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const replay = () => {
    setAnimationStep(0);
    setTimeout(() => {
      setAnimationStep(1);
      setTimeout(() => setAnimationStep(2), 300);
      setTimeout(() => setAnimationStep(3), 600);
      setTimeout(() => setAnimationStep(4), 900);
      setTimeout(() => setAnimationStep(5), 1250);
      setTimeout(() => setAnimationStep(6), 1600);
      setTimeout(() => setAnimationStep(7), 1950);
    }, 300);
  };

  return (
    <div className="case-wrapper">
      <div className="stripes-bg"></div>
      
      <button className="replay-btn" onClick={replay}>
        ↻ 重播动画
      </button>
      
      <div className={`animation-container step-${animationStep}`}>
        
        <CanvasGrid animationStep={animationStep} />

        <div className="morph-stage">
          <div className="leaf leaf-top">
            <svg width="24" height="24" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6.57676C3.62838 15.183 16.4176 15.0933 20 6.5941C18.2134 2.4297 13.9112 -0.34316 9.18734 0.0343088C5.01991 0.312819 1.58959 2.96836 0 6.57676Z" fill="white"/>
            </svg>
          </div>
          <div className="leaf leaf-bottom">
            <svg width="24" height="24" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6.57676C3.62838 15.183 16.4176 15.0933 20 6.5941C18.2134 2.4297 13.9112 -0.34316 9.18734 0.0343088C5.01991 0.312819 1.58959 2.96836 0 6.57676Z" fill="white"/>
            </svg>
          </div>
          <div className="leaf leaf-left">
            <svg width="24" height="24" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6.57676C3.62838 15.183 16.4176 15.0933 20 6.5941C18.2134 2.4297 13.9112 -0.34316 9.18734 0.0343088C5.01991 0.312819 1.58959 2.96836 0 6.57676Z" fill="white"/>
            </svg>
          </div>
          <div className="leaf leaf-right">
            <svg width="24" height="24" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6.57676C3.62838 15.183 16.4176 15.0933 20 6.5941C18.2134 2.4297 13.9112 -0.34316 9.18734 0.0343088C5.01991 0.312819 1.58959 2.96836 0 6.57676Z" fill="white"/>
            </svg>
          </div>

          <svg className="squircle" width="40" height="42" viewBox="0 0 40 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5938 0C25.5257 2.50036 27.3594 9.48464 25.001 14.71C30.1159 12.8209 36.5856 14.6967 39 20.4229C37.4104 24.0312 33.9799 26.6873 29.8125 26.9658C28.2824 27.0881 26.7972 26.8775 25.4268 26.3984C27.0786 31.4462 25.1561 37.6477 19.5771 40C15.9688 38.4104 13.3127 34.9799 13.0342 30.8125C12.9119 29.2825 13.1216 27.7972 13.6006 26.4268C8.55294 28.0781 2.35216 26.1558 0 20.5771C1.58959 16.9688 5.02007 14.3127 9.1875 14.0342C10.9179 13.8959 12.5912 14.182 14.1055 14.8027C13.5063 13.5896 13.1299 12.2445 13.0342 10.8125C12.6568 6.08884 15.4296 1.78668 19.5938 0Z" fill="white"/>
            <path d="M3.5 7.5C3.5 8 1.5 17 0 20.5L16 15L19.5 0C18.5 0.5 13.1708 3.5 6.5 3.5C5 3.5 3.5 6 3.5 7.5Z" fill="white"/>
            <path d="M32.1921 3.66274C31.6921 3.65654 22.7176 1.5451 19.2365 0.00181431L24.5377 16.0688L38.9989 20.5C38.5113 19.4939 36.0719 13.3824 36.1546 6.71211C36.1732 5.21223 33.692 3.68134 32.1921 3.66274Z" fill="white"/>
            <path d="M36.0004 33.9961C36.0501 33.4493 37.0004 22.997 38.9969 20.5034L23.8803 25.7997L19.4997 40.0029C20.5409 39.5955 25.8566 36.8958 32.5 37.5C33.9938 37.6359 35.8641 35.4938 36 34L36.0004 33.9961Z" fill="white"/>
            <path d="M3 33C2.95471 32.5021 2.00155 23.1337 2.61841e-05 20.6339L15.1167 25.9302L19.5001 39.9936C18.459 39.5863 12.6708 37 6 37C4.30271 37 3.13586 34.4938 3 33Z" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FlowerStamp;