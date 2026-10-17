import { Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import SettingPages from './pages/SettingPages';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/*" element={<SettingPages />} />
    </Routes>
  );
}

export default App;
