import React, { useContext } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import NavContext from '../../context/NavContext';

const TopNavbar = () => {
    const nav = useContext(NavContext);
    return (
    <>
        <div className='fixed h-12 w-full z-[95]'>
            <nav className="w-full h-full bg-darkGray text-activeFontColor font-roboto text-2xl">
                <div className='flex h-full w-full'>
                    <div className='pt-1 pl-1'>
                        <div className='flex hover:cursor-pointer hover:bg-lightGray rounded-full w-10 h-10 justify-center items-center'>
                            <GiHamburgerMenu onClick={()=>nav.setShowSidebar(!nav.showSidebar)} className='h-12'/>
                        </div>
                    </div>
                    <div className='space-x-5 h-full w-full flex items-center'>
                        <div className='flex w-full justify-end space-x-2 pr-2'>
                            <button onClick={()=>nav.setLoginOpen(!nav.isLoginOpen)} className='text-center w-32 rounded-3xl hover:bg-lightGray hover:cursor-pointer'>Login</button>
                            <button onClick={()=>nav.setLoginOpen(!nav.isLoginOpen)} className='text-center w-32 rounded-3xl hover:bg-lightGray hover:cursor-pointer'>Sign up</button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </>
  );
};

export default TopNavbar;
