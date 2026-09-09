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
  ChevronDown,
  ChevronUp,
  Users,
  Target,
  Search,
  Layers,
  FlaskConical,
  RefreshCw,
  Sparkles,
  Zap,
  X,
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
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
          {number}
        </span>
        <div className="h-px w-12 bg-border" />
      </div>

      <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
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

function BulletList({ items }: { items: string[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <Check size={18} className="mt-0.5 shrink-0 text-primary" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function PersonaCard({
  name,
  age,
  location,
  occupation,
  quote,
  bio,
  goals,
  frustrations,
}: {
  name: string;
  age: string;
  location: string;
  occupation: string;
  quote: string;
  bio: string;
  goals: string[];
  frustrations: string[];
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="rounded-3xl border border-border bg-card/40 p-7"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            User Persona
          </p>
          <h3 className="mt-2 text-3xl font-bold">{name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {age} · {location} · {occupation}
          </p>
        </div>

        <Users className="text-primary" size={24} />
      </div>

      <blockquote className="mt-8 border-l-2 border-primary pl-5 text-xl font-medium leading-relaxed">
        “{quote}”
      </blockquote>

      <p className="mt-7 text-sm leading-relaxed text-muted-foreground">
        {bio}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest">
            Goals
          </p>
          <BulletList items={goals} />
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest">
            Frustrations
          </p>
          <BulletList items={frustrations} />
        </div>
      </div>
    </motion.div>
  );
}

function EmpathyMap({
  title,
  says,
  thinks,
  does,
  feels,
}: {
  title: string;
  says: string[];
  thinks: string[];
  does: string[];
  feels: string[];
}) {
  const quadrants = [
    { label: "Says", items: says },
    { label: "Thinks", items: thinks },
    { label: "Does", items: does },
    { label: "Feels", items: feels },
  ];

  return (
    <Reveal>
      <div className="rounded-3xl border border-border bg-card/30 p-7">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-bold">{title}</h3>
          <Users size={20} className="text-primary" />
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          {quadrants.map((quadrant) => (
            <div key={quadrant.label} className="bg-background p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                {quadrant.label}
              </p>
              <ul className="mt-4 space-y-3">
                {quadrant.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function ComparisonBlock({
  title,
  original,
  redesign,
  improvements,
  onImageClick,
}: {
  title: string;
  original: string;
  redesign: string;
  improvements: { title: string; text: string }[];
  onImageClick: (label: string) => void;
}) {
  return (
    <Reveal>
      <div className="border-t border-border pt-14">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Website Redesign
            </p>
            <h3 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h3>
          </div>
          <RefreshCw size={20} className="hidden text-muted-foreground md:block" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Original
              </span>
              <span className="text-xs text-muted-foreground">Before</span>
            </div>
            <ImagePlaceholder
              title={original}
              height="h-[360px]"
              onClick={() => onImageClick(original)}
            />
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Redesign
              </span>
              <span className="text-xs text-primary">After</span>
            </div>
            <ImagePlaceholder
              title={redesign}
              height="h-[360px]"
              onClick={() => onImageClick(redesign)}
            />
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {improvements.map((item) => (
            <InfoCard key={item.title} icon={Check} title={item.title}>
              {item.text}
            </InfoCard>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ZaraCaseStudy() {
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

  const researchQuestions = [
    "Can you describe your experience while shopping at a ZARA store?",
    "What do you think about the design and the layout of the ZARA website?",
    "Can you share the challenges and frustrations encountered while using the ZARA website?",
    "What are your thoughts on the typography of the ZARA website?",
    "What is your impression of the colour scheme of the ZARA website?",
    "Can you describe your experience with navigating through the ZARA website?",
    "Can you share the experience you've had with ZARA's customer service?",
  ];

  const quantitativeQuestions = [
    "How responsive do you find the ZARA website to be when using different devices?",
    "How satisfied are you with the visual appeal and layout of the ZARA website?",
    "How easy is it for you to find specific products or categories on the ZARA website?",
    "Please rate the clarity and effectiveness of product information provided on the ZARA website.",
    "To what extent do you find the ZARA website's checkout process straightforward and user-friendly?",
    "Rate your overall satisfaction with the customer support services available on the ZARA website.",
  ];

  const competitorFeatures = [
    "Saved Items List",
    "In-Store Stock Checker",
    "Style Recommendations",
    "360-Degree Product Views",
    "Sustainability Information",
    "Buyer Ratings",
    "Size Chart",
    "Wishlist Sharing",
    "Shop By Occasion",
    "Flash Sales Countdown Timer",
  ];

  const iaColumns = [
    {
      title: "Women",
      items: [
        "Best Sellers",
        "Blazers",
        "Linen",
        "Dresses",
        "Crochet",
        "Shoes",
        "Shorts / Skorts",
        "Skirts",
        "T-Shirts / Polo",
        "Shirts",
        "Tops",
        "Trousers",
        "Suits",
        "Cargo",
        "Waistcoat",
        "Trench Coat",
        "Sweatshirt",
        "Beachwear",
      ],
    },
    {
      title: "Men",
      items: [
        "Best Sellers",
        "Linen",
        "Dresses",
        "Shoes",
        "Shirts",
        "Trousers",
        "Shorts",
        "Suits",
        "Jeans",
        "Jacket / Coat",
        "Hoodies",
        "Cardigan",
        "Sweaters",
        "Jackets",
        "Blazers",
        "Knitwear",
      ],
    },
    {
      title: "Kids",
      items: [
        "Girls — 1.5–6 yrs",
        "Girls — 6–14 yrs",
        "Boys — 1.5–6 yrs",
        "Boys — 6–14 yrs",
        "Baby — 0–6 months",
        "Baby — 6–18 months",
        "T-Shirts",
        "Swimwear",
        "Cardigans",
        "Sweatshirts / Sweaters",
      ],
    },
    {
      title: "Others",
      items: ["Perfumes", "Makeup", "Jewellery", "Bags", "Bodysuits"],
    },
  ];

  const userFlow = [
    "Google Search",
    "Click Home",
    "Screen Search",
    "White Tops",
    "Product Details",
    "Visual",
    "Select Product Page",
    "Select Size",
    "Click Buy Now",
    "Personal Details Page",
    "Create New Account",
    "Select Login Page",
    "Enter Details",
    "Create New Account Button",
    "Order Details",
    "Authorize Payment",
    "Select Payment Mode",
    "Continue Payment",
    "Order Confirmation",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Reading progress */}
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
                <Tag>UX/UI Design</Tag>
                <Tag>Website Redesign</Tag>
                <Tag>Fashion E-Commerce</Tag>
                <Tag>User Research</Tag>
              </div>

              <h1 className="max-w-5xl text-6xl font-bold tracking-[-0.04em] md:text-8xl">
                ZARA
              </h1>

              <p className="mt-8 max-w-4xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
                Zara website re-design for an enhanced user experience — a user-centric redesign focused on clearer navigation, stronger hierarchy, better readability, and a more efficient shopping journey.
              </p>
            </Reveal>

            <Reveal className="mt-12">
              <div className="grid gap-6 md:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Date</p>
                  <p className="mt-2 font-medium">June 2024</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Project</p>
                  <p className="mt-2 font-medium">ZARA Website Redesign</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Tools</p>
                  <p className="mt-2 font-medium">Figma · Google Forms · Excel</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Focus</p>
                  <p className="mt-2 font-medium">UX Research · UI · E-Commerce</p>
                </div>
              </div>
            </Reveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16"
            >
              <ImagePlaceholder
                title="ZARA Website Redesign — Hero / Final Showcase"
                height="h-[560px]"
                onClick={() => setLightbox("ZARA Website Redesign — Hero / Final Showcase")}
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
            01 — EMPATHIZE
        =================================================== */}
        <section id="overview" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="01"
              title="Empathize"
              description="The first stage focused on understanding the challenges customers encounter while shopping on the ZARA website through qualitative and quantitative research."
            />

            <div className="grid gap-5 md:grid-cols-3">
              <InfoCard icon={Target} title="The Context">
                ZARA is a renowned fashion brand known for its trendy clothing and fast-fashion cycle. Its website is minimalist and aesthetic, but users can experience clutter and unintuitive navigation.
              </InfoCard>
              <InfoCard icon={FlaskConical} title="The Research">
                Qualitative interviews and quantitative research through Google Forms were used to identify user needs, pain points, and usability challenges.
              </InfoCard>
              <InfoCard icon={Sparkles} title="The Direction">
                The findings informed a redesign centered on a more user-centric shopping experience, with stronger hierarchy, readability, navigation, and clarity.
              </InfoCard>
            </div>

            <Reveal className="mt-20">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Project Introduction</p>
                  <h3 className="mt-4 text-3xl font-bold md:text-5xl">Redesigning a minimalist experience without losing its identity.</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  The project assessed the existing website's usability challenges and introduced a redesigned site aimed at prioritizing a user-centric design philosophy. The central opportunity was not simply to add more interface elements, but to make the existing shopping experience easier to understand and navigate.
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-20">
              <div className="rounded-3xl border border-border bg-card/30 p-8 md:p-10">
                <div className="flex items-center gap-4">
                  <Layers className="text-primary" size={22} />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Design Thinking Process</p>
                    <p className="mt-1 text-xl font-semibold">Empathize → Define → Ideate → Design</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-start">
              <Reveal>
                <div>
                  <SectionHeader
                    number="1.1"
                    title="Qualitative Research"
                    description="Open-ended, conversational research was used to understand customers' experiences, challenges, and frustrations while shopping on ZARA."
                  />

                  <div className="space-y-3">
                    {researchQuestions.map((question, index) => {
                      const isOpen = expandedResearch === index;
                      return (
                        <button
                          key={question}
                          type="button"
                          onClick={() => setExpandedResearch(isOpen ? null : index)}
                          className="w-full rounded-2xl border border-border bg-card/30 p-5 text-left transition-colors hover:bg-card"
                        >
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-sm font-medium leading-relaxed">Q{index + 1} — {question}</span>
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 text-sm leading-relaxed text-muted-foreground"
                              >
                                This question was used to understand the user's perspective on the existing ZARA shopping experience.
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl bg-primary p-8 text-primary-foreground md:p-10">
                  <Search size={24} />
                  <h3 className="mt-8 text-3xl font-bold">Insights from qualitative research</h3>
                  <p className="mt-5 leading-relaxed opacity-80">
                    The responses consistently pointed toward problems with clutter, alignment, navigation, typography, contrast, and discoverability.
                  </p>

                  <div className="mt-8 space-y-5">
                    <div className="border-t border-primary-foreground/20 pt-5">
                      <p className="text-4xl font-bold">71%</p>
                      <p className="mt-2 text-sm leading-relaxed opacity-80">
                        of users reported that the search bar and menu button blend with the background while viewing other content.
                      </p>
                    </div>
                    <div className="border-t border-primary-foreground/20 pt-5">
                      <p className="text-sm leading-relaxed opacity-80">
                        Users described the website as “too cluttered” and “not aligned”, with the overall experience described as not so great.
                      </p>
                    </div>
                    <div className="border-t border-primary-foreground/20 pt-5">
                      <p className="text-sm leading-relaxed opacity-80">
                        Users felt that some pages had weak colour contrast and that typography was too small and difficult to read.
                      </p>
                    </div>
                    <div className="border-t border-primary-foreground/20 pt-5">
                      <p className="text-sm leading-relaxed opacity-80">
                        Navigation was repeatedly described as challenging, confusing, and frustrating.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal className="mt-20">
              <div className="rounded-3xl border border-border p-8 md:p-10">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">User Reviews</p>
                <p className="mt-5 max-w-4xl text-2xl font-semibold leading-tight md:text-4xl">
                  The research revealed a gap between ZARA's minimalist visual language and the clarity users need while shopping online.
                </p>
              </div>
            </Reveal>

            <div className="mt-24 grid gap-12 lg:grid-cols-2">
              <Reveal>
                <SectionHeader
                  number="1.3"
                  title="Quantitative Research"
                  description="Google Forms were used to gather responses about personal experiences with the ZARA website and the challenges faced while using it."
                />
                <div className="space-y-3">
                  {quantitativeQuestions.map((question, index) => (
                    <div key={question} className="rounded-2xl border border-border p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Q{index + 1}</p>
                      <p className="mt-2 text-sm leading-relaxed">{question}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl bg-muted/30 p-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Research Dimensions</p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {[
                      "Responsiveness across devices",
                      "Visual appeal and layout",
                      "Product/category discoverability",
                      "Product information clarity",
                      "Checkout usability",
                      "Customer support satisfaction",
                    ].map((item) => (
                      <div key={item} className="rounded-2xl border border-border bg-background p-5">
                        <Check size={18} className="text-primary" />
                        <p className="mt-4 text-sm font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
                    The source case study includes the response scales and charts, but does not provide all numerical results as extractable text. The redesign therefore uses the research themes that are explicitly supported by the case study.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal className="mt-24">
              <SectionHeader
                number="1.4"
                title="Competitor Analysis"
                description="The competitor analysis considered shopping features that could make the ZARA experience more useful and discoverable."
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {competitorFeatures.map((feature) => (
                  <motion.div
                    key={feature}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-border p-5"
                  >
                    <Sparkles size={18} className="text-primary" />
                    <p className="mt-4 text-sm font-medium leading-relaxed">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===================================================
            02 — DEFINE
        =================================================== */}
        <section id="problem" className="scroll-mt-32 border-t border-border px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="02"
              title="Define"
              description="The research was translated into a clear problem statement, user personas, and empathy maps that framed the redesign around real shopping frustrations."
            />

            <Reveal>
              <div className="rounded-[2rem] border border-border bg-card/40 p-8 md:p-14">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">2.1 Problem Statement</p>
                <p className="mt-6 max-w-5xl text-2xl font-semibold leading-tight md:text-5xl">
                  The ZARA website has been heavily criticized for its poor user experience and design, with unclear CTAs, unintuitive navigation, insufficient contrast, overly small typography, and large imagery that makes browsing difficult.
                </p>
                <p className="mt-8 max-w-4xl text-lg leading-relaxed text-muted-foreground">
                  Based on the survey feedback, the redesign focused on improving navigation, hierarchy, readability, contrast, and the overall shopping flow.
                </p>
              </div>
            </Reveal>

            <div className="mt-24 grid gap-8">
              <PersonaCard
                name="Alice Morgan"
                age="26"
                location="Brooklyn"
                occupation="Data Analyst"
                quote="I prefer quick shopping without spending too much time on finding the perfect fit."
                bio="Single lifestyle data analyst who is very independent and motivated to build her own business from the ground up. Extremely self-confident and busy."
                goals={[
                  "Get exclusive discounts.",
                  "Purchase several pairs to fit occasion, style, and colour.",
                  "Skip the queue.",
                  "Find a platform that understands her style and preferences.",
                  "Find a wide range of sizes for better fit and variety.",
                ]}
                frustrations={[
                  "Difficulty finding stylish and quality clothing.",
                  "Fewer options when applying the colour filter.",
                  "Long checkout process.",
                  "Not knowing if something is truly in stock online.",
                ]}
              />

              <PersonaCard
                name="David Miller"
                age="31"
                location="Boston"
                occupation="Software Developer"
                quote="I have lived here for 7+ years and I have never had a pleasant shopping experience."
                bio="A software developer who lives in a rented apartment with two friends. His job demands travelling and meeting new clients in different locations."
                goals={[
                  "Safeguard personal information during online shopping.",
                  "Curate a wardrobe reflecting individuality and creativity.",
                  "Prioritize sustainability in fashion choices.",
                  "Have an enhanced and seamless online shopping experience.",
                ]}
                frustrations={[
                  "Long shipping times and delivery issues.",
                  "Concerns about online product quality.",
                  "Websites lacking detailed product information.",
                  "Privacy concerns over personal information.",
                ]}
              />
            </div>

            <div className="mt-24 grid gap-8 lg:grid-cols-2">
              <EmpathyMap
                title="Empathy Mapping 1 — Alice"
                says={[
                  "Let's see what is new in Zara.",
                  "The font isn't legible.",
                  "The text overlaps on images and makes readability difficult.",
                ]}
                thinks={[
                  "The font isn't legible.",
                  "Might ask questions about sizing, fabric, or return policy.",
                ]}
                does={[
                  "Let's see what is new in Zara.",
                  "Checks the Zara website.",
                  "Searches for specific items or explores different styles.",
                  "Reads product descriptions and reviews.",
                ]}
                feels={[
                  "The layout is too cluttered and kind of unorganized.",
                  "Anxious about whether the clothes will fit or look as expected.",
                  "I need to buy some new clothes.",
                ]}
              />

              <EmpathyMap
                title="Empathy Mapping 2 — David"
                says={[
                  "Finding work-appropriate attire that is also stylish is a big win for me.",
                  "I love this attire but I'm not sure about the sizing.",
                  "I want to be able to trust the brand and have a seamless online shopping experience.",
                ]}
                thinks={[
                  "Zara should offer fashion advice and styling tips.",
                  "I wish Zara provided more size options for trendy pieces.",
                  "Will I get notifications or updates if there is a delivery issue?",
                ]}
                does={[
                  "Plans to go to the shop after work.",
                  "If not satisfied with the product delivered, will exchange it.",
                  "Searches for a specific category on the website.",
                  "Reads product and reviews, paying attention to quality and sizing.",
                ]}
                feels={[
                  "Anxious about the quality and sizing of the material.",
                  "Confused about purchasing at the last minute from the website.",
                  "Frustrated by the confusing user interface.",
                ]}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            03 — IDEATE
        =================================================== */}
        <section id="ideation" className="scroll-mt-32 border-t border-border px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="03"
              title="Ideate"
              description="The design direction translated the research findings into a visual language, user flow, information architecture, and wireframes."
            />

            <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
              <Reveal>
                <div className="rounded-3xl border border-border bg-card/30 p-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">3.1 Mood Board</p>
                  <h3 className="mt-5 text-3xl font-bold">A restrained fashion-led visual system.</h3>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    The case study's mood board uses a neutral palette and combines Didot with Neue Helvetica, retaining the fashion-editorial character while creating a clearer system for digital interaction.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    {[
                      "#333333",
                      "#000000",
                      "#111111",
                      "#FFFFFF",
                      "#979797",
                      "#F2F1F1",
                    ].map((hex) => (
                      <div key={hex} className="rounded-xl border border-border p-4">
                        <div
                          className="h-16 rounded-lg border border-border"
                          style={{ backgroundColor: hex }}
                        />
                        <p className="mt-2 text-xs font-mono text-muted-foreground">{hex}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border p-5">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Display</p>
                      <p className="mt-2 text-2xl font-serif">Didot</p>
                    </div>
                    <div className="rounded-2xl border border-border p-5">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Interface</p>
                      <p className="mt-2 text-2xl font-sans">Neue Helvetica</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl border border-border p-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">3.2 User Flow</p>
                  <h3 className="mt-5 text-3xl font-bold">From discovery to order confirmation.</h3>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {userFlow.map((step, index) => (
                      <div key={`${step}-${index}`} className="flex items-center gap-2">
                        <span className="rounded-full border border-border bg-card/50 px-3 py-2 text-xs font-medium">
                          {step}
                        </span>
                        {index < userFlow.length - 1 && <ArrowUpRight size={13} className="text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal className="mt-24">
              <SectionHeader
                number="3.3"
                title="Information Architecture"
                description="The information architecture organizes the ZARA home page around Women, Men, Kids, and Others, with more discoverable product categories."
              />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {iaColumns.map((column) => (
                  <div key={column.title} className="rounded-3xl border border-border bg-card/30 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{column.title}</h3>
                      <Layers size={18} className="text-primary" />
                    </div>
                    <div className="mt-5 space-y-2">
                      {column.items.map((item) => (
                        <div key={item} className="rounded-xl bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-20">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">3.4 Wireframes</p>
                  <h3 className="mt-4 text-3xl font-bold md:text-5xl">Mid-fidelity before visual polish.</h3>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                    The wireframing stage established layout, hierarchy, content placement, and navigation before moving into the high-fidelity website redesign.
                  </p>
                </div>
                <ImagePlaceholder
                  title="ZARA Mid-Fidelity Wireframes"
                  height="h-[420px]"
                  onClick={() => setLightbox("ZARA Mid-Fidelity Wireframes")}
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===================================================
            04 — DESIGN
        =================================================== */}
        <section id="ui-design" className="scroll-mt-32 border-t border-border px-6 py-32 pb-48">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="04"
              title="Design"
              description="The final redesign focused on solving the specific usability problems identified during research, while maintaining ZARA's fashion-oriented visual identity."
            />

            <Reveal>
              <div className="rounded-3xl border border-border bg-card/30 p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <Tag>Readability</Tag>
                  <Tag>Contrast</Tag>
                  <Tag>Alignment</Tag>
                  <Tag>Navigation</Tag>
                  <Tag>CTA clarity</Tag>
                  <Tag>Information hierarchy</Tag>
                </div>
                <p className="mt-7 max-w-4xl text-2xl font-semibold leading-tight md:text-4xl">
                  Every redesign decision responds directly to an issue documented in the original ZARA experience.
                </p>
              </div>
            </Reveal>

            <div className="mt-20 space-y-20">
              <ComparisonBlock
                title="Login Page"
                original="Original Login Page"
                redesign="Login Page Redesign"
                onImageClick={setLightbox}
                improvements={[
                  { title: "Negative Spacing", text: "The real estate of the website has been used more judiciously in the redesign." },
                  { title: "CTA Buttons", text: "The redesign ensures people can differentiate between CTAs." },
                  { title: "Clearer Hierarchy", text: "The original page was described as too plain, with unnecessary buttons and no attention-grabbing CTA." },
                ]}
              />

              <ComparisonBlock
                title="Home Page"
                original="Original Home Page"
                redesign="Home Page Redesign"
                onImageClick={setLightbox}
                improvements={[
                  { title: "Logo Scale", text: "The ZARA logo was resized to a more appropriate and balanced size so it remains legible without dominating the page." },
                  { title: "Contrast", text: "The redesign follows consistency and a visual theme aligned with ZARA campaigns." },
                  { title: "Layout & Alignment", text: "The redesign follows alignment and a user-friendly layout that is easier to navigate." },
                ]}
              />

              <ComparisonBlock
                title="Search Page"
                original="Original Search Page"
                redesign="Search Page Redesign"
                onImageClick={setLightbox}
                improvements={[
                  { title: "Readability", text: "Legibility is enhanced so the content on the search page is easier to understand." },
                  { title: "Organization", text: "Product content and the gist of its details are organized and aligned in a more appealing way." },
                  { title: "Typography", text: "The redesign addresses the extremely small and difficult-to-read typography identified in the original." },
                ]}
              />

              <ComparisonBlock
                title="Search Result Page"
                original="Original Search Result Page"
                redesign="Search Result Page Redesign"
                onImageClick={setLightbox}
                improvements={[
                  { title: "Clarity", text: "Product information is presented with more clarity and avoids misleading customers." },
                  { title: "Filters", text: "More filters are provided to make finding the desired product easier." },
                  { title: "Search Results", text: "The redesign moves away from a confusing collage-like presentation toward a clearer search-results layout." },
                ]}
              />

              <ComparisonBlock
                title="Product Detail Page"
                original="Original Product Detail Page"
                redesign="Product Detail Page Redesign"
                onImageClick={setLightbox}
                improvements={[
                  { title: "Text Formatting", text: "Product details follow a clearer visual hierarchy according to the content on the page." },
                  { title: "Colour & Size", text: "Colour and size options are mentioned clearly in the product details section." },
                  { title: "Wisely Used White Space", text: "The redesign avoids both excessive empty space and dumping too much information onto the page." },
                ]}
              />

              <ComparisonBlock
                title="Order Detail Page"
                original="Original Order Detail Page"
                redesign="Order Detail Page Redesign"
                onImageClick={setLightbox}
                improvements={[
                  { title: "Organization", text: "Content is organized to avoid alignment that would be overwhelming for users." },
                  { title: "Icon Functionality", text: "A single minus icon is used to avoid confusion and clarify its function." },
                  { title: "Positive / Negative Space", text: "The redesign responds to the original page's lack of a clear positive-space and negative-space relationship." },
                ]}
              />

              <ComparisonBlock
                title="Checkout & Payment"
                original="Original Checkout and Payment Page"
                redesign="Checkout and Payment Redesign"
                onImageClick={setLightbox}
                improvements={[
                  { title: "Wisely Used Real Estate", text: "Website space is used more sensibly to make checkout and payment easier." },
                  { title: "Alignment & Placement", text: "Content is positioned more judiciously to make the process faster and more efficient." },
                  { title: "Reduced Scrolling", text: "The redesign addresses the overwhelming navigation caused by excessive scrolling in the original flow." },
                ]}
              />
            </div>

            <Reveal className="mt-24">
              <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground md:p-14">
                <Sparkles size={25} />
                <h3 className="mt-8 text-3xl font-bold md:text-5xl">The redesign principle</h3>
                <p className="mt-6 max-w-4xl text-lg leading-relaxed opacity-85">
                  The project does not reject ZARA's minimalist aesthetic. Instead, it makes that aesthetic work harder by introducing clearer hierarchy, better contrast, stronger alignment, readable typography, useful filters, and more deliberate use of website real estate.
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-24">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Search, title: "Clearer Search", text: "More readable search content and useful filtering." },
                  { icon: Layers, title: "Better Hierarchy", text: "Content is organized around what users need to understand." },
                  { icon: Target, title: "Clear CTAs", text: "Primary actions are easier to distinguish." },
                  { icon: Zap, title: "Efficient Checkout", text: "Space, alignment, and flow are used to reduce friction." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      whileHover={{ y: -5 }}
                      className="rounded-2xl border border-border p-6"
                    >
                      <Icon size={20} className="text-primary" />
                      <h3 className="mt-5 font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </Reveal>

            {/* Individual contribution */}
            <Reveal className="mt-24">
              <SectionHeader
                number="04.3"
                title="Individual Contribution"
                description="The source case study documents contributions across research, information architecture, user flow, wireframes, fidelity stages, and case-study production."
              />

              <div className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    name: "Prateesh M M",
                    items: ["Qualitative Research", "Quantitative Research", "Mid Fidelity", "High Fidelity", "Case Study"],
                  },
                  {
                    name: "Niharika G",
                    items: ["User Flow", "Wire Frame", "Mid Fidelity", "High Fidelity", "Case Study"],
                  },
                  {
                    name: "Jaya Ridhanya S",
                    items: ["Qualitative Research", "Information Architecture", "High Fidelity", "Case Study"],
                  },
                ].map((member) => (
                  <div key={member.name} className="rounded-3xl border border-border bg-card/30 p-7">
                    <Users size={20} className="text-primary" />
                    <h3 className="mt-5 text-xl font-bold">{member.name}</h3>
                    <div className="mt-6 space-y-2">
                      {member.items.map((item) => (
                        <div key={item} className="rounded-xl bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-24">
              <div className="border-t border-border pt-12">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Next Case Study</p>
                <button className="group mt-5 flex items-center gap-4 text-3xl font-bold md:text-5xl">
                  Heuristic Evaluation
                  <ArrowUpRight className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>
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
                aria-label="Close image preview"
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
                    Replace this placeholder with the corresponding ZARA case-study image.
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