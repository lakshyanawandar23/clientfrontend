import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";    
import "./Transaction.css"; // Assuming you've created a Transaction.css file for styles
import QRimage from "../assets/QR.jpg"
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HeadphonesIcon from '@mui/icons-material/Headphones';
const Transaction = () => {
  const [transxnId, setTransxnId] = useState(
    "TKVCn8sJbrZSucivKjR992tCrLCirBNGKF"
  );
  const [message, setMessage] = useState(""); // State for message
  const [messageColor, setMessageColor] = useState(""); // State for message color
  const phoneNumber = "+919256935027";

  const shareToWhatsApp = () => {
  //   const message = "Hello, Please put my order!";
  //   const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
  //   message)}`;
  //  // const url = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
  //  window.open(url,"_blank");
   const message = "Hello, Please put my orders.";
   const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
     message
   )}`;

   window.open(url, "_blank");
    // try {
    //   window.open(url, "_blank");
    //   setMessage("Message shared successfully!");
    //   setMessageColor("green");
    // } catch (error) {
    //   console.error("Error sharing to WhatsApp", error);
    //   setMessage("Error sharing to WhatsApp");
    //   setMessageColor("red");
    // }

    // // Clear message after a delay for better user experience
    // setTimeout(() => {
    //   setMessage("");
    // }, 3000);
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setMessage("Id Copied to Clipboard!");
    setMessageColor("green");
  };

  const chatToNumber = () => {
    const message = "Hello, Please share your details.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="transaction-container">
      <div className="transaction-box">
        <p className="uppertext">Min Deposit: $10</p>
        <p className="uppertext">Use Network: TRC 20</p>
      </div>

      <div className="qr-container">
        <div className="qr-image-box">
          <img src={QRimage} alt="QR Code" className="qr-image" />
        </div>
        <div className="copy-btn">
          <p className="copy-text">{transxnId}</p>
          <button className="copy-icon" onClick={() => copyToClipboard(transxnId)}>
            Copy
          </button>
        </div>
      </div>

      <button className="dial-button" onClick={chatToNumber}>
      <HeadphonesIcon fontSize="large">/</HeadphonesIcon>
      </button>

      <p className="instruction-text">
        After completing the payment, please share the payment screenshot here.
      </p>

      <button className="button" onClick={shareToWhatsApp}>
      <WhatsAppIcon></WhatsAppIcon>
      Share on WhatsApp
      </button>

      {message && (
        <p className="message" style={{ color: messageColor }}>
          {message}
        </p>
      )}

      <p className="lowertext">
        Don't forget to share your transaction ID along with your bank details.
      </p>
    </div>
  );
};

export default Transaction;
