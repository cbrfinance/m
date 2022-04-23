import React, { useEffect, useState } from 'react';
import {faX, faGear} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {Context} from '../context/Context'

function BondModal(pair) {
	const [first, setFirst] = useState(false);
    const [setting, setSetting] = useState(false);
    const [slippage, setSlippage] = useState();
    const {connectWallet, currentAccount} = React.useContext(Context);

    const onSlippageChange = (e) => {
        setSlippage(e.target.value);
    }

	useEffect(() => {
		setFirst(true);
	}, []);
	return (
		<div
			onClick={e => {
				pair.setActive(!pair.active);
				e.stopPropagation();
			}}
			className="fixed inset-0 z-50 h-full w-screen bg-black/60 backdrop-blur"
		>
			<div
				onClick={e => {
					e.stopPropagation();
				}}
				className={`relative shadow-lg shadow-black p-3 top-1/2 -translate-y-1/2 inset-0 w-11/12 m-auto bg-gray-100 rounded-xl max-w-2xl ${
					first ? 'scale-100' : 'scale-0'
				} transition-all duration-500`}
			>
                {setting ? (
                <>
                    <div className="flex justify-between items-center p-5">
                        <div  />
                        <p>Adjust Slippage</p>
                        <FontAwesomeIcon icon={faX} onClick={()=>{setSetting(false)}} className="cursor-pointer hover:text-slate-400"/>
                    </div>
                    <div className="px-5 flex flex-col items-center w-full">
                        <p className="text-slate-500 text-sm mb-5">
                            Important: Recommended slippage is 1-5% to avoid a failed transaction.
                        </p>
                        <div className="w-full h-12 rounded-md flex items-center text-2xl bg-gray-200 px-6">
                            <input
                                placeholder=""
                                type="number"
                                step="0.1"
                                value={slippage}
                                onChange={(e) => onSlippageChange(e)}
                                className="outline-none placeholder-slate-700 text-gray-600 bg-gray-200 h-12 w-1 flex-grow"
                            />
                            <p className="pl-2 text-gray-600 bg-gray-200">%</p>
                        </div>
                        <div className="flex w-full justify-between space-x-5 m-5">
                            <div onClick={()=>{setSlippage(1.0)}}className="rounded-md transition-all duration-200 hover:bg-slate-600 cursor-pointer hover:text-black text-center text-white bg-slate-400 p-2 flex-1">1%</div>
                            <div onClick={()=>{setSlippage(2.0)}} className="rounded-md transition-all duration-200 hover:bg-slate-600 cursor-pointer hover:text-black text-center text-white bg-slate-400 p-2 flex-1">2%</div>
                            <div onClick={()=>{setSlippage(3.0)}} className="rounded-md transition-all duration-200 hover:bg-slate-600 cursor-pointer hover:text-black text-center text-white bg-slate-400 p-2 flex-1">3%</div>
                            <div onClick={()=>{setSlippage(4.0)}} className="rounded-md transition-all duration-200 hover:bg-slate-600 cursor-pointer hover:text-black text-center text-white bg-slate-400 p-2 flex-1">4%</div>
                            <div onClick={()=>{setSlippage(5.0)}} className="rounded-md transition-all duration-200 hover:bg-slate-600 cursor-pointer hover:text-black text-center text-white bg-slate-400 p-2 flex-1">5%</div>
                        </div>
                        <div onClick={()=>{setSetting(false)}} className="bg-slate-300 rounded-md px-7 py-2 text-center text-gray-600 cursor-pointer hover:bg-slate-600 hover:text-white transition-all duration-200">
                            Adjust Slippage
                        </div>
                    </div>
                </>) : (
                <>
                    <div className="mb-4 flex justify-between">
                        <div
                            className="cursor-pointer text-slate-700 hover:text-slate-400"
                            onClick={() => {
                                pair.setActive(!pair.active);
                            }}
                        >
                            <FontAwesomeIcon icon={faX}/>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <img className="w-9 h-9" src={pair.token1img} alt="description of ge"/>
                                <img
                                    className="relative transform -translate-x-3 w-9 h-9"
                                    src={pair.token2img}
                                    alt="description of ge"
                                />
                                <p className="text-lg font-semibold -translate-x-2">
                                    {pair.token1}-{pair.token2} LP
                                </p>
                            </div>
                        </div>
                        <div onClick={()=>{setSetting(true)}} className="text-slate-700 hover:text-slate-400 cursor-pointer">
                            <FontAwesomeIcon icon={faGear} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-sm">Fixed Term</p>
                        <p className="-m-1 text-sm">2 days</p>
                        <div className="w-full flex justify-around">
                            <div>
                                <p className="text-lg text-gray-500">Bond Price</p>
                                <p className="text-center text-2xl font-bold">$36.80</p>
                            </div>
                            <div>
                                <div>
                                    <p className="text-lg text-gray-500">Market Price</p>
                                    <p className="text-center text-2xl font-bold">$35.81</p>
                                </div>
                            </div>
                        </div>
                        {!currentAccount && (<><div onClick={()=>{connectWallet()}} className="cursor-pointer bg-slate-400 hover:bg-slate-500 transition-all duration-200 hover:text-black py-3 px-12 text-white text-lg font-normal m-4 rounded-lg">
							Connect Wallet
						</div>
						<p className="font-light text-sm">
							Connect your wallet to bond
                           
						</p></>)}
                        <div className="flex flex-col space-y-2 w-full p-4 text-sm">
                            <div className="flex justify-between">
                                <p>Your Balance</p>
                                <p>
                                    3.245 {pair.token1}-{pair.token2} LP
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p>You Will Get</p>
                                <p>0.0000 sOHM</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Discount</p>
                                <p>2.4%</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Duration</p>
                                <p>2 days</p>
                            </div>
                        </div>
                    </div>
                </>)}
				
			</div>
		</div>
	);
}
export default BondModal;
