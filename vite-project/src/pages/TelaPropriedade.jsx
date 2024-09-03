import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TelaPropriedade.css';
import Topbar from '../components/Topbar';

const TelaPropriedade = () => {
    const [propriedades, setPropriedades] = useState([]);
    const [propriedadeSelecionada, setPropriedadeSelecionada] = useState(null);
    const usarDadosSimulados = true;  // Se colocar false teoricamente e pra pegar os daddos do bd
    useEffect(() => {
        if (usarDadosSimulados) {
            carregarDadosSimulados();
        } else {
            carregarPropriedadesDoBackend();
        }
    }, []);

    // usei de exemplo
    const carregarDadosSimulados = () => {
        const dadosSimulados = [
            { id: 1, nome: 'Fazenda Boa Vista', localizacao: 'Alfenas, MG', areaTotal: 500, talhoes: [
                { id: 1, nome: 'Talhão 1', area: 15 },
                { id: 2, nome: 'Talhão 2', area: 20 }
            ]},
            { id: 2, nome: 'Sítio Santa Cruz', localizacao: 'Varginha, MG', areaTotal: 300, talhoes: [
                { id: 3, nome: 'Talhão A', area: 10 },
                { id: 4, nome: 'Talhão B', area: 25 }
            ]}
        ];
        setPropriedades(dadosSimulados);
    };

    // aqui é teoricamente funcionando com o back
    const carregarPropriedadesDoBackend = async () => {
        try {
            const response = await fetch('http://localhost:3000/propriedades'); 
            setPropriedades(data);
        } catch (error) {
            console.error('Erro ao carregar propriedades:', error);
        }
    };

    const handlePropriedadeClick = async (propriedadeId) => {
        if (propriedadeSelecionada === propriedadeId) {
            setPropriedadeSelecionada(null); 
            if (usarDadosSimulados) {
                // Encontre os talhões simulados
                const propriedadeSelecionada = propriedades.find(p => p.id === propriedadeId);
                setPropriedadeSelecionada(propriedadeId);
            } else {
                try {
                    const response = await fetch(`http://localhost:3000/propriedades`); 
                    const data = await response.json();
                    const propriedadesAtualizadas = propriedades.map(propriedade => 
                        propriedade.id === propriedadeId ? { ...propriedade, talhoes: data } : propriedade
                    );
                    setPropriedades(propriedadesAtualizadas);
                    setPropriedadeSelecionada(propriedadeId); 
                } catch (error) {
                    console.error('Erro ao carregar talhões:', error);
                }
            }
        }
    };

    return (
        <div>
            <Topbar />
            <div className="tela-propriedade-container">
                <h1>Propriedades Cadastradas</h1>
                <div className="propriedades-lista">
                    {propriedades.map(propriedade => (
                        <div 
                            key={propriedade.id} 
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TelaPropriedade;
