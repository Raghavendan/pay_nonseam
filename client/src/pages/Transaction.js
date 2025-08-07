import CryptoJS from "crypto-js";
import { useEffect, useLocation } from "react-router-dom";

function Transaction() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const respData = query.get("respData");

  useEffect(() => {
    if (!respData) return;

    // ✅ Define key and iv
    const authKey = "Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo";
    const key = CryptoJS.SHA256(authKey).toString().substr(0, 32); // 256-bit key

    // Assume respData is in format: base64Data::ivHex
    const [encryptedData, ivHex] = respData.split("::");
    if (!ivHex) {
      console.error("IV missing in respData");
      return;
    }

    const iv = CryptoJS.enc.Hex.parse(ivHex); // ✅ Used below

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv: iv, // ← IV is used here
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const plainText = decrypted.toString(CryptoJS.enc.Utf8);
      if (!plainText) {
        throw new Error("Decryption failed");
      }

      const txnStatus = JSON.parse(plainText);
      console.log("Transaction Status:", txnStatus);
      // Update state, show UI, etc.
    } catch (error) {
      console.error("Decryption failed:", error);
    }
  }, [respData]);

  return <div>Processing transaction...</div>;
}

export default Transaction;