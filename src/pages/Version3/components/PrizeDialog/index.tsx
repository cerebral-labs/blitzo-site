import { AnimatePresence, motion } from "motion/react";
import Lottie from "lottie-react";
import confetti from "@/assets/lottie/confetti (2).json";
import { useState } from "react";
import { CDN_PRIFIX } from "@/constant";
interface PrizeDialogProps {
  open: boolean;
  onClose: () => void;
  params: any;
  onVerified?: () => void;
}

export default function PrizeDialog({
  open,
  onClose,
  params,
  onVerified,
}: PrizeDialogProps) {
  const isClaimed =
    params?.linked_accounts.filter((account: any) => account.type === "phone")
      .length > 0;

  const [hideLottie, setHideLottie] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1300,
            }}
          />

          <motion.div
            className="flex items-center justify-center"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 36,
              mass: 0.6,
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1301,
            }}
          >
            <div className="mx-auto w376px rd-30px box-border p36px bg-black text-white relative">
              {!isClaimed && !hideLottie && (
                <div
                  className="w-full h-full flex-center translate-y--90px"
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                >
                  <Lottie
                    animationData={confetti}
                    loop={false}
                    onComplete={() => setHideLottie(true)}
                  />
                </div>
              )}

              <div className="flex-center glow-fire fire-flicker-animation">
                <img
                  src={require("@/assets/version3/blitzoLogo.png")}
                  alt="blitzo"
                  className="h35px"
                />
              </div>
              <div className="mx-auto mt50px w252px h338px">
                <img src={CDN_PRIFIX + "/goldticket.png"} alt="" />
              </div>

              <div className="text-center mt15px text-14px">
                <p>
                  Ticket Class: <span className="font-bold">Gold</span>
                </p>
                <p className="mt8px">
                  Tag: <span className="font-bold">First 10k User</span>
                </p>
              </div>

              {(isClaimed && (
                <div className="mx-auto mt50px flex gap-10px items-center justify-center w206px h67px rd-65px bg-[#292929] text-[#A8A8A8] btn-particle">
                  <span className="text-22px ">
                    {isClaimed ? "Claimed" : "Claim Ticket"}
                  </span>
                </div>
              )) || (
                <div
                  className="mx-auto mt50px flex gap-10px items-center justify-center w206px h67px rd-65px bg-[#fff] text-black btn-particle"
                  onClick={onVerified}
                >
                  <span className="text-22px neon-text">
                    {isClaimed ? "Claimed" : "Claim Ticket"}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
