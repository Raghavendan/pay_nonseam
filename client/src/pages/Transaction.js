import { useLocation } from "react-router-dom";

function Transaction() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const encData = queryParams.get("encData");
  const AuthID = queryParams.get("AuthID");
  const Status = queryParams.get("Status");

  console.log("✅ Decrypted URL Params:", { encData, AuthID, Status });

  // Example: Store to state if needed
  // const [encDataValue, setEncDataValue] = useState(encData);

  return (
    <div>
      <h2>Transaction Result</h2>
      <p><strong>Status:</strong> {Status}</p>
      <p><strong>Auth ID:</strong> {AuthID}</p>
      <p><strong>Encrypted Data:</strong> {encData}</p>
    </div>
  );
}

export default Transaction;
