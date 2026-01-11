import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const token = process.env.TOKEN_APII; // Vercel’da TOKEN_APII deb qo‘ygan bo‘lsang
const bot = new TelegramBot(token);

const app = express();
app.use(express.json());

// Webhook endpoint (api/ bilan boshlanadi)
app.post(`/api/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Hamster Tapper logikasi
const scores = {};

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