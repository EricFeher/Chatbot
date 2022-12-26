import React, { useContext } from 'react'
import { MdClose } from 'react-icons/md'
import NavContext from '../context/NavContext';

const Login = () => {
    const nav = useContext(NavContext);
    return (
        <>{nav.isLoginOpen ? 
            <>
            <div className='fixed top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 z-[101]'>
                <div className='w-full h-full flex items-center justify-center'>
                    <div className='bg-lightGray bg-opacity-100 w-52 h-36 border text-activeFontColor space-y-3 z-[101]'>
                        <div className='flex justify-end pr-1 pt-1' onClick={()=> nav.setLoginOpen(!nav.isLoginOpen)}>
                            <MdClose className='fill-activeFontColor hover:cursor-pointer hover:bg-darkGray rounded-full'/>
                        </div>
                        <div className='w-full justify-center flex'>
                            <h2 className='font-medium text-2xl'>Connect With</h2>
                        </div>
                        <div className='w-full justify-center flex'>
                            <a href="https://www.twitch.tv  ">
                                <div className='flex justify-center space-x-3 text items-center w-36 h-8 rounded-xl bg-tpurple cursor-pointer hover:bg-tpurpleActive'>
                                    <img src="/assets/images/twitchlogo.png" alt="Twitch" className='w-6 h-6'/>
                                    <span>Twitch</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className='fixed w-screen h-screen z-[100] bg-black bg-opacity-60' onClick={()=> nav.setLoginOpen(!nav.isLoginOpen)}></div>
            </>
            : (<></>)}
        </>
    )
}

export default Login