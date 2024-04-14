const LiqPay = require("./liqpay");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const querystring = require("querystring");

const public_key = process.env.LIQPAY_PUBLIC_KEY;
const private_key = process.env.LIQPAY_PRIVATE_KEY;

const liqpay = new LiqPay(public_key, private_key);

const gotsCallbackController = async (req, res) => {
  // Отримати дані з тіла запиту
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { data, signature } = req.body;

    // Розкодувати дані з base64
    const decodedData = Buffer.from(data, "base64").toString("utf-8");

    // Розрахунок підпису
    const sign = liqpay.str_to_sign(private_key + data + private_key);

    // Порівняння отриманого підпису з підписом, що надійшов у запиті
    if (signature === sign) {
      // Якщо підписи співпадають, то запит від LiqPay є справжнім
      console.log("Справжня відповідь від сервера LiqPay");
      console.log("Data:", decodedData);
      // Обробка запиту відповідно до ваших потреб
    } else {
      // Якщо підписи не співпадають, запит може бути підробленим
      console.log("Недійсний запит від сервера LiqPay");
      console.log("Data:", decodedData);
    }

    res.end(); // Завершення відповіді
    // // Розкодувати дані з тіла запиту
    // const decodedData = querystring.parse(body);
    // const { data, signature } = decodedData;

    // // Розрахунок підпису
    // const sign = liqpay.str_to_sign(private_key + data + private_key);

    // // Порівняння отриманого підпису з підписом, що надійшов у запиті
    // if (signature === sign) {
    //   // Якщо підписи співпадають, то запит від LiqPay є справжнім
    //   console.log("Справжня відповідь від сервера LiqPay");
    //   console.log("Data:", decodedData);
    //   // Обробка запиту відповідно до ваших потреб
    // } else {
    //   // Якщо підписи не співпадають, запит може бути підробленим
    //   console.log("Недійсний запит від сервера LiqPay");
    //   console.log("Data:", decodedData);
    // }

    // res.end(); // Завершення відповіді
  });
};

module.exports = gotsCallbackController;
