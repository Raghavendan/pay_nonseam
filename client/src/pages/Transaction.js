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
    const AggRefNo = query.get("AggRefNo"); // Now we'll use it

    if (!respData) {
      setError("No response data received.");
      return;
    }

    try {
      // 🔑 Use first 16 characters of AuthKey
      const authKey = "Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo";
      const key = authKey.substring(0, 16); // 16 chars = 128-bit key

      // 🧱 Fixed IV (common in payment gateways if IV not sent)
      const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000"); // 16 bytes zero

      // 📦 Decrypt
      const decrypted = CryptoJS.AES.decrypt(respData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const plainText = decrypted.toString(CryptoJS.enc.Utf8);

      if (!plainText) {
        throw new Error("Decryption failed - invalid data");
      }

      const parsed = JSON.parse(plainText);
      console.log("Decrypted Transaction:", parsed);
      setTxnStatus(parsed);

      // ✅ Now use AggRefNo and AuthID (to fix ESLint)
      console.log("AuthID:", AuthID);
      console.log("AggRefNo:", AggRefNo);

    } catch (err) {
      console.error("Decryption error:", err);
      setError(`Failed to decrypt: ${err.message}`);
    }
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
          <pre style={{ textAlign: 'left', display: 'inline-block', margin: '0 auto', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
            {JSON.stringify(txnStatus, null, 2)}
          </pre>
          <br />
          <a href="/" style={{ marginTop: '20px', display: 'block' }}>← Back Home</a>
        </div>
      ) : (
        <p>Decrypting transaction...</p>
      )}
    </div>
  );
}

export default Transaction;