import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, letter } = req.body;
  if (!email || !letter) return res.status(400).json({ error: "Email and letter required" });

  const motivationalQuotes = [
  "Believe in yourself! 🌟",
  "Your future self is proud of you. 💪",
  "Small steps every day lead to big changes.",
  "Never stop learning and growing!",
  "Consistency is the key to success.",
  "Dream big, work hard, stay focused.",
  "You are capable of amazing things.",
  "Every day is a new opportunity.",
  "Success is a journey, not a destination.",
  "Courage doesn’t always roar; sometimes it whispers, ‘Try again tomorrow.’",
  "Turn your can’ts into cans and your dreams into plans.",
  "Progress, not perfection, is what matters.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Don’t watch the clock; do what it does. Keep going.",
  "You are stronger than you think.",
  "Challenges are what make life interesting.",
  "Believe you can and you’re halfway there.",
  "Push yourself because no one else is going to do it for you.",
  "The best way to get started is to quit talking and begin doing.",
  "Little by little, one travels far.",
  "Mistakes are proof that you are trying.",
  "Great things never come from comfort zones.",
  "Do something today that your future self will thank you for.",
  "It always seems impossible until it’s done.",
  "You don’t have to be perfect to be amazing.",
  "Focus on your goal. Don’t look in any direction but ahead.",
  "Sometimes later becomes never. Do it now.",
  "Don’t limit your challenges. Challenge your limits.",
  "Work hard in silence. Let success make the noise.",
  "Your limitation—it’s only your imagination.",
  "Don’t wait for opportunity. Create it.",
  "Dream it. Wish it. Do it.",
  "Difficult roads often lead to beautiful destinations.",
  "The secret of getting ahead is getting started.",
  "If it doesn’t challenge you, it won’t change you.",
  "Push yourself because no one else is going to do it for you.",
  "Success doesn’t just find you. You have to go out and get it.",
  "Sometimes you win, sometimes you learn.",
  "Strive for progress, not perfection.",
  "You are capable of more than you know.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don’t stop until you’re proud.",
  "The only way to do great work is to love what you do.",
  "Hustle in silence, let your success be your noise.",
  "Small progress is still progress.",
  "Don’t let yesterday take up too much of today.",
  "Keep going. Everything you need will come to you at the perfect time.",
  "Believe in the power of yet: 'I can’t do this… yet.'"
];

  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  const finalLetter = `${letter}\n\n---\nMotivation from your future self:\n${quote}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your FutureMe Letter 📬",
      text: finalLetter
    });
    res.json({ result: "Your letter has been sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email sending failed" });
  }
}
