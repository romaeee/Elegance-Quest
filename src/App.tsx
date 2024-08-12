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
  const [isLoading, setIsLoading] = useState(true); // Состояние для экрана загрузки
  const [count, setCount] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Сохранение числа кликов в CloudStorage
  useEffect(() => {
    WebApp.cloudStorage.setItem('clickCount', count.toString())
      .catch(err => console.error('Failed to save count to CloudStorage:', err));
  }, [count]);

  // Загрузка числа кликов из CloudStorage
  useEffect(() => {
    WebApp.cloudStorage.getItem('clickCount')
      .then(savedCount => {
        if (savedCount !== null) {
          setCount(parseInt(savedCount));
        }
      })
      .catch(err => console.error('Failed to load count from CloudStorage:', err));

    // Таймер для переключения с экрана загрузки на основной экран через 5 секунд
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Очистка таймера при размонтировании компонента
    return () => clearTimeout(timer);
  }, []);

  // Получение данных пользователя из Telegram WebApp
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  if (isLoading) {
    // Экран загрузки
    return <h1>Loading...</h1>;
  }

  // Основной экран
  return (
    <>
      <h1>{userData ? userData.first_name : 'Player'}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p>var 1</p>
    </>
  );
}

export default App;
