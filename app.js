const express = require("express");
const logger = require("morgan");
const cors = require("cors");
// const sendMessage = require("./controler/tuttiKidsControler");
// const circle = require("./controler/circleController");
// const gotsSender = require("./controler/gotsController");
const liqpayController = require("./controler/liqpayController");
const gotsCallbackController = require("./controler/gotsCallbackController");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(logger("dev"));
app.use(cors());
app.use(express.json());


app.post("/liqpay-gots", liqpayController);
app.post("/gots-callback", async (req, res) => {
  const { data, signature } = req.body;
  console.log("req.body:", req.body);

  if (signature) {
    console.log("Справжня відповідь від сервера LiqPay");
  } else {
    console.log("Недійсний запит від сервера LiqPay");
  }
  res.status(200).json({ message: "Server work" });
});

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
