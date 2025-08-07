import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const Transaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decrypt the response data
  const decryptResponse = (encryptedData, authKey) => {
    try {
      const key = CryptoJS.enc.Utf8.parse(authKey.padEnd(32, "0"));
      const iv = CryptoJS.enc.Utf8.parse(authKey.substring(0, 16));

      const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error("❌ Decryption Error:", error);
      throw new Error("Failed to decrypt response data");
    }
  };

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(location.search);
        const authID = urlParams.get('AuthID');
        const aggRefNo = urlParams.get('AggRefNo');
        const respData = urlParams.get('respData');

        console.log("📥 Callback Parameters:", { authID, aggRefNo, respData });

        if (!authID || !respData) {
          throw new Error("Missing required callback parameters");
        }

        // For decryption, you'll need the AuthKey. 
        // You can either:
        // 1. Store it in localStorage/sessionStorage during payment initiation
        // 2. Fetch it from your database using AuthID
        // 3. Pass it through state if coming from same session

        // Method 1: Get from localStorage (if stored during payment)
        const authKey = localStorage.getItem('currentAuthKey') || 'Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo';

        // Decrypt the response
        const decryptedData = decryptResponse(respData, authKey);
        console.log("🔓 Decrypted Transaction Data:", decryptedData);

        setTransactionData(decryptedData);
        setLoading(false);

      } catch (err) {
        console.error("❌ Error processing callback:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    processCallback();
  }, [location]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Ok': { color: '#28a745', bg: '#d4edda', text: 'SUCCESS' },
      'F': { color: '#dc3545', bg: '#f8d7da', text: 'FAILED' },
      'PPPP': { color: '#ffc107', bg: '#fff3cd', text: 'PENDING' },
    };

    const config = statusConfig[status] || { color: '#6c757d', bg: '#e9ecef', text: status };

    return (
      <span
        style={{
          padding: "8px 16px",
          backgroundColor: config.bg,
          color: config.color,
          borderRadius: "20px",
          fontWeight: "bold",
          fontSize: "14px",
          border: `1px solid ${config.color}`,
        }}
      >
        {config.text}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString.replace(' ', 'T'));
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  const handleReturnHome = () => {
    // Clear any stored auth keys
    localStorage.removeItem('currentAuthKey');
    navigate('/');
  };

  const handleRetry = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p>Processing transaction...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        maxWidth: '600px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h2>❌ Error Processing Transaction</h2>
          <p>{error}</p>
        </div>
        <button
          onClick={handleReturnHome}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '10px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: '#333'
        }}>
          🧾 Transaction Details
        </h1>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          {getStatusBadge(transactionData?.payStatus)}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px'
        }}>
          {/* Transaction Info */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#495057', marginBottom: '15px' }}>💳 Transaction Info</h3>
            <div style={{ lineHeight: '2' }}>
              <p><strong>Amount:</strong> ₹{transactionData?.PayAmount}</p>
              <p><strong>Reference No:</strong> {transactionData?.CustRefNum}</p>
              <p><strong>Aggregator Ref:</strong> {transactionData?.AggRefNo}</p>
              <p><strong>Service RRN:</strong> {transactionData?.serviceRRN}</p>
              <p><strong>Payment Mode:</strong> {transactionData?.MOP}</p>
            </div>
          </div>

          {/* Status Info */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#495057', marginBottom: '15px' }}>📊 Status Info</h3>
            <div style={{ lineHeight: '2' }}>
              <p><strong>Status:</strong> {transactionData?.payStatus}</p>
              <p><strong>Response Code:</strong> {transactionData?.resp_code}</p>
              <p><strong>Message:</strong> {transactionData?.resp_message}</p>
              <p><strong>Payment Date:</strong> {formatDateTime(transactionData?.PaymentDate || transactionData?.Paymentdate)}</p>
              <p><strong>Response Date:</strong> {formatDateTime(transactionData?.payrespDate)}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#495057', marginBottom: '15px' }}>👤 Customer Info</h3>
            <div style={{ lineHeight: '2' }}>
              <p><strong>Email:</strong> {transactionData?.EmailId || transactionData?.userEmailID}</p>
              <p><strong>Contact:</strong> {transactionData?.ContactNo}</p>
              <p><strong>Auth ID:</strong> {transactionData?.AuthID || transactionData?.AuthId}</p>
            </div>
          </div>

          {/* Additional Data */}
          {(transactionData?.adf1 !== "NA" || transactionData?.adf2 !== "NA" || transactionData?.adf3 !== "NA") && (
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px'
            }}>
              <h3 style={{ color: '#495057', marginBottom: '15px' }}>📝 Additional Data</h3>
              <div style={{ lineHeight: '2' }}>
                {transactionData?.adf1 !== "NA" && <p><strong>ADF1:</strong> {transactionData?.adf1}</p>}
                {transactionData?.adf2 !== "NA" && <p><strong>ADF2:</strong> {transactionData?.adf2}</p>}
                {transactionData?.adf3 !== "NA" && <p><strong>ADF3:</strong> {transactionData?.adf3}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px', 
          marginTop: '30px'
        }}>
          <button
            onClick={handleReturnHome}
            style={{
              padding: "12px 24px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            🏠 Return Home
          </button>
          
          {transactionData?.payStatus === 'F' && (
            <button
              onClick={handleRetry}
              style={{
                padding: "12px 24px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              🔄 Retry Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;