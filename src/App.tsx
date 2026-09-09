import { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header/Header";
import { HeroSection } from "./components/HeroSection/HeroSection";
import { AboutSection } from "./components/AboutSection/AboutSection";
import { ServicesSection } from "./components/ServicesSection/ServicesSection";
import { ProjectsSection } from "./components/ProjectsSection/ProjectsSection";
import { EducationSection } from "./components/EducationSection/EducationSection";
import { CareerTimeline } from "./components/CareerSection/CareerTimeline";
import { ContactSection } from "./components/ContactSection/ContactSection";
import { Footer } from "./components/Footer/Footer";
import WhatIBringSection from "./components/WhatIBringSection/WhatIBringSection";
import BackgroundParticles from "./components/BackgroundParticles/BackgroundParticles";

import ReactLenis, { useLenis } from "lenis/react";

import {
  Home,
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Send,
  MessageSquare,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import Dock from "./components/lightswind/dock";
import { SmoothCursor } from "./components/lightswind/smooth-cursor";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AINergy from "./Projects/AINergy";
import HeuristicEvaluation from "./Projects/HeuristicEvaluation";
import VidyaVani from "./Projects/VidyaVani";
import ZaraCaseStudy from "./Projects/ZaraCaseStudy";


/* =========================================================
   SCROLL MANAGER
   Lenis caches the document's scroll height when it mounts.
   Client-side route changes (case study <-> homepage) swap
   the DOM without a full reload, so Lenis doesn't know the
   page height changed. Without this, the visual scroll
   position can get stuck, making navigation look like it
   silently failed even though the route did change.
========================================================= */

function ScrollManager() {
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    // Recalculate Lenis's internal measurements for the newly
    // mounted page. Deliberately NOT forcing scrollTo(0) here,
    // since HomePage may still need to scroll to a pending
    // section target stored in sessionStorage.
    if (lenis) {
      lenis.resize();
    }
  }, [location.pathname, lenis]);

  return null;
}


/* =========================================================
   HOME PAGE
========================================================= */

function HomePage() {
  const [showDock, setShowDock] = useState(false);
  const lenis = useLenis();

  // --------------------------------------------------
  // SHOW DOCK WHEN SCROLLING DOWN
  // --------------------------------------------------

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      const shouldShow =
        currentScrollY > lastScrollY &&
        currentScrollY > window.innerHeight * 0.5;

      const isTop =
        currentScrollY < window.innerHeight * 0.5;

      if (shouldShow) {
        setShowDock(true);
      } else if (isTop) {
        setShowDock(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };

  }, []);

  useEffect(() => {
    const id = sessionStorage.getItem("portfolioTarget");

    if (!id) return;

    sessionStorage.removeItem("portfolioTarget");

    let attempts = 0;
    const maxAttempts = 40;

    const tryScroll = () => {
      const element = document.getElementById(id);

      if (element) {
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

      attempts++;

      if (attempts < maxAttempts) {
        setTimeout(tryScroll, 50);
      }
    };

    setTimeout(tryScroll, 100);
  }, [lenis]);

  // --------------------------------------------------
  // SCROLL TO HOMEPAGE SECTION
  // --------------------------------------------------

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // --------------------------------------------------
  // DOCK ITEMS
  // --------------------------------------------------

  const dockItems = [
    {
      icon: <Home size={20} />,
      label: "Home",
      onClick: () =>
        scrollToSection("hero"),
    },

    {
      icon: <User size={20} />,
      label: "About",
      onClick: () =>
        scrollToSection("about"),
    },

    {
      icon: <Briefcase size={20} />,
      label: "Career",
      onClick: () =>
        scrollToSection("career"),
    },

    {
      icon: <FolderKanban size={20} />,
      label: "Projects",
      onClick: () =>
        scrollToSection("projects"),
    },

    {
      icon: <GraduationCap size={20} />,
      label: "Education",
      onClick: () =>
        scrollToSection("education"),
    },

    {
      icon: <MessageSquare size={20} />,
      label: "What I Bring",
      onClick: () =>
        scrollToSection("approach"),
    },

    {
      icon: <Send size={20} />,
      label: "Contact",
      onClick: () =>
        scrollToSection("contact"),
    },
  ];

  // --------------------------------------------------
  // HOME PAGE
  // --------------------------------------------------

  return (
    <div
      className="
        bg-transparent
        min-h-screen
        relative
        overflow-x-hidden
        selection:bg-primary/30
        selection:text-primary-foreground
      "
    >

      {/* Main Header */}

      <Header />

      {/* Main Portfolio */}

      <main>

        <section id="hero">
          <HeroSection />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section id="career">
          <CareerTimeline />
        </section>

        <section id="projects">
          <ProjectsSection />
        </section>

        <section id="services">
          <ServicesSection />
        </section>

        <section id="education">
          <EducationSection />
        </section>

        <section id="approach">
          <WhatIBringSection />
        </section>

        <section id="contact">
          <ContactSection />
        </section>

      </main>

      {/* Footer */}

      <Footer />

      {/* =============================================
          FLOATING DOCK
      ============================================= */}

      <AnimatePresence>
        {showDock && (
          <motion.div
            initial={{
              y: 100,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: 100,
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="
              fixed
              bottom-2
              left-0
              right-0
              z-[999]
              hidden
              md:block
            "
          >
            <Dock
              items={dockItems}
              panelHeight={56}
              baseItemSize={44}
              magnification={66}
              distance={180}
              multiBorder
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}


/* =========================================================
   APP ROUTER
========================================================= */

function App() {
  return (
    <BrowserRouter>

      {/* Global Smooth Scrolling */}

      <ReactLenis
        root
        options={{
          smoothWheel: true,
          duration: 1.2,
        }}
      >

        {/* Bouncing background shapes/emojis — behind everything, on every route */}

        <BackgroundParticles />

        {/* Global Cursor */}

        <SmoothCursor
          glowEffect
          showTrail
          trailLength={4}
        />

        {/* Fix Lenis's cached scroll height on every route change */}

        <ScrollManager />

        {/* Routes */}

        <Routes>

          {/* Portfolio Homepage */}

          <Route
            path="/"
            element={<HomePage />}
          />

          {/* Project Case Studies */}

          <Route
            path="/projects/ai-energy"
            element={<AINergy />}
          />

          <Route
            path="/projects/heuristic-evaluation"
            element={<HeuristicEvaluation />}
          />

          <Route
            path="/projects/vidyavani"
            element={<VidyaVani />}
          />

          <Route
            path="/projects/zara"
            element={<ZaraCaseStudy />}
          />

        </Routes>

      </ReactLenis>

    </BrowserRouter>
  );
}

export default App;