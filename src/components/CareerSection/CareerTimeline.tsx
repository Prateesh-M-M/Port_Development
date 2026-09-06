import { ScrollTimeline } from "../lightswind/scroll-timeline";
import { Briefcase, Layers,  Globe } from "lucide-react";

export const CareerTimeline = () => {
  const careerEvents = [
    {
      year: "May 2025 – August 2026",
      title: "UI/UX Designer",
      subtitle: "Angika Technology",
      description:
        "Designed intuitive user experiences for web and mobile applications, creating user flows, wireframes, prototypes, and high-fidelity interfaces. Collaborated with stakeholders and development teams to ensure seamless implementation. Conducted user research and usability evaluations while contributing to design systems and maintaining visual consistency across products.",
      icon: <Globe className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "June 2024 – November 2024",
      title: "Junior UX Designer",
      subtitle: "Gizmo Plugs",
      description:
        "Contributed to UX research, user journey mapping, usability testing, and iterative product improvements. Developed wireframes and interactive prototypes in Figma while collaborating with senior designers to improve usability, accessibility, and overall product experiences.",
      icon: <Layers className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "April 2020 – May 2021",
      title: "Freelance Designer",
      subtitle: "Self-Employed",
      description:
        "Delivered UI, branding, and digital design solutions for independent clients. Managed projects from requirement gathering through final delivery, creating responsive interfaces and visual assets tailored to client goals while maintaining clear communication and effective project management.",
      icon: <Briefcase className="h-4 w-4 mr-2 text-primary" />,
    },
  ];

  return (
    <div id="career">
      <ScrollTimeline
        events={careerEvents}
        title="Career Journey"
        subtitle="An evolving path of leadership, innovation, and impact"
        animationOrder="staggered"
        cardAlignment="alternating"
        cardVariant="elevated"
        parallaxIntensity={0.15}
        revealAnimation="fade"
        progressIndicator={true}
        lineColor="bg-primary/20"
        activeColor="bg-primary"
        progressLineWidth={3}
        progressLineCap="round"
      />
    </div>
  );
};
