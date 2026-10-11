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
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Target,
  Layers,
  FlaskConical,
  Sparkles,
  X,
  Gamepad2,
  Rocket,
  Coins,
  Skull,
  Camera,
  Music,
  KeyRound,
  Code2,
  Flame,
  Palette,
  Play,
  Footprints,
  Volume2,
} from "lucide-react";

import Header from "../components/Header/Header";
import CaseStudyNav from "../components/CaseStudyNav/CaseStudyNav";

/* PROJECT MEDIA (Dribbble URLs or /image/ files from public/) */

const MEDIA: Record<string, string> = {
  // Dribbble
  overview:
    "https://cdn.dribbble.com/userupload/49286339/file/3515b206f5cba2c54fdc32b07d5640a8.png?resize=1920x1080&vertical=center",
  toolsOverview:
    "https://cdn.dribbble.com/userupload/49286351/file/237b33017a203c92cd43e53fe55112a4.png?resize=3810x2143&vertical=center",
  sceneSetup:
    "https://cdn.dribbble.com/userupload/49286345/file/22ab37f1bcc02d18164fc8289cb08d6a.png?resize=3810x2143&vertical=center",
  elementsPlayerAndItems:
    "https://cdn.dribbble.com/userupload/49286355/file/b5042229d6287d0899784abd14c520cc.png?resize=3810x2143&vertical=center",
  elementsHazards:
    "https://cdn.dribbble.com/userupload/49286352/file/4120308ae64cb04f29a52a12ec1c5ed9.png?resize=3810x2143&vertical=center",
  level1Editor:
    "https://cdn.dribbble.com/userupload/49286362/file/a21255abb7ed85fc6e4d7ef76aa3e51f.png?resize=3810x2143&vertical=center",
  level1Gameplay:
    "https://cdn.dribbble.com/userupload/49286356/file/e5572258e7ba26fbbb92964dfac143cb.png?resize=3810x2143&vertical=center",
  level2Editor:
    "https://cdn.dribbble.com/userupload/49286357/file/bb3a41707a88affc83214486ac1de3fb.png?resize=3810x2143&vertical=center",
  level2Gameplay:
    "https://cdn.dribbble.com/userupload/49286344/file/60a6cb9f8d612b0660545257fc49d1de.png?resize=3810x2143&vertical=center",
  level3Editor:
    "https://cdn.dribbble.com/userupload/49286361/file/88e51a30d804780c084c31c70a91a7e0.png?resize=2048x1152&vertical=center",
  level3Gameplay:
    "https://cdn.dribbble.com/userupload/49286360/file/54b51b393feb2813c638a7c92bb7238c.png?resize=2048x1152&vertical=center",
  scripts:
    "https://cdn.dribbble.com/userupload/49286353/file/27c41a0a44a5af873a4a936be868376e.png?resize=3810x2143&vertical=center",

  // Local
  mainMenu: "/images/MainMenu.png",
  gameOver: "/images/CompletedScreen.png",
};

const GAMEPLAY_VIDEO_URL = "https://drive.google.com/file/d/1mQr_oCXkmtJcOd8TmI9X92dbULoBC2dB/view?usp=sharing";

function media(key: string): string | null {
  return MEDIA[key] ?? null;
}

/* REUSABLE COMPONENTS */

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
        <span className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
          {number}
        </span>
        <div className="h-px w-12 bg-border" />
      </div>

      <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

