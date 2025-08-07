const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan"); // For logging

const app = express();
const PORT = process.env.PORT || 8080;

// Enhanced middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));  // Request logging

// Payment Callback Endpoint (Enhanced)
app.post("/transaction", (req, res) => {
  try {
    console.log("🔵 Received callback request body:", req.body);
    console.log("🔍 Full body:", JSON.stringify(req.body, null, 2));

    // ✅ Use 'respData' and 'AuthID' — these are what the gateway sends
    const respData = req.body.respData;  // ← This is the encrypted payload
    const AuthID = req.body.AuthID;
    const AggRefNo = req.body.AggRefNo;

    if (!respData || !AuthID) {
      console.error("❌ Missing required parameters: respData and AuthID");
      return res.status(400).json({
        status: "error",
        message: "Missing required parameters: respData and AuthID"
      });
    }

    // ✅ Redirect to your React app with the data
    const redirectUrl = `/transaction?respData=${encodeURIComponent(respData)}&AuthID=${encodeURIComponent(AuthID)}${AggRefNo ? '&AggRefNo=' + encodeURIComponent(AggRefNo) : ''}`;

    console.log("🚀 Redirecting to:", redirectUrl);
    return res.redirect(302, redirectUrl);

  } catch (error) {
    console.error("❌ Error in callback handler:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

// Serve React app
app.use(express.static(path.join(__dirname,  "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔄 Callback URL: https://nonseam-pay.onrender.com/transaction`);
});
