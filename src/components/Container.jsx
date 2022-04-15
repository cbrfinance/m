import React, {useEffect, useState} from 'react';
import Stake from './Stake';
import Bond from './Bond';
import Toast from './Toast';
import { Routes, Route } from 'react-router-dom';
import {Context} from '../context/Context'
import '../App.css';

// 받을때 children 객체를 받는다.
function Container({ active, setActive }) {
    const {connectWallet, currentAccount, setCBRs} = React.useContext(Context)
    const [userName, setUserName] = React.useState()
    const [showToast, setShowToast] = useState(true)
    const [toastType, setToastType] = useState("welcome")
    const [tokenMenu, setTokenMenu] = useState(false)
 
    

    useEffect(() => {
        if (currentAccount) {
              setUserName(
                `${currentAccount.slice(0, 7)}...${currentAccount.slice(38)}`,
              )
      }}, [currentAccount])


	return (
		<div onClick={e => {e.stopPropagation();}} id="container" className="fixed z-10 overflow-hidden inset-0 pt-14 md:pt-20 w-full h-full bg-green-100 md:relative md:w-0 md:flex-grow">
      
			{/*navbar*/}
			<div className="fixed flex inset-0 justify-between items-center font-light inset-0 z-10 h-14 md:h-20 w-screen bg-white bg-transparent p-2 md:p-6">
				<div
					onClick={() => {
						setActive(!active);
					}}
					className="bg-slate-50 w-10 h-10 rounded-md"
				/>
                <div className="flex space-x-2 items-center">
                    <div onMouseEnter={() => setTokenMenu(true)}
        onMouseLeave={() => setTokenMenu(false)}onClick={() => {
						setCBRs();
					}} className="hover:bg-slate-200 cursor-pointer bg-slate-50 rounded-md w-10 h-10 px-4 px font-normal text-s bg-opacity-50">
                        <div className={`${!tokenMenu && "invisible opacity-0"} transition-all duration-500 absolute -translate-x-4 translate-y-11 rounded-md z-20 h-40 w-24 bg-white bg-opacity-50`}>

                        </div>
                        
                    </div>
                    {currentAccount ? (<div onClick={() => {
                            setShowToast(!showToast);
                        }} className="bg-slate-50 rounded-md p-2 px-4 px font-normal text-gray-700 text-s bg-opacity-50">
                        {userName}
                    </div>) : (<div onClick={() => {
                            connectWallet();
                        }} className="hover:bg-slate-300 cursor-pointer bg-slate-50 h-10 rounded-md p-2 px-4 px font-normal text-s opacity-25">
                        Connect
                    </div>)}
                                    
                </div>
				
			</div>
			{/*navbar*/}

			<div
				id="content"
				className="px-3 absolute bg-transparent overflow-auto h-full pb-14 md:pb-20 w-full"
			>
        
				<Routes>
					<Route path="/" element={<Stake showToast={showToast} setShowToast={setShowToast} setToastType={setToastType}/>} />
					<Route path="/Stake" element={<Stake showToast={showToast} setShowToast={setShowToast} setToastType={setToastType}/>} />
					<Route path="/Bond" element={<Bond />} />
				</Routes>

        
			</div>
            {<Toast showToast={showToast} toastType={toastType}/>}
		</div>
	);
}

export default Container;
