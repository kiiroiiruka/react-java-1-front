import { Route, Routes } from 'react-router-dom';
import SettingPages from './pages/SettingPages';

function App() {
  return (
    <Routes>
      <Route path="/*" element={<SettingPages />} />
    </Routes>
  );
}

export default App;
