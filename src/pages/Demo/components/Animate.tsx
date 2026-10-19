import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface AnimateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AnimateDialog({
  isOpen,
  onClose,
  children,
}: AnimateDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(30, 30, 30, 0.18)",
              backdropFilter: "blur(15px) saturate(1.5)",
              WebkitBackdropFilter: "blur(15px) saturate(1.5)",
              transition: "backdrop-filter 0.3s",
            }}
            onClick={onClose}
          >
            {/* Dialog content with scale */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                },
              }}
              exit={{
                scale: 0.5,
                opacity: 0,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Example usage:
export function DemoDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: "12px 24px",
          borderRadius: "8px",
          backgroundColor: "#FF731C",
          color: "white",
          border: "none",
          cursor: "pointer",
          font: "inherit",
        }}
      >
        打开弹窗
      </button>

      <AnimateDialog isOpen={open} onClose={() => setOpen(false)}>
        <div style={{ minWidth: "300px" }}>
          <h2 style={{ margin: "0 0 16px" }}>Dialog 标题</h2>
          <p style={{ margin: "0 0 24px" }}>
            这是一个从小变大的动画弹窗示例。点击背景可以关闭。
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: "#FF731C",
                color: "white",
                border: "none",
                cursor: "pointer",
                font: "inherit",
              }}
            >
              关闭
            </button>
          </div>
        </div>
      </AnimateDialog>
    </div>
  );
}
