import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Lottie from "lottie-react";

import h2h from "@/assets/mov/h2h.mp4";
import t2t from "@/assets/mov/t2t.mp4";
import t2h from "@/assets/mov/t2h.mp4";
import h2t from "@/assets/mov/h2t.mp4";
import confettiAnimation from "@/assets/lottie/confetti (2).json";

interface EmailLoginDialogProps {
  open: boolean;
  onClose: () => void;
  derection?: string;
  callback?: () => void;
}

export default function CoinAnimateDialog({ open, onClose, derection, callback }: EmailLoginDialogProps) {
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (open) {
      setShowResult(false);
      setShowConfetti(false);
      // Set playback speed when dialog opens
      if (videoRef.current) {
        videoRef.current.playbackRate = 2.0;
      }
    }
  }, [open]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.0;
    }
  };

  const handleVideoEnd = () => {
    setShowConfetti(true);
    setShowResult(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          margin: { xs: "20px", sm: "32px" },
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'transparent',
          }
        }
      }}
    >
      <DialogContent sx={{ padding: 0, position: "relative", display: 'flex', justifyContent: 'center' }}>
        {showConfetti && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}>
            <Lottie animationData={confettiAnimation} loop={false} />
          </div>
        )}
        <div className="w-90vw md:w1100px max-w-full h-auto max-h-[70vh] md:h700px flex flex-col items-center justify-center px-20px md:px-40px py-40px md:py-40px bg-white">
          <div className={`w-full flex-center transition-all duration-500 ${showResult ? "mt-0" : ""}`}>
            <video ref={videoRef} autoPlay muted playsInline className="w255px h255px md:w400px md:h400px object-cover" src={derection === "heads" ? h2h : t2t} onEnded={handleVideoEnd} onLoadedMetadata={handleVideoLoad}></video>
          </div>

          {showResult && (
            <div className="animate-fade-in w-full">
              <div className="text-center text-24px md:text-34px mt20px">
                <p className="font-bold">{derection === "heads" ? "HEADS!" : "TAILS"}</p>
                <div className="font-bold">
                  <span>
                    YOU WON <span className="text-[#FF7022]">$5</span>
                  </span>
                </div>
              </div>

              <div className="flex justify-center mt30px">
                <div className="w271px h71px rd-full bg-[#FF7022] flex-center text-25px cursor-pointer outline-none select-none" style={{ WebkitTapHighlightColor: "transparent", userSelect: "none", fontFamily: "Tomorrow", fontWeight: 700, fontStyle: "italic" }} onClick={callback}>
                  CLAIM
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
