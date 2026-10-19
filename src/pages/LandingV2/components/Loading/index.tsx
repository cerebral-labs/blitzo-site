import { PropsWithChildren, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

import { CDN_PRIFIX } from "@/constant";

export type LoadingProps = {
  open: boolean;
  onClose: () => void;
};

export default function Loading(props: PropsWithChildren<LoadingProps>) {
  const { open, onClose } = props;
  const [videoDuration, setVideoDuration] = useState<number | null>(null); // 初始时为null，等待视频加载完成
  const [progress, setProgress] = useState(0);

  // 获取视频实际时长
  const handleVideoLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setVideoDuration(video.duration); // 设置为视频实际时长
  };

  // 实时更新进度
  useEffect(() => {
    if (!open || !videoDuration) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / (videoDuration * 60)); // 60fps更新
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [open, videoDuration]);

  // 当视频播放完毕时关闭加载
  const handleVideoEnded = () => {
    setProgress(100);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[1400] bg-black"
          />

          {/* 全屏视频容器 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[1401]"
          >
            <video
              src={CDN_PRIFIX + "/loading.mp4"}
              autoPlay
              muted
              playsInline
              onLoadedMetadata={handleVideoLoaded}
              onEnded={handleVideoEnded}
              className="w-screen h-screen object-cover"
            />

            {/* 居中的 Loading 动画条 - 三层结构 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-16px">
              {/* 最外层：淡白色边框 */}
              <div className="relative w-[280px] sm:w-[400px] h-[28px] sm:h-[36px] bg-[rgba(200,200,200,0.6)] rd-[18px] p-[2px]">
                {/* 中间层：灰黑色轨道 */}
                <div className="relative w-full h-full bg-[#2a2a2a] rd-[16px] p-[4px]">
                  {/* 最内层：纯白色发光进度条 */}
                  <div
                    className="h-full bg-white rd-[12px] relative"
                    style={{
                      width: `${progress}%`,
                      boxShadow: progress > 0 ? '0 0 16px rgba(255, 255, 255, 0.8), 0 0 32px rgba(255, 255, 255, 0.4), inset 0 1px 3px rgba(255, 255, 255, 0.9)' : 'none',
                    }}
                  >
                    {/* 顶部高光 */}
                    {progress > 0 && (
                      <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/80 to-transparent rd-t-[12px]" />
                    )}
                  </div>
                </div>
              </div>

              {/* 百分比显示 */}
              <div className="text-white text-24px sm:text-32px font-bold font-[ABCDiatypeMono-Regular] min-w-[80px] sm:min-w-[100px]">
                {Math.round(progress)}%
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
