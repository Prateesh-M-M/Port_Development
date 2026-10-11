import { useState, type ReactNode } from "react";

import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion";

import { ArrowDown, Layers, X } from "lucide-react";

import Header from "../components/Header/Header";

/* PROJECT MEDIA  (images only) */

const DESIGN_MEDIA: Record<string, string | null> = {
  overview: "https://cdn.dribbble.com/userupload/44337207/file/422000aa8a8d691921b97f44721a8927.png?resize=1600x1787&vertical=top",

  // The 4 bento tiles
  couch:
    "https://cdn.dribbble.com/userupload/44337205/file/d2510ca2402a4e212e3177b769be2b38.png?resize=2400x1600&vertical=center", // top-left
  mug: "https://cdn.dribbble.com/userupload/44337206/file/15116ee40c0e688bc73db305e6088b8d.png?resize=2400x1680&vertical=center", // top-right
  cushion:
    "https://cdn.dribbble.com/userupload/44337208/file/14d12f82fd1c4dbe7494e94e4f91b85d.png?resize=2048x1434&vertical=center", // bottom-left
  tote: "https://cdn.dribbble.com/userupload/44337209/file/fbc6f45d5df9ec234fa8ce98f8ed180d.png?resize=1600x2401&vertical=center", // bottom-right (portrait)
};

/*  REUSABLE COMPONENTS */

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ImagePlaceholder({
  title,
  height = "h-[420px]",
  src,
  onClick,
}: {
  title: string;
  height?: string;
  src?: string | null;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={src ? onClick : undefined}
      role={src ? "button" : undefined}
      aria-label={src ? `${title} — click to enlarge` : title}
      className={`group relative ${height} ${
        src ? "cursor-pointer" : ""
      } overflow-hidden rounded-3xl border border-border bg-muted/30`}
    >
      {src ? (
        <>
          <img
            src={src}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="pointer-events-none absolute right-5 top-5 rounded-full bg-background/70 px-3 py-1.5 text-xs opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            Click to enlarge
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_40%)]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background/60 backdrop-blur">
              <Layers size={22} />
            </div>

            <span className="text-sm font-medium text-muted-foreground">
              {title}
            </span>

            <span className="mt-1 text-xs text-muted-foreground/60">
              Replace with project image
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
      {children}
    </span>
  );
}

/* PAGE */

export default function GeometricPatternDesign() {
  const [lightbox, setLightbox] = useState<{
    title: string;
    src: string | null;
  } | null>(null);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const open = (title: string, src: string | null) =>
    setLightbox({ title, src });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="fixed left-0 right-0 top-0 z-[100] h-1 bg-primary"
      />

      <main>
        {/* HERO */}

        <section className="relative overflow-hidden px-6 pb-24 pt-40">
          <div className="pointer-events-none absolute left-1/2 top-20 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl">
            <Reveal>
              <div className="mb-8 flex flex-wrap gap-2">
                <Tag>Graphic Design</Tag>
                <Tag>Pattern Design</Tag>
                <Tag>Mockups</Tag>
              </div>

              <h1 className="max-w-5xl text-6xl font-bold tracking-[-0.04em] md:text-8xl">
                Geometric Pattern Design
              </h1>

              <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
                A seamless pattern built from tropical leaves and toucans,
                arranged into a repeating geometric lattice and applied to
                everyday products.
              </p>
            </Reveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16"
            >
              <ImagePlaceholder
                title="Geometric Pattern Design / Project Overview"
                height="h-[500px]"
                src={DESIGN_MEDIA.overview}
                onClick={() =>
                  open(
                    "Geometric Pattern Design / Project Overview",
                    DESIGN_MEDIA.overview
                  )
                }
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-10 flex justify-center text-muted-foreground"
            >
              <ArrowDown size={20} />
            </motion.div>
          </div>
        </section>

        <section className="px-6 pb-48 pt-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="grid gap-6 md:grid-cols-[792fr_880fr]">
              <Reveal>
                <ImagePlaceholder
                  title="couch"
                  height="h-[360px] md:h-[460px]"
                  src={DESIGN_MEDIA.couch}
                  onClick={() =>
                    open("couch", DESIGN_MEDIA.couch)
                  }
                />
              </Reveal>

              <Reveal>
                <ImagePlaceholder
                  title="Mug Mockup"
                  height="h-[360px] md:h-[460px]"
                  src={DESIGN_MEDIA.mug}
                  onClick={() => open("Mug Mockup", DESIGN_MEDIA.mug)}
                />
              </Reveal>
            </div>

            <div className="grid gap-6 md:grid-cols-[880fr_792fr]">
              <Reveal>
                <ImagePlaceholder
                  title="Cushion Mockup"
                  height="h-[360px] md:h-[620px]"
                  src={DESIGN_MEDIA.cushion}
                  onClick={() => open("Cushion Mockup", DESIGN_MEDIA.cushion)}
                />
              </Reveal>

              <Reveal>
                <ImagePlaceholder
                  title="Tote Bag Mockup"
                  height="h-[460px] md:h-[620px]"
                  src={DESIGN_MEDIA.tote}
                  onClick={() => open("Tote Bag Mockup", DESIGN_MEDIA.tote)}
                />
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* LIGHTBOX */}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 p-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-6xl"
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur"
              >
                <X size={18} />
              </button>

              {lightbox.src ? (
                <img
                  src={lightbox.src}
                  alt={lightbox.title}
                  className="max-h-[85vh] w-full rounded-3xl border border-border object-contain"
                />
              ) : (
                <div className="flex h-[70vh] items-center justify-center rounded-3xl border border-border bg-muted/30">
                  <div className="text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Layers size={25} />
                    </div>

                    <p className="font-medium">{lightbox.title}</p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Replace this placeholder with your actual project image.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}