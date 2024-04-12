const LiqPay = require("./liqpay");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const public_key = process.env.LIQPAY_PUBLIC_KEY;
const private_key = process.env.LIQPAY_PRIVATE_KEY;

const liqpay = new LiqPay(public_key, private_key);

const gotsCallbackController = async (req, res) => {
  const { data, signature } = req.body;
  console.log("req.body:", req.body);
  // console.log("Received data:", data);
  // Розкодування параметра data з base64 та перетворення його в рядок JSON
  // const decodedData = Buffer.from(data, "base64").toString("utf-8");

  // Створення підпису на вашому сервері
  const calculatedSignature = crypto
    .createHash("sha1")
    .update(private_key + data + private_key)
    .digest("base64");

  // Порівняння отриманої підпису з підписом, що надійшов у запиті
  if (signature === calculatedSignature) {
    // Якщо підписи співпадають, то запит від LiqPay є справжнім
    // Тут ви можете обробити запит відповідно до ваших потреб
    console.log("Справжня відповідь від сервера LiqPay");
    // console.log(decodedData);
    // Наприклад, ви можете виконати додаткові дії згідно з отриманим статусом платежу
  } else {
    // Якщо підписи не співпадають, запит може бути підробленим
    console.log("Недійсний запит від сервера LiqPay");
    // console.log(decodedData);
  }

  res.end(); // Завершення відповіді
};

module.exports = gotsCallbackController;
