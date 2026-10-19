import { PropsWithChildren, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import unboxingVideo from "@/assets/version3/unboxing.mp4";
import { CDN_PRIFIX } from "@/constant";

export type LoadingProps = {
  open: boolean;
  onClose: () => void;
  onCallback?: () => void;
};

export default function Loading(props: PropsWithChildren<LoadingProps>) {
  const { open, onClose, onCallback } = props;
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
              src={CDN_PRIFIX + "/unboxing.mp4"}
              autoPlay
              muted
              playsInline
              onLoadedMetadata={handleVideoLoaded}
              onEnded={() => {
                onClose();
                onCallback?.();
              }}
              className="w-screen h-screen object-cover"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
