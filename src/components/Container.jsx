import React, {useEffect, useState} from 'react';
import Stake from './Stake';
import Bond from './Bond';
import Toast from './Toast';
import { Routes, Route } from 'react-router-dom';
import {Context} from '../context/Context'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCoins, faBars} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import '../App.css';

// 받을때 children 객체를 받는다.
function Container({ active, setActive }) {
    const {connectWallet, currentAccount, setCBR, setsCBR} = React.useContext(Context)
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
		<div onClick={e => {e.stopPropagation();}} id="container" className="fixed z-20 overflow-hidden inset-0 pt-14 md:pt-20 w-full h-full bg-green-100 md:relative md:w-0 md:flex-grow">
      
			{/*navbar*/}
			<div className="fixed flex inset-0 justify-between items-center font-light inset-0 z-10 h-14 md:h-20 w-screen bg-white bg-transparent p-2 md:p-6">
				<div
					onClick={() => {
						setActive(!active);
					}}
					className="bg-slate-50 shadow-lg bg-opacity-50 lg:invisible lg-cursor-pointer flex items-center justify-center hover:bg-slate-200 w-10 h-10 rounded-md"
				>
                    <FontAwesomeIcon className="text-xl" icon={faBars}/>
                </div>
                <div className="flex space-x-2 items-center">
                    <div onMouseEnter={() => setTokenMenu(true)}
        onMouseLeave={() => setTokenMenu(false)} className="shadow-lg hover:bg-slate-200 cursor-pointer bg-slate-50 space-x-1 rounded-md p-2 h-10 flex items-center justify-center font-normal text-xl bg-opacity-50">
                        <img className="w-8" alt="" src="img/token.svg"/>
                        <div className={`${!tokenMenu && "invisible opacity-0"} shadow-lg transition-all duration-500 absolute translate-y-24 rounded-md z-20 w-36 bg-white bg-opacity-95`}>
                            
                            <div className="text-xl p-2">
                                <div className="flex justify-around items-center p-2 rounded-lg hover:bg-slate-200 hover:text-slate-600">
                                    <FontAwesomeIcon icon={faCoins}/>
                                    <p className="text-base font-normal">Get CBR</p>
                                </div>
                                <div onClick={()=>{setCBR()}} className="flex justify-around items-center p-2 rounded-lg hover:text-slate-600 hover:bg-slate-200">
                                    <FontAwesomeIcon icon={faCoins}/>
                                    <p className="text-base font-normal">Add CBR</p>
                                </div>
                                <div onClick={()=>{setsCBR()}} className="flex justify-around items-center p-2 rounded-lg hover:text-slate-600 hover:bg-slate-200">
                                    <FontAwesomeIcon  icon={faCoins}/>
                                    <p className="text-base font-normal">Add sCBR</p>
                                </div>
                            </div>
                            <div>
                                
                            </div>

                        </div>
                        
                    </div>
                    {currentAccount ? (<div onClick={() => {
                            setShowToast(!showToast);
                        }} className="bg-slate-50 rounded-md p-2 px-4 flex items-center space-x-2 px font-normal text-gray-700 text-s shadow-lg bg-opacity-50">
                        <img className="w-6 h-6" alt="" src="img/metamask.svg"/><p>{userName}</p>
                    </div>) : (<div onClick={() => {
                            connectWallet();
                        }} className="hover:bg-slate-300 cursor-pointer flex items-center space-x-2 h-10 rounded-md p-2 bg-slate-50 shadow-lg font-normal text-s bg-opacity-50">
                        <img className="w-10" alt="" src="img/wallet3.svg"/>
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
