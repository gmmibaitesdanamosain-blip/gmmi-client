import { memo, useEffect, useState } from "react";
import { Image } from "@heroui/react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingLogo = memo(() => (
  <motion.div
    className="flex h-56 w-56 items-center justify-center rounded-full p-4"
    animate={{
      rotateY: [0, 360],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{ perspective: 1000 }}
  >
    <Image
      src="/img/LOGO GMMI.png"
      alt="GMMI Loading"
      width={512}
      height={512}
      draggable={false}
      className="h-full w-full object-contain"
    />
  </motion.div>
));
LoadingLogo.displayName = "";

const LoadingText = memo(() => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="text-sm font-semibold text-white tracking-widest"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      Loading{dots}
    </motion.div>
  );
});
LoadingText.displayName = "LoadingText";

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [portalEl] = useState<HTMLElement>(() => {
    let el = document.getElementById("loading-screen-portal");
    if (!el) {
      el = document.createElement("div");
      el.id = "loading-screen-portal";
      document.body.appendChild(el);
    }
    return el;
  });

  return createPortal(
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(2px)",
            pointerEvents: "auto",
            zIndex: 99999,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex flex-col items-center justify-center gap-5"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <LoadingLogo />

            {/* Pulse ring behind logo */}
            {/* <motion.div
              className="absolute h-36 w-36 rounded-full border-2 border-white/20"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            /> */}

            {/* <LoadingText /> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalEl,
  );
};

export default LoadingScreen;
