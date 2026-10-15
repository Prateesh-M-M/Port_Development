import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight} from "lucide-react";

type ProjectCategory =
  | "Case Studies"
  | "Graphic Design"
  | "Motion Graphics"
  | "Others";

type MotionPosition = "left" | "top" | "bottom" | "right";

type Project = {
  id: number;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  link: string;
  image: string;
  gridClass?: string;
  aspectRatio?: string;
  motionPosition?: MotionPosition;
};

export const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] =
    useState<ProjectCategory>("Case Studies");

  const categories: ProjectCategory[] = [
    "Case Studies",
    "Graphic Design",
    "Motion Graphics",
    "Others",
  ];

  const projects: Project[] = [
    // CASE STUDIES

    {
      id: 1,
      title: "AI-NERGY",
      subtitle:
        "An intelligent home energy experience that helps people understand and manage their energy consumption",
      category: "Case Studies",
      link: "/projects/ai-energy",
      image:
        "https://cdn.dribbble.com/userupload/44336281/file/0333295e0300b04d6e88d5819fde13f1.png?resize=1504x845&vertical=center",
      gridClass: "md:col-span-7 h-[420px]",
    },

    {
      id: 2,
      title: "Heuristic Evaluation",
      subtitle:
        "A UX evaluation focused on identifying usability issues and improving the overall user experience",
      category: "Case Studies",
      link: "/projects/heuristic-evaluation",
      image:
        "https://cdn.dribbble.com/userupload/44336424/file/f6ab7185375041658418c5487deaf909.png?resize=2048x1152&vertical=center",
      gridClass: "md:col-span-5 h-[420px]",
    },

    {
      id: 3,
      title: "VidyaVani",
      subtitle:
        "An educational experience designed to make learning more accessible and engaging",
      category: "Case Studies",
      link: "/projects/vidyavani",
      image:
        "https://cdn.dribbble.com/userupload/44337813/file/b3c75bc9740ac039d4c8679162b5b6ba.png?resize=1504x846&vertical=center",
      gridClass: "md:col-span-5 h-[360px]",
    },

    {
      id: 4,
      title: "Zara Case Study",
      subtitle:
        "A UX case study exploring the shopping experience and opportunities for improvement",
      category: "Case Studies",
      link: "/projects/zara",
      image:
        "https://cdn.dribbble.com/userupload/44341042/file/139d0c290a50e9148fc0d7ec77f39065.jpg?resize=1200x676&vertical=center",
      gridClass: "md:col-span-7 h-[360px]",
    },

    // GRAPHIC DESIGN

    {
      id: 5,
      title: "Pattern Design",
      subtitle:
        "Selected visual design work exploring branding, composition, typography, and visual communication",
      category: "Graphic Design",
      link: "/projects/patterndesign",
      image: "https://cdn.dribbble.com/userupload/44337207/file/422000aa8a8d691921b97f44721a8927.png?resize=1600x1787&vertical=center",
      gridClass: "md:col-span-7 h-[420px]",
    },

    {
      id: 6,
      title: "Graphic Design Project",
      subtitle:
        "Selected visual design work exploring branding, composition, typography, and visual communication",
      category: "Graphic Design",
      link: "https://dribbble.com/shots/26349628-Poster-Design-Beach-Party-Invite",
      image: "https://cdn.dribbble.com/userupload/44336711/file/76817135354b9745b040e2be5e553b2a.jpg?resize=1600x2262&vertical=center",
      gridClass: "md:col-span-5 h-[420px]",
    },

    // MOTION GRAPHICS
    
    {
      id:7,
      title: "Fanta Advert",
      subtitle: "Motion Graphics exploration and animation",
      category: "Motion Graphics",
      link: "https://drive.google.com/file/d/1dcbbPhplRpVvv_zeKUanH_4mddrFqa0f/view?usp=sharing",
      image: "/images/MG1.png",
      motionPosition: "left",
    },

    {
      id: 8,
      title: "Lays Advert",
      subtitle: "Motion Graphics exploration and animation",
      category: "Motion Graphics",
      link: "https://drive.google.com/file/d/1GY1qiAEMFJHGY7mZL2qo3GnHN6tw8qF8/view?usp=sharing", 
      image: "/images/MG2.png",
      motionPosition: "top",
    },

    {
      id: 9,
      title: "Food Delivery App Loading Animation",
      subtitle: "Motion Graphics exploration and animation",
      category: "Motion Graphics",
      link: "https://drive.google.com/file/d/1l8JP0aWcb9-AKQQ0VleRikbs-XMPsB-Q/view?usp=sharing",
      image: "/images/MG3.png",
      motionPosition: "bottom",
    },

    {
      id: 10,
      title: "Fanta Advert 2.0",
      subtitle: "Motion Graphics exploration and animation",
      category: "Motion Graphics",
      link: "https://drive.google.com/file/d/1qBIEyzF1EA_cQ4CglmwAVzZajKqFLEBw/view?usp=sharing",
      image: "/images/MG4.png",
      motionPosition: "right",
    },

    // OTHERS

    {
      id: 11,
      title: "2D Game Design",
      subtitle:
        "2D Game Design using Unity and C# for a simple platformer game",
      category: "Others",
      link: "/projects/PlanetPirate",
      image: "https://cdn.dribbble.com/userupload/49286339/file/6434eff9d5d3d0906bcf82b614b0629d.png?resize=3810x2143&vertical=center",
      gridClass: "md:col-span-7 h-[360px]",
    },
  ];

  const filteredProjects = projects.filter(
    (project) => project.category === activeCategory
  );

  const isMotionGraphics = activeCategory === "Motion Graphics";

  return (
    <section
      id="projects"
      className="relative w-full max-w-[1500px] mx-auto px-6 md:px-8 py-24 overflow-hidden"
    >
      
      {/* SECTION HEADING */}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mb-8 md:mb-10"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center md:text-left">
          Selected{" "}
          <span className="text-gradient-primary">Works</span>
        </h2>

        <p className="text-muted-foreground text-center md:text-left max-w-2xl text-lg">
          A collection of case studies, visual explorations, motion work,
          and other things I've created.
        </p>
      </motion.div>

      {/* FILTER */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="
          relative
          z-20
          flex
          flex-wrap
          justify-center
          md:justify-start
          gap-2
          mb-12
        "
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                relative
                px-5
                py-2.5
                rounded-full
                text-sm
                font-medium
                transition-all
                duration-300
                border
                ${
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-foreground/10 hover:text-foreground hover:border-foreground/30"
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </motion.div>

      {/* MOTION GRAPHICS — SPECIAL BENTO LAYOUT */}

      {isMotionGraphics ? (
        <div className="relative z-10 w-full flex justify-center">

          <motion.div
            layout
            className="
              relative
              w-full
              max-w-[1180px]
              h-[650px]
              md:h-[560px]
            "
          >

            <AnimatePresence mode="popLayout">

              {filteredProjects.map((project, i) => {

                const positionStyles = {
                  left: `
                    absolute
                    left-[-7.5%]
                    top-0
                    w-[27%]
                    aspect-[9/16]
                  `,

                  top: `
                    absolute
                    left-[22%]
                    top-0
                    w-[40%]
                    aspect-[16/9]
                  `,

                  bottom: `
                    absolute
                    left-[41%]
                    top-[52%]
                    w-[40%]
                    aspect-[16/9]
                  `,

                  right: `
                    absolute
                    right-[-10%]
                    top-0
                    w-[27%]
                    aspect-[9/16]
                  `,
                };

                return (
                  <motion.a
                    key={project.id}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"

                    layout

                    initial={{
                      opacity: 0,
                      scale: 0.92,
                      y: 25,
                    }}

                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}

                    exit={{
                      opacity: 0,
                      scale: 0.92,
                      y: -20,
                    }}

                    transition={{
                      duration: 0.6,
                      delay: i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}

                    className={`
                      group
                      ${positionStyles[project.motionPosition!]}
                    `}
                  >

                    {/* CARD */}

                    <div
                      className="
                        relative
                        w-full
                        h-full
                        overflow-hidden
                        rounded-[2rem]
                        md:rounded-[2.35rem]
                        bg-neutral-950
                        border
                        border-foreground/10
                        shadow-xl
                      "
                    >

                      {/* IMAGE */}

                      <div className="absolute inset-0 overflow-hidden">

                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-700
                            ease-out
                            group-hover:scale-[1.045]
                          "
                        />

                        {/* subtle overlay */}

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/75
                            via-black/10
                            to-transparent
                            opacity-70
                            group-hover:opacity-85
                            transition-opacity
                            duration-500
                          "
                        />

                      </div>


                      {/* CONTENT */}

                      <div
                        className="
                          absolute
                          inset-0
                          p-5
                          md:p-6
                          flex
                          flex-col
                          justify-end
                          pointer-events-none
                        "
                      >

                        <div
                          className="
                            flex
                            items-end
                            justify-between
                            gap-3
                            translate-y-2
                            group-hover:translate-y-0
                            transition-transform
                            duration-300
                          "
                        >

                          <div>

                            <p
                              className="
                                text-[9px]
                                md:text-[10px]
                                uppercase
                                tracking-[0.18em]
                                font-semibold
                                text-white/60
                                mb-1
                              "
                            >
                              Motion
                            </p>

                            <h3
                              className="
                                text-lg
                                md:text-xl
                                font-bold
                                tracking-tight
                                text-white
                              "
                            >
                              {project.title}
                            </h3>

                          </div>


                          {/* Arrow */}

                          <div
                            className="
                              w-9
                              h-9
                              md:w-10
                              md:h-10
                              rounded-full
                              bg-white/15
                              backdrop-blur-md
                              border
                              border-white/25
                              flex
                              items-center
                              justify-center
                              shrink-0
                              opacity-80
                              group-hover:opacity-100
                              group-hover:bg-white
                              transition-all
                              duration-300
                              rotate-45
                              group-hover:rotate-0
                            "
                          >

                            <ArrowUpRight
                              className="
                                w-4
                                h-4
                                md:w-5
                                md:h-5
                                text-white
                                group-hover:text-black
                                transition-colors
                              "
                            />

                          </div>

                        </div>

                      </div>

                    </div>

                  </motion.a>
                );
              })}

            </AnimatePresence>

          </motion.div>

        </div>
      ) : (
        /*  NORMAL BENTO GRID FOR OTHER CATEGORIES */

        <motion.div
          layout
          className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 w-full"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.a
                key={project.id}
                href={project.link}
                layout
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: -20,
                }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.05,
                }}
                className={`group relative block ${project.gridClass}`}
              >
                <div
                  className="
                    relative
                    w-full
                    h-full
                    overflow-hidden
                    rounded-[2.25rem]
                    shadow-xl
                    border
                    border-foreground/10
                    bg-neutral-950
                  "
                >
                  <div className="absolute inset-0">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-105
                        opacity-80
                        group-hover:opacity-100
                        transform-gpu
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/90
                        via-black/40
                        to-transparent
                      "
                    />
                  </div>

                  <div
                    className="
                      absolute
                      inset-0
                      p-8
                      flex
                      flex-col
                      justify-end
                      pointer-events-none
                    "
                  >
                    <div
                      className="
                        flex
                        items-end
                        justify-between
                        gap-4
                        translate-y-2
                        group-hover:translate-y-0
                        transition-transform
                        duration-300
                      "
                    >
                      <div className="z-10 max-w-lg">
                        <h3
                          className="
                            text-2xl
                            md:text-3xl
                            font-extrabold
                            text-white
                            mb-2
                            tracking-tight
                            drop-shadow-md
                          "
                        >
                          {project.title}
                        </h3>

                        <p
                          className="
                            text-sm
                            md:text-base
                            font-medium
                            text-white/80
                            opacity-90
                            group-hover:opacity-100
                            transition-opacity
                            duration-300
                          "
                        >
                          {project.subtitle}
                        </p>
                      </div>

                      <div
                        className="
                          w-12
                          h-12
                          rounded-full
                          bg-white/20
                          backdrop-blur-md
                          border
                          border-white/30
                          flex
                          items-center
                          justify-center
                          shrink-0
                          opacity-80
                          group-hover:opacity-100
                          group-hover:bg-white
                          group-hover:text-black
                          transition-all
                          duration-300
                          rotate-45
                          group-hover:rotate-0
                          z-10
                          shadow-lg
                        "
                      >
                        <ArrowUpRight
                          className="
                            w-6
                            h-6
                            text-white
                            group-hover:text-black
                            transition-colors
                          "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* EMPTY STATE */}

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            py-20
            text-center
            text-muted-foreground
          "
        >
          No projects added to this category yet.
        </motion.div>
      )}
    </section>
  );
};