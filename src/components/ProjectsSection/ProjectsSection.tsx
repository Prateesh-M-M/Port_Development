import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const ProjectsSection = () => {
  const projects = [
    {
    id: 1,
    title: "AI-NERGY",
    subtitle:
      "An intelligent home energy experience that helps people understand and manage their energy consumption",
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
    link: "/projects/zara",
    image:
      "https://cdn.dribbble.com/userupload/44341042/file/139d0c290a50e9148fc0d7ec77f39065.jpg?resize=1200x676&vertical=center",
    gridClass: "md:col-span-7 h-[360px]",
    },
  ];

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center md:text-left">
          Selected <span className="text-gradient-primary">Works</span>
        </h2>
        <p className="text-muted-foreground text-center md:text-left max-w-2xl text-lg">
          A showcase of complex systems, elegant interfaces, and scalable applications I've engineered.
        </p>
      </motion.div>

      {/* 12-Column Full-Width Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        {projects.map((project, i) => (
          <motion.a
            key={project.id}
            href={project.link}
            className={`group relative overflow-hidden rounded-[2.25rem] block shadow-xl border border-foreground/10 ${project.gridClass}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 bg-neutral-950">
              <img 
                src={project.image} 
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 transform-gpu"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
              <div className="flex items-end justify-between gap-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 transform-gpu">
                <div className="z-10 max-w-lg">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
                    {project.title}
                  </h3>
                  <p className="text-sm md:text-base font-medium text-white/80 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    {project.subtitle}
                  </p>
                </div>
                
                {/* Arrow Action Icon */}
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 opacity-80 group-hover:opacity-100 group-hover:bg-white group-hover:text-black transition-all duration-300 rotate-45 group-hover:rotate-0 z-10 shadow-lg">
                  <ArrowUpRight className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};
