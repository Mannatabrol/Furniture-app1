const express = require("express");
const path = require("path");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

var razorpay = new Razorpay({
  key_id: 'rzp_test_MRvRAK22kZpeog',
  key_secret: '5YFoc9zlHijLQy2TkBqKwJoC',
});

app.get("/logo.svg", (req, res) => {
  res.sendFile(path.join(__dirname, "logo.svg"));
});

app.post("/verification", (req, res) => {
  
  const secret = "razorpaysecret";

 

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    res.status(200).json({
      message: "OK",
    });
  } else {
    res.status(403).json({ message: "Invalid" });
  }
});

app.post("/razorpay", async (req, res) => {
  const payment_capture = 1;
  const amount = req.body.Amount;
  const currency = "INR";

  const options = {
    amount,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.log(err);
  }
});

const PORT =  1337;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
