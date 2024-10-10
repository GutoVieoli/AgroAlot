import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OptionsBar.css';

const Optionsbar = ({ buttonActive }) => {
    const [propriedades, setPropriedades] = useState([]);
    const [propriedadesVisiveis, setPropriedadesVisiveis] = useState(false);
    const [talhoesVisiveis, setTalhoesVisiveis] = useState({});

    // propriedades do back
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
            const propriedadesTransformadas = propriedadesSalvas.map((propriedade) => ({
                id: propriedade.id,
                nome: propriedade.nome,
                localizacao: propriedade.localizacao,
                talhoes: propriedade.talhoes || []
            }));

            setPropriedades(propriedadesTransformadas);
        } catch (error) {
            console.error('Erro ao carregar propriedades:', error);
        }
    };

    useEffect(() => {
        carregarPropriedadesDoBackend();
    }, []);

    // visibilidade das propriedades
    const togglePropriedadesVisiveis = () => {
        setPropriedadesVisiveis(!propriedadesVisiveis);
    };

    // visibilidade dos talhoes
    const toggleTalhoesVisiveis = (propriedadeId) => {
        setTalhoesVisiveis((prevState) => ({
            ...prevState,
            [propriedadeId]: !prevState[propriedadeId],
        }));
    };

    return (
        <div className={`barra-opcoes ${buttonActive ? "active" : "inactive"}`}>
            <div className="opcoes">
                {/* seta da propriedade */}
                <div className="opcao-item" onClick={togglePropriedadesVisiveis}>
                    Propriedades
                    <span className={`seta ${propriedadesVisiveis ? 'down' : 'right'}`}></span>
                </div>
                {/* lista de talhoes */}
                {propriedadesVisiveis && (
                    <div className="lista-propriedades">
                        {propriedades.length > 0 ? (
                            propriedades.map((propriedade) => (
                                <div key={propriedade.id}>
                                    {/* nome da prorpiedade */}
                                    <div 
                                        className="propriedade-nome" 
                                        onClick={() => toggleTalhoesVisiveis(propriedade.id)}
                                    >
                                        {propriedade.nome}
                                        <span className={`seta ${talhoesVisiveis[propriedade.id] ? 'down' : 'right'}`}></span>
                                    </div>
                                    {/* talhoes */}
                                    {talhoesVisiveis[propriedade.id] && (
                                        <div className="lista-talhoes">
                                            {propriedade.talhoes.length > 0 ? (
                                                propriedade.talhoes.map((talhao) => (
                                                    <Link 
                                                        key={talhao.id} 
                                                        to={`/talhao/${talhao.id}`} 
                                                        className="talhao-nome"
                                                    >
                                                        {talhao.nome} - {talhao.area} ha
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="nenhum-talhao">Nenhum talhão cadastrado</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="nenhuma-propriedade">Nenhuma propriedade cadastrada</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Optionsbar;
