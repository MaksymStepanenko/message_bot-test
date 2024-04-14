const express = require("express");
const logger = require("morgan");
const cors = require("cors");
// const sendMessage = require("./controler/tuttiKidsControler");
// const circle = require("./controler/circleController");
// const gotsSender = require("./controler/gotsController");
const liqpayController = require("./controler/liqpayController");
const gotsCallbackController = require("./controler/gotsCallbackController");
const LiqPay = require("./controler/liqpay");

require("dotenv").config();
const public_key = process.env.LIQPAY_PUBLIC_KEY;
const private_key = process.env.LIQPAY_PRIVATE_KEY;
const liqpay = new LiqPay(public_key, private_key);

const app = express();
const port = process.env.PORT || 3001;

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

app.post("/liqpay-gots", liqpayController);
app.post("/get-current-status", async (req, res) => {
  // Отримати дані з тіла запиту
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    // Розкодувати дані з тіла запиту
    const decodedData = querystring.parse(body);
    const { order_id } = decodedData;

    // Викликати LiqPay API для запиту статусу оплати
    liqpay.api("request", {
      "action": "status",
      "version": "3",
      "order_id": order_id
    }, function (json) {
      console.log(json.status); // Вивести статус оплати в консоль
      res.end(); // Завершити відповідь
    });
  });
});
  
app.post("/gots-callback", gotsCallbackController);

app.post("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
