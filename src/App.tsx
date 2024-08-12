import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

function App() {
  const [isLoading, setIsLoading] = useState(true); 
  const [count, setCount] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Загрузка и сохранение числа кликов из MongoDB
  useEffect(() => {
    if (userData) {
      fetch(`http://localhost:5000/get-count?userId=${userData.id}`)
        .then((res) => res.json())
        .then((data) => {
          setCount(data);
        });
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      fetch('http://localhost:5000/save-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userData.id, count }),
      });
    }
  }, [count, userData]);

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>{userData ? userData.first_name : 'Player'}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p>var 2</p>
    </>
  );
}

export default App;
