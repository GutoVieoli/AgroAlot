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
    const navigate = useNavigate();

    const usarDadosSimulados = false;

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
            const tokenJWT = localStorage.getItem('tokenJWT');
            const response = await fetch('http://localhost:3000/propriedades/listar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    tokenJWT
                }),
            });
            const data = await response.json();
            const propriedadesSalvas = data.propriedades;

            // Transforma os dados recebidos no formato desejado
            const propriedadesTransformadas = propriedadesSalvas.map((propriedade, index) => {
                return {
                    id: propriedade.id,
                    nome: propriedade.nome,
                    localizacao: propriedade.localizacao,
                    areaTotal: propriedade.area_total,

                    talhoes: propriedade.talhoes.map( (talhao) => {
                        return {
                            id: talhao.id,
                            nome: `Talhão ${talhao.nome}`,
                            area: talhao.area
                        }
                    })

                };
            });
    
            console.log(propriedadesTransformadas); // Exibe as propriedades transformadas no formato correto
            setPropriedades(propriedadesTransformadas);
            return propriedadesTransformadas; // Retorna o objeto transformado

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


    const handleAdicionarPropriedade = async () => {
        try {
            const tokenJWT = localStorage.getItem('tokenJWT');
            const response = await fetch('http://localhost:3000/propriedades/criar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    nome: novoNomePropriedade,
                    localizacao: localizacaoPropriedade,
                    tokenJWT
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar a propriedade');
            }

            // Reinicializa os campos e oculta o formulário de adicionar
            setNovoNomePropriedade('');
            setLocalizacaoPropriedade('');
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
                            <form 
                            className="adicionar-propriedade-detalhes" 
                            onClick={(e) => e.stopPropagation()}
                            onSubmit={(e) => { e.preventDefault(); handleAdicionarPropriedade();}} >
                                <button onClick={handleFecharAdicionar} className="fechar-adicionar">X</button>
                                <input 
                                    type="text" 
                                    placeholder="Nome da Propriedade" 
                                    value={novoNomePropriedade}
                                    onChange={handleNomePropriedadeChange}
                                    className="input-propriedade"
                                    required
                                />
                                <input 
                                    type="text" 
                                    placeholder="Localização" 
                                    value={localizacaoPropriedade}
                                    onChange={handleLocalizacaoChange}
                                    className="input-propriedade"
                                    required
                                />
                                <button type='submit' className="botao-adicionar-propriedade">
                                    Adicionar Propriedade
                                </button>
                            </form>
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
