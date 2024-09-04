import React from 'react';
import { Link } from 'react-router-dom';

const PropriedadeItem = ({ propriedade, propriedadeSelecionada, handlePropriedadeClick }) => {
    return (
        <div 
            className={`propriedade-item ${propriedade.id === propriedadeSelecionada ? 'expanded' : ''}`}
            onClick={() => handlePropriedadeClick(propriedade.id)}
        >
            <h3>{propriedade.nome}</h3>
            {propriedade.id === propriedadeSelecionada && (
                <div className="talhoes-detalhes">
                    <h4>Detalhes da Propriedade:</h4>
                    <p>Localização: {propriedade.localizacao}</p>
                    <p>Área Total: {propriedade.areaTotal} ha</p>
                    <h4>Talhões:</h4>
                    {propriedade.talhoes && propriedade.talhoes.length > 0 ? (
                        propriedade.talhoes.map(talhao => (
                            <Link 
                                to={`/mapapropriedade?talhaoId=${talhao.id}`}
                                key={talhao.id} 
                                className="talhao-item"
                            >
                                {talhao.nome} - Área: {talhao.area} ha
                            </Link>
                        ))
                    ) : (
                        <p>Nenhum talhão cadastrado para esta propriedade.</p>
                    )}
                </div>
            )}
            <div className="expand-icon">
                {propriedade.id === propriedadeSelecionada ? '-' : '+'}
            </div>
        </div>
    );
};

export default PropriedadeItem;
