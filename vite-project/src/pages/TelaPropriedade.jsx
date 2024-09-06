import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import PropriedadeItem from '../components/PropriedadeItem';
import './TelaPropriedade.css';

const TelaPropriedade = () => {
    const [propriedades, setPropriedades] = useState([]);
    const [propriedadeSelecionada, setPropriedadeSelecionada] = useState(null);
    const [adicionarPropriedade, setAdicionarPropriedade] = useState(false);
    const [novoNomePropriedade, setNovoNomePropriedade] = useState('');
    const [localizacaoPropriedade, setLocalizacaoPropriedade] = useState('');
    const [descricaoPropriedade, setDescricaoPropriedade] = useState('');
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

    const handleAdicionarClick = (e) => {
        e.stopPropagation(); 
        setAdicionarPropriedade(true);
    };

    const handleFecharAdicionar = (e) => {
        e.stopPropagation();
        setAdicionarPropriedade(false);
    };

    const handleNomePropriedadeChange = (e) => {
        setNovoNomePropriedade(e.target.value);
    };

    const handleLocalizacaoChange = (e) => {
        setLocalizacaoPropriedade(e.target.value);
    };

    const handleDescricaoChange = (e) => {
        setDescricaoPropriedade(e.target.value);
    };

    const handleAdicionarPropriedade = async () => {
        try {
            const response = await fetch('http://localhost:3000/propriedades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    nome: novoNomePropriedade, 
                    localizacao: localizacaoPropriedade,
                    descricao: descricaoPropriedade
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar a propriedade');
            }

            // Reinicializa os campos e oculta o formulário de adicionar
            setNovoNomePropriedade('');
            setLocalizacaoPropriedade('');
            setDescricaoPropriedade('');
            setAdicionarPropriedade(false);
            carregarPropriedadesDoBackend();
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
                    {/* bloco para adicionar nova propriedade */}
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
                                <input 
                                    type="text" 
                                    placeholder="Localização" 
                                    value={localizacaoPropriedade}
                                    onChange={handleLocalizacaoChange}
                                    className="input-propriedade"
                                />
                                <textarea
                                    placeholder="Descrição (opcional)"
                                    value={descricaoPropriedade}
                                    onChange={handleDescricaoChange}
                                    className="input-descricao"
                                />
                                <button onClick={handleAdicionarPropriedade} className="botao-adicionar-propriedade">
                                    Adicionar Propriedade
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
