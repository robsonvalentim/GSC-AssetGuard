import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MovementProvider } from './contexts/MovementContext';
import { Home } from './pages/Home';
import { Checkout } from './pages/Checkout';
import { Checkin } from './pages/Checkin';

function App() {
  return (
    <MovementProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkin" element={<Checkin />} />
        </Routes>
      </BrowserRouter>
    </MovementProvider>
  );
}

export default App;