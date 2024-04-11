const axios = require("axios");
const crypto = require("crypto");

const LiqPay = function LiqPay(public_key, private_key) {
  this.host = "https://www.liqpay.ua/api/";
  this.availableLanguages = ["pl", "uk", "en"];
  this.buttonTranslations = { ru: "Оплатить", uk: "Сплатити", en: "Pay" };

  this.api = async function api(path, params) {
    if (!params.version) {
      throw new Error("version is null");
    }

    params.public_key = public_key;
    const data = Buffer.from(JSON.stringify(params)).toString("base64");
    const signature = this.str_to_sign(private_key + data + private_key);

    const dataToSend = new URLSearchParams();
    dataToSend.append("data", data);
    dataToSend.append("signature", signature);

    try {
      const response = await axios.post(this.host + path, dataToSend, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Request failed with status code: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  this.cnb_form = function cnb_form(params) {
    let buttonText = "PAY";
    if (params.language==="ua") {
      buttonText = "СПЛАТИТИ"
    }



    params = this.cnb_params(params);
    const data = Buffer.from(JSON.stringify(params)).toString("base64");
    const signature = this.str_to_sign(private_key + data + private_key);

    return (
      '<form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8" >' +
      '<input type="hidden" name="data" value="' +
      data +
      '" />' +
      '<input type="hidden" name="signature" value="' +
      signature +
      '" />' +
      `<button style="border: none !important; display:flex !important;text-align: center !important;padding: 20px 36px !important;
    color: #fff !important; box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.12); font-size:14px !important; line-height: 1.75 !important; font-weight: 600 !important; font-family: 'Open Sans', sans-serif; cursor: pointer !important; border-radius: 0px !important;
    background: #000000 !important;"onmouseover="this.style.opacity='0.5';" onmouseout="this.style.opacity='1';">
    <img src="https://static.liqpay.ua/buttons/logo-white.svg" name="btn_text"
      style="vertical-align: middle !important;"/>
    <span style="vertical-align:middle; !important; margin-left: 8px !important; text-transform: uppercase;"> ` + buttonText + `</span>
  </button>` +
      "</form>"
    );
  };

  this.cnb_signature = function cnb_signature(params) {
    params = this.cnb_params(params);
    const data = Buffer.from(JSON.stringify(params)).toString("base64");
    return this.str_to_sign(private_key + data + private_key);
  };

  this.cnb_params = function cnb_params(params) {
    params.public_key = public_key;

    if (params.version) {
      if (
        typeof params.version === "string" &&
        !isNaN(Number(params.version))
      ) {
        params.version = Number(params.version);
      } else if (typeof params.version !== "number") {
        throw new Error(
          "version must be a number or a string that can be converted to a number"
        );
      }
    } else {
      throw new Error("version is null");
    }

    if (params.amount) {
      if (typeof params.amount === "string" && !isNaN(Number(params.amount))) {
        params.amount = Number(params.amount);
      } else if (typeof params.amount !== "number") {
        throw new Error(
          "amount must be a number or a string that can be converted to a number"
        );
      }
    } else {
      throw new Error("amount is null");
    }

    const stringParams = ["action", "currency", "description", "language"];
    for (const param of stringParams) {
      if (params[param] && typeof params[param] !== "string") {
        params[param] = String(params[param]);
      } else if (!params[param] && param !== "language") {
        throw new Error(`${param} is null or not provided`);
      }
    }

    if (params.language && !this.availableLanguages.includes(params.language)) {
      params.language = "uk";
    }

    return params;
  };

  this.str_to_sign = function str_to_sign(str) {
    if (typeof str !== "string") {
      throw new Error("Input must be a string");
    }

    const sha1 = crypto.createHash("sha1");
    sha1.update(str);
    return sha1.digest("base64");
  };

  this.cnb_object = function cnb_object(params) {
    params.language = params.language || "uk";
    params = this.cnb_params(params);
    const data = Buffer.from(JSON.stringify(params)).toString("base64");
    const signature = this.str_to_sign(private_key + data + private_key);
    return { data: data, signature: signature };
  };

  return this;
};

module.exports = LiqPay;
