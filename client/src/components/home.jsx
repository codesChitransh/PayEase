import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0); // State for balance
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

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/user/${loggedInUser.username}/transactions`);
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchBalance = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/user/${loggedInUser.username}/balance`);
        setBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchUsers();
    const interval = setInterval(() => {
      fetchTransactions();
      fetchBalance();
    }, 5000);
    
    fetchTransactions();
    fetchBalance();
    
    return () => clearInterval(interval);
  }, [loggedInUser.username]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      
      <div className="w-1/4 p-4 border-r border-gray-300 bg-white shadow-lg">
        <h2 className="text-lg font-bold mb-4">User List</h2>
        <ul>
          {users.map((user) => (
            <li 
              key={user._id} 
              className="mb-2 p-4 border-b border-gray-200 bg-gradient-to-r from-green-100 to-blue-100 hover:from-blue-100 hover:to-green-100 transition-all duration-300 ease-in-out rounded-lg shadow-md"
            >
              <strong>{user.name}</strong> ({user.username}) - {user.mobile}
            </li>
          ))}
        </ul>
      </div>

      
      <div className="w-1/4 p-6 bg-gradient-to-r from-green-300 to-blue-300 text-white shadow-md rounded-lg mx-4">
        <h3 className="text-xl font-bold mb-2">Available Balance:</h3>
        <p className={`text-3xl font-semibold ${balance < 500 ? 'text-red-500' : 'text-green-900'}`}>
          {balance}
        </p>
        {balance < 500 && (
          <p className="mt-2 text-lg text-red-500 font-bold">
            Low balance, recharge soon!
          </p>
        )}
      </div>

      
      <div className="w-3/4 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-lg font-bold mb-4">Your Transaction History</h2>
        
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul>
            {transactions.map((transaction, index) => (
              <li 
                key={index} 
                className="mb-4 p-4 bg-gradient-to-r from-yellow-100 to-pink-100 hover:from-pink-100 hover:to-yellow-100 transition-all duration-300 ease-in-out rounded-lg shadow-md"
              >
                {transaction.payerUsername === loggedInUser.username
                  ? `Paid ${transaction.amount} to ${transaction.receiverUsername}`
                  : `Received ${transaction.amount} from ${transaction.payerUsername}`}
                <span className="block text-sm text-gray-600 mt-2">
                  Date: {new Date(transaction.date).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;