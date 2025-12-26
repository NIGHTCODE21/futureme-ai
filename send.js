import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

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

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
