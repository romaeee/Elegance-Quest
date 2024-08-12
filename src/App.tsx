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

  // Загрузка числа кликов из CloudStorage
  useEffect(() => {
    const loadClickCount = async () => {
      try {
        const result = await WebApp.cloudStorage.get('clickCount');
        if (result) {
          setCount(parseInt(result));
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных из CloudStorage:', error);
      } finally {
        setIsLoading(false); // Снимаем состояние загрузки после загрузки данных
      }
    };

    loadClickCount();
  }, []);

  // Сохранение числа кликов в CloudStorage
  useEffect(() => {
    const saveClickCount = async () => {
      try {
        await WebApp.cloudStorage.set('clickCount', count.toString());
      } catch (error) {
        console.error('Ошибка при сохранении данных в CloudStorage:', error);
      }
    };

    saveClickCount();
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
      <p>var 1</p>
    </>
  );
}

export default App;
