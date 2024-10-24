import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './HomeScreen.css'; // Create a CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons'; // Icons
import Modal from 'react-modal'; // Modal for web
import backgroundImage from '../assets/theme1.jpg';
import backgroundImage2 from '../assets/theme3.jpg';

// Custom styles for the Modal
const customModalStyles = {
  content: {
    width: '80%',
    margin: 'auto',
    padding: '20px',
    borderRadius: '10px',
  },
};

const HomeScreen = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading,setLoading]=useState(false);
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [valuedt,setValuedt]=useState();
  const handleSell = () => {
    navigate('/transaction');
  };
 const fetchdata=async()=>{
  const resp=await fetch("https://clientbackend-yzy5.onrender.com/api/v1/transaction");
  const data=await resp.json();
  console.log(data);
  setValuedt(data.rate);
  setIsLoading(true);
  localStorage.setItem('transactionid',data.transactionid);
 }
 fetchdata();
  const handleLogout = async () => {
    setLoading(true);
     localStorage.removeItem('token');
    setLoading(false);
    navigate('/'); // Adjust navigation
  };

  const handleAddBankAccount = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    const payload = {
      accountHolder,
      accountNumber,
      ifscCode,
      bankName,
    };

    try {
      setSubmissionMessage('Wait...');
      const response = await fetch('https://clientbackend-yzy5.onrender.com/api/v1/bankdetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmissionMessage('Bank details submitted successfully!');
        setAccountHolder('');
        setAccountNumber('');
        setIfscCode('');
        setBankName('');
        setModalVisible(false);
      } else {
        throw new Error('Failed to submit bank details');
      }
    } catch (error) {
      setSubmissionMessage('Failed to submit bank details. Please try again.');
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const storedToken =  localStorage.getItem('token');
      if (!storedToken) {
        navigate('/');
      }
    };
    checkToken();
  }, [navigate]);

  return (
    <div className="image-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="header">
        <button onClick={handleLogout} className="icon-button">
          <FontAwesomeIcon icon={faSignOutAlt} size="2x" color="#f3ce09" />
        </button>
        <button className="add-button" onClick={handleAddBankAccount}>
          + Add Bank
        </button>
      </div>

      <div className="container">
        <div className="inner-box">
          <h1 className="title">Currency Exchange</h1>
          <h2 className="price">$ Today's Price</h2>
        </div>

        <div className="box">
          <div className="image2" style={{ backgroundImage: `url(${backgroundImage2})` }}>
            <div className="logo">
              <div className="icon">
                <FontAwesomeIcon icon={faInfoCircle} size="2x" color="#FFD700" />
                <h3 className="box-title">Pursa Exchange</h3>
              </div>
            </div>
            {
              !(isLoading) ? <div>Loading ...</div> : 
              <p className="exchange-rate">1 USDT = {valuedt} INR</p>
            }
            <button className="sell-button" onClick={handleSell}>
              $ Sell USDT
            </button>
          </div>
        </div>

        <Modal
          isOpen={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={customModalStyles}
        >
          <button className="close-button" onClick={() => setModalVisible(false)}>
            <FontAwesomeIcon icon={faTimes} size="1x" />
          </button>
          <h2>Add Bank Account</h2>
          <input
            className="input"
            type="text"
            placeholder="Account Holder"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="IFSC Code"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
          {submissionMessage && (
            <p
              style={{
                color: submissionMessage.includes('successfully') ? 'green' : 'red',
                fontWeight: 'bold',
              }}
            >
              {submissionMessage}
            </p>
          )}
        </Modal>
      </div>

      <footer className="footer">
        <div className="terms-container">
          <FontAwesomeIcon icon={faInfoCircle} size="1x" color="#FFD700" />
          <p className="footer-text">It's 100% safe and secure wallet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeScreen;
