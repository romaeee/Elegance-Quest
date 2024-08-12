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

    const loadAppData = async () => {
      await loadCloudData(); // Load cloud data first
      if (WebApp.initDataUnsafe.user) {
        setUserData(WebApp.initDataUnsafe.user as UserData);
      }
      setIsLoading(false); // Finish loading after all data is retrieved
    };

    // Wait 1 second before starting to load data
    const timer = setTimeout(loadAppData, 1000); 

    return () => clearTimeout(timer); // Clear timer
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