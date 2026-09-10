import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Layers,
  Search,
  Target,
  Maximize2,
  X,
} from "lucide-react";

import Header from "../components/Header/Header";
import CaseStudyNav from "../components/CaseStudyNav/CaseStudyNav";
import { useLenis } from "lenis/react";

/* =========================================================
   PROJECT MEDIA
   Two kinds of entries are supported per tile:

   1. A still image (e.g. a Dribbble shot):
        { kind: "image", url: "https://cdn.dribbble.com/.../shot.png" }
      (right-click the shot on Dribbble → "Copy image address" —
      the page URL alone won't render as an image)

   2. A live, interactive Figma prototype:
        { kind: "figma", url: "https://www.figma.com/proto/XXXX/Your-File?node-id=..." }
      (use the "Present" / prototype link from Figma, with link
      sharing turned on, or the ready-made src from Figma's
      "Embed" panel — both are supported)

   Leave an entry as `null` to keep the grey placeholder tile.
   Each heuristic (01–10) is keyed to match its `number` field
   below, e.g. DESIGN_MEDIA.heuristic01 for Heuristic 01.
========================================================= */

type DesignMediaKind = "image" | "figma";

interface DesignMedia {
  kind: DesignMediaKind;
  url: string;
}

const DESIGN_MEDIA: Record<string, DesignMedia | null> = {
  overview: { kind: "image", url: "https://cdn.dribbble.com/userupload/44336424/file/f6ab7185375041658418c5487deaf909.png?resize=2400x1350&vertical=center" },
  heuristic01: { kind: "image", url: "https://cdn.dribbble.com/userupload/44336426/file/19a75281ce7a997a8a00af37c609afda.png?resize=2048x2340&vertical=center" },
  heuristic02: { kind: "image", url: "https://cdn.dribbble.com/userupload/48972848/file/83799d90d76066e83aa124a84f1af25a.png?resize=2048x1222&vertical=center" },
  heuristic03: { kind: "image", url: "https://cdn.dribbble.com/userupload/48972846/file/4e824422dc7b32c80e010f0f51c229dc.png?resize=2048x1275&vertical=center" },
  heuristic04: { kind: "image", url: "https://cdn.dribbble.com/userupload/48972850/file/d23588c978a486a0d58e8e355ab1c5a1.png?resize=2400x1695&vertical=center" },
  heuristic05: { kind: "image", url: "https://cdn.dribbble.com/userupload/48972845/file/84dd5fa73a47b1af9759547b5dc819dd.png?resize=3810x2396&vertical=center" },
  heuristic06: { kind: "image", url: "https://cdn.dribbble.com/userupload/48972849/file/3d7ae53dc0899b73cbe2257eb5e346ac.png?resize=2048x1451&vertical=center" },
  heuristic07: { kind: "image", url: "https://cdn.dribbble.com/userupload/48972851/file/d6d80ce1f0ca59fbcba93cf083d784f3.png?resize=2048x1607&vertical=center" },
  heuristic08: { kind: "image", url: "https://cdn.dribbble.com/userupload/48972844/file/c1486255eea412d785536bf268f7caa0.png?resize=1920x1524&vertical=center" },
  heuristic09: { kind: "image", url: "https://cdn.dribbble.com/userupload/48972842/file/0e6ce6d845b3859b911bce34c0706bcf.png?resize=2048x1262&vertical=center" },
  heuristic10: { kind: "image", url: "https://cdn.dribbble.com/userupload/48972843/file/98b48c0eb54a4963a68c4d5caf6153b0.png?resize=1920x1526&vertical=center" },
};

