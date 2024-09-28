import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const usernameFirstLetter = user?.username?.charAt(0).toUpperCase(); 

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <nav style={{ backgroundColor: '#10375b' }} className="p-4 w-full fixed top-0 left-0 z-10">
        <div className="flex justify-between items-center">
          <div className="text-white text-lg font-bold flex items-center">
            <Link to="/" className="flex items-center">
              PayEase
            </Link>
            {/* Side form heading */}
            <span className="ml-3 text-xs text-gray-300">
              Your one-stop payment solution
            </span>
          </div>
          
          <div className="space-x-4 flex items-center">
            <Link to="/pay" className="text-gray-300 hover:text-white">
              Pay Now
            </Link>
            {user && (
              <div
                className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onClick={toggleModal} 
              >
                {usernameFirstLetter}
              </div>
            )}
            {!user && (
              <>
                <Link to="/signup" className="text-gray-300 hover:text-white">
                  Signup
                </Link>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
              </>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 shadow-lg">
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Mobile:</strong> {user?.mobile}</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={toggleModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
