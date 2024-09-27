import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import './Topbar.css';
import Optionsbar from './Optionsbar';
import Profile from './Profile';  

const Topbar = () => {
    const [estadoMenu, setEstado] = useState(false);
    const [buttonActive, setButtonActive] = useState(false);

    useEffect(() => {
        // Ajusta o padding-top do body quando a top bar está presente
        document.body.style.paddingTop = '10vh'; // Ajuste para a altura real da top bar

        return () => {
            // Remove o padding-top quando o componente for desmontado
            document.body.style.paddingTop = '0';
        };
    }, []);

    const exibirMenu = () => {
        setEstado(!estadoMenu);
        setButtonActive(!buttonActive);
    };

    return (
        <div>
            <div className="topBar">
                <div onClick={exibirMenu} className={`menu-opcao ${estadoMenu ? 'active' : ''}`}>
                    <div className="line1"></div>
                    <div className="line2"></div>
                    <div className="line3"></div>
                </div>
                <Link to="/" className="linklogo">
                    <img className="logo" src={Logo} alt="Logotipo. Drone sobrevoando plantação" />
                </Link>
                <Profile />  
            </div>
            <Optionsbar buttonActive={buttonActive} />
        </div>
    );
};

export default Topbar;
