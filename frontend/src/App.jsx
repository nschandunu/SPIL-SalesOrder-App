import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import SalesOrder from './pages/SalesOrder';

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<SalesOrder />} />
        <Route path="/order/:id" element={<SalesOrder />} />
      </Routes>
    </>
  );
}

export default App;