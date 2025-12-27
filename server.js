import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
  const { email, letter } = req.body;
  if (!email || !letter) return res.status(400).json({ error: "Email and letter required" });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"FutureMe AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your FutureMe Letter 📬",
      text: letter
    });

    res.json({ success: "Email sent successfully 🚀" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
