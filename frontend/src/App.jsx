import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SalesOrder from './pages/SalesOrder';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/order" element={<SalesOrder />} />
      <Route path="/order/:id" element={<SalesOrder />} />
    </Routes>
  );
}

export default App;