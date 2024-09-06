import React, { useState, useEffect } from 'react';
import './AddTalhaoPage.css';
import Topbar from '../components/Topbar';

const AddTalhaoPage = () => {
    const [nomeTalhao, setNomeTalhao] = useState('');
    const [propriedade, setPropriedade] = useState('');
    const [cultura, setCultura] = useState('');
    const [coordenadas, setCoordenadas] = useState(['', '', '']);
    const [modo, setModo] = useState('manual');
    const [erroMsg, setErroMsg] = useState('');

    const [propriedadesCadastradas, setPropriedadesCadastradas] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false); // Controla a exibição do modal
    const [novaPropriedadeNome, setNovaPropriedadeNome] = useState('');
    const [novaPropriedadeLocalizacao, setNovaPropriedadeLocalizacao] = useState('');
    const [novaPropriedadeDescricao, setNovaPropriedadeDescricao] = useState('');

    const culturas = [
        "Algodão",
        "Arroz",
        "Batata",
        "Café",
        "Cana de Açúcar",
        "Feijão",
        "Milho",
        "Pasto", 
        "Soja",
        "Sorgo",
        "Trigo",
    ];

    useEffect(() => {
        const fetchPropriedades = async () => {
            try {
                const token = localStorage.getItem('tokenJWT');
                const response = await fetch('http://localhost:3000/propriedades/listar', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ jwt: token })
                });
                if (!response.ok) {
                    throw new Error('Erro ao buscar propriedades cadastradas.');
                }
                const data = await response.json();
                const nomesPropriedades = data.propriedades.map(propriedade => propriedade.nome);
                setPropriedadesCadastradas(nomesPropriedades); // Preenche apenas com os nomes

            } catch (error) {
                console.error('Erro ao buscar propriedades:', error);
                setErroMsg('Erro ao carregar propriedades cadastradas.');
            }
        };

        fetchPropriedades(); // Chama a função assim que o componente for montado
    }, []);


    const handleAddCoordenada = () => {
        setCoordenadas([...coordenadas, '']);
    };

    const handleCoordenadaChange = (index, value) => {
        const novasCoordenadas = [...coordenadas];
        novasCoordenadas[index] = value;
        setCoordenadas(novasCoordenadas);
    };

    const handleRemoveCoordenada = (index) => {
        if (coordenadas.length > 3) {
            const novasCoordenadas = coordenadas.filter((_, i) => i !== index);
            setCoordenadas(novasCoordenadas);
        }
    };

    const handleSubmitManual = (e) => {
        e.preventDefault();

        if (coordenadas.length < 3) {
            setErroMsg("Você precisa adicionar pelo menos 3 pontos de coordenadas.");
            return;
        }

        const dados = {
            nome,
            propriedade,
            cultura,
            coordenadas,
        };

        fetch('http://localhost:3000/novo-talhao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then((error) => {
                    setErroMsg(error.message);
                    throw new Error(`Erro HTTP! status: ${response.status}, message: ${error.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            setNomeTalhao('');
            setPropriedade('');
            setCultura('');
            setCoordenadas(['', '', '']);
            setErroMsg(''); 
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
    };

    const handleAddPropriedade = async () => {
        // Função para enviar a nova propriedade ao backend
        try {
            const response = await fetch('http://localhost:3000/propriedades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: novaPropriedadeNome,
                    localizacao: novaPropriedadeLocalizacao,
                    descricao: novaPropriedadeDescricao
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar a propriedade');
            }

            // Fechar o modal após salvar
            setMostrarModal(false);
            setNovaPropriedadeNome('');
            setNovaPropriedadeLocalizacao('');
            setNovaPropriedadeDescricao('');
        } catch (error) {
            console.error('Erro ao adicionar propriedade:', error);
        }
    };

    return (
        <div>
            <Topbar />
            <div className="add-talhao-container">
                <h1>Adicionar Novo Talhão</h1>
                <div className="modo-switch">
                    <button 
                        className={modo === 'manual' ? 'active' : ''} 
                        onClick={() => setModo('manual')}
                    >
                        Manual por Pontos
                    </button>
                    <button 
                        className={modo === 'arquivo' ? 'active' : ''} 
                        onClick={() => setModo('arquivo')}
                    >
                        Via Arquivo
                    </button>
                </div>

                {erroMsg && <p className="error-message">{erroMsg}</p>}

                <form onSubmit={handleSubmitManual} className="add-talhao-form">

                    <div className="form-group">

                        <label htmlFor="propriedade">Propriedade</label>
                        <select 
                            type="text" 
                            id="propriedade" 
                            value={propriedade} 
                            required 
                        >
                                <option value="" disabled>
                                    Selecione uma propriedade
                                </option>
                                {propriedadesCadastradas.map((propriedade, index) => (
                                    <option key={index} value={propriedade}>
                                        {propriedade}
                                    </option>
                                ))}
                        </select>

                        <div className="add-propriedade-section">
                            <span>Não encontrou a propriedade?</span>
                            <button type="button" className="add-propriedade-btn" onClick={() => setMostrarModal(true)}>
                                Adicionar nova propriedade
                            </button>
                        </div>

                    </div>

                    <div className="form-group">
                        <label htmlFor="nome">Nome do Talhão</label>
                        <input 
                            type="text" 
                            id="nome" 
                            value={nomeTalhao} 
                            onChange={(e) => setNomeTalhao(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cultura">Cultura</label>
                        <select 
                            id="cultura" 
                            value={cultura} 
                            onChange={(e) => setCultura(e.target.value)} 
                            required
                        >
                            <option value="" disabled>
                                Selecione uma cultura
                            </option>
                            {culturas.map((cultura, index) => (
                                <option key={index} value={cultura}>
                                    {cultura}
                                </option>
                            ))}
                        </select>
                    </div>

                    {modo === 'manual' && (
                        <div className="form-group coordenadas-group">
                            <label>Coordenadas</label>
                            {coordenadas.map((coord, index) => (
                                <div key={index} className="coordenada-item">
                                    <input 
                                        type="text" 
                                        placeholder="Ex: 45.1234, -73.5678" 
                                        value={coord}
                                        onChange={(e) => handleCoordenadaChange(index, e.target.value)}
                                        required
                                    />
                                    {coordenadas.length > 3 && (
                                        <button 
                                            type="button" 
                                            className="remove-coordenada-btn" 
                                            onClick={() => handleRemoveCoordenada(index)}
                                        >
                                            X
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="add-coordenada-btn" onClick={handleAddCoordenada}>
                                + Adicionar Coordenada
                            </button>
                        </div>
                    )}

                    {modo === 'arquivo' && (
                        <div className="form-group">
                            <label htmlFor="arquivo">Arquivo (JSON ou GeoJSON)</label>
                            <input type="file" id="arquivo" accept=".json,.geojson" required />
                        </div>
                    )}
                    <button type="submit" className="submit-btn">Adicionar Talhão</button>


                    {/* Modal de Adicionar Propriedade */}
                    {mostrarModal && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Adicionar Propriedade</h2>
                                <div className="modal-form-group">
                                    <label htmlFor="novaPropriedadeNome">Nome</label>
                                    <input
                                        type="text"
                                        id="novaPropriedadeNome"
                                        value={novaPropriedadeNome}
                                        onChange={(e) => setNovaPropriedadeNome(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="modal-form-group">
                                    <label htmlFor="novaPropriedadeLocalizacao">Localização</label>
                                    <input
                                        type="text"
                                        id="novaPropriedadeLocalizacao"
                                        value={novaPropriedadeLocalizacao}
                                        onChange={(e) => setNovaPropriedadeLocalizacao(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="modal-form-group">
                                    <label htmlFor="novaPropriedadeDescricao">Descrição (opcional)</label>
                                    <textarea
                                        id="novaPropriedadeDescricao"
                                        value={novaPropriedadeDescricao}
                                        onChange={(e) => setNovaPropriedadeDescricao(e.target.value)}
                                    />
                                </div>
                                <button className="submit-btn" onClick={handleAddPropriedade}>
                                    Adicionar Propriedade
                                </button>
                                <button className="close-btn" onClick={() => setMostrarModal(false)}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
};

export default AddTalhaoPage;
