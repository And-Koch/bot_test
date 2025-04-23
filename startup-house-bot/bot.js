const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const bot = new TelegramBot(token, { polling: true });

// let respondedChats = {};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  const options = {
    reply_markup: {
      keyboard: [["ИИ", "Бизнес"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  if (text === "/start") {
    setTimeout(() => {
      bot.sendMessage(chatId, "Привет! Добро пожаловать в Startup House! 🚀");
    }, 2000);
    return;
  }
  if (text.includes("привет") || text.includes("здравствуй")) {
    setTimeout(() => {
      bot.sendMessage(chatId, "Тебя интересует ИИ или бизнес? 💬", options);
    }, 2000);
    return;
  }
  if (
    text.includes("ии") ||
    text.includes("искусственный интеллект") ||
    text.includes("ai") ||
    text.includes("бизнес")
  ) {
    // if (respondedChats[chatId]) {
    //   return;
    // }

    setTimeout(() => {
      bot.sendMessage(
        chatId,
        "Интересная тема! Расскажи, как ты используешь ИИ в бизнесе? 💡"
      );
    }, 2000);
    // respondedChats[chatId] = true;
    return;
  }
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openchat/openchat-3.5-0106",
        messages: [{ role: "user", content: msg.text }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://t.me/StartupHouseAiBot",
          "Content-Type": "application/json",
        },
      }
    );

    const botReply = response.data.choices[0].message.content;
    bot.sendMessage(chatId, botReply);
  } catch (error) {
    console.error(
      "Ошибка OpenRouter API:",
      error.response?.data || error.message
    );
    bot.sendMessage(
      chatId,
      "Произошла ошибка при обращении к ИИ. Попробуй позже."
    );
  }
});
