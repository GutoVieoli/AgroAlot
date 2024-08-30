import './OptionsBar.css';
import { useState } from 'react';

const Optionsbar = ({ buttonActive, talhoes }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={`barra-opcoes ${buttonActive ? "active" : "inactive"}`}>
            <div className="header" onClick={toggleExpand}>
                <h2>Talhões</h2>
                <span className={`arrow ${expanded ? "down" : "right"}`}></span>
            </div>
            {expanded && (
                <div className="talhoes-list">
                    {talhoes.map((talhao, index) => (
                        <div key={index} className="talhao-item">
                            <span>{talhao}</span>
                        </div>
                    ))}
                </div>
            )}
            <button className="add-talhao-btn">
                + Adicionar Talhão
            </button>
        </div>
    );
};

export default Optionsbar;
