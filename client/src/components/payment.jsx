import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PayNow() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [payerBalance, setPayerBalance] = useState(0);

  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3005/users');
        const filteredUsers = response.data.filter(user => user.username !== loggedInUser.username);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    const fetchPayerBalance = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/user/${loggedInUser.username}/balance`);
        setPayerBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    const int = setInterval(fetchPayerBalance, 4000);
    fetchPayerBalance();
    return () => clearInterval(int);
  }, [payerBalance]);

  const handlePayClick = (user) => {
    setSelectedUser(user);
    setAmount('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transferAmount = Number(amount);

    if (transferAmount > payerBalance) {
      setMessage('Insufficient balance to complete the transaction.');
      setSuccess(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3005/pay', {
        payerUsername: loggedInUser.username,
        receiverUsername: selectedUser.username,
        amount: transferAmount,
      });

      if (response.data.success) {
        setSuccess(true);
        setMessage(response.data.message);
        setPayerBalance(response.data.payer.balance);
      } else {
        setSuccess(false);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error transferring money:', error);
      setSuccess(false);
      setMessage('An error occurred while transferring money. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-teal-100 to-teal-500 min-h-screen flex justify-center items-center">
      <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Select a User to Pay</h2>

        {selectedUser ? (
          <form onSubmit={handleSubmit}>
            <h3 className="mb-2">Paying {selectedUser.name} ({selectedUser.username})</h3>
            <div className="mb-4">
              <label htmlFor="amount" className="block mb-1">Amount</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="border p-2 w-full"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit Payment</button>
            <button
              onClick={() => setSelectedUser(null)}
              className="ml-4 p-2 rounded bg-gray-500 text-white"
            >
              Cancel
            </button>

            {success && (
              <div className="mt-4 text-green-500">
                {message} <br /> Your remaining balance is {payerBalance}.
              </div>
            )}

            {!success && message && (
              <div className="mt-4 text-red-500">{message}</div>
            )}
          </form>
        ) : (
          <ul>
            {users.map((user) => (
              <li
                key={user._id}
                className="mb-2 p-2 border-b border-gray-200 flex justify-between items-center"
              >
                <span>{user.name} ({user.username})</span>
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => handlePayClick(user)}
                >
                  Pay
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <h3 className="font-bold">Your Current Balance:</h3>
          <p className="text-lg">{payerBalance}</p>
        </div>
      </div>
    </div>
  );
}

export default PayNow;
