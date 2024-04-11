// const TelegramBot = require("node-telegram-bot-api");
// const emailSender = require("../decorators/emailSender");

// require("dotenv").config();

// const token = process.env.tokenGots;
// const chatId = process.env.chatIdGots;

// const bot = new TelegramBot(token, { polling: true });

// const gotsSender = async (req, res) => {
//   const data = req.body;
//   function formatJson(jsonData, indent = 0) {
//     const indentString = " ".repeat(indent);
//     return Object.entries(jsonData)
//       .map(([key, value]) => {
//         if (typeof value === "object") {
//           if (Object.values(value).every((val) => val === "")) {
//             // If all values in the object are empty, skip the key
//             return "";
//           }
//           // If the value is an object, recursively format it
//           const nestedObject = formatJson(value, indent + 2);
//           return `${indentString}${key}:\n${nestedObject}`;
//         } else if (value !== "") {
//           if (key === "----------") {
//             return `${indentString}${key}: ${value}`;
//           }
//           return `${indentString}${key}: ${value}`;
//         }
//         // Skip the key if the value is an empty string
//         return "";
//       })
//       .filter(Boolean) // Remove empty strings
//       .join("\n");
//   }
//   const formattedData = formatJson(data);
//   const sendEmail = {
//     to: "circle.in.ua@gmail.com",
//     subject: "Нове замовлення від GOTS",
//     text: formattedData,
//   };
//   await emailSender(sendEmail);
//   bot.sendMessage(chatId, formattedData);
//   res.status(200).json({
//     message: "OK",
//   });
// };

// module.exports = gotsSender;