function toFigmaEmbedUrl(prototypeUrl: string) {
  // Already a ready-to-use embed URL (e.g. copied straight from Figma's
  // "Embed" panel) — use it as-is instead of double-wrapping it.
  if (prototypeUrl.includes("figma.com/embed")) {
    return prototypeUrl;
  }

  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
    prototypeUrl
  )}`;
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

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

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-14">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
          {number}
        </span>
        <div className="h-px w-12 bg-border" />
      </div>

      <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * ImagePlaceholder accepts a `media` entry (see DESIGN_MEDIA above).
 * Behaviour differs by kind:
 *  - "image": shown filling the tile; clicking anywhere opens the
 *    enlarged image in the in-page lightbox.
 *  - "figma": the live prototype is embedded directly in the tile
 *    (fully interactive on hover/click); a small "Full screen"
 *    button opens a larger embed in the lightbox without hijacking
 *    normal clicks inside the prototype.
 * With no `media`, it falls back to the original grey placeholder tile.
 */
function ImagePlaceholder({
  title,
  height = "h-[420px]",
  media,
  onClick,
}: {
  title: string;
  height?: string;
  media?: DesignMedia | null;
  onClick?: () => void;
}) {
  const isImage = media?.kind === "image";
  const isFigma = media?.kind === "figma";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={isImage ? onClick : undefined}
      role={isImage ? "button" : undefined}
      aria-label={isImage ? `${title} — click to enlarge` : title}
      className={`
        group relative ${height} overflow-hidden rounded-3xl
        border border-border bg-muted/30 ${isImage ? "cursor-pointer" : ""}
      `}
    >
      {isImage && (
        <img
          src={media!.url}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}

      {isFigma && (
        <iframe
          src={toFigmaEmbedUrl(media!.url)}
          title={title}
          allow="fullscreen"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}

      {!media && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_40%)]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
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

      {isImage && (
        <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-1 rounded-full bg-background/70 px-3 py-1.5 text-xs opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          Click to enlarge
        </div>
      )}

      {isFigma && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick?.();
          }}
          className="absolute right-5 top-5 z-10 flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-xs opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
        >
          <Maximize2 size={12} />
          Full screen
        </button>
      )}

      {!media && (
        <div className="pointer-events-none absolute right-5 top-5 rounded-full bg-background/70 px-3 py-1.5 text-xs opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          View
        </div>
      )}
    </motion.div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-border bg-card/50 p-6 transition-colors hover:bg-card"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={20} />
      </div>

      <h3 className="mb-2 font-semibold">{title}</h3>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
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

/* =========================================================
   HEURISTIC DATA
========================================================= */

const heuristics = [
  {
    number: "01",
    title: "Visibility of System Status",
    image: "Heuristic 01 — Visibility of System Status",
    observations: [
      "Myntra provides clear feedback for user actions.",
      "The search experience gives users immediate visual feedback and updates dynamically.",
      "Loading screens appear during page transitions/loading states.",
    ],
    issue: "System feedback can still be made more explicit and consistent across different loading and interaction states.",
    suggestion: "Use clearer loading indicators, progress feedback, and state changes so users always understand what the system is doing.",
  },
  {
    number: "02",
    title: "Match Between System and the Real World",
    image: "Heuristic 02 — Match Between System and the Real World",
    observations: [
      "The language and categories are familiar to online fashion shoppers.",
      "Terms such as 'Men', 'Women', and other category labels follow users' expectations and a familiar shopping structure.",
    ],
    issue: "Some category and product terminology can become dense when many options are presented together.",
    suggestion: "Continue using familiar shopping terminology and group related categories in a way that mirrors how users naturally browse for clothing.",
  },
  {
    number: "03",
    title: "User Control & Freedom",
    image: "Heuristic 03 — User Control & Freedom",
    observations: [
      "Users can navigate between product details, cart, wishlist, and previous shopping states.",
      "The return/exchange process is clearly structured.",
    ],
    issue: "Users should always have an obvious way to undo, close, return, or move back from an action without losing their context.",
    suggestion: "Provide stronger cancel/close/undo affordances wherever an action opens a new state or interrupts the current shopping flow.",
  },
  {
    number: "04",
    title: "Consistency & Standards",
    image: "Heuristic 04 — Consistency & Standards",
    observations: [
      "The interface follows common e-commerce conventions for navigation, search, filters, product cards, and shopping actions.",
      "Buttons and labels maintain a consistent visual language across the experience.",
    ],
    issue: "Consistency can be affected when promotional modules use different visual treatments from the surrounding interface.",
    suggestion: "Standardize button styles, labels, spacing, and interaction patterns across promotional and transactional areas.",
  },
  {
    number: "05",
    title: "Error Prevention",
    image: "Heuristic 05 — Error Prevention",
    observations: [
      "Forms provide guidance while users enter information.",
      "Buttons and labels help users understand the expected action before submitting information.",
    ],
    issue: "Some form states can benefit from stronger prevention and validation before the user reaches an error.",
    suggestion: "Use inline validation, clearer required-field indicators, sensible defaults, and constraints that prevent invalid input before submission.",
  },
  {
    number: "06",
    title: "Recognition Rather Than Recall",
    image: "Heuristic 06 — Recognition Rather Than Recall",
    observations: [
      "Product pages display visual previews, making it easier for users to recognize products rather than remember names.",
      "Filters, categories, and product information remain visible while browsing.",
    ],
    issue: "Large product grids can still require users to remember which products they have already considered.",
    suggestion: "Make comparison, wishlist, recently viewed, and saved-product states more prominent so users can recognize previous choices quickly.",
  },
  {
    number: "07",
    title: "Flexibility & Efficiency of Use",
    image: "Heuristic 07 — Flexibility & Efficiency of Use",
    observations: [
      "Myntra offers filtering and sorting options to help users narrow a large product catalogue.",
      "Users can combine filters to refine the product set.",
    ],
    issue: "There is limited support for faster repeat actions and shortcuts for experienced users.",
    suggestion: "Add a 'Buy Now' or similarly direct action where appropriate, and provide quicker access to frequently used filters and recently used preferences.",
  },
  {
    number: "08",
    title: "Aesthetic & Minimalist Design",
    image: "Heuristic 08 — Aesthetic & Minimalist Design",
    observations: [
      "The interface uses a balance of images and text.",
      "White space is used throughout the interface.",
    ],
    issue: "Some promotional content uses large areas of the page and can compete with important content below it.",
    suggestion: "Optimize banner and promotional content so it remains visually engaging without pushing important product information too far down the page.",
  },
  {
    number: "09",
    title: "Help Users Recognize, Diagnose & Recover from Errors",
    image: "Heuristic 09 — Help Users Recognize, Diagnose & Recover from Errors",
    observations: [
      "Error states are present for invalid or unavailable inputs.",
    ],
    issue: "Error messaging can be more descriptive about what went wrong and how the user can recover.",
    suggestion: "Use clear, human-readable error messages that identify the problem and provide an immediate next action.",
  },
  {
    number: "10",
    title: "Help & Documentation",
    image: "Heuristic 10 — Help & Documentation",
    observations: [
      "The footer provides access to help-related information, policies, app links, and supporting resources.",
      "Important support information is available without interrupting the shopping experience.",
    ],
    issue: "Some support content can require users to navigate through large amounts of information before finding the exact answer they need.",
    suggestion: "Make frequently needed help easier to scan and provide direct paths to common support topics.",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function MyntraHeuristicEvaluation() {
  const lenis = useLenis();
  const [lightbox, setLightbox] = useState<{
    title: string;
    media?: DesignMedia | null;
  } | null>(null);
  const [showTop, setShowTop] = useState(false);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openLightbox = (title: string, media?: DesignMedia | null) => {
    setLightbox({ title, media });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="fixed left-0 right-0 top-0 z-[100] h-1 bg-primary"
      />

      <main>
        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative overflow-hidden px-6 pb-24 pt-40">
          <div className="pointer-events-none absolute left-1/2 top-20 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl">
            <Reveal>
              <div className="mb-8 flex flex-wrap gap-2">
                <Tag>UX Analysis</Tag>
                <Tag>Myntra</Tag>
                <Tag>Heuristic Evaluation</Tag>
                <Tag>E-Commerce</Tag>
              </div>

              <h1 className="max-w-5xl text-6xl font-bold tracking-[-0.04em] md:text-8xl">
                Heuristic Evaluation of Myntra
              </h1>

              <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
                A usability review of Myntra using Jakob Nielsen&apos;s
                10 usability heuristics to identify interaction issues,
                usability strengths, and opportunities for improvement.
              </p>
            </Reveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16"
            >
              <ImagePlaceholder
                title="Heuristic Evaluation of Myntra"
                height="h-[500px]"
                media={DESIGN_MEDIA.overview}
                onClick={() =>
                  openLightbox("Heuristic Evaluation of Myntra", DESIGN_MEDIA.overview)
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

        <CaseStudyNav />

        {/* ===================================================
            OVERVIEW
        =================================================== */}

        <section
          id="overview"
          className="scroll-mt-32 px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="01"
              title="Overview"
              description="The evaluation examines Myntra's shopping experience against Jakob Nielsen's usability heuristics."
            />

            <div className="grid gap-5 md:grid-cols-3">
              <InfoCard icon={Target} title="Method">
                Heuristic evaluation based on Jakob Nielsen&apos;s 10
                usability heuristics.
              </InfoCard>

              <InfoCard icon={Search} title="Scope">
                Navigation, search, product browsing, forms, errors,
                promotional content, and help/support.
              </InfoCard>

              <InfoCard icon={Check} title="Output">
                Observations, usability issues, and design suggestions
                for each heuristic.
              </InfoCard>
            </div>
          </div>
        </section>

        {/* ===================================================
            HEURISTIC EVALUATION
        =================================================== */}

        <section
          id="heuristics"
          className="scroll-mt-32 border-t border-border px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="02"
              title="Heuristic Evaluation"
              description="Each section below follows the structure of the original evaluation: interface evidence, observation, issue, and suggested improvement."
            />

            <div className="space-y-24">
              {heuristics.map((heuristic) => {
                const mediaKey = `heuristic${heuristic.number}`;
                const media = DESIGN_MEDIA[mediaKey];

                return (
                  <Reveal key={heuristic.number}>
                    <article
                      id={`heuristic-${heuristic.number}`}
                      className="scroll-mt-32"
                    >
                      <div className="mb-8 flex items-end justify-between gap-6">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                            Heuristic {heuristic.number}
                          </p>

                          <h3 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                            {heuristic.title}
                          </h3>
                        </div>

                        <span className="hidden text-6xl font-bold text-muted-foreground/10 md:block">
                          {heuristic.number}
                        </span>
                      </div>

                      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
                        <ImagePlaceholder
                          title={heuristic.image}
                          height="h-[420px]"
                          media={media}
                          onClick={() => openLightbox(heuristic.image, media)}
                        />

                        <div className="space-y-5">
                          <div className="rounded-3xl border border-border bg-card/40 p-7">
                            <h4 className="font-semibold">Observation</h4>

                            <ul className="mt-5 space-y-3">
                              {heuristic.observations.map((item) => (
                                <li
                                  key={item}
                                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                                >
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-3xl border border-border p-7">
                            <h4 className="font-semibold">Issue</h4>
                            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                              {heuristic.issue}
                            </p>
                          </div>

                          <div className="rounded-3xl bg-primary p-7 text-primary-foreground">
                            <h4 className="font-semibold">Suggestion</h4>
                            <p className="mt-4 text-sm leading-relaxed opacity-85">
                              {heuristic.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================
            KEY TAKEAWAYS
        =================================================== */}

        <section
          id="takeaways"
          className="scroll-mt-32 border-t border-border px-6 py-32 pb-48"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="03"
              title="Key Takeaways"
              description="The evaluation highlights areas where Myntra's experience can become clearer, more predictable, and easier to recover from."
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <Reveal>
                <div className="rounded-3xl border border-border bg-card/40 p-8">
                  <h3 className="text-2xl font-bold">
                    Strengths observed
                  </h3>

                  <div className="mt-8 space-y-5">
                    {[
                      "Uses familiar e-commerce patterns and terminology.",
                      "Provides clear visual product recognition through imagery.",
                      "Supports product discovery through filtering and categorization.",
                      "Maintains a recognizable visual language across the shopping experience.",
                      "Provides access to help, policies, and support resources.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex gap-4 text-sm leading-relaxed text-muted-foreground"
                      >
                        <Check
                          size={18}
                          className="mt-0.5 shrink-0 text-primary"
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl bg-primary p-8 text-primary-foreground">
                  <h3 className="text-3xl font-bold">
                    Main opportunities
                  </h3>

                  <div className="mt-8 space-y-5">
                    {[
                      "Make system status and feedback more explicit.",
                      "Strengthen error prevention and recovery messaging.",
                      "Reduce the visual dominance of promotional content.",
                      "Improve shortcuts and repeat actions for frequent users.",
                      "Make support content faster to scan and navigate.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex gap-4 text-sm leading-relaxed opacity-85"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="mt-32 border-t border-border pt-12">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Next Case Study
              </p>

              <button className="group mt-5 flex items-center gap-4 text-3xl font-bold md:text-5xl">
                Heuristic Evaluation
                <ArrowUpRight className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          BACK TO TOP
      ===================================================== */}

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 shadow-xl backdrop-blur transition hover:bg-muted"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* =====================================================
          LIGHTBOX
          Renders an enlarged image, a bigger interactive Figma
          embed, or the fallback placeholder — depending on
          which media kind (if any) that tile has in DESIGN_MEDIA.
      ===================================================== */}

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

              {lightbox.media?.kind === "image" && (
                <img
                  src={lightbox.media.url}
                  alt={lightbox.title}
                  className="max-h-[85vh] w-full rounded-3xl border border-border object-contain"
                />
              )}

              {lightbox.media?.kind === "figma" && (
                <iframe
                  src={toFigmaEmbedUrl(lightbox.media.url)}
                  title={lightbox.title}
                  allow="fullscreen"
                  className="h-[85vh] w-full rounded-3xl border border-border"
                />
              )}

              {!lightbox.media && (
                <div className="flex h-[70vh] items-center justify-center rounded-3xl border border-border bg-muted/30">
                  <div className="text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Layers size={25} />
                    </div>

                    <p className="font-medium">{lightbox.title}</p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Replace this placeholder with the corresponding
                      evaluation screenshot.
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