import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import PropriedadeItem from '../components/PropriedadeItem';
import './TelaPropriedade.css';

const TelaPropriedade = () => {
    const [propriedades, setPropriedades] = useState([]);
    const [propriedadeSelecionada, setPropriedadeSelecionada] = useState(null);
    const [adicionarPropriedade, setAdicionarPropriedade] = useState(false);
    const [novoNomePropriedade, setNovoNomePropriedade] = useState('');
    const navigate = useNavigate();

    const usarDadosSimulados = true;

    useEffect(() => {
        if (usarDadosSimulados) {
            carregarDadosSimulados();
        } else {
            carregarPropriedadesDoBackend();
        }
    }, []);

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

    const carregarPropriedadesDoBackend = async () => {
        try {
            const response = await fetch('http://localhost:3000/propriedades'); 
            const data = await response.json();
            setPropriedades(data);
        } catch (error) {
            console.error('Erro ao carregar propriedades:', error);
        }
    };

    const handlePropriedadeClick = (propriedadeId) => {
        setPropriedadeSelecionada(propriedadeId === propriedadeSelecionada ? null : propriedadeId);
    };

    // Expande o bloco de adicionar propriedade
    const handleAdicionarClick = (e) => {
        e.stopPropagation();  // Evita fechamento ao clicar no campo
        setAdicionarPropriedade(true);
    };

    // Fecha o bloco de adicionar propriedade
    const handleFecharAdicionar = (e) => {
        e.stopPropagation();
        setAdicionarPropriedade(false);
    };

    // Controla a entrada do nome da propriedade
    const handleNomePropriedadeChange = (e) => {
        setNovoNomePropriedade(e.target.value);
    };

    // Envia os dados da nova propriedade para o backend e navega para a página de adicionar talhão
    const handleIrParaTalhao = async () => {
        try {
            const response = await fetch('http://localhost:3000/propriedades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome: novoNomePropriedade }),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar a propriedade');
            }

            navigate('/add-talhao');
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    };

    return (
        <div>
            <Topbar />
            <div className="tela-propriedade-container">
                <h1>Propriedades Cadastradas</h1>
                <div className="propriedades-lista">
                    {propriedades.map(propriedade => (
                        <PropriedadeItem
                            key={propriedade.id}
                            propriedade={propriedade}
                            propriedadeSelecionada={propriedadeSelecionada}
                            handlePropriedadeClick={handlePropriedadeClick}
                        />
                    ))}
                    {/* Bloco para adicionar nova propriedade */}
                    <div
                        className={`propriedade-item add-propriedade ${adicionarPropriedade ? 'expanded' : ''}`}
                        onClick={handleAdicionarClick}
                    >
                        {adicionarPropriedade ? (
                            <div className="adicionar-propriedade-detalhes" onClick={(e) => e.stopPropagation()}>
                                <button onClick={handleFecharAdicionar} className="fechar-adicionar">X</button>
                                <input 
                                    type="text" 
                                    placeholder="Nome da Propriedade" 
                                    value={novoNomePropriedade}
                                    onChange={handleNomePropriedadeChange}
                                    className="input-propriedade"
                                />
                                <button onClick={handleIrParaTalhao} className="botao-ir-talhao">
                                    Adicionar Talhão
                                </button>
                            </div>
                        ) : (
                            <div className="add-icon">+</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TelaPropriedade;
