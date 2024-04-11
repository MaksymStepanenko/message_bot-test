// const LiqPay = require("./liqpay");

// const public_key = process.env.LIQPAY_PUBLIC_KEY;
// const private_key = process.env.LIQPAY_PRIVATE_KEY;

// const liqpay = new LiqPay(public_key, private_key);

// const gotsCallbackController = async (req, res) => {
//   const data = req.body;
//   const testData = req.body.data;
//   const testSignature = req.body.signature;
//   const sign = liqpay.str_to_sign(private_key + data + private_key);
//   console.log("sign", sign);
//   console.log("data--------->", data);
//   console.log("testSignature--------->", testSignature);
//   console.log("testData--------->", testData);
// };

// module.exports = gotsCallbackController;
