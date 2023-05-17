import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Calendars from './components/Calendar';
import Home from './components/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route >
          <Route path="/" element={<Home />} />
          <Route path="/calendars/:hrId" element={<Calendars />} />
          {/* <Route path="/products/:productID" element={<SingleProduct />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
