import "dotenv/config";


export default function handler(req, res) {
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
    "Don’t stop until you’re proud."
  ];

  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  res.json({ quote });
}