function ImagePlaceholder({
  title,
  height = "h-[420px]",
  media,
  onClick,
}: {
  title: string;
  height?: string;
  media?: string | null;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={media ? onClick : undefined}
      role={media ? "button" : undefined}
      aria-label={media ? `${title} — click to enlarge` : title}
      className={`group relative ${height} ${
        media ? "cursor-pointer" : ""
      } overflow-hidden rounded-3xl border border-border bg-muted/30`}
    >
      {media ? (
        <>
          <img
            src={media}
            alt={title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-1 rounded-full bg-background/70 px-3 py-1.5 text-xs opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            Click to enlarge
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background/60 backdrop-blur">
            <Layers size={22} />
          </div>

          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>

          <span className="mt-1 text-xs text-muted-foreground/60">
            Add an image in MEDIA
          </span>
        </div>
      )}
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

/* PLANET PIRATE CASE STUDY DATA */

const tools = [
  { name: "Unity", role: "Game engine used to build all three levels and the menus." },
  { name: "Unity Hub", role: "Project and editor version management." },
  { name: "C#", role: "Scripting for player, enemies, camera, UI and scene flow." },
  { name: "OpenToonz", role: "2D animation software used for the hand-drawn character." },
];

const unityFeatures = [
  { name: "Sprite Renderers", role: "Display the player, enemies, coins, potions and backgrounds." },
  { name: "Colliders & Rigidbody", role: "Physics, ground checks, hazards and pickups." },
  { name: "Audio", role: "Background music plus coin, power-up and death sound effects." },
];

const sceneObjects = [
  { icon: Camera, title: "Main Camera", text: "Captures the playable area." },
  { icon: Sparkles, title: "Background", text: "Space themed environment." },
  { icon: Gamepad2, title: "Player", text: "2D hand drawn character." },
  {
    icon: Coins,
    title: "Coins",
    text: "Collectable points. 10 to complete Level 1 and 22 to complete Levels 2 and 3.",
  },
  { icon: Skull, title: "Traps", text: "Kill the player to end the run." },
  {
    icon: Music,
    title: "BG Music",
    text: "Eerie and disturbing music to fit the theme of the story.",
  },
];

const elements = [
  { icon: Gamepad2, name: "Player", text: "Sid, the hand-drawn pirate the player controls." },
  { icon: FlaskConical, name: "Power Up", text: "Red potion. Makes you bigger and slower." },
  { icon: FlaskConical, name: "Power Down", text: "Blue potion. Makes you smaller and faster." },
  { icon: FlaskConical, name: "Power Normal", text: "Grey potion. Resets the player to normal." },
  { icon: KeyRound, name: "Key", text: "Unlocks the level once every coin is collected." },
  { icon: Coins, name: "Coin", text: "The collectable that tracks progress and score." },
  { icon: Skull, name: "Enemy 1", text: "Red spikes placed on platforms and the ground." },
  { icon: Flame, name: "Enemy 2", text: "Lava pits that must be jumped precisely." },
  { icon: Footprints, name: "Enemy 3", text: "A patrolling enemy that walks back and forth." },
];

const levels = [
  {
    id: "level-1",
    section: "Level 1",
    number: "06",
    title: "Level 1",
    description:
      "Floating platforms, spikes and enemies introduce the core rules: collect every coin, then reach the key.",
    stats: [
      ["Coins", "10"],
      ["Hazards", "Spikes, enemies"],
      ["Goal", "Coins, then key"],
    ],
    points: [
      "Created a 2D platformer level using multiple floating platforms.",
      "Added the player at the starting point on the top-left side of the map.",
      "Used the PlayerController script for movement, jumping, coin collection, and power-ups.",
      "Placed multiple coins across different platform heights to encourage exploration.",
      "Added spike obstacles to create hazards and increase difficulty.",
      "Implemented enemy objects using the Enemy tag.",
      "Added potion power-ups that make the player bigger, smaller or return to normal.",
      "Placed a key object near the end of the level which unlocks only after collecting all coins.",
      "Added boundaries, sound effects, score UI, and level completion popup for gameplay feedback.",
    ],
    editorKey: "level1Editor",
    gameplayKey: "level1Gameplay",
  },
  {
    id: "level-2",
    section: "Level 2",
    number: "07",
    title: "Level 2",
    description:
      "A larger map with lava, uneven platform heights and more vertical movement that asks for precise jumping.",
    stats: [
      ["Coins", "22"],
      ["Hazards", "Lava"],
      ["Goal", "Coins, then key"],
    ],
    points: [
      "Designed a larger level with more vertical and horizontal platform movement.",
      "Added lava obstacles to make platforming more challenging for the player.",
      "Increased the number of coins and spread them across the level for better progression.",
      "Used different platform heights to require precise jumping mechanics.",
      "Added multiple safe and dangerous zones to improve gameplay balance.",
      "Included potion power-ups to change player size and movement abilities dynamically.",
      "Positioned the key near the end of the map to encourage full level exploration.",
      "Used collision detection from the PlayerController script for hazards, coins, and power-ups.",
      "Added UI systems such as score tracking, death popup, and level completion popup.",
    ],
    editorKey: "level2Editor",
    gameplayKey: "level2Gameplay",
  },
  {
    id: "level-3",
    section: "Level 3",
    number: "08",
    title: "Level 3",
    description:
      "The final level swaps vertical complexity for a longer side-scrolling run with a following camera and patrolling enemies.",
    stats: [
      ["Coins", "22"],
      ["Hazards", "Patrolling enemies"],
      ["Goal", "Finish the run"],
    ],
    points: [
      "Created the final level with a simpler but longer platform layout.",
      "Added a continuous ground structure for smooth side-scrolling gameplay.",
      "Placed coins throughout the level for collection objectives.",
      "Added enemy characters to increase difficulty near the center of the level.",
      "Used the EnemyPatrol script to make enemies move automatically.",
      "Implemented camera tracking using the CameraFollow script.",
      "Added background elements and space-themed visuals for better environment design.",
      "Used boundaries to prevent the player from leaving the playable area.",
      "Connected the level to the completion screen using the LevelPopupManager script.",
      "Added sound, UI, and scene transitions to complete the final gameplay experience.",
    ],
    editorKey: "level3Editor",
    gameplayKey: "level3Gameplay",
  },
];

const scripts = [
  {
    name: "PlayerController",
    summary:
      "Controls player movement, jumping, sounds, UI, scoring, and power-ups.",
    points: [
      "Stores movement values, speed and jump force, audio clips, UI references (score text, popups) and player states like isDead and isGrounded.",
      "Start() gets the AudioSource and Rigidbody2D, saves the original size and speed, and counts the coins tagged \"gold\" in the level.",
      "Gravity depends on level type: stronger for side scroller levels, default for normal levels.",
      "Update() runs every frame, stops all movement if the player is dead, then picks SideScrollerMovement() for platformer levels or OldMovement() for basic movement levels.",
      "OldMovement() uses Transform.Translate() with horizontal and jump input and flips the sprite by movement direction.",
      "SideScrollerMovement() uses Rigidbody2D velocity, only allows jumping when grounded, and also flips the sprite.",
      "OnCollisionStay2D() sets isGrounded = true on the ground and OnCollisionExit2D() sets it to false, which prevents infinite jumping in the air (side scroller mode only).",
      "Coin collection: detects \"gold\", increases the score, updates the score text, destroys the coin and plays the coin sound.",
      "Enemy collision: detects \"enemy\", prevents repeated death triggers, sets the player to dead, plays the death sound and particles, then calls HandleDeath() after the sound finishes.",
      "Power Up makes the player bigger but slower. Power Down makes the player smaller but faster. Normal restores the original size, speed and jump height. Each plays its own sound.",
      "Key system: the player must collect all coins first. If so, the level completion popup shows and the key is removed. Otherwise a message is logged to the console.",
      "HandleDeath() hides the player, shows the death popup and pauses with Time.timeScale = 0. ShowLevelPopup() activates the completion popup and pauses the game.",
    ],
  },
  {
    name: "MainMenu",
    summary: "Manages the main menu buttons of the game.",
    points: [
      "StartGame() loads the first level using build index 1.",
      "QuitGame() closes the application using Application.Quit().",
      "Debug.Log() prints a message in the Unity Console when the game is closed.",
      "Uses SceneManager to switch from the menu scene to the gameplay scene.",
    ],
  },
  {
    name: "LevelPopupManager",
    summary: "Controls the level completion popup after finishing a level.",
    points: [
      "YesNextLevel() loads the next level by increasing the current scene index.",
      "Checks that another level exists before loading it.",
      "If no more levels are available, it loads the \"Completed Screen\" scene.",
      "NoMainMenu() returns the player to the main menu scene called \"Planet_Pirate\".",
    ],
  },
  {
    name: "DeathPopupManager",
    summary: "Handles the options shown after the player dies.",
    points: [
      "RestartLevel() resumes the game and reloads the current level using SceneManager.",
      "GoToMainMenu() resumes the game and loads the main menu scene called \"Planet_Pirate\".",
      "Uses Time.timeScale = 1f to unpause the game before changing scenes.",
    ],
  },
  {
    name: "EndScreenManager",
    summary: "Drives the Thank You screen shown after the final level.",
    points: [
      "GoToMainMenu() loads the main menu scene called \"Planet_Pirate\".",
      "PlayAgain() restarts the game by loading Level 1 using build index 1.",
      "Time.timeScale = 1f resumes normal game time before changing scenes.",
    ],
  },
  {
    name: "CameraFollow",
    summary: "Makes the camera follow the player during side-scrolling levels.",
    points: [
      "offsetX keeps the camera slightly ahead of the player for better visibility.",
      "LateUpdate() updates the camera position after player movement each frame.",
      "The camera only moves forward and never backward, creating a side-scrolling effect.",
      "maxX sets a limit so the camera stops moving after a certain point.",
    ],
  },
  {
    name: "EnemyPatrol",
    summary: "A simple back-and-forth patrol system for enemies.",
    points: [
      "Moves the enemy between two points, pointA and pointB, using Vector2.MoveTowards() at a set speed.",
      "When the enemy reaches one point, it switches direction and heads for the other.",
      "Flip() reverses the enemy sprite by changing its X scale value.",
    ],
  },
];

/* PAGE */

export default function PlanetPirate() {
  const [lightbox, setLightbox] = useState<{
    title: string;
    url: string | null;
  } | null>(null);
  const [expandedScript, setExpandedScript] = useState<number | null>(0);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const openLightbox = (title: string, key: string) =>
    setLightbox({ title, url: media(key) });

  useEffect(() => {
    if (!lightbox) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="fixed left-0 right-0 top-0 z-[100] h-1 bg-primary"
      />

      <main>
        {/* HERO */}

        <section className="relative overflow-hidden px-6 pb-24 pt-40">
          <div className="pointer-events-none absolute left-1/2 top-20 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl">
            <Reveal>
              <div className="mb-8 flex flex-wrap gap-2">
                <Tag>Game Design Case Study</Tag>
                <Tag>Unity</Tag>
                <Tag>2D Platformer</Tag>
                <Tag>C#</Tag>
                <Tag>Mini Project VI</Tag>
              </div>

              <h1 className="max-w-5xl text-6xl font-bold tracking-[-0.04em] md:text-8xl">
                Planet Pirate
              </h1>

              <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
                A 2D space platformer built in Unity where a kid turned pirate
                collects coins across hostile planets to free Earth from loan
                sharks.
              </p>
            </Reveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16"
            >
              <ImagePlaceholder
                title="Planet Pirate / Project Overview"
                height="h-[500px]"
                media={media("overview")}
                onClick={() =>
                  openLightbox("Planet Pirate / Project Overview", "overview")
                }
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

        {/* INTRODUCTION / GAME CONCEPT */}

        <section id="introduction" data-case-section="Game Concept" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="01"
              title="Game Concept"
              description="Planet Pirate 2D is the sixth mini project in the course: a three-level platformer where every coin counts and every planet is trapped."
            />

            <div className="grid gap-5 md:grid-cols-3">
              <InfoCard icon={Gamepad2} title="Gameplay">
                Run, jump and collect every coin on each level, avoid spikes,
                lava and enemies, then grab the key to finish.
              </InfoCard>

              <InfoCard icon={FlaskConical} title="Potions">
                Three potions change the player's size, speed and jump height,
                so each level can be tackled in more than one way.
              </InfoCard>

              <InfoCard icon={Rocket} title="Three planets">
                Level 1 introduces the rules, Level 2 raises the platforming
                challenge and Level 3 turns it into a side-scrolling run.
              </InfoCard>
            </div>
          </div>
        </section>

        {/* BACK STORY */}

        <section
          id="back-story"
          data-case-section="Back Story"
          className="scroll-mt-32 border-t border-border px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="02"
              title="Back Story"
              description="The story sets the tone for the eerie music, the space backdrops and the traps on every level."
            />

            <Reveal>
              <div className="rounded-[2rem] border border-border bg-card/40 p-10 md:p-16">
                <p className="max-w-5xl text-2xl font-semibold leading-snug md:text-4xl">
                  SID is a kid from Earth who gets rescued by aliens after
                  Earth is taken over by loan sharks. Now he has taken it on
                  himself to free Earth by becoming a pirate and collecting
                  money from different planets.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <InfoCard icon={Target} title="The goal">
                Collect money from different planets to pay off the loan
                sharks and free Earth.
              </InfoCard>

              <InfoCard icon={FlaskConical} title="The allies">
                Allies give SID different types of potions that help him on
                his adventures.
              </InfoCard>

              <InfoCard icon={Skull} title="The threat">
                The loan sharks have set traps that will stop SID from
                reaching his goal.
              </InfoCard>
            </div>
          </div>
        </section>

        {/* TOOLS & RESOURCES */}

        <section id="tools" data-case-section="Tools" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="03"
              title="Tools & Resources"
              description="Software used to make the game, and the Unity components that bring it to life."
            />

            <div className="grid gap-5 md:grid-cols-4">
              {tools.map((tool) => (
                <Reveal key={tool.name}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="h-full rounded-3xl border border-border bg-card/40 p-7"
                  >
                    <Code2 size={22} className="text-primary" />

                    <h3 className="mt-8 text-2xl font-bold">{tool.name}</h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {tool.role}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {unityFeatures.map((feature) => (
                <Reveal key={feature.name}>
                  <div className="h-full rounded-3xl border border-border p-7">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Unity component
                    </p>

                    <h3 className="mt-4 text-xl font-bold">{feature.name}</h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {feature.role}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="Planet Pirate Unity Project Setup"
                height="h-[450px]"
                media={media("toolsOverview")}
                onClick={() =>
                  openLightbox("Planet Pirate Unity Project Setup", "toolsOverview")
                }
              />
            </div>
          </div>
        </section>

        {/* SCENE SETUP */}

        <section
          id="scene-setup"
          data-case-section="Scene Setup"
          className="scroll-mt-32 border-t border-border px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="04"
              title="Scene Setup"
              description="How the visuals of the game look. Every level is built from the same set of scene objects."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {sceneObjects.map((item) => (
                <InfoCard key={item.title} icon={item.icon} title={item.title}>
                  {item.text}
                </InfoCard>
              ))}
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="Planet Pirate Scene Setup"
                height="h-[500px]"
                media={media("sceneSetup")}
                onClick={() =>
                  openLightbox("Planet Pirate Scene Setup", "sceneSetup")
                }
              />
            </div>
          </div>
        </section>

        {/* ELEMENTS USED */}

        <section id="elements" data-case-section="Elements" className="scroll-mt-32 px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="05"
              title="Elements Used"
              description="The player, the potions, the key, the coins and three kinds of hazard."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {elements.map((element, index) => {
                const Icon = element.icon;

                return (
                  <Reveal key={element.name}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      className="h-full rounded-3xl border border-border bg-card/40 p-7"
                    >
                      <div className="flex items-start justify-between">
                        <Icon size={22} className="text-primary" />

                        <span className="text-4xl font-bold text-muted-foreground/10">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="mt-6 text-xl font-bold">{element.name}</h3>

                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {element.text}
                      </p>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <ImagePlaceholder
                title="Player, Potions & Key"
                height="h-[420px]"
                media={media("elementsPlayerAndItems")}
                onClick={() =>
                  openLightbox("Player, Potions & Key", "elementsPlayerAndItems")
                }
              />

              <ImagePlaceholder
                title="Coin & Enemies"
                height="h-[420px]"
                media={media("elementsHazards")}
                onClick={() => openLightbox("Coin & Enemies", "elementsHazards")}
              />
            </div>
          </div>
        </section>

        {/* LEVELS 1–3 */}

        {levels.map((level, levelIndex) => (
          <section
            key={level.id}
            id={level.id}
            data-case-section={level.section}
            className={`scroll-mt-32 px-6 py-32 ${
              levelIndex % 2 === 0 ? "border-t border-border" : ""
            }`}
          >
            <div className="mx-auto max-w-7xl">
              <SectionHeader
                number={level.number}
                title={level.title}
                description={level.description}
              />

              <div className="grid gap-5 md:grid-cols-3">
                {level.stats.map(([label, value]) => (
                  <Reveal key={label}>
                    <div className="rounded-3xl border border-border p-7">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {label}
                      </p>

                      <p className="mt-2 text-3xl font-bold">{value}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <Reveal>
                  <ul className="space-y-3">
                    {level.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <div className="space-y-6">
                  <ImagePlaceholder
                    title={`${level.title} in the Unity Editor`}
                    height="h-[300px]"
                    media={media(level.editorKey)}
                    onClick={() =>
                      openLightbox(`${level.title} in the Unity Editor`, level.editorKey)
                    }
                  />

                  <ImagePlaceholder
                    title={`${level.title} Gameplay`}
                    height="h-[300px]"
                    media={media(level.gameplayKey)}
                    onClick={() =>
                      openLightbox(`${level.title} Gameplay`, level.gameplayKey)
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* LOGIC & STEPS (SCRIPTS) */}

        <section
          id="logic"
          data-case-section="Logic & Scripts"
          className="scroll-mt-32 border-t border-border px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="09"
              title="Logic & Steps"
              description="The C# scripts behind the game: one big controller for the player, and small focused scripts for menus, popups, camera and enemies."
            />

            <div className="space-y-3">
              {scripts.map((script, index) => (
                <motion.div
                  key={script.name}
                  layout
                  className="overflow-hidden rounded-2xl border border-border bg-card/30"
                >
                  <button
                    onClick={() =>
                      setExpandedScript(expandedScript === index ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        0{index + 1}
                      </span>

                      <div>
                        <span className="font-mono text-sm font-medium">
                          {script.name}.cs
                        </span>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {script.summary}
                        </p>
                      </div>
                    </div>

                    {expandedScript === index ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedScript === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5"
                      >
                        <ul className="space-y-2 pl-12">
                          {script.points.map((point) => (
                            <li
                              key={point}
                              className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <ImagePlaceholder
                title="PlayerController Script"
                height="h-[520px]"
                media={media("scripts")}
                onClick={() =>
                  openLightbox("PlayerController Script", "scripts")
                }
              />
            </div>
          </div>
        </section>

        {/* GAME PLAY */}

        <section
          id="game-play"
          data-case-section="Game Play"
          className="scroll-mt-32 px-6 py-32 pb-48"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              number="10"
              title="Game Play"
              description="From the main menu and information screen through three levels to the Thank You screen."
            />

            <div className="grid gap-6 md:grid-cols-2">
              <ImagePlaceholder
                title="Main Menu & Information"
                height="h-[420px]"
                media={media("mainMenu")}
                onClick={() =>
                  openLightbox("Main Menu & Information", "mainMenu")
                }
              />

              <ImagePlaceholder
                title="Game Over / Thank You Screen"
                height="h-[420px]"
                media={media("gameOver")}
                onClick={() =>
                  openLightbox("Game Over / Thank You Screen", "gameOver")
                }
              />
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {[
                {
                  icon: Footprints,
                  title: "Move & jump",
                  text: "Side-scroller physics with grounded jumping.",
                },
                {
                  icon: Coins,
                  title: "Collect",
                  text: "Gather every coin to unlock the key.",
                },
                {
                  icon: Palette,
                  title: "Look",
                  text: "Hand-drawn character on space-themed backdrops.",
                },
                {
                  icon: Volume2,
                  title: "Sound",
                  text: "Eerie music with coin, power-up and death effects.",
                },
              ].map((feature) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    whileHover={{ y: -5 }}
                    className="rounded-2xl border border-border p-5"
                  >
                    <Icon size={19} className="text-primary" />

                    <p className="mt-4 text-sm font-medium">{feature.title}</p>

                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {feature.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {GAMEPLAY_VIDEO_URL && (
              <div className="mt-10">
                <a
                  href={GAMEPLAY_VIDEO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-border bg-card/50 px-6 py-3 text-sm font-medium transition-colors hover:bg-card"
                >
                  <Play size={16} />
                  Watch gameplay video
                </a>
              </div>
            )}

            <div className="mt-32 rounded-[2rem] bg-primary p-10 text-primary-foreground md:p-16">
              <Rocket size={30} />

              <h3 className="mt-8 max-w-3xl text-3xl font-bold md:text-5xl">
                Three levels, one pirate and a planet to win back.
              </h3>

              <p className="mt-6 max-w-2xl leading-relaxed opacity-85">
                Planet Pirate brings together hand-drawn art, Unity physics
                and C# game logic into a complete play loop: menu, three
                levels, death and restart, and an end screen.
              </p>
            </div>

            <div className="mt-32 border-t border-border pt-12">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Next Case Study
              </p>

              <button className="group mt-5 flex items-center gap-4 text-3xl font-bold md:text-5xl">
                Heuristic Evaluation
                <ArrowUpRight className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* LIGHTBOX */}

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
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur"
              >
                <X size={18} />
              </button>

              {lightbox.url ? (
                <img
                  src={lightbox.url}
                  alt={lightbox.title}
                  className="max-h-[85vh] w-full rounded-3xl border border-border object-contain"
                />
              ) : (
                <div className="flex h-[70vh] items-center justify-center rounded-3xl border border-border bg-muted/30">
                  <div className="text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Layers size={25} />
                    </div>

                    <p className="font-medium">{lightbox.title}</p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Add an image for this tile in MEDIA.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}