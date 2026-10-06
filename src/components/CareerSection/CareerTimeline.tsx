import { Briefcase, Layers, Globe } from "lucide-react";

const careerEvents = [
  {
    period: "May 2025 – August 2026",
    title: "UI/UX Designer",
    company: "Angika Technology",
    icon: Globe,
    points: [
      "Designed user flows, wireframes, prototypes and high-fidelity interfaces for web and mobile apps.",
      "Worked with stakeholders and developers to keep implementation true to the design.",
      "Ran user research and usability evaluations.",
      "Contributed to the design system and kept visuals consistent across products.",
    ],
  },
  {
    period: "June 2024 – November 2024",
    title: "Junior UX Designer",
    company: "Gizmo Plugs",
    icon: Layers,
    points: [
      "Supported UX research, user journey mapping and usability testing.",
      "Built wireframes and interactive prototypes in Figma.",
      "Partnered with senior designers to improve usability and accessibility through iteration.",
    ],
  },
  {
    period: "April 2020 – May 2021",
    title: "Freelance Designer",
    company: "Self-Employed",
    icon: Briefcase,
    points: [
      "Delivered UI, branding and digital design for independent clients.",
      "Managed projects from requirement gathering to final delivery.",
      "Created responsive interfaces and visual assets tailored to each client's goals.",
    ],
  },
];

export const CareerTimeline = () => {
  return (
    <section id="career" className="mx-auto w-full max-w-3xl px-4 py-12 md:py-16">
      <header className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Career Journey
        </h2>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Where I've worked and what I did there.
        </p>
      </header>

      <ol className="relative space-y-8">
        {/* vertical rail */}
        <span
          aria-hidden="true"
          className="absolute left-4 top-2 bottom-2 w-px bg-border"
        />

        {careerEvents.map(({ period, title, company, icon: Icon, points }) => (
          <li key={`${company}-${period}`} className="relative pl-12">
            {/* node */}
            <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-background">
              <Icon className="h-4 w-4 text-primary" />
            </span>

            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="text-lg font-semibold leading-snug">
                {title}
                <span className="font-normal text-muted-foreground">
                  {" "}
                  at {company}
                </span>
              </h3>
              <time className="shrink-0 text-sm text-muted-foreground">
                {period}
              </time>
            </div>

            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">
              {points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
};