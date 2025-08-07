import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

const Transaction = () => {
  const location = useLocation();
  const [decryptedData, setDecryptedData] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const encData = query.get("encData");
    const statusParam = query.get("Status");
    const authId = query.get("AuthID");

    console.log("🔁 Returned to frontend:", {
      encData,
      statusParam,
      authId,
    });

    if (!encData) {
      setError("Missing encrypted data.");
      return;
    }

    const authKey = localStorage.getItem("currentAuthKey");

    if (!authKey) {
      setError("AuthKey not found in localStorage.");
      return;
    }

    try {
      const key = CryptoJS.enc.Utf8.parse(authKey.padEnd(32, "0"));
      const iv = CryptoJS.enc.Utf8.parse(authKey.substring(0, 16));

      const decrypted = CryptoJS.AES.decrypt(encData, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      const parsed = JSON.parse(decryptedText);

      console.log("✅ Decrypted Data:", parsed);
      setDecryptedData(parsed);
      setStatus(statusParam);
    } catch (err) {
      console.error("❌ Decryption error:", err);
      setError("Decryption failed.");
    }
  }, [location.search]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Transaction Result</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && decryptedData && (
        <div style={{ textAlign: "left", marginTop: "1rem" }}>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Customer Ref:</strong> {decryptedData.CustRefNum}</p>
          <p><strong>Amount:</strong> ₹{decryptedData.txn_Amount}</p>
          <p><strong>Email:</strong> {decryptedData.EmailId}</p>
          <p><strong>Mobile:</strong> {decryptedData.ContactNo}</p>
          {/* Add more fields if needed */}
        </div>
      )}
    </div>
  );
};

export default Transaction;
