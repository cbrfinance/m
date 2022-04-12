import React, {useEffect, useState}from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

const Toast = () => {
    const [first, setFirst] = useState(false);
    const [show, setShow] = useState(true);

    useEffect(() => {
        setFirst(true)
        setTimeout(() => {
            setFirst(false);
          }, 3000);
          setTimeout(() => {
            setShow(false);
          }, 4000);
      }, []);
    return (
        show &&
        (<div className={`inset-0 left-1/2 absolute flex items-center translate-y-5 bg-green-300 shadow-xl p-4 -translate-x-2/4 rounded-sm justify-center w-72 h-12 z-50 space-x-4 ${first? 'translate-y-5' : '-translate-y-28'} transition-all duration-700`}>
            <FontAwesomeIcon icon={faCircleCheck} size="2x" color="white" />
            <p className="text-white">
                Transaction completed
            </p>
        </div>)
        
    )
}

export default Toast
