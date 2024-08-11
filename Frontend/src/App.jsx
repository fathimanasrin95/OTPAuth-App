import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [step, setStep] = useState('sendEmail');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    try {
      await axios.post('http://localhost:5000/api/otp/send', { email });
      setStep('verifyOtp');
      setMessage('OTP sent to your email');
    } catch (error) {
      setMessage('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/otp/verify', { email, otp });
      setMessage(response.data.message);
      if (response.data.message === 'OTP verified') {
        setStep('welcome');
      }
    } catch (error) {
      setMessage('Invalid OTP');
    }
  };


  return (
    <>
   <div className="App">
      {step === 'sendEmail' && (
        <div>
          <h1>Send OTP</h1>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendEmail}>Send OTP</button>
        </div>
      )}
      {step === 'verifyOtp' && (
        <div>
          <h1>Verify OTP</h1>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}
      {step === 'welcome' && <h1>Welcome!</h1>}
      {message && <p>{message}</p>}
    </div>
    </>
  )
}

export default App
