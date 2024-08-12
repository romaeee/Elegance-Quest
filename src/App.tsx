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
  const [count, setCount] = useState<number>(() => {
    // Загрузка числа кликов
    const savedCount = localStorage.getItem('clickCount');
    return savedCount !== null ? parseInt(savedCount) : 0;
  });

  const [userData, setUserData] = useState<UserData | null>(null);

  // Сохранение числа кликов
  useEffect(() => {
    localStorage.setItem('clickCount', count.toString());
  }, [count]);

  // Получение данных пользователя из Telegram WebApp
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }

    // Таймер для переключения с экрана загрузки на основной экран через 5 секунд
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Очистка таймера при размонтировании компонента
    return () => clearTimeout(timer);
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
      <p>var 3</p>
    </>
  );
}

export default App;