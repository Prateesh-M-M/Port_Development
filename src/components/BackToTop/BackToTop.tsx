import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";

export default function BackToTop() {
  const lenis = useLenis();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setShow((window.scrollY || document.documentElement.scrollTop) > 1000);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();

    lenis?.start();
    lenis?.scrollTo(0, { immediate: true, force: true });

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onPointerDown={goTop}
          onClick={goTop}
          style={{ position: "fixed", bottom: 24, right: 24, zIndex: 10000 }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 shadow-xl backdrop-blur transition hover:bg-muted"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>,
    document.body
  );
}