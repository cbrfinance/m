import React, { useState, useEffect } from 'react';
import { Context } from '../context/Context'
import Loading from './Loading'


const AuctionSwap = ({ setToastType }) => {
    const [klayAmount, setKlayAmount] = useState()
    const [VTRAmount, setVTRAmount] = useState()
    const [loading, setLoading] = useState(false);
    const [genInfo, setGenInfo] = useState({})
    const [indInfo, setIndInfo] = useState({})

    const { getKlayToVTR, getAuctionSwapInfo, auctionSwap } = React.useContext(Context)

    const onKlayAmountChange = (e) => {
        if(e.target.value === ''){setKlayAmount(''); setVTRAmount('');}
        setKlayAmount(e.target.value);
        getKlayToVTR(setVTRAmount, e.target.value);
    }
    const _auctionSwap = async () =>
    {
        await auctionSwap(klayAmount, setLoading, setToastType);
        setKlayAmount('');
        setVTRAmount('');
        getAuctionSwapInfo(setGenInfo, setIndInfo)
    }
    const progressbar = {
        width: `${genInfo.percent}%`
    }
    
    useEffect(() => {
		getAuctionSwapInfo(setGenInfo, setIndInfo);
	}, [getAuctionSwapInfo]);
    return (


        <div className="p-1">


            <div className="flex flex-col items-center m-auto">
                <div className="flex space-x-2 items-center">
                    <img className="w-10" alt="" src="img/klaytntrans.png" />
                    <img className="w-9" alt="" src="https://cryptologos.cc/logos/convex-finance-cvx-logo.svg" />
                </div>
                <h1 className="text-6xl font-semibold text-stone-600 mb-10 mt-4">KLAY - VTR</h1>

                <div className="flex flex-col items-center space-y-3 md:flex-row md:items-center md:space-x-7 md:space-y-0">
                    <div className="flex flex-col items-center">
                        <p className="text-gray-100">APY</p>
                        <p className="text-gray-600 font-semibold text-2xl">26.4%</p>
                    </div>
                    <div className="hidden md:block border-solid border-1 border-l h-10 border-gray-300"></div>
                    <div className="flex flex-col items-center">
                        <p className="text-gray-100">Total Rewards</p>
                        <p className="text-gray-600 font-semibold text-2xl">500,00000 VTR</p>
                    </div>
                    <div className="hidden md:block border-solid border-1 border-l h-10 border-gray-300"></div>
                    <div className="flex flex-col items-center">
                        <p className="text-gray-100">Vesting Period</p>
                        <p className="text-gray-600 font-semibold text-2xl">30 Days</p>
                    </div>
                </div>
            </div>


            <div className="rounded-lg bg-gray-100 w-full m-auto max-w-3xl mt-14 p-5 mb-5">
                <div className="w-full">
                    <p className="text-xl"> <span className="text-stone-500 font-semibold">{genInfo.totalFund}</span><span className="text-gray-500"> KLAY SOLD</span></p>

                </div>

                <div className="relative h-6 my-4 rounded-full bg-gray-300">

                    <div id="progress" style={progressbar} className={` ${!genInfo.percent && 'w-0' } h-6 rounded-full bg-white transition-all duration-1000`}></div>
                    <h4 className="absolute text-center w-full inline h-full inset-0 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-thin text-slate-600 text-md font-semibold">
                        {genInfo.percent}%
                    </h4>
                </div>
                <p className="text-gray-500 text-sm">{genInfo.klayLeft} KLAY left / {genInfo.goal} KLAY</p>
            </div>
            <div className="rounded-lg max-w-3xl m-auto md:flex">
                <div className="flex-1 rounded-lg rounded-b-none md:rounded-r-none md:rounded-lg bg-gray-100 p-3">
                    <div className="p-3">
                        <p className="text-sm font-semibold text-stone-500 mb-4">From</p>
                        <div className="flex items-center">
                            <input
                                className="outline-none text-3xl text-gray-600 placeholder-slate-400 bg-gray-100 placeholder-font-light w-1 flex-grow"
                                type="number"
                                onChange={(e) => onKlayAmountChange(e)}
                                value={klayAmount}
                                placeholder="0"
                                step="0.0001" />
                            <img className="w-9" alt="" src="img/klaytnlogo.svg" />
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 my-4">Balance {indInfo.klayBalance}</p>
                            <p className="text-sm font-semibold">KLAY</p>
                        </div>

                    </div>
                    <div className="border-solid border-1 border-t border-gray-300"></div>
                    <div className="p-3">
                        <p className="text-sm mt-1 font-semibold text-stone-500 mb-4">To</p>
                        <div className="flex items-center">
                            <input
                                className="outline-none text-3xl text-gray-600 placeholder-slate-400 bg-gray-100 placeholder-font-light w-1 flex-grow"
                                type="number"
                                value={VTRAmount}
                                placeholder="0" />
                            <img className="w-8" alt="" src="https://cryptologos.cc/logos/convex-finance-cvx-logo.svg" />
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 my-4">Balance</p>
                            <p className="text-sm font-semibold ml-2">sCBR</p>
                        </div>
                    </div>
                </div>
                <div onClick={()=>{_auctionSwap()}}className="rounded-lg rounded-t-none md:rounded-l-none md:rounded-lg text-sm cursor-pointer hover:bg-stone-500 font-medium text-gray-100 flex justify-center items-center p-3 bg-stone-400">
                    {loading ? (<Loading className="text-sm"/>) : (<p className="text-lg">Swap</p>)}
                </div>
            </div>


            <div className="rounded-lg max-w-3xl m-auto mt-5">
                <div className="bg-gray-100 rounded-lg p-10 text-slate-800 flex-1 rounded-lg rounded-b-none bg-gray-100">
                    <div className="mb-5">
                        <p className="text-lg text-stone-500">Your Total Purchase Amount</p>
                        <p className="text-4xl font-bold">{indInfo.VTRBalance} VTR</p>
                    </div>
                </div>
                <div className="rounded-lg rounded-t-none text-2xl cursor-pointer hover:bg-neutral-500 font-medium text-gray-100 flex justify-center items-center p-3 bg-neutral-400">
                    <p>CLAIM</p>
                </div>
            </div>



        </div>
    )
}

export default AuctionSwap
