import React, { useState, useEffect, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { UserContext } from "../App";
import '../css/wallet.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserWallet = () => {
  const user = useContext(UserContext);
  const [data, setData] = useState([]);
  const [walletError, setWalletError] = useState('');
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (user?.userID) {
      fetchData(offset, true);
    }
  }, [user]);

  useEffect(() => {
    if (user?.userID && offset > 0) {
      fetchData(offset, false);
    }
  }, [offset]);

  const fetchData = async (offset, isNewUser) => {
    if (!user.userID) {
      setWalletError("You have to log in first.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/wallet/${user.userID}?limit=5&offset=${offset}`,{ credentials: "include"});
      const result = await response.json();

      if (response.status !== 200) {
        setWalletError(result.message);
        return;
      }
      if (isNewUser) {
        setData(result);
      } else {
        setData(prevData => [...prevData, ...result]);
      }
    } catch (error) {
      setWalletError('There was an error: ' + error.toString());
      console.error('Fetch error:', error);
    }
  };

  const loadMore = () => {
    setOffset(prevOffset => prevOffset + 5);
  };

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Incomes',
        data: data.map(item => item.income),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: data.map(item => item.expenses),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='wallet'>
      <Bar data={chartData} />
      {data.length >= offset &&<button className='loadMore' onClick={loadMore}>View More</button>}
      {walletError && <p className="error" style={{ color: "red" }}>{walletError}</p>}
    </div>
  );
};

export default UserWallet;
