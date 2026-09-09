import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLenis } from "lenis/react";
import { useLocation, useNavigate } from "react-router-dom";

export const caseStudySections = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  {
    id: "user-stakeholder-analysis",
    label: "Users & Stakeholders",
  },
  {
    id: "design-challenge",
    label: "Design Challenge",
  },
  { id: "ideation", label: "Ideation" },
  {
    id: "information-architecture",
    label: "Information Architecture",
  },
  { id: "wireframes", label: "Wireframes" },
  { id: "ui-design", label: "UI Design" },
  { id: "prototype", label: "Prototype" },
  { id: "testing", label: "Testing" },
  { id: "iterations", label: "Iterations" },
  { id: "final-solution", label: "Final Solution" },
  { id: "outcomes", label: "Outcomes & Learnings" },
];

export default function CaseStudyNav() {
  const lenis = useLenis();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] =
    useState("overview");

  const [isBottomNav, setIsBottomNav] =
    useState(false);

  // --------------------------------------------------
  // SHOW BOTTOM NAV AFTER SCROLLING
  // --------------------------------------------------

  useEffect(() => {
    const handleScroll = () => {
      setIsBottomNav(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --------------------------------------------------
  // DETECT ACTIVE CASE STUDY SECTION
  // --------------------------------------------------

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    caseStudySections.forEach((section) => {
      const element = document.getElementById(section.id);

      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(section.id);
          }
        },
        {
          rootMargin: "-25% 0px -60% 0px",
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) =>
        observer.disconnect()
      );
    };
  }, [location.pathname]);

  // --------------------------------------------------
  // SCROLL INSIDE CASE STUDY
  // --------------------------------------------------

  const scrollToCaseStudySection = (id: string) => {
    if (lenis) {
      lenis.scrollTo(`#${id}`, {
        offset: -100,
      });
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  // --------------------------------------------------
  // GO TO MAIN PORTFOLIO SECTION
  // --------------------------------------------------

const goToMainSection = (id: string) => {
  // If already on the homepage, scroll directly
    window.location.href = `/#${id}`;

  if (location.pathname === "/") {
    const element = document.getElementById(id);

    if (!element) return;

    if (lenis) {
      lenis.scrollTo(element, {
        offset: -100,
      });
    } else {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    return;
  }

  // Store the section we want to visit
  sessionStorage.setItem("portfolioTarget", id);

  // Go to homepage
  navigate("/");
};

  // --------------------------------------------------
  // ACTIVE / PREVIOUS / NEXT
  // --------------------------------------------------

  const activeIndex = caseStudySections.findIndex(
    (section) => section.id === activeSection
  );

  const previous =
    activeIndex > 0
      ? caseStudySections[activeIndex - 1]
      : null;

  const next =
    activeIndex < caseStudySections.length - 1
      ? caseStudySections[activeIndex + 1]
      : null;

  // --------------------------------------------------
  // TOP NAVIGATION
  // --------------------------------------------------

  return (
    <>
      {/* ============================================= */}
      {/* TOP CASE STUDY NAV */}
      {/* ============================================= */}

      <AnimatePresence>
        {!isBottomNav && (
          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            className="sticky top-24 z-40 px-4"
          >
            <div className="mx-auto max-w-7xl">
              <div className="glass-panel rounded-2xl p-2 shadow-lg">

                <div className="flex gap-1 overflow-x-auto scrollbar-hide">

                  {/* ================================= */}
                  {/* MAIN PORTFOLIO NAVIGATION */}
                  {/* ================================= */}

                    <button
                    onClick={() => {
                        window.location.href = "/";
                    }}
                    className="
                        relative
                        whitespace-nowrap
                        rounded-xl
                        px-4
                        py-2.5
                        text-xs
                        font-medium
                        text-muted-foreground
                        transition-all
                        duration-300
                        hover:bg-muted/50
                        hover:text-foreground
                    "
                    >
                    Home
                    </button>

                  <button
                    onClick={() =>
                      goToMainSection("about")
                    }
                    className="
                      relative
                      whitespace-nowrap
                      rounded-xl
                      px-4
                      py-2.5
                      text-xs
                      font-medium
                      text-muted-foreground
                      transition-all
                      duration-300
                      hover:bg-muted/50
                      hover:text-foreground
                    "
                  >
                    About
                  </button>

                  <button
                    onClick={() =>
                      goToMainSection("education")
                    }
                    className="
                      relative
                      whitespace-nowrap
                      rounded-xl
                      px-4
                      py-2.5
                      text-xs
                      font-medium
                      text-muted-foreground
                      transition-all
                      duration-300
                      hover:bg-muted/50
                      hover:text-foreground
                    "
                  >
                    Education
                  </button>

                  <button
                    onClick={() =>
                      goToMainSection("career")
                    }
                    className="
                      relative
                      whitespace-nowrap
                      rounded-xl
                      px-4
                      py-2.5
                      text-xs
                      font-medium
                      text-muted-foreground
                      transition-all
                      duration-300
                      hover:bg-muted/50
                      hover:text-foreground
                    "
                  >
                    Career
                  </button>

                  <button
                    onClick={() =>
                      goToMainSection("projects")
                    }
                    className="
                      relative
                      whitespace-nowrap
                      rounded-xl
                      px-4
                      py-2.5
                      text-xs
                      font-medium
                      text-muted-foreground
                      transition-all
                      duration-300
                      hover:bg-muted/50
                      hover:text-foreground
                    "
                  >
                    Projects
                  </button>

                  <button
                    onClick={() =>
                      goToMainSection("contact")
                    }
                    className="
                      relative
                      whitespace-nowrap
                      rounded-xl
                      px-4
                      py-2.5
                      text-xs
                      font-medium
                      text-muted-foreground
                      transition-all
                      duration-300
                      hover:bg-muted/50
                      hover:text-foreground
                    "
                  >
                    Contact
                  </button>

                  {/* DIVIDER */}

                  <div
                    className="
                      mx-1
                      h-8
                      w-px
                      shrink-0
                      self-center
                      bg-border
                    "
                  />
                  
                  {/* ================================= */}
                  {/* CASE STUDY SECTIONS */}
                  {/* ================================= */}

                  {caseStudySections.map((section) => {
                    const active =
                      activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        onClick={() =>
                          scrollToCaseStudySection(
                            section.id
                          )
                        }
                        className={`
                          relative
                          whitespace-nowrap
                          rounded-xl
                          px-4
                          py-2.5
                          text-xs
                          font-medium
                          transition-all
                          duration-300
                          ${
                            active
                              ? "bg-primary/10 text-foreground"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }
                        `}
                      >
                        {section.label}

                        {active && (
                          <motion.div
                            layoutId="case-study-active"
                            className="
                              absolute
                              bottom-1
                              left-1/2
                              h-0.5
                              w-5
                              -translate-x-1/2
                              rounded-full
                              bg-primary
                            "
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

      {/* ============================================= */}
      {/* BOTTOM CASE STUDY NAV */}
      {/* ============================================= */}

      <AnimatePresence>
        {isBottomNav && (
          <motion.div
            initial={{
              opacity: 0,
              y: 100,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 100,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="
              fixed
              bottom-5
              left-0
              right-0
              z-50
              px-4
            "
          >
            <div className="mx-auto max-w-3xl">

              <div className="glass-panel rounded-2xl p-2 shadow-2xl">

                <div className="flex items-center gap-2">

                  {/* PREVIOUS */}

                  <button
                    disabled={!previous}
                    onClick={() =>
                      previous &&
                      scrollToCaseStudySection(
                        previous.id
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-1
                      rounded-xl
                      px-3
                      py-2.5
                      text-xs
                      text-muted-foreground
                      transition
                      hover:bg-muted/50
                      hover:text-foreground
                      disabled:opacity-20
                    "
                  >
                    <ChevronLeft size={15} />

                    <span className="hidden sm:inline">
                      {previous?.label || "Previous"}
                    </span>

                    <span className="sm:hidden">
                      Prev
                    </span>
                  </button>

                  {/* CURRENT */}

                  <button
                    onClick={() =>
                      scrollToCaseStudySection(
                        activeSection
                      )
                    }
                    className="
                      flex-1
                      rounded-xl
                      bg-primary/10
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-foreground
                    "
                  >
                    {
                      caseStudySections[activeIndex]
                        ?.label
                    }
                  </button>

                  {/* NEXT */}

                  <button
                    disabled={!next}
                    onClick={() =>
                      next &&
                      scrollToCaseStudySection(
                        next.id
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-1
                      rounded-xl
                      px-3
                      py-2.5
                      text-xs
                      text-muted-foreground
                      transition
                      hover:bg-muted/50
                      hover:text-foreground
                      disabled:opacity-20
                    "
                  >
                    <span className="hidden sm:inline">
                      {next?.label || "Next"}
                    </span>

                    <span className="sm:hidden">
                      Next
                    </span>

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
