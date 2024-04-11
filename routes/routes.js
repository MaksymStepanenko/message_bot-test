const express = require("express");
const {sendMessage} = require('../controler/controler');
const liqpay = require("../controler/liqpay");

const routes = express.Router();

// routes.post("/", sendMessage);
routes.post("/liqpay-gots", liqpay)

module.exports = routes;