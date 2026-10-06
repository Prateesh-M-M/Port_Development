import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  const { name, email, message, botcheck } = req.body ?? {};

  // Honeypot: pretend success so bots don't retry
  if (botcheck) return res.status(200).json({ success: true });

  // Validation
  if (
    typeof name !== "string" || name.trim().length < 2 || name.length > 100 ||
    typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 200 ||
    typeof message !== "string" || message.trim().length < 10 || message.length > 5000
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please check your name, email and message." });
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD");
    return res.status(500).json({ success: false, message: "Server isn't configured." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      replyTo: `"${name.replace(/["\r\n]/g, "")}" <${email}>`, // hitting Reply goes to the visitor
      subject: `Portfolio message from ${name.replace(/[\r\n]/g, " ")}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Couldn't send your message. Please try again." });
  }
}