import React from 'react'
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Zap = () => {
    return (
        <div className="p-1 flex space-y-4 flex-col">
            <div className='w-full flex flex-col p-4 bg-gray-100 rounded-lg max-w-3xl m-auto'>
                <h2 className="mb-3 font-extrabold text-lg">Zap</h2>
                <div className='flex justify-center items-center m-auto space-x-5 m-5'>
                    <div className='bg-gray-300 border-2 border-slate-400 flex justify-center items-center hover:bg-slate-300 cursor-pointer rounded-full p-2'>
                        <img
                                className="w-9 h-9"
                                src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022"
                                alt="description of ge"
                            />
                    </div>
                    <div className='bg-gray-300 hover:bg-slate-300 cursor-pointer rounded-full p-2'>
                        <img
                                className="w-9 h-9"
                                src="https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=022"
                                alt="description of ge"
                            />
                    </div>
                    <div className='bg-gray-300 hover:bg-slate-300 cursor-pointer rounded-full p-2'>
                        <img
                                className="w-9 h-9"
                                src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=022"
                                alt="description of ge"
                            />
                    </div>
                    <div className='bg-gray-300 hover:bg-slate-300 cursor-pointer rounded-full p-2'>
                        <img
                                className="w-9 h-9"
                                src="https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=022"
                                alt="description of ge"
                            />
                    </div>
                    <div className='bg-gray-300 hover:bg-slate-300 cursor-pointer rounded-full p-2'>
                        <img
                                className="w-9 h-9"
                                src="img/klaytntrans.png"
                                alt="description of ge"
                            />
                    </div>
                </div>
                <h1 className='ml-10 text-sm text-gray-500'>You Pay</h1>
                <div className="mt-4 m-auto mb-4 w-full rounded-lg h-14 max-w-2xl hover:rounded-md flex items-center text-2xl bg-gray-200 pl-6 hover:border-gray-400 border-solid border border-gray-200">
                    <input
                        placeholder=""
                        type="number"
                        step="0.1"
                        className="outline-none placeholder-slate-700 text-gray-600 bg-gray-200 h-full w-1 flex-grow"
                                />
                                
                    <p className="pl-2 pr-2 text-sm text-gray-600 bg-gray-200">ETH</p>    
                </div>
                <FontAwesomeIcon className='m-4' icon={faArrowDown}/>
                <h1 className='ml-10 text-sm text-gray-500'>You Get</h1>
                <div className="m-auto mb-1 w-full rounded-lg h-14 max-w-2xl hover:rounded-md flex items-center text-2xl bg-gray-200 pl-6 hover:border-gray-400 border-solid border border-gray-200">
                    <input
                        placeholder=""
                        type="number"
                        step="0.1"
                        className="outline-none placeholder-slate-700 text-gray-600 bg-gray-200 h-full w-1 flex-grow"
                                />
                                
                    <p className="pl-2 pr-2 text-sm text-gray-600 bg-gray-200">sVTR</p>    
                </div>
                <div className="m-auto mt-10 mb-7 cursor-pointer hover:bg-slate-500 hover:text-black transition-all duration-400 text-center bg-slate-400 py-2 px-20 text-white text-lg font-normal rounded-lg">
                    Approve
                </div>
            </div>  
        </div>
    )
}

export default Zap
