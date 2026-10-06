import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "../lightswind/input";
import { Textarea } from "../lightswind/textarea";
import { Button } from "../lightswind/button";

const EMAIL = "workwithprateesh@gmail.com";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; message: string };

const fieldClass =
  "rounded-xl py-3 px-4 bg-foreground/5 border-foreground/10 text-foreground focus-visible:ring-primary placeholder:text-muted-foreground/50";

export const ContactSection = () => {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.type === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never see or tick this box, bots usually do
    if (data.get("botcheck")) return;

    setStatus({ type: "loading" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          botcheck: data.get("botcheck"),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        form.reset();
        setStatus({ type: "success" });
      } else {
        setStatus({
          type: "error",
          message:
            result.message || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: `Couldn't reach the server. Check your connection or email me at ${EMAIL}.`,
      });
    }
  };

  const isLoading = status.type === "loading";

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="glass-panel p-8 md:p-12 rounded-[3rem] border border-foreground/10 relative overflow-hidden"
      >
        {/* Background Gradients */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-12 md:gap-24">
          {/* Contact Info */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Let's <span className="text-gradient-primary">Connect</span>
              </h2>
              <p className="text-muted-foreground">
                Currently open for new opportunities and exciting collaborations.
                Whether you have a question or just want to say hi, I'll try my
                best to get back to you!
              </p>
            </div>

            <div className="space-y-6">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-medium">{EMAIL}</span>
              </a>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-medium">Bangalore, India</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 glass-panel p-8 rounded-[2rem] border border-foreground/10 relative">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Honeypot (hidden from people) */}
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  Your Name
                </label>
                <Input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  autoComplete="name"
                  disabled={isLoading}
                  className={fieldClass}
                  placeholder="Kanye West"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  Your Email
                </label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className={fieldClass}
                  placeholder="kanye@west.com"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-muted-foreground mb-1.5"
                >
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  minLength={10}
                  disabled={isLoading}
                  className={`${fieldClass} resize-none min-h-[120px]`}
                  placeholder="How can I help you?"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full rounded-xl bg-primary text-primary-foreground font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] mt-4 h-12 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    Sending <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>

              {/* Status message */}
              <div aria-live="polite" className="min-h-[1.5rem]">
                {status.type === "success" && (
                  <p className="flex items-center gap-2 text-sm text-green-500">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Thanks! Your message is on its way. I'll reply soon.
                  </p>
                )}
                {status.type === "error" && (
                  <p className="flex items-start gap-2 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {status.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
};