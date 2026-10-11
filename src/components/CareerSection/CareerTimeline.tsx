import { ArrowUpRight } from "lucide-react";

type Experience = {
  company: string;
  period: string;
  role: string;
  summary: string;
  tags: string[];
};

const experiences: Experience[] = [
  {
    company: "Angika Technology",
    period: "May 2025 - August 2026",
    role: "UI/UX Designer",
    summary: "Web and mobile flows, prototypes and design system work.",
    tags: ["UI/UX", "Design System"],
  },

  {
    company: "Gizmo Plugs",
    period: "June 2024 - November 2024",
    role: "Junior UX Designer",
    summary: "User research, journey mapping and Figma prototypes.",
    tags: ["UX Research", "Prototyping"],
  },

  {
    company: "Self-Employed",
    period: "April 2020 - May 2021",
    role: "Freelance Designer",
    summary: "UI, branding and digital design for independent clients.",
    tags: ["UI/UX", "Branding"],
  },
];

export const CareerTimeline = () => {
  return (
    <section id="career" className="mx-auto w-full max-w-5xl px-4 py-12 md:py-20">
      {/* Header */}
      <header className="grid gap-6 md:grid-cols-2 md:gap-12">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-foreground">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-foreground" />
            Experiences
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
            Career{" "}
            <span className="relative isolate inline-block">
              <span className="bg-gradient-to-r from-[#9b8cf8] to-[#4db6ff] bg-clip-text text-transparent">
                Journey
              </span>
            </span>
          </h2>
        </div>

        <div className="md:pt-1">
          <p className="max-w-md text-sm text-muted-foreground md:text-base">
            Where I've worked and what I did there.
          </p>
          <a
            href="#contact"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-foreground underline underline-offset-4 decoration-foreground/60 hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Get in Contact
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* Rows */}
      <ul className="mt-12 md:mt-16">
        {experiences.map(({ company, period, role, summary, tags }) => (
          <li
            key={`${company}-${period}`}
            className="group grid gap-4 border-b border-border py-7 first:border-t-0 last:border-b-0 md:grid-cols-[1.3fr_1fr_auto] md:items-center md:gap-8"
          >
            {/* Company + period */}
            <div>
              <h3 className="text-lg font-semibold leading-snug">
                {company}
              </h3>
              <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                <span aria-hidden="true">•</span>
                <time>{period}</time>
              </p>
            </div>

            {/* Role + summary */}
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">
              {role}. {summary}
            </p>

            {/* Tags */}
            <ul className="flex flex-wrap gap-2 md:justify-end">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-muted px-3.5 py-1.5 text-sm text-foreground transition-colors group-hover:bg-foreground group-hover:text-background"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
};