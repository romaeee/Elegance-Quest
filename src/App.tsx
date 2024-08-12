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

  // Функция для загрузки числа кликов из cloudStorage
  const loadClickCount = async () => {
    try {
      const data = await WebApp.cloudStorage.get('clickCount');
      if (data !== null) {
        setCount(parseInt(data));
      }
    } catch (error) {
      console.error('Failed to load click count:', error);
    }
  };

  // Функция для сохранения числа кликов в cloudStorage
  const saveClickCount = async (count: number) => {
    try {
      await WebApp.cloudStorage.set('clickCount', count.toString());
    } catch (error) {
      console.error('Failed to save click count:', error);
    }
  };

  // Сохранение числа кликов при изменении
  useEffect(() => {
    saveClickCount(count);
  }, [count]);

  // Получение данных пользователя из Telegram WebApp и загрузка числа кликов
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }

    // Загрузка числа кликов из cloudStorage
    loadClickCount().finally(() => {
      setIsLoading(false);
    });

    // Очистка эффекта при размонтировании компонента
    return () => {};
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
    </>
  );
}

export default App;