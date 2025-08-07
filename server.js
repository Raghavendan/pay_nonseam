// server.js
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // Important: payment gateways often use x-www-form-urlencoded
app.use(bodyParser.json()); // Also support JSON

// Your AES decryption function
function decryptAES256(encryptedData, authKey) {
  const key = crypto.createHash('sha256').update(authKey).digest(); // 32-byte key
  const [data, ivHex] = encryptedData.split('::'); // Assuming format: base64Data::ivHex
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(data, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}

// Mock AuthKey (should match what you used to encrypt)
const AUTH_KEY = 'Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo'; // Keep this secure

// POST route to handle callback from payment gateway
app.post('/transaction', (req, res) => {
  try {
    console.log('Raw body:', req.body);

    const { AuthID, AggRefNo, respData } = req.body;

    if (!respData) {
      return res.status(400).send('Missing respData');
    }

    // Decrypt the respData
    let decrypted;
    try {
      decrypted = decryptAES256(respData, AUTH_KEY);
    } catch (err) {
      console.error('Decryption failed:', err);
      return res.status(400).send('Failed to decrypt data');
    }

    console.log('Decrypted Data:', decrypted);

    // Parse decrypted string (should be JSON string)
    const txnStatus = JSON.parse(decrypted);

    // Respond with HTML page showing status (or redirect)
    res.send(`
      <html>
        <head><title>Payment Status</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>Transaction Status</h2>
          <pre>${JSON.stringify(txnStatus, null, 2)}</pre>
          <br/>
          <a href="/">← Back to Home</a>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Optional: Serve frontend (if you want same project)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Welcome to Payment Portal</h1>
        <p>Make a payment to get redirected.</p>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});