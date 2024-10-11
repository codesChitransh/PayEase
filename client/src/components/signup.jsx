import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const url = "http://localhost:3006/signup"; 

    try {
      const res = await axios.post(url, { name, username, password, mobile });
      
      if (res.data.success) {
        console.log("Signup successful", res.data.user);
        setSuccess('Signup successful! Redirecting to login...');
        setError('');
        setTimeout(() => {
          navigate('/login'); 
        }, 500); 
      } else {
        setError('Signup failed: ' + res.data.message);
        setSuccess('');
      }
    } catch (err) {
      console.log("Error:", err);
      setError('An error occurred. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded mt-1" 
            required 
          />
        </div>

        
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded mt-1" 
            required 
          />
        </div>

       
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded mt-1" 
            required 
          />
        </div>

     
        <div className="mb-4">
          <label htmlFor="mobile" className="block text-gray-700">Mobile</label>
          <input 
            type="tel" 
            id="mobile" 
            value={mobile} 
            onChange={(e) => setMobile(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded mt-1" 
            required 
          />
        </div>

        
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
