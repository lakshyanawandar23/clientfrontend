import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // Using Bootstrap for Modal
import { Icon } from "@mui/material";
import './AdminPanel.css'; // Importing CSS file for custom styles

const UserItem = ({ user, onViewDetails }) => (
  <div className="user-item">
    <h3 className="user-name">{user.name}</h3>
    <p className="user-detail">Email: {user.email}</p>
    <p className="user-detail">Phone No: {user.phone}</p>
    <p className="user-detail">Address: {user.address}</p>
    <button className="view-details-button" onClick={() => onViewDetails(user)}>
      View Bank Details
    </button>
  </div>
);

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [error, setError] = useState(null);
 const navigate=useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleViewDetails = (user) => {
    const userBankDetails = bankDetails.find(detail => detail._id === user._id);
    setSelectedUser(user);
    setSelectedBankDetails(userBankDetails || null);
    setShowBankDetailsModal(true);
  };

  const handleSubmitAdmin = async () => {
    setErrorMessage("");

    if (!transactionId || !imageUri) {
      setErrorMessage("Transaction ID and QR code are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("YOUR_BACKEND_API_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, qrCodeUri: imageUri }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      alert("Data submitted successfully!");
      setTransactionId("");
      setImageUri(null);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
      setShowAdminModal(false);
    }
  };

  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      try {
        setLoading(true);
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
        //  navigation.reset({ index: 0, routes: [{ name: "LoginOrRegister" }] });
        navigate('/');
          return;
        }
        await fetchData();
      } catch (error) {
        setError("Failed to authenticate or load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const userResponse = await fetch("https://clientbackend-yzy5.onrender.com/api/v1/users");
        const usersData = await userResponse.json();
        const bankResponse = await fetch("https://clientbackend-yzy5.onrender.com/api/v1/bankdetails");
        const bankData = await bankResponse.json();

        setUsers(usersData);
        setBankDetails(bankData.data);
      } catch (error) {
        setError("Failed to load data. Please try again.");
      }
    };

    checkTokenAndFetchData();
  }, []);

  return (
    <div className="admin-panel">
      <div className="header">
        <h1>Users Detail</h1>
      </div>
      <div className="scrollable-list">
        {users.map(user => (
          <UserItem key={user._id} user={user} onViewDetails={handleViewDetails} />
        ))}
      </div>
      
      <button onClick={() => setShowAdminModal(true)} className="admin-button">
    <Icon name="cog" size={25} /> Admin Options
      </button>

      <Modal show={showBankDetailsModal} onHide={() => setShowBankDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Bank Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBankDetails ? (
            <>
              <p>Account Number: {selectedBankDetails.accountNumber}</p>
              <p>IFSC Code: {selectedBankDetails.ifscCode}</p>
              <p>Bank Name: {selectedBankDetails.bankName}</p>
            </>
          ) : (
            <p>Not submitted yet</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowBankDetailsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Admin Panel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Change Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageUri(URL.createObjectURL(e.target.files[0]))}
          />
          {imageUri && <img src={imageUri} alt="QR Code" className="preview-image" />}
          <button onClick={handleSubmitAdmin} className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowAdminModal(false)}>Close</Button>
          <Button onClick={handleLogout} className="logout-button">Logout</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;
