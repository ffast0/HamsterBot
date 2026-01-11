import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const token = process.env.TOKEN_APII;
const bot = new TelegramBot(token, { polling: true }); // Lokal yoki VPS uchun polling ishlaydi

const app = express();
app.use(express.json());

// Ballar saqlash (oddiy object, keyin database qo‘shish mumkin)
const scores = {};

// Root route (test uchun)
app.get("/", (req, res) => {
  res.send("Hamster Tapper backend is running!");
});

// API endpoint – web frontend ballni olish uchun
app.get("/score/:chatId", (req, res) => {
  const chatId = req.params.chatId;
  const score = scores[chatId] || 0;
  res.json({ chatId, score });
});

// Telegram bot logikasi
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  scores[chatId] = 0;
  bot.sendMessage(chatId, "🐹 Hamster Tapper o‘yini! Boshlash uchun /tap yozing.");
});

bot.onText(/\/tap/, (msg) => {
  const chatId = msg.chat.id;
  if (!(chatId in scores)) scores[chatId] = 0;
  scores[chatId] += 1;
  bot.sendMessage(chatId, `🐹 Tap! Sizning ballingiz: ${scores[chatId]}`);
});

bot.onText(/\/score/, (msg) => {
  const chatId = msg.chat.id;
  const score = scores[chatId] || 0;
  bot.sendMessage(chatId, `📊 Sizning umumiy ballingiz: ${score}`);
});

export default app;