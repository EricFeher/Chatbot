import React, { useState } from 'react';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import Login from '../Login';
import NavContext from './../../context/NavContext';


const Navbar = () => {

    const [showSidebar, setShowSidebar] = useState(false);
    const [isLoginOpen, setLoginOpen] = useState(false);
    

    return (
    <>
      <NavContext.Provider value={{showSidebar,setShowSidebar,isLoginOpen,setLoginOpen}}>
          <Login/>
          <TopNavbar/>
          <Sidebar/>
      </NavContext.Provider>
      <div className='h-12'></div>
          
    </>
  );
};

export default Navbar;
