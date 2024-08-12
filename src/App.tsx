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
  const [isLoading, setIsLoading] = useState(true); // Loading Status
  const [count, setCount] = useState<number>(0); // Counter
  const [userData, setUserData] = useState<UserData | null>(null);

  // Loading from Cloud Storage
  useEffect(() => {
    async function loadCloudData() {
      try {
        const result = await WebApp.cloudStorage.get('clickCount');
        if (result) {
          setCount(parseInt(result));
        }
      } catch (error) {
        console.error('Failed to load cloud data:', error);
      }
    }

    loadCloudData();
  }, []);

  // Saving to Cloud Storage
  useEffect(() => {
    async function saveCloudData() {
      try {
        await WebApp.cloudStorage.set('clickCount', count.toString());
      } catch (error) {
        console.error('Failed to save cloud data:', error);
      }
    }

    saveCloudData();
  }, [count]);

  // Delay Loading (temp)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (WebApp.initDataUnsafe.user) {
        setUserData(WebApp.initDataUnsafe.user as UserData);
        setIsLoading(false); // Final loading if data get
      } else {
        console.warn('No user data found');
        setIsLoading(false); // Final loading if data is not loaded
      }
    }, 1000); // Delay 1 sec

    return () => clearTimeout(timer); // Clear timer
  }, []);

  // Increase counter and Saver
  const handleButtonClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>{userData ? userData.first_name : 'Player'}</h1>
      <div className="card">
        <button onClick={handleButtonClick}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;