import React, { useEffect, useState } from "react";
import {
  useNavigate,
} from "react-router"; // For navigation
import "./LoginScreen.css"; // Import CSS file for styling
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [login, setLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !name || !phoneNumber  || !address || !password) {
      setErrorMessage("All fields are required!");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://clientbackend-yzy5.onrender.com/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phoneNumber, password, address }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setEmail("");
        setName("");
        setPhoneNumber("");
        setPassword("");
        setAddress("");
        setLogin(true);
        navigate("/login");
      } else {
        setErrorMessage(data || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Email or password can't be empty");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://clientbackend-yzy5.onrender.com/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);
      if (data.message == "Login successful") {
        console.log(data);
         localStorage.setItem("token", data.token);
        const route = data.role === "Admin" ? "/admin" : "/home";
        navigate(route);
      } else {
        setErrorMessage(data.message || "Invalid login, please try again.");
      }
    } catch (error) {
      setErrorMessage("Request timeout. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        setLoading(true);
        const storedToken =  localStorage.getItem("token");
        if (storedToken) {
          navigate("/home");
        }
      } catch (error) {
        console.error("Error checking token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [navigate]);

  return (
    <div className="outer-container">
      {login ? (
        <div className="login-container">
          <h2>Login</h2>
          <div className="input-container">
            <EmailIcon className="icon"></EmailIcon>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-container ">
            <LockIcon className="icon "/>
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              <i className="material-icons sm">
                {isPasswordVisible ? <VisibilityIcon fontSize="small"></VisibilityIcon> : <VisibilityOffIcon fontSize="small"></VisibilityOffIcon>}
              </i>
            </button>
          </div>

          <button onClick={handleLogin}>Login</button>
          <p>
            Don’t have an account?{" "}
            <span onClick={() => setLogin(false)} className="link-text">
              Register
            </span>
          </p>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </div>
      ) : (
        <div className="login-container">
          <h2>Register</h2>

          <div className="input-container">
            <PersonIcon className="icon"/>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-container">
          <PhoneIcon className="icon" />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="input-container">
            <EmailIcon className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-container">
            <LockIcon className="icon" />
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-container">
            <HomeIcon className="icon"/>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <button onClick={handleRegister}>Register</button>
          <p>
            Already have an account?{" "}
            <span onClick={() => setLogin(true)} className="link-text">
              Login here
            </span>
          </p>
        </div>
      )}

      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
