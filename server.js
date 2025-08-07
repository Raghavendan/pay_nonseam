const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 👉 Payment gateway will POST to this endpoint
app.post("/transaction", (req, res) => {
  const { encData, AuthID, Status } = req.body;

  console.log("🔁 Received POST from payment gateway:", {
    encData,
    AuthID,
    Status,
  });

  // Redirect with query parameters
  const redirectUrl = `/transaction?encData=${encodeURIComponent(encData)}&AuthID=${encodeURIComponent(AuthID)}&Status=${encodeURIComponent(Status)}`;
  return res.redirect(302, redirectUrl);
});

// Serve React build (assuming React is built into /build folder)
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
