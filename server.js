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
    console.log("🔵 Received callback request query:", req.query);
    
    // Handle both POST body and query params
    const encData = req.body.encData || req.query.encData;
    const AuthID = req.body.AuthID || req.query.AuthID;
    const Status = req.body.Status || req.query.Status;

    if (!encData || !AuthID) {
      console.error("❌ Missing required parameters");
      return res.status(400).json({
        status: "error",
        message: "Missing required parameters: encData and AuthID"
      });
    }

    // Add additional validation if needed
    if (typeof encData !== "string" || encData.length < 10) {
      console.error("❌ Invalid encData format");
      return res.status(400).json({
        status: "error",
        message: "Invalid encData format"
      });
    }

    // Success response - redirect to frontend with parameters
    const redirectUrl = `/transaction?encData=${encodeURIComponent(encData)}&AuthID=${encodeURIComponent(AuthID)}`;
    if (Status) redirectUrl += `&Status=${encodeURIComponent(Status)}`;

    console.log("🔵 Redirecting to:", redirectUrl);
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
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔄 Callback URL: https://nonseam-pay.onrender.com/transaction`);
});
