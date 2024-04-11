const TelegramBot = require("node-telegram-bot-api");
const emailSender = require("../decorators/emailSender");

require("dotenv").config();

const token = process.env.tokenCircle;
const chatId = process.env.chatIdCircle;

const bot = new TelegramBot(token, { polling: true });

const sendMessage = async (req, res) => {
  const data = req.body;
  function formatJson(jsonData) {
    return Object.entries(jsonData)
      .map(([key, value]) => {
        if (key === "----------") {
          return `${key}: ${value}`;
        }
        return `${key}: ${value ? value : "м"}`;
      })
      .join("\n");
  }

  const formattedData = formatJson(data);

  const sendEmail = {
    to: "circle.in.ua@gmail.com",
    subject: "Нове замовлення від Circle",
    text: formattedData,
  };
  await emailSender(sendEmail);

  bot.sendMessage(chatId, formattedData);

  res.status(200).json({
    message: "OK",
  });
};

module.exports = sendMessage;
