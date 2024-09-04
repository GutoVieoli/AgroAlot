import React from 'react';
import { Link } from 'react-router-dom';
import './OptionsBar.css';

const Optionsbar = ({ buttonActive }) => {
    return (
        <div className={`barra-opcoes ${buttonActive ? "active" : "inactive"}`}>
            <div className="header">
                <h2>Talhões</h2>
            </div>
            <Link to="/add-talhao" className="add-talhao-btn">
                + Adicionar Talhão
            </Link>
        </div>
        

    );
};

export default Optionsbar;
