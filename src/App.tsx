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

  useEffect(() => {
    const loadClickCount = async () => {
      try {
        const savedData = await WebApp.cloudStorage.get('clickCount');
        if (savedData && savedData.clickCount !== undefined) {
          setCount(parseInt(savedData.clickCount));
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных из CloudStorage:', error);
      } finally {
        setIsLoading(false); // Ставим false только после попытки загрузки данных
      }
    };

    loadClickCount();
  }, []);

  useEffect(() => {
    const saveClickCount = async () => {
      try {
        await WebApp.cloudStorage.set('clickCount', count.toString());
      } catch (error) {
        console.error('Ошибка при сохранении данных в CloudStorage:', error);
      }
    };

    if (!isLoading) {
      saveClickCount(); // Сохраняем данные только после того, как закончится загрузка
    }
  }, [count, isLoading]);

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
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
      <p>var 5</p>
    </>
  );
}

export default App;