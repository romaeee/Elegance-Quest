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
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [count, setCount] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Загрузка данных из облачного хранилища
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

  // Сохранение данных в облачное хранилище
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

  // Загрузка данных пользователя с задержкой в 1 секунду
  useEffect(() => {
    const timer = setTimeout(() => {
      if (WebApp.initDataUnsafe.user) {
        setUserData(WebApp.initDataUnsafe.user as UserData);
        setIsLoading(false); // Завершить загрузку, когда данные получены
      } else {
        console.warn('No user data found');
        setIsLoading(false); // Завершить загрузку даже если данные не найдены
      }
    }, 1000); // Задержка 1 секунда

    return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
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
    </>
  );
}

export default App;
