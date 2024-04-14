const LiqPay = require("./liqpay");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const querystring = require("querystring");
const https = require("https");

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
    const decodedData = querystring.parse(body);
    const { data, signature } = decodedData;

    const baseDecodedData = Buffer.from(data, "base64").toString("utf-8");
    // Розрахунок підпису
    const sign = liqpay.str_to_sign(private_key + data + private_key);

    // Порівняння отриманого підпису з підписом, що надійшов у запиті
    if (signature === sign) {
      // Якщо підписи співпадають, то запит від LiqPay є справжнім
      console.log("Справжня відповідь від сервера LiqPay");
      console.log("Data:", baseDecodedData);

      // Отримати order_id та status з даних
      const { order_id, status } = JSON.parse(baseDecodedData);

      // Дані для відправки на mock API
      const postData = JSON.stringify({
        id: order_id,
        status: status,
      });

      // Налаштування параметрів запиту
      const options = {
        hostname: "661c0750e7b95ad7fa698bf1.mockapi.io",
        port: 443,
        path: "/gots_db/gots",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": postData.length,
        },
      };

      // Виконання POST запиту
      const request = https.request(options, (response) => {
        console.log(`Status code: ${response.statusCode}`);
        response.on("data", (d) => {
          process.stdout.write(d);
        });
      });

      request.on("error", (error) => {
        console.error(error);
      });

      request.write(postData);
      request.end();

      // Обробка запиту відповідно до ваших потреб
    } else {
      // Якщо підписи не співпадають, запит може бути підробленим
      console.log("Недійсний запит від сервера LiqPay");
      console.log("Data:", baseDecodedData);
    }

    res.end(); // Завершення відповіді
  });
};

module.exports = gotsCallbackController;
