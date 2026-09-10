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
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Users,
  Target,
  Search,
  Layers,
  FlaskConical,
  Sparkles,
  Zap,
  BarChart3,
  PieChart,
  Palette,
  Smartphone,
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
      sharing turned on — it's embedded in an iframe so it stays
      interactive right on the page)

   Leave an entry as `null` to keep the grey placeholder tile.
========================================================= */

type DesignMediaKind = "image" | "figma";

interface DesignMedia {
  kind: DesignMediaKind;
  url: string;
}

const DESIGN_MEDIA: Record<string, DesignMedia | null> = {
  overview: {
    kind: "image",
    url: "https://cdn.dribbble.com/userupload/44336281/file/0333295e0300b04d6e88d5819fde13f1.png?resize=1600x899&vertical=center",
  },
  designProcess: {
    kind: "image",
    url: "https://cdn.dribbble.com/userupload/44336287/file/420817d24970c81617840d88f39490ac.png?resize=1600x899&vertical=center",
  },
  qualitativeResearch: {
    kind: "image",
    url: "https://cdn.dribbble.com/userupload/44336282/file/633c5a09a23d617b00af892f3b5cb448.png?resize=1600x753&vertical=center",
  },
  quantitativeResearchCharts: {
    kind: "image",
    url: "https://cdn.dribbble.com/userupload/44336291/file/11d9dec9fe211418157f1c875aa78388.png?resize=1905x1232&vertical=center",
  },
  competitorAnalysisMatrix: {
    kind: "image",
    url: "https://cdn.dribbble.com/userupload/44336290/file/c7dbcf8319c8f8d1d1fd6acf10334799.png?resize=2048x1151&vertical=center",
  },
  userPersonas: {
    kind: "image",
    url: "https://cdn.dribbble.com/userupload/44336289/file/714ccf7e6433191566a72cb8d3f3bd67.png?resize=975x1600&vertical=center",
  },
  empathyMaps: {
    kind: "image",
    url: "https://cdn.dribbble.com/userupload/44336288/file/cb904ad963eebc776b6f3a526e95ffcc.png?resize=975x1600&vertical=center",
  },
  moodBoard: {
    kind: "image",
    url: "https://cdn.dribbble.com/userupload/44336297/file/36ed8a61b038ab59dd4b08944318404b.png?resize=975x787&vertical=center",
  },
  informationArchitecture: {
    kind: "image",
    url: "https://cdn.dribbble.com/userupload/48934720/file/cc85414ffeb023288b4c27d2845f1c86.png?resize=975x807&vertical=center",
  },
  userFlow: {
    kind: "image",
    url: "https://cdn.dribbble.com/userupload/44336286/file/8fdf0ac186422091fe29270302282ef0.png?resize=1369x1600&vertical=center",
  },
  highFidelity: {
    kind: "figma",
    url: "https://embed.figma.com/proto/fRXXGT4AYZ79sLY6diSmwc/Mini-Project-4-AInergy?node-id=471-23544&scaling=scale-down&content-scaling=fixed&page-id=377%3A22725&starting-point-node-id=471%3A23540&embed-host=share",
  },
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
 * ImagePlaceholder now accepts a `media` entry (see DESIGN_MEDIA
 * above). Behaviour differs by kind:
 *  - "image": shown filling the tile; clicking anywhere opens
 *    the enlarged image in the in-page lightbox.
 *  - "figma": the live prototype is embedded directly in the
 *    tile (fully interactive on hover/click); a small "Full
 *    screen" button opens a larger embed in the lightbox
 *    without hijacking normal clicks inside the prototype.
 * With no `media`, it falls back to the original grey
 * placeholder tile.
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
      className={`group relative ${height} ${
        isImage ? "cursor-pointer" : ""
      } overflow-hidden rounded-3xl border border-border bg-muted/30`}
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

      {isImage && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-1 rounded-full bg-background/70 px-3 py-1.5 text-xs opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            Click to enlarge
          </div>
        </>
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
        <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-1 rounded-full bg-background/70 px-3 py-1.5 text-xs opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
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
   CASE STUDY DATA
   Content is structured from the supplied AI-NERGY board.
========================================================= */

const designProcess = [
  ["01", "Research", "Understand the problem, users, habits and existing energy products."],
  ["02", "Define", "Synthesize research into a focused problem and opportunity."],
  ["03", "Ideate", "Explore multiple ways AI could make energy information actionable."],
  ["04", "Design", "Translate the strongest ideas into flows, architecture and interfaces."],
  ["05", "Validate", "Use research and testing to refine the experience."],
];

const qualitativeFindings = [
  {
    title: "Energy data is difficult to interpret",
    text: "People can see numbers and charts, but raw energy data does not always explain what the numbers mean in everyday life.",
  },
  {
    title: "Users need actionable guidance",
    text: "Instead of simply monitoring consumption, users need help understanding what they can change and why it matters.",
  },
  {
    title: "Context matters",
    text: "Energy consumption changes depending on routines, appliances, weather and household behaviour.",
  },
  {
    title: "Personalization can increase relevance",
    text: "Different households have different devices, schedules and priorities, so recommendations need to reflect individual contexts.",
  },
];

const quantitativeFindings = [
  {
    label: "Energy awareness",
    value: "Low",
    text: "Users are more familiar with bills and costs than technical energy metrics.",
  },
  {
    label: "Actionability",
    value: "High need",
    text: "Users expect an energy product to tell them what action they can take next.",
  },
  {
    label: "Personalization",
    value: "Important",
    text: "Recommendations become more useful when they relate to the user's own devices and routines.",
  },
];

const competitors = [
  {
    name: "Google Home",
    focus: "Connected home",
    strength: "Device ecosystem",
    opportunity: "Energy insights can be more contextual and action-oriented.",
  },
  {
    name: "Sense",
    focus: "Energy monitoring",
    strength: "Detailed consumption data",
    opportunity: "Complex data can be translated into simpler everyday recommendations.",
  },
  {
    name: "Energy utilities",
    focus: "Billing & consumption",
    strength: "Trusted usage and billing information",
    opportunity: "Move beyond reporting toward proactive guidance.",
  },
];

const personas = [
  {
    type: "Primary User",
    name: "The Optimizer",
    description:
      "Actively wants to reduce energy consumption and understand where savings are possible.",
    tags: ["Data curious", "Goal oriented", "Cost conscious"],
  },
  {
    type: "Primary User",
    name: "The Casual User",
    description:
      "Does not want to study a dashboard but wants simple recommendations when something needs attention.",
    tags: ["Low effort", "Simple guidance", "Time limited"],
  },
  {
    type: "Secondary User",
    name: "The Household Manager",
    description:
      "Manages household bills and wants a clear picture of recurring energy patterns.",
    tags: ["Planning", "Budget focused", "Long term"],
  },
  {
    type: "Secondary User",
    name: "The Conscious Consumer",
    description:
      "Wants to make more sustainable everyday decisions but needs understandable feedback.",
    tags: ["Sustainability", "Habit driven", "Impact focused"],
  },
];

const empathyMaps = [
  {
    title: "The Optimizer",
    says: "I want to know where I can save energy.",
    thinks: "There must be a better way to understand these numbers.",
    does: "Checks usage, compares periods and experiments with devices.",
    feels: "Curious but sometimes overwhelmed by data.",
  },
  {
    title: "The Casual User",
    says: "Just tell me if something needs attention.",
    thinks: "I don't have time to analyse another dashboard.",
    does: "Glances at summaries and acts on simple recommendations.",
    feels: "Confident when guidance is clear and quick.",
  },
  {
    title: "The Household Manager",
    says: "How much will this affect my bill?",
    thinks: "I need to understand recurring patterns.",
    does: "Tracks costs and household usage.",
    feels: "Responsible for keeping consumption under control.",
  },
];

const architecture = [
  {
    title: "Home",
    children: ["Today's usage", "Estimated cost", "AI recommendation"],
  },
  {
    title: "Insights",
    children: ["Usage history", "Trends", "Personal insights"],
  },
  {
    title: "Devices",
    children: ["Connected devices", "Device usage", "Device details"],
  },
  {
    title: "Goals",
    children: ["Energy goals", "Progress", "Achievements"],
  },
];

const moodBoard = [
  "Calm",
  "Trustworthy",
  "Intelligent",
  "Approachable",
  "Data-driven",
  "Minimal",
];

/* =========================================================
   PAGE
========================================================= */

export default function AINergy() {
  const lenis = useLenis();
  const [lightbox, setLightbox] = useState<{
    title: string;
    media?: DesignMedia | null;
  } | null>(
    null
  );
  const [expandedResearch, setExpandedResearch] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 1000);

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
                <Tag>UX Case Study</Tag>
                <Tag>AI-NERGY</Tag>
                <Tag>Energy</Tag>
                <Tag>Mobile App</Tag>
              </div>

              <h1 className="max-w-5xl text-6xl font-bold tracking-[-0.04em] md:text-8xl">
                AI-NERGY
              </h1>

              <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
                An intelligent energy companion designed to turn complex
                household energy data into simple, contextual and actionable
                decisions.
              </p>
            </Reveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16"
            >
              <ImagePlaceholder
                title="AI-NERGY Case Study / Project Overview"
                height="h-[500px]"
                media={DESIGN_MEDIA.overview}
                onClick={() =>
                  setLightbox({ title: "AI-NERGY Case Study / Project Overview", media: DESIGN_MEDIA.overview })
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
            INTRODUCTION
        =================================================== */}

        <section id="introduction" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="01"
              title="Introduction"
              description="AI-NERGY explores how intelligent interfaces can make household energy information easier to understand and easier to act upon."
            />

            <div className="grid gap-5 md:grid-cols-3">
              <InfoCard icon={Target} title="Goal">
                Make energy consumption understandable without requiring users
                to interpret technical charts and metrics.
              </InfoCard>

              <InfoCard icon={Sparkles} title="AI Opportunity">
                Transform passive monitoring into contextual recommendations
                that explain what is happening and what users can do.
              </InfoCard>

              <InfoCard icon={Zap} title="Design Direction">
                Connect energy information with familiar household actions,
                devices, costs and goals.
              </InfoCard>
            </div>
          </div>
        </section>

        {/* ===================================================
            PROBLEM STATEMENT
        =================================================== */}

        <section
          id="problem-statement"
          className="scroll-mt-32 border-t border-border px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="02"
              title="Problem Statement"
              description="Energy dashboards often show users what happened without helping them understand why it happened or what they should do next."
            />

            <Reveal>
              <div className="rounded-[2rem] border border-border bg-card/40 p-10 md:p-16">
                <p className="max-w-5xl text-3xl font-semibold leading-tight md:text-5xl">
                  How might we help people understand their energy consumption
                  and turn that understanding into meaningful everyday action?
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <InfoCard icon={BarChart3} title="Too much raw data">
                Charts, numbers and historical information can create cognitive
                load without providing enough context.
              </InfoCard>

              <InfoCard icon={Search} title="Low context">
                A change in consumption does not automatically tell a user
                whether it is expected or problematic.
              </InfoCard>

              <InfoCard icon={Lightbulb} title="Limited actionability">
                Users need recommendations that connect insight to a clear
                next step.
              </InfoCard>
            </div>
          </div>
        </section>

        {/* ===================================================
            DESIGN THINKING PROCESS
        =================================================== */}

        <section id="design-process" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="03"
              title="Design Thinking Process"
              description="The project followed an iterative design process, moving from understanding the problem to research, synthesis, exploration and interface design."
            />

            <div className="grid gap-4 md:grid-cols-5">
              {designProcess.map(([number, title, text]) => (
                <Reveal key={number}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="h-full rounded-3xl border border-border bg-card/40 p-6"
                  >
                    <span className="text-xs font-bold tracking-widest text-primary">
                      {number}
                    </span>

                    <h3 className="mt-8 text-xl font-semibold">{title}</h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {text}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="Design Thinking Process"
                height="h-[420px]"
                media={DESIGN_MEDIA.designProcess}
                onClick={() => setLightbox({ title: "Design Thinking Process", media: DESIGN_MEDIA.designProcess })}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            PROJECT TIMELINE
        =================================================== */}

        <section
          id="project-timeline"
          className="scroll-mt-32 border-t border-border px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="04"
              title="Project Timeline"
              description="The work progressed from initial discovery and research through synthesis, concept development and high-fidelity design."
            />

            <Reveal>
              <div className="rounded-3xl border border-border p-8 md:p-12">
                <div className="relative">
                  <div className="absolute left-3 top-4 bottom-4 w-px bg-border md:left-1/2" />

                  {[
                    ["01", "Discovery", "Problem framing and initial understanding"],
                    ["02", "Research", "Qualitative and quantitative research"],
                    ["03", "Synthesis", "Personas, empathy maps and opportunity areas"],
                    ["04", "Design", "Information architecture, user flow and visual direction"],
                    ["05", "Prototype", "High-fidelity mobile experience"],
                  ].map(([number, title, text], index) => (
                    <div
                      key={number}
                      className={`relative mb-10 flex items-start gap-6 last:mb-0 md:w-1/2 ${
                        index % 2 === 0
                          ? "md:pr-12"
                          : "md:ml-auto md:pl-12"
                      }`}
                    >
                      <div className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {number}
                      </div>

                      <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===================================================
            QUALITATIVE RESEARCH
        =================================================== */}

        <section id="qualitative-research" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="05"
              title="Qualitative Research"
              description="Qualitative research focused on how people understand energy, what frustrates them about existing tools, and what kind of guidance they expect."
            />

            <div className="mb-12 grid gap-5 md:grid-cols-3">
              <InfoCard icon={Users} title="User Interviews">
                Conversations explored energy habits, household decisions,
                existing tools and expectations.
              </InfoCard>

              <InfoCard icon={Search} title="Desk Research">
                Existing energy dashboards, smart-home products and behavioural
                design patterns were reviewed.
              </InfoCard>

              <InfoCard icon={FlaskConical} title="Usability Review">
                Existing interfaces were examined for comprehension,
                information density and interaction patterns.
              </InfoCard>
            </div>

            <div className="space-y-3">
              {qualitativeFindings.map((item, index) => (
                <motion.div
                  key={item.title}
                  layout
                  className="overflow-hidden rounded-2xl border border-border bg-card/30"
                >
                  <button
                    onClick={() =>
                      setExpandedResearch(
                        expandedResearch === index ? null : index
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        0{index + 1}
                      </span>

                      <span className="font-medium">{item.title}</span>
                    </div>

                    {expandedResearch === index ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedResearch === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5"
                      >
                        <p className="pl-12 text-sm leading-relaxed text-muted-foreground">
                          {item.text}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="Qualitative Research"
                height="h-[500px]"
                media={DESIGN_MEDIA.qualitativeResearch}
                onClick={() => setLightbox({ title: "Qualitative Research", media: DESIGN_MEDIA.qualitativeResearch })}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            QUANTITATIVE RESEARCH
        =================================================== */}

        <section
          id="quantitative-research"
          className="scroll-mt-32 border-t border-border px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="06"
              title="Quantitative Research"
              description="Quantitative research helped identify broad patterns and gave direction to the areas that needed the most attention."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {quantitativeFindings.map((item) => (
                <Reveal key={item.label}>
                  <div className="rounded-3xl border border-border p-7">
                    <BarChart3 size={22} className="text-primary" />

                    <p className="mt-7 text-xs uppercase tracking-widest text-muted-foreground">
                      {item.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold">{item.value}</p>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <ImagePlaceholder
                title="Quantitative Research — Charts"
                height="h-[430px]"
                media={DESIGN_MEDIA.quantitativeResearchCharts}
                onClick={() =>
                  setLightbox({ title: "Quantitative Research — Charts", media: DESIGN_MEDIA.quantitativeResearchCharts })
                }
              />

              <div className="rounded-3xl border border-border p-8">
                <PieChart size={24} className="text-primary" />

                <h3 className="mt-7 text-2xl font-bold">
                  Research synthesis
                </h3>

                <p className="mt-4 leading-relaxed text-muted-foreground">
                  The research pointed toward a product that should not merely
                  expose more information. It should reduce interpretation
                  effort by translating energy behaviour into understandable
                  insights and recommended actions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            COMPETITOR COMPARISON
        =================================================== */}

        <section id="competitor-comparison" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="07"
              title="Competitor Comparison"
              description="Competitor analysis was used to understand how existing products approach connected homes, energy monitoring and user guidance."
            />

            <Reveal>
              <div className="overflow-x-auto rounded-3xl border border-border">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="border-b border-border bg-muted/20">
                    <tr>
                      <th className="p-5 text-sm font-semibold">Product</th>
                      <th className="p-5 text-sm font-semibold">Focus</th>
                      <th className="p-5 text-sm font-semibold">Strength</th>
                      <th className="p-5 text-sm font-semibold">
                        Opportunity for AI-NERGY
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {competitors.map((competitor) => (
                      <tr key={competitor.name} className="border-b border-border last:border-0">
                        <td className="p-5 font-medium">{competitor.name}</td>
                        <td className="p-5 text-sm text-muted-foreground">
                          {competitor.focus}
                        </td>
                        <td className="p-5 text-sm text-muted-foreground">
                          {competitor.strength}
                        </td>
                        <td className="p-5 text-sm text-muted-foreground">
                          {competitor.opportunity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===================================================
            COMPETITOR ANALYSIS
        =================================================== */}

        <section
          id="competitor-analysis"
          className="scroll-mt-32 border-t border-border px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="08"
              title="Competitor Analysis"
              description="The opportunity was to combine the clarity of energy monitoring with the convenience of intelligent recommendations."
            />

            <div className="grid gap-5 md:grid-cols-3">
              <InfoCard icon={BarChart3} title="Monitor">
                Existing products are strong at exposing consumption data and
                trends.
              </InfoCard>

              <InfoCard icon={Sparkles} title="Interpret">
                AI-NERGY focuses on explaining what those changes mean in the
                user's context.
              </InfoCard>

              <InfoCard icon={Zap} title="Act">
                Insights are connected to recommendations so users can move
                from understanding to action.
              </InfoCard>
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="Competitor Analysis Matrix"
                height="h-[480px]"
                media={DESIGN_MEDIA.competitorAnalysisMatrix}
                onClick={() => setLightbox({ title: "Competitor Analysis Matrix", media: DESIGN_MEDIA.competitorAnalysisMatrix })}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            USER PERSONAS
        =================================================== */}

        <section id="user-personas" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="09"
              title="User Personas"
              description="Personas represent different motivations and levels of engagement with household energy management."
            />

            <div className="grid gap-6 md:grid-cols-2">
              {personas.map((persona, index) => (
                <Reveal key={persona.name}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="rounded-3xl border border-border bg-card/40 p-7"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-primary">
                          {persona.type}
                        </p>

                        <h3 className="mt-4 text-2xl font-bold">
                          {persona.name}
                        </h3>
                      </div>

                      <span className="text-5xl font-bold text-muted-foreground/10">
                        0{index + 1}
                      </span>
                    </div>

                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                      {persona.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {persona.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="User Personas"
                height="h-[650px]"
                media={DESIGN_MEDIA.userPersonas}
                onClick={() => setLightbox({ title: "User Personas", media: DESIGN_MEDIA.userPersonas })}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            EMPATHY MAPS
        =================================================== */}

        <section
          id="empathy-maps"
          className="scroll-mt-32 border-t border-border px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="10"
              title="Empathy Maps"
              description="Empathy mapping helped translate persona characteristics into behaviours, thoughts, feelings and needs."
            />

            <div className="grid gap-8">
              {empathyMaps.map((map) => (
                <Reveal key={map.title}>
                  <div className="rounded-3xl border border-border p-7 md:p-9">
                    <h3 className="text-2xl font-bold">{map.title}</h3>

                    <div className="mt-7 grid gap-4 md:grid-cols-2">
                      {[
                        ["Says", map.says],
                        ["Thinks", map.thinks],
                        ["Does", map.does],
                        ["Feels", map.feels],
                      ].map(([label, text]) => (
                        <div
                          key={label}
                          className="rounded-2xl bg-muted/20 p-5"
                        >
                          <p className="text-xs font-bold uppercase tracking-widest text-primary">
                            {label}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="Empathy Maps"
                height="h-[650px]"
                media={DESIGN_MEDIA.empathyMaps}
                onClick={() => setLightbox({ title: "Empathy Maps", media: DESIGN_MEDIA.empathyMaps })}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            MOOD BOARD
        =================================================== */}

        <section id="mood-board" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="11"
              title="Mood Board"
              description="The visual direction was shaped around a calm, intelligent and trustworthy personality rather than an overly technical energy dashboard."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {moodBoard.map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-border bg-card/40 p-7"
                >
                  <Palette size={22} className="text-primary" />

                  <h3 className="mt-8 text-2xl font-bold">{item}</h3>

                  <p className="mt-3 text-sm text-muted-foreground">
                    A visual quality used to keep the AI-NERGY experience
                    approachable and focused.
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="AI-NERGY Mood Board"
                height="h-[600px]"
                media={DESIGN_MEDIA.moodBoard}
                onClick={() => setLightbox({ title: "AI-NERGY Mood Board", media: DESIGN_MEDIA.moodBoard })}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            INFORMATION ARCHITECTURE
        =================================================== */}

        <section
          id="information-architecture"
          className="scroll-mt-32 border-t border-border px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="12"
              title="Information Architecture"
              description="The architecture is organized around the main questions users ask: how am I doing, what changed, which devices matter and what can I improve?"
            />

            <Reveal>
              <div className="rounded-3xl border border-border p-8 md:p-12">
                <div className="flex flex-col items-center gap-5">
                  <div className="rounded-2xl bg-primary px-8 py-5 font-semibold text-primary-foreground">
                    AI-NERGY
                  </div>

                  <div className="h-8 w-px bg-border" />

                  <div className="grid w-full gap-4 md:grid-cols-4">
                    {architecture.map((section) => (
                      <motion.div
                        key={section.title}
                        whileHover={{ scale: 1.03 }}
                        className="rounded-2xl border border-border bg-muted/20 p-6"
                      >
                        <h3 className="font-semibold">{section.title}</h3>

                        <div className="mt-5 space-y-2">
                          {section.children.map((child) => (
                            <div
                              key={child}
                              className="rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground"
                            >
                              {child}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mt-10">
              <ImagePlaceholder
                title="Information Architecture"
                height="h-[500px]"
                media={DESIGN_MEDIA.informationArchitecture}
                onClick={() => setLightbox({ title: "Information Architecture", media: DESIGN_MEDIA.informationArchitecture })}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            USER FLOW
        =================================================== */}

        <section id="user-flow" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="13"
              title="User Flow"
              description="The core flow moves users from noticing an energy change to understanding its context and choosing an action."
            />

            <Reveal>
              <div className="rounded-3xl border border-border p-8 md:p-12">
                <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-center">
                  {[
                    ["01", "Home"],
                    ["02", "Notice insight"],
                    ["03", "Understand context"],
                    ["04", "View recommendation"],
                    ["05", "Take action"],
                  ].map(([number, title], index) => (
                    <div
                      key={number}
                      className="flex items-center gap-3 md:flex-1"
                    >
                      <div className="w-full rounded-2xl border border-border bg-muted/20 p-5 text-center">
                        <p className="text-xs font-bold text-primary">
                          {number}
                        </p>
                        <p className="mt-2 text-sm font-medium">{title}</p>
                      </div>

                      {index < 4 && (
                        <ArrowUpRight
                          size={18}
                          className="hidden shrink-0 text-muted-foreground md:block"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="mt-10">
              <ImagePlaceholder
                title="AI-NERGY User Flow"
                height="h-[550px]"
                media={DESIGN_MEDIA.userFlow}
                onClick={() => setLightbox({ title: "AI-NERGY User Flow", media: DESIGN_MEDIA.userFlow })}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            HIGH FIDELITY
        =================================================== */}

        <section
          id="high-fidelity"
          className="scroll-mt-32 border-t border-border px-6 py-32 pb-48"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="14"
              title="High Fidelity"
              description="The final interface brings together the research, personas, architecture and user flow into a focused mobile experience."
            />

            <Reveal>
              <ImagePlaceholder
                title="AI-NERGY High Fidelity Screens"
                height="h-[700px]"
                media={DESIGN_MEDIA.highFidelity}
                onClick={() =>
                  setLightbox({ title: "AI-NERGY High Fidelity Screens", media: DESIGN_MEDIA.highFidelity })
                }
              />
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {[
                {
                  icon: Sparkles,
                  title: "AI Insights",
                  text: "Explain changes in consumption in plain language.",
                },
                {
                  icon: Target,
                  title: "Personal Goals",
                  text: "Turn energy reduction into measurable progress.",
                },
                {
                  icon: Zap,
                  title: "Smart Actions",
                  text: "Connect recommendations to practical next steps.",
                },
                {
                  icon: Smartphone,
                  title: "Mobile First",
                  text: "Keep the experience focused and easy to scan.",
                },
              ].map((feature) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    whileHover={{ y: -5 }}
                    className="rounded-2xl border border-border p-5"
                  >
                    <Icon size={19} className="text-primary" />

                    <p className="mt-4 text-sm font-medium">
                      {feature.title}
                    </p>

                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {feature.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-32 rounded-[2rem] bg-primary p-10 text-primary-foreground md:p-16">
              <Sparkles size={28} />

              <h3 className="mt-8 max-w-3xl text-3xl font-bold md:text-5xl">
                From energy data to energy decisions.
              </h3>

              <p className="mt-6 max-w-2xl leading-relaxed opacity-85">
                AI-NERGY is designed around a simple principle: intelligence
                should reduce the effort required to understand a system, not
                make the system more complicated.
              </p>
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