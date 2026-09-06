import { motion } from "framer-motion";
import {
  Search,
  Palette,
  Code2,
  Brain,
  Accessibility,
  Sparkles,
} from "lucide-react";

const WhatIBringSection = () => {
  const strengths = [
    {
      icon: <Search className="w-5 h-5" />,
      title: "Research-Driven",
      description:
        "I start by understanding the problem, the users, and the context before jumping into solutions.",
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Thoughtful Design",
      description:
        "I turn insights into clear, intuitive interfaces with strong visual hierarchy and purposeful interactions.",
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Design + Technology",
      description:
        "My understanding of development helps me create designs that are not only beautiful, but practical to build.",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "AI & HCI",
      description:
        "I'm exploring how AI can create more adaptive, intelligent, and human-centered digital experiences.",
    },
    {
      icon: <Accessibility className="w-5 h-5" />,
      title: "Accessible by Design",
      description:
        "I believe good experiences should be usable by as many people as possible, regardless of ability.",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Always Exploring",
      description:
        "From AI and 3D to AR and VR, I enjoy experimenting with emerging technologies and new forms of interaction.",
    },
  ];

  return (
    <section id="approach" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          What I <span className="text-gradient-primary">Bring</span>
        </h2>

        <p className="text-muted-foreground max-w-xl mx-auto">
          A combination of design thinking, technical understanding, and
          curiosity for emerging technology.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strengths.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass-panel p-7 rounded-3xl border border-foreground/10 group hover:border-primary/30 transition-colors duration-500"
          >
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/15 transition-colors">
              {item.icon}
            </div>

            <h3 className="text-lg font-bold mb-2">
              {item.title}
            </h3>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhatIBringSection;