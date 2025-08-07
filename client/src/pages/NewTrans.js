// src/pages/Transaction.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

function Transaction() {
  const location = useLocation();
  const [txnStatus, setTxnStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const respData = query.get("respData");
    const AuthID = query.get("AuthID");
    const AggRefNo = query.get("AggRefNo");

    if (!respData) {
      setError("No response data received.");
      return;
    }

    try {
      // 🔑 Full AuthKey as 256-bit key
      const authKey = "Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo";
      const key = CryptoJS.enc.Utf8.parse(authKey); // 32 bytes for AES-256

      // 🧱 First 16 characters of AuthKey as IV
      const ivString = authKey.substring(0, 16); // "Qv0rg4oN8cS9sm6P"
      const iv = CryptoJS.enc.Utf8.parse(ivString); // 16 bytes for IV

      // 📦 Decrypt using AES-256-CBC
      const decrypted = CryptoJS.AES.decrypt(respData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const plainText = decrypted.toString(CryptoJS.enc.Utf8);

      if (!plainText) {
        throw new Error("Decryption failed - invalid or corrupted data");
      }

      // ✅ Successfully decrypted!
      const parsed = JSON.parse(plainText);
      console.log("✅ Decrypted Transaction:", parsed);
      setTxnStatus(parsed);

      // Log other fields (to avoid ESLint warnings)
      console.log("AuthID:", AuthID);
      console.log("AggRefNo:", AggRefNo);

    } catch (err) {
      console.error("❌ Decryption error:", err);
      setError(`Failed to decrypt: ${err.message}`);
    }
    console.log("✅ Transaction page loaded");
  }, [location.search]);
  

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', textAlign: 'center' }}>
      <h2>Transaction Result</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {txnStatus ? (
        <div>
          <h3>Status: {txnStatus.payStatus === "Ok" ? "✅ Success" : "❌ Failed"}</h3>
          <pre style={{ 
            textAlign: 'left', 
            display: 'inline-block', 
            margin: '0 auto', 
            padding: '10px', 
            background: '#f5f5f5', 
            borderRadius: '5px', 
            whiteSpace: 'pre-wrap',
            fontSize: '14px'
          }}>
            {JSON.stringify(txnStatus, null, 2)}
          </pre>
          <br />
          <a href="/" style={{ marginTop: '20px', display: 'block' }}>← Back Home</a>
        </div>
      ) : (
        <p>🔐 Decrypting transaction...</p>
      )}
    </div>
  );
}

export default Transaction;