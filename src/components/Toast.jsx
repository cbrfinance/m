import React, {useEffect, useState}from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {} from "@fortawesome/free-solid-svg-icons";
import {faHandshake, faCircleCheck, faCircleXmark, faPaperPlane} from "@fortawesome/free-regular-svg-icons";

const Toast = ({toastType}) => {
    const[first, setFirst] = useState(false)
    
    useEffect(() => {
        setFirst(true)
        setTimeout(() => {
            setFirst(false);
          }, 3000);
          
      },[toastType]);
    return (
        (<div className={`inset-0 left-1/2 absolute flex items-center translate-y-5 ${((toastType==="success" || toastType==="welcome")  && 'bg-green-300') || (toastType==="submit"  && 'bg-blue-300') || (toastType==="fail" && 'bg-red-300') } shadow-xl p-4 -translate-x-2/4 rounded-sm justify-center w-72 h-12 z-50 space-x-4 ${first? 'translate-y-5' : '-translate-y-28'} transition-all duration-700`}>
            <FontAwesomeIcon icon={(toastType==="welcome" && faHandshake) || (toastType==="success" && faCircleCheck) || (toastType==="submit" && faPaperPlane) || (toastType==="fail" && faCircleXmark)} size="2x" color="white" />
            <p className="text-white">
            {toastType==="welcome" && "Welcome back"}
                {toastType==="success" && "Transaction successful"}
                {toastType==="submit" && "Transaction submited"}
                {toastType==="fail" && "Transaction failed"}
            </p>
        </div>)
        
    )
}

export default Toast
