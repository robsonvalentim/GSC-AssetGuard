import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Checkout } from './pages/Checkout';
import { Checkin } from './pages/Checkin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkin" element={<Checkin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;