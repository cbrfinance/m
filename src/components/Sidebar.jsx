import React, { useState } from 'react';
import { Link } from 'react-router-dom'

function Sidebar({active, setActive}) {

  
	return (
     <div onClick={(e)=>{setActive(!active); e.stopPropagation(); }} className={`fixed z-10 w-screen h-screen bg-black/60 backdrop-blur ${active ? 'opacity-100 ease-in' : 'w-0'} lg:relative lg:w-80`}>

       
         <div id="sidebar" onClick={(e) => {e.stopPropagation();}} id="content" className={`p-4 font-bold fixed w-80 h-screen bg-slate-50 overflow-auto ${active ? 'shadow-xl shadow-black translate-x-0 ease-in' : '-translate-x-full ease-out'} duration-200 lg:relative lg:transform-none md:shadow-none`}
  			>
           {/*contents*/}
          <div className="h-60 w-full flex">
            <h3 className="m-auto text-6xl">COBRA</h3>
          </div>
          <ul className="gap-2 font-normal">
            <li className="p-2">DashBoard</li>
            <Link onClick={()=>{setActive(!active)}} to='/Bond'><li className="p-2 hover:bg-gray-200 rounded-lg">Bond</li></Link>
            <Link onClick={()=>{setActive(!active)}} to='/Stake'><li className="p-2 hover:bg-gray-200 rounded-lg">Stake</li></Link>
            <li className="p-2">Zap</li> 
          </ul>
           <div className="my-5 border-solid border-1 border-t border-gray-300"></div>
           <ul className="gap-2 font-normal">
            <li className="p-2">Docs</li>
            <li className="p-2">Governance</li>
            <li className="p-2">Bug Bounty</li>
          </ul>


           
            
          
           {/*contents*/}
         </div>  
      </div>
	);
}

export default Sidebar;