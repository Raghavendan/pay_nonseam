import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { database, ref, get } from "../firebase";
import "../StartTrans.css";
import CryptoJS from "crypto-js";

const StartTrans = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [encryptedData, setEncryptedData] = useState("");

  const { username, amount } = location.state || {};

  const generateCustRefNo = () => {
    return Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
  };

  const getCurrentFormattedDateTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };

  const encryptTransaction = (user) => {
  const payload = {
    AuthID: user.authId,
    AuthKey: user.authKey,
    CustRefNum: user.custrefno,
    txn_Amount: user.amount,
    PaymentDate: user.paymentdate,
    ContactNo: user.mobile,
    EmailId: user.email,
    IntegrationType: user.integrationType,
    CallbackURL: user.callbackurl,
    adf1: "NA",
    adf2: "NA",
    adf3: "NA",
    MOP: user.mop,
    MOPType: user.moptype,
    MOPDetails: user.mopdetails,
  };


  // Convert payload to key="value"&key="value" format (double quotes on both key and value)
 const keyValueString = `{${Object.entries(payload)
  .map(([key, value]) => `"${key}":"${value}"`)
  .join(",")}}`;

  console.log("🔍 Payload to Encrypt:", keyValueString);


  const key = CryptoJS.enc.Utf8.parse(user.authKey.padEnd(32, "0")); // 256-bit
  const iv = CryptoJS.enc.Utf8.parse(user.authKey.substring(0, 16)); // IV: First 16 chars
  console.log("🔑 Secret Key:", user.authKey);
  console.log("🧊 IV:", user.authKey.substring(0, 16));

  const encrypted = CryptoJS.AES.encrypt(keyValueString, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  setEncryptedData(encrypted.toString());
};


  useEffect(() => {
    const fetchUser = async () => {
      if (!username || !amount) return;

      try {
        const usersRef = ref(database, "users");
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const matchedUser = Object.values(usersData).find((user) => user.name === username);

          if (matchedUser) {
            const fullUserData = {
              ...matchedUser,
              custrefno: generateCustRefNo(),
              amount,
              paymentdate: getCurrentFormattedDateTime(),
              integrationType: "nonseamless",
              callbackurl: "https://dashboard.skill-pay.in/pay/merchantResponse.jsp",
              mop: "NA",
              moptype: "NA",
              mopdetails: "NA",
            };

            setUserData(fullUserData);
            encryptTransaction(fullUserData); // auto-encrypt
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, amount]);

 const handleNext = () => {
  if (!userData || !encryptedData) return;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://dashboard.skill-pay.in/pay/paymentinit";

  const authIdField = document.createElement("input");
  authIdField.type = "hidden";
  authIdField.name = "AuthID";
  authIdField.value = userData.authId;

  const encDataField = document.createElement("input");
  encDataField.type = "hidden";
  encDataField.name = "encData";
  encDataField.value = encryptedData;

  form.appendChild(authIdField);
  form.appendChild(encDataField);

  document.body.appendChild(form);
  form.submit();
};


  if (loading) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>Loading transaction details...</div>;
  }

  if (!userData) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>User not found or data incomplete.</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🧾 Transaction Details</h2>
      <table className="trans-table">
        <tbody>
          <tr><th>Auth ID</th><td>{userData.authId}</td></tr>
          <tr><th>Auth Key</th><td>{userData.authKey}</td></tr>
          <tr><th>Customer Ref No</th><td>{userData.custrefno}</td></tr>
          <tr><th>Amount</th><td>₹{userData.amount}</td></tr>
          <tr><th>Payment Date</th><td>{userData.paymentdate}</td></tr>
          <tr><th>Mobile No</th><td>{userData.mobile}</td></tr>
          <tr><th>Email ID</th><td>{userData.email}</td></tr>
          <tr><th>Integration Type</th><td>{userData.integrationType}</td></tr>
          <tr><th>Address</th><td>{userData.address}</td></tr>
          <tr><th>Callback URL</th><td>{userData.callbackurl}</td></tr>
          <tr><th>MOP</th><td>{userData.mop}</td></tr>
          <tr><th>MOP Type</th><td>{userData.moptype}</td></tr>
          <tr><th>MOP Details</th><td>{userData.mopdetails}</td></tr>
        </tbody>
      </table>

      {encryptedData && (
        <>
          <div style={{ marginTop: "20px", wordBreak: "break-all", background: "#f0f0f0", padding: "15px", borderRadius: "6px" }}>
            <strong>🔐 Encrypted Data:</strong>
            <p>{encryptedData}</p>
          </div>

          <button
            onClick={handleNext}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Next ➡️
          </button>
        </>
      )}
    </div>
  );
};

export default StartTrans;
