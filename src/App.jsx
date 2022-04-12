import React, { useState } from 'react';
import Sidebar from './components/Sidebar'
import Container from './components/Container'
import {Provider} from './context/Context'
import './App.css';


function App() {
	const [active, setActive] = useState(false);
	return (
        <Provider>
            <div id="wrap" className="fixed w-screen h-screen overflow-auto md:flex bg-gray-500">
                <Sidebar active={active} setActive={setActive}/>
                <Container active={active} setActive={setActive}/>
            </div>
        </Provider>
	);
}

export default App;
