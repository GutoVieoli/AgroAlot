import { useState } from 'react'
import { Link } from 'react-router-dom'

import Logo from '../assets/Logo.svg'
import Perfil from '../assets/Perfil.svg'
import './Topbar.css'
import Optionsbar from './Optionsbar'

const Topbar = () => {
    
    const [estadoMenu, setEstado] = useState(false);
    const [buttonActive, setButtonActive] = useState(false);

    const exibirMenu = () => {
        const botton = document.querySelector('.menu-opcao');

        if(estadoMenu === false){
            botton.classList.add('active');
            setEstado(true);
            setButtonActive(true);
        } else {
            botton.classList.remove('active');
            setEstado(false);
            setButtonActive(false);
        }
    }

    return (
        <div>
            <div className='topBar'>
                <div onClick={exibirMenu} className="menu-opcao">
                    <div className="line1"></div>
                    <div className="line2"></div>
                    <div className="line3"></div>
                </div>
                <Link to='/' className='linklogo'>
                    <img className='logo' src={Logo} alt='Logotipo. Drone sobevoando plantação' />
                </Link>
                <img className='perfil' src={Perfil} alt='Logotipo do perfil do usuario' />
            </div>
            <Optionsbar buttonActive={buttonActive} />

        </div>
    )
}

export default Topbar