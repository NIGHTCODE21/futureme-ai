import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import cron from "node-cron";

// -------------------- Setup --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "letters.json");

// Load / save letters
const loadLetters = () =>
  fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : [];
const saveLetters = (letters) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(letters, null, 2));

// -------------------- Nodemailer --------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,       // your Gmail
    pass: process.env.EMAIL_PASS   // Gmail App Password
  }
});

// -------------------- Motivational Quotes --------------------


// -------------------- Routes --------------------

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Submit letter
app.post("/generate", (req, res) => {
  const { email, letter, deliveryDate } = req.body;
  if (!email || !letter || !deliveryDate) {
    return res.status(400).json({ error: "Email, letter, and date required." });
  }

  // Add motivational quote
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  const finalLetter = `${letter}\n\n---\nMotivation from your future self:\n${quote}`;

  const letters = loadLetters();
  letters.push({
    id: Date.now(),
    email,
    letter: finalLetter,
    deliveryDate,
    delivered: false
  });
  saveLetters(letters);

  res.json({ result: "Your letter has been saved and will be delivered on your chosen date! 📨" });
});

// List all letters (for debugging)
app.get("/letters", (req, res) => {
  res.json(loadLetters());
});

// -------------------- Cron Job --------------------
// Check every minute if letters are due
cron.schedule("* * * * *", async () => {
  const letters = loadLetters();
  const now = new Date();

  for (let l of letters) {
    if (!l.delivered && new Date(l.deliveryDate) <= now) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: l.email,
          subject: "Your FutureMe Letter 📬",
          text: l.letter
        });
        l.delivered = true;
        console.log(`Sent letter to ${l.email}`);
      } catch (err) {
        console.error("Email send error:", err);
      }
    }
  }

  saveLetters(letters);
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 FutureMe running on http://localhost:${PORT}`));
