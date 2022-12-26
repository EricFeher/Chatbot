import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './component/Navigation/Navbar';
import Home from './component/Home';
import NotFound from './component/NotFound';
import Test from './component/Test/Test';
import Authentication from './component/Auth/Authentication';

function App() {

  return (
    <BrowserRouter>
      <div className="w-screen h-screen bg-lightGray">
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/test' element={<Test />} />
          <Route path='/auth' element={<Authentication />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
