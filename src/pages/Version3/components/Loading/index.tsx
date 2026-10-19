import { PropsWithChildren, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import loadingVideo from "@/assets/version3/loading.mp4";

import { CDN_PRIFIX } from "@/constant";

export type LoadingProps = {
  open: boolean;
  onClose: () => void;
};

export default function Loading(props: PropsWithChildren<LoadingProps>) {
  const { open, onClose } = props;
  const [videoDuration, setVideoDuration] = useState(1.6); // 默认1.6秒

  // 获取视频实际时长
  const handleVideoLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setVideoDuration(video.duration);
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
              onEnded={onClose}
              className="w-screen h-screen object-cover"
            />

            {/* 居中的 Loading 动画条 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[320px] sm:w-656px h-[32px] bg-#111 rd-7px ring-1 ring-white/6 ring-inset shadow-[0_8px_24px_rgba(0,0,0,0.35)] overflow-hidden ">
                {/* 进度条背景 */}
                <div className="absolute inset-0 bg-#111" />

                {/* 橙色进度条 - 动画时长与视频时长完全匹配 */}
                <div
                  className="absolute top-5px left-4px bottom-0 h-22px rd-7px bg-gradient-to-b from-#FF8A3D to-#FF5A1F"
                  style={{
                    animation: `loadingProgress ${videoDuration}s ease-in-out 1 forwards`,
                  }}
                />

                {/* 文本 */}
                <div className="absolute inset-0 flex items-center justify-center text-#EDEDED tracking-[4px] font-600 text-14px font-[ABCDiatypeMono-Regular]">
                  LOADING...
                </div>
              </div>
            </div>

            {/* 关键帧 */}
            <style>{`
              @keyframes loadingProgress {
                0% { 
                  width: 0;
                }
                100% { 
                  width: calc(100% - 8px);
                }
              }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
