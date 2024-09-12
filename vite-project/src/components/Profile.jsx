import React, { useState, useEffect } from 'react';
import './Profile.css';
import Perfil from '../assets/Perfil.svg';

const Profile = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userData, setUserData] = useState({ name: '', email: '' });

    
    useEffect(() => {
        
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3000/user'); // back
                const data = await response.json();
                setUserData({ name: data.name, email: data.email });
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        fetchUserData(); 
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        // logica do logout
       
    };

    return (
        <div className="profile-container" onClick={toggleMenu}>
            <img src={Perfil} alt="Perfil do Usuário" className="profile-pic" />
            
            {isMenuOpen && (
                <div className="profile-menu">
                    <ul>
                        <li>Nome: {userData.name}</li>
                        <li>Email: {userData.email}</li>
                        <li>
                            <button className="edit-account-btn">Editar Conta</button>
                        </li>
                        <li>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Profile;
