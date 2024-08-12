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
  const [count, setCount] = useState<number | null>(null); // Счётчик
  const [userData, setUserData] = useState<UserData | null>(null);

  // Функция для загрузки данных из облачного хранилища
  const loadCloudData = async () => {
    try {
      const result = await WebApp.cloudStorage.get('clickCount');
      if (result) {
        setCount(parseInt(result)); // Установить загруженное значение
      } else {
        setCount(0); // Установить 0, если данных нет
      }
    } catch (error) {
      console.error('Failed to load cloud data:', error);
      setCount(0); // Установить 0 в случае ошибки
    } finally {
      setIsLoading(false); // Завершить загрузку после получения данных
    }
  };

  // Функция для сохранения данных в облачное хранилище
  const saveCloudData = async (newCount: number) => {
    try {
      await WebApp.cloudStorage.set('clickCount', newCount.toString());
    } catch (error) {
      console.error('Failed to save cloud data:', error);
    }
  };

  // Функция для загрузки данных пользователя
  const loadUserData = () => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  };

  // Загрузка всех данных
  useEffect(() => {
    const loadAppData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Задержка 1 секунда
      loadUserData(); // Загрузка данных пользователя
      await loadCloudData(); // Загрузка счётчика
    };

    loadAppData();
  }, []);

  // Сохранение данных в облачное хранилище при изменении счётчика
  useEffect(() => {
    if (count !== null) {
      saveCloudData(count);
    }
  }, [count]);

  // Увеличение счётчика и сохранение
  const handleButtonClick = () => {
    setCount((prevCount) => {
      const newCount = prevCount !== null ? prevCount + 1 : 1;
      saveCloudData(newCount); // Сохранить новое значение
      return newCount;
    });
  };

  if (isLoading || count === null) {
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
