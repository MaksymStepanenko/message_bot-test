const LiqPay = require("./liqpay");

require("dotenv").config();
const public_key = process.env.LIQPAY_PUBLIC_KEY;
const private_key = process.env.LIQPAY_PRIVATE_KEY;

const liqpay = new LiqPay(public_key, private_key);

const liqpayController = async (req, res) => {
  const data = req.body;
  console.log(data);
  const html = liqpay.cnb_form({
    action: "pay",
    version: "3",
    amount: data.amount,
    currency: data.currency,
    description: data.description,
    order_id: data.order_id,
    result_url: data.result_url,
    language: data.language,
    server_url: data.server_url,
  });

  res.send(html);
};

module.exports = liqpayController;
