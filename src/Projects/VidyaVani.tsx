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
  Users,
  Target,
  Search,
  Layers,
  FlaskConical,
  Sparkles,
  BarChart3,
  PieChart,
  Palette,
  Route,
  Smartphone,
  X,
  GraduationCap,
  BookOpen,
  MessageCircle,
  RefreshCw,
} from "lucide-react";

import Header from "../components/Header/Header";
import CaseStudyNav from "../components/CaseStudyNav/CaseStudyNav";
import { useLenis } from "lenis/react";

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

function ImagePlaceholder({
  title,
  height = "h-[420px]",
  onClick,
}: {
  title: string;
  height?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`group relative ${height} cursor-pointer overflow-hidden rounded-3xl border border-border bg-muted/30`}
    >
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

      <div className="absolute right-5 top-5 rounded-full bg-background/70 px-3 py-1.5 text-xs opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
        View
      </div>
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
   VIDYAVANI CASE STUDY DATA

   Structured from the supplied VidyaVani case-study board:
   Introduction → Problem Statement → Design Thinking →
   Project Timeline → Research → Competitor Analysis →
   Personas → Empathy Maps → Mood Board → IA →
   User Flow → Wireframes → High Fidelity
========================================================= */

const designProcess = [
  ["01", "Discover", "Understand the educational context, users and existing learning behaviour."],
  ["02", "Define", "Synthesize research into the core problem and opportunity."],
  ["03", "Ideate", "Explore possible ways to make learning more accessible, engaging and useful."],
  ["04", "Design", "Develop the information architecture, flows and interface direction."],
  ["05", "Validate", "Review concepts and refine the experience around user needs."],
];

const timeline = [
  ["01", "Research", "Understand students, teachers, learning habits and existing solutions."],
  ["02", "Synthesis", "Convert research into insights, personas and opportunity areas."],
  ["03", "Ideation", "Generate and compare possible product directions."],
  ["04", "Structure", "Define information architecture and user flows."],
  ["05", "Prototype", "Create wireframes and progressively higher fidelity screens."],
  ["06", "Final Design", "Refine the visual system and high-fidelity experience."],
];

const qualitativeFindings = [
  {
    title: "Learning needs to feel accessible",
    text: "The experience should reduce unnecessary complexity and make educational content easier to discover and understand.",
  },
  {
    title: "Different learners have different needs",
    text: "Students vary in confidence, pace, interests and preferred ways of consuming information.",
  },
  {
    title: "Guidance matters",
    text: "Users benefit when the product helps them understand what to learn next instead of simply presenting a large collection of content.",
  },
  {
    title: "Engagement should support learning",
    text: "Visual feedback, progress and interactive elements can encourage continued participation when they remain connected to the learning goal.",
  },
];

const quantitativeFindings = [
  {
    label: "Learning engagement",
    value: "Key focus",
    text: "The research points toward making learning more interactive and motivating.",
  },
  {
    label: "Content discovery",
    value: "High need",
    text: "Users need clearer ways to find relevant educational material.",
  },
  {
    label: "Personalization",
    value: "Important",
    text: "A single experience cannot serve every learner equally well.",
  },
];

const competitors = [
  {
    name: "Existing Learning Platforms",
    focus: "Content delivery",
    strength: "Large content libraries",
    opportunity: "Improve discovery, guidance and personalization.",
  },
  {
    name: "Video Learning",
    focus: "Visual education",
    strength: "Easy-to-consume content",
    opportunity: "Connect content with structured learning journeys.",
  },
  {
    name: "Traditional Resources",
    focus: "Reference material",
    strength: "Familiarity and depth",
    opportunity: "Make learning more interactive and accessible.",
  },
];

const personas = [
  {
    type: "Primary User",
    name: "The Curious Learner",
    description:
      "A student who enjoys discovering new topics and needs an engaging environment that encourages exploration.",
    tags: ["Curious", "Explorative", "Visual"],
  },
  {
    type: "Primary User",
    name: "The Focused Student",
    description:
      "A learner who wants structure, clear progress and an easy way to continue from where they left off.",
    tags: ["Goal oriented", "Structured", "Progress driven"],
  },
  {
    type: "Secondary User",
    name: "The Guided Learner",
    description:
      "A student who benefits from recommendations and explanations that make difficult concepts easier to approach.",
    tags: ["Needs guidance", "Supportive", "Consistent"],
  },
  {
    type: "Secondary User",
    name: "The Independent Learner",
    description:
      "A learner who prefers choosing topics and resources independently while still being able to track progress.",
    tags: ["Independent", "Self paced", "Resourceful"],
  },
];

const empathyMaps = [
  {
    title: "The Curious Learner",
    says: "I want to discover something interesting.",
    thinks: "Learning should not feel boring or difficult to start.",
    does: "Browses topics, explores resources and follows interesting subjects.",
    feels: "Excited when content is easy to discover.",
  },
  {
    title: "The Focused Student",
    says: "I want to know what I should do next.",
    thinks: "I need a clear path so I don't lose track.",
    does: "Completes lessons, checks progress and returns to unfinished work.",
    feels: "Motivated when progress is visible.",
  },
  {
    title: "The Guided Learner",
    says: "I need someone to explain this simply.",
    thinks: "I understand better when concepts are broken down.",
    does: "Looks for examples, explanations and supporting material.",
    feels: "Confident when the product provides useful guidance.",
  },
  {
    title: "The Independent Learner",
    says: "Let me learn at my own pace.",
    thinks: "I know what interests me; I just need the right resources.",
    does: "Searches, saves resources and builds a personal learning routine.",
    feels: "In control when the interface does not get in the way.",
  },
];

const architecture = [
  {
    title: "Home",
    children: ["Recommended", "Continue learning", "Topics", "Progress"],
  },
  {
    title: "Explore",
    children: ["Subjects", "Categories", "Search", "Resources"],
  },
  {
    title: "Learning",
    children: ["Lessons", "Activities", "Saved content", "Progress"],
  },
  {
    title: "Profile",
    children: ["My learning", "Achievements", "Preferences", "Settings"],
  },
];

const moodBoard = [
  "Educational",
  "Friendly",
  "Playful",
  "Clear",
  "Accessible",
  "Trustworthy",
];

const userFlow = [
  ["01", "Open VidyaVani"],
  ["02", "Choose / discover a topic"],
  ["03", "View learning content"],
  ["04", "Interact / learn"],
  ["05", "Track progress"],
  ["06", "Continue or explore"],
];

/* =========================================================
   PAGE
========================================================= */

export default function VidyaVani() {
  const lenis = useLenis();
  const [lightbox, setLightbox] = useState<string | null>(null);
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
                <Tag>VidyaVani</Tag>
                <Tag>Education</Tag>
                <Tag>Mobile App</Tag>
              </div>

              <h1 className="max-w-5xl text-6xl font-bold tracking-[-0.04em] md:text-8xl">
                VidyaVani
              </h1>

              <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
                A learning experience designed to make education more
                accessible, engaging and easier to navigate for diverse
                learners.
              </p>
            </Reveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16"
            >
              <ImagePlaceholder
                title="VidyaVani / Project Overview"
                height="h-[500px]"
                onClick={() => setLightbox("VidyaVani / Project Overview")}
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
              description="VidyaVani is an education-focused product concept that explores how digital interfaces can make learning more approachable, engaging and personalized."
            />

            <div className="grid gap-5 md:grid-cols-3">
              <InfoCard icon={GraduationCap} title="Education">
                Create a digital environment where learners can discover,
                consume and continue educational content.
              </InfoCard>

              <InfoCard icon={Users} title="Learners">
                Support students with different learning behaviours,
                confidence levels and goals.
              </InfoCard>

              <InfoCard icon={Sparkles} title="Experience">
                Combine clear information architecture with an engaging,
                approachable interface.
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
              description="Educational resources are increasingly available digitally, but access to content does not automatically create an effective learning experience."
            />

            <Reveal>
              <div className="rounded-[2rem] border border-border bg-card/40 p-10 md:p-16">
                <p className="max-w-5xl text-3xl font-semibold leading-tight md:text-5xl">
                  How might we create a learning experience that helps
                  students discover relevant content, understand it easily and
                  stay motivated to continue learning?
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <InfoCard icon={Search} title="Content overload">
                A large amount of educational content can make it difficult
                for learners to decide where to start.
              </InfoCard>

              <InfoCard icon={BookOpen} title="Different learning needs">
                Students have different levels of knowledge, interests,
                learning speeds and preferred formats.
              </InfoCard>

              <InfoCard icon={Target} title="Motivation">
                Learners need clear progress and meaningful feedback to keep
                returning to the experience.
              </InfoCard>
            </div>
          </div>
        </section>

        {/* ===================================================
            DESIGN THINKING
        =================================================== */}

        <section id="design-thinking" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="03"
              title="Design Thinking"
              description="The project used an iterative process to move from understanding the educational context to developing and refining the product experience."
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
                title="VidyaVani Design Thinking Process"
                height="h-[450px]"
                onClick={() => setLightbox("VidyaVani Design Thinking Process")}
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
              description="The project moved through research, synthesis, ideation, structural design and interface development."
            />

            <Reveal>
              <div className="rounded-3xl border border-border p-8 md:p-12">
                <div className="relative">
                  <div className="absolute left-3 top-4 bottom-4 w-px bg-border md:left-1/2" />

                  {timeline.map(([number, title, text], index) => (
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
              description="The qualitative phase focused on understanding learners' behaviours, frustrations, motivations and expectations around digital education."
            />

            <div className="mb-12 grid gap-5 md:grid-cols-3">
              <InfoCard icon={MessageCircle} title="User Interviews">
                Explore how students currently learn, find resources and deal
                with difficult concepts.
              </InfoCard>

              <InfoCard icon={Search} title="Contextual Research">
                Understand the environments and situations in which digital
                learning takes place.
              </InfoCard>

              <InfoCard icon={FlaskConical} title="Observation">
                Look for patterns in how users navigate content and decide
                what to learn next.
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
                title="VidyaVani Qualitative Research"
                height="h-[520px]"
                onClick={() => setLightbox("VidyaVani Qualitative Research")}
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
              description="Quantitative findings were used to identify broader patterns and prioritise the parts of the experience that needed clearer support."
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
                onClick={() =>
                  setLightbox("Quantitative Research — Charts")
                }
              />

              <div className="rounded-3xl border border-border p-8">
                <PieChart size={24} className="text-primary" />

                <h3 className="mt-7 text-2xl font-bold">
                  What the numbers suggested
                </h3>

                <p className="mt-4 leading-relaxed text-muted-foreground">
                  The quantitative stage reinforced the need for a product
                  that balances content, structure and motivation rather than
                  treating education as a simple content-library problem.
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
              description="Existing educational experiences were compared to understand common patterns, strengths and opportunities for improvement."
            />

            <Reveal>
              <div className="overflow-x-auto rounded-3xl border border-border">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="border-b border-border bg-muted/20">
                    <tr>
                      <th className="p-5 text-sm font-semibold">Category</th>
                      <th className="p-5 text-sm font-semibold">Focus</th>
                      <th className="p-5 text-sm font-semibold">Strength</th>
                      <th className="p-5 text-sm font-semibold">
                        VidyaVani Opportunity
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {competitors.map((competitor) => (
                      <tr
                        key={competitor.name}
                        className="border-b border-border last:border-0"
                      >
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
              description="The analysis identified an opportunity to bring content discovery, structured learning and learner motivation together in one experience."
            />

            <div className="grid gap-5 md:grid-cols-3">
              <InfoCard icon={BookOpen} title="Content">
                Educational resources should be easy to find, understand and
                return to.
              </InfoCard>

              <InfoCard icon={Route} title="Journey">
                Users should be able to move through learning without feeling
                lost or overwhelmed.
              </InfoCard>

              <InfoCard icon={Sparkles} title="Engagement">
                Progress, interaction and feedback should support the learning
                goal rather than become distractions.
              </InfoCard>
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="Competitor Analysis Matrix"
                height="h-[500px]"
                onClick={() => setLightbox("Competitor Analysis Matrix")}
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
              description="Personas translate research into representative learner types and make different needs visible throughout the design process."
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
                title="VidyaVani User Personas"
                height="h-[700px]"
                onClick={() => setLightbox("VidyaVani User Personas")}
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
              description="Empathy maps were used to understand what each learner type says, thinks, does and feels during the learning journey."
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
                title="VidyaVani Empathy Maps"
                height="h-[700px]"
                onClick={() => setLightbox("VidyaVani Empathy Maps")}
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
              description="The visual direction balances the credibility of an educational product with a friendly, playful and approachable personality."
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
                    A visual quality used to shape the VidyaVani experience.
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="VidyaVani Mood Board"
                height="h-[600px]"
                onClick={() => setLightbox("VidyaVani Mood Board")}
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
              description="The information architecture groups the experience around the main learner tasks: discovering content, learning, tracking progress and managing a personal learning space."
            />

            <Reveal>
              <div className="rounded-3xl border border-border p-8 md:p-12">
                <div className="flex flex-col items-center gap-5">
                  <div className="rounded-2xl bg-primary px-8 py-5 font-semibold text-primary-foreground">
                    VidyaVani
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
                title="VidyaVani Information Architecture"
                height="h-[520px]"
                onClick={() => setLightbox("VidyaVani Information Architecture")}
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
              description="The core journey is designed to take a learner from discovery to learning and then back into a clear continuation loop."
            />

            <Reveal>
              <div className="rounded-3xl border border-border p-8 md:p-12">
                <div className="grid gap-3 md:grid-cols-3">
                  {userFlow.map(([number, title], index) => (
                    <div
                      key={number}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-1 rounded-2xl border border-border bg-muted/20 p-5">
                        <p className="text-xs font-bold text-primary">
                          {number}
                        </p>

                        <p className="mt-2 text-sm font-medium">
                          {title}
                        </p>
                      </div>

                      {index < userFlow.length - 1 && (
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
                title="VidyaVani User Flow"
                height="h-[580px]"
                onClick={() => setLightbox("VidyaVani User Flow")}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            WIREFRAMES
        =================================================== */}

        <section
          id="wireframes"
          className="scroll-mt-32 border-t border-border px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="14"
              title="Wireframes"
              description="Low-fidelity wireframes were used to test structure, hierarchy and navigation before committing to the visual language."
            />

            <div className="grid gap-5 md:grid-cols-3">
              <InfoCard icon={Layers} title="Structure">
                Establish the hierarchy of information and identify the most
                important content on each screen.
              </InfoCard>

              <InfoCard icon={Route} title="Navigation">
                Explore how learners move between discovery, content,
                progress and their personal space.
              </InfoCard>

              <InfoCard icon={RefreshCw} title="Iteration">
                Quickly change layouts and flows before introducing visual
                details.
              </InfoCard>
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="VidyaVani Wireframes"
                height="h-[650px]"
                onClick={() => setLightbox("VidyaVani Wireframes")}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            HIGH FIDELITY
        =================================================== */}

        <section
          id="high-fidelity"
          className="scroll-mt-32 px-6 py-32 pb-48"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="15"
              title="High Fidelity"
              description="The final interface translates the research and structural decisions into a polished learning experience with clear hierarchy, engaging visuals and focused interactions."
            />

            <Reveal>
              <ImagePlaceholder
                title="VidyaVani High Fidelity Screens"
                height="h-[720px]"
                onClick={() => setLightbox("VidyaVani High Fidelity Screens")}
              />
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {[
                {
                  icon: BookOpen,
                  title: "Learning",
                  text: "Keep educational content clear and easy to consume.",
                },
                {
                  icon: Search,
                  title: "Discovery",
                  text: "Help users find topics and resources without friction.",
                },
                {
                  icon: Target,
                  title: "Progress",
                  text: "Make learning progress visible and meaningful.",
                },
                {
                  icon: Smartphone,
                  title: "Mobile First",
                  text: "Design an experience that works naturally on mobile.",
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
              <GraduationCap size={30} />

              <h3 className="mt-8 max-w-3xl text-3xl font-bold md:text-5xl">
                Making learning easier to discover, understand and continue.
              </h3>

              <p className="mt-6 max-w-2xl leading-relaxed opacity-85">
                VidyaVani brings together research, learner needs,
                information architecture and interface design to create a
                more approachable digital learning experience.
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
          IMAGE LIGHTBOX
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

              <div className="flex h-[70vh] items-center justify-center rounded-3xl border border-border bg-muted/30">
                <div className="text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Layers size={25} />
                  </div>

                  <p className="font-medium">{lightbox}</p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Replace this placeholder with your actual project image.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}