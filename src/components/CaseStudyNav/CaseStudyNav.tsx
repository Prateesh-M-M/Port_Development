import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLenis } from "lenis/react";
import { useLocation, useNavigate } from "react-router-dom";

export type CaseStudySection = { id: string; label: string };

type CaseStudyNavProps = {
  /** Optional. If omitted, sections are discovered from the page via [data-case-section]. */
  sections?: CaseStudySection[];
};

const mainLinks = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "career", label: "Career" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const navButton =
  "relative whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:bg-muted/50 hover:text-foreground";

// Reads every <section data-case-section="Label" id="..."> currently on the page
function discoverSections(): CaseStudySection[] {
  const found: CaseStudySection[] = [];

  document
    .querySelectorAll<HTMLElement>("[data-case-section]")
    .forEach((el) => {
      if (!el.id) return;

      const label =
        el.dataset.caseSection?.trim() ||
        el.querySelector("h1, h2, h3")?.textContent?.trim() ||
        el.id;

      found.push({ id: el.id, label });
    });

  return found;
}

export default function CaseStudyNav({ sections: sectionsProp }: CaseStudyNavProps) {
  const lenis = useLenis();
  const navigate = useNavigate();
  const location = useLocation();

  const [discovered, setDiscovered] = useState<CaseStudySection[]>([]);
  const [activeSection, setActiveSection] = useState("");
  const [isBottomNav, setIsBottomNav] = useState(false);

  const sections = sectionsProp ?? discovered;

  // --------------------------------------------------
  // DISCOVER SECTIONS FOR THE CURRENT CASE STUDY
  // Re-runs on route change and whenever the DOM changes
  // (covers lazy-loaded / late-rendering content).
  // --------------------------------------------------

  useEffect(() => {
    if (sectionsProp) return;

    let timeout: number;

    const scan = () => {
      const next = discoverSections();

      // Only update state if something actually changed
      setDiscovered((prev) =>
        prev.length === next.length &&
        prev.every((s, i) => s.id === next[i].id && s.label === next[i].label)
          ? prev
          : next
      );
    };

    const debouncedScan = () => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(scan, 100);
    };

    scan();

    const mutationObserver = new MutationObserver(debouncedScan);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.clearTimeout(timeout);
      mutationObserver.disconnect();
    };
  }, [location.pathname, sectionsProp]);

  // --------------------------------------------------
  // SHOW BOTTOM NAV AFTER SCROLLING
  // --------------------------------------------------

  useEffect(() => {
    const handleScroll = () => setIsBottomNav(window.scrollY > 600);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // --------------------------------------------------
  // DETECT ACTIVE SECTION (one observer for all sections)
  // --------------------------------------------------

  useEffect(() => {
    if (sections.length === 0) {
      setActiveSection("");
      return;
    }

    // Start on the first section of the new case study
    setActiveSection(sections[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // Re-run only when the set of section ids changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.map((s) => s.id).join("|")]);

  // --------------------------------------------------
  // SCROLLING
  // --------------------------------------------------

  const scrollToCaseStudySection = useCallback(
    (id: string) => {
      if (lenis) {
        lenis.scrollTo(`#${id}`, { offset: -100 });
      } else {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenis]
  );

  const goToMainSection = (id: string) => {
    // Already on the homepage: just scroll
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (!element) return;

      if (lenis) lenis.scrollTo(element, { offset: -100 });
      else element.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Otherwise remember the target and go home (homepage reads this, see note)
    sessionStorage.setItem("portfolioTarget", id);
    navigate("/");
  };

  // --------------------------------------------------
  // ACTIVE / PREVIOUS / NEXT
  // --------------------------------------------------

  const activeIndex = Math.max(
    sections.findIndex((s) => s.id === activeSection),
    0
  );
  const current = sections[activeIndex];
  const previous = activeIndex > 0 ? sections[activeIndex - 1] : null;
  const next =
    activeIndex < sections.length - 1 ? sections[activeIndex + 1] : null;

  return (
    <>
      {/* TOP NAV */}
      <AnimatePresence>
        {!isBottomNav && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="sticky top-24 z-40 px-4"
          >
            <div className="mx-auto max-w-7xl">
              <div className="glass-panel rounded-2xl p-2 shadow-lg">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  <button onClick={() => navigate("/")} className={navButton}>
                    Home
                  </button>

                  {mainLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => goToMainSection(link.id)}
                      className={navButton}
                    >
                      {link.label}
                    </button>
                  ))}

                  {sections.length > 0 && (
                    <div className="mx-1 h-8 w-px shrink-0 self-center bg-border" />
                  )}

                  {sections.map((section) => {
                    const active = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToCaseStudySection(section.id)}
                        className={`relative whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-medium transition-all duration-300 ${
                          active
                            ? "bg-primary/10 text-foreground"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        {section.label}

                        {active && (
                          <motion.div
                            layoutId="case-study-active"
                            className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM NAV */}
      <AnimatePresence>
        {isBottomNav && sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-5 left-0 right-0 z-50 px-4"
          >
            <div className="mx-auto max-w-3xl">
              <div className="glass-panel rounded-2xl p-2 shadow-2xl">
                <div className="flex items-center gap-2">
                  <button
                    disabled={!previous}
                    onClick={() =>
                      previous && scrollToCaseStudySection(previous.id)
                    }
                    className="flex items-center gap-1 rounded-xl px-3 py-2.5 text-xs text-muted-foreground transition hover:bg-muted/50 hover:text-foreground disabled:opacity-20"
                  >
                    <ChevronLeft size={15} />
                    <span className="hidden sm:inline">
                      {previous?.label || "Previous"}
                    </span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  <button
                    onClick={() => current && scrollToCaseStudySection(current.id)}
                    className="flex-1 rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-semibold text-foreground"
                  >
                    {current?.label}
                  </button>

                  <button
                    disabled={!next}
                    onClick={() => next && scrollToCaseStudySection(next.id)}
                    className="flex items-center gap-1 rounded-xl px-3 py-2.5 text-xs text-muted-foreground transition hover:bg-muted/50 hover:text-foreground disabled:opacity-20"
                  >
                    <span className="hidden sm:inline">
                      {next?.label || "Next"}
                    </span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}