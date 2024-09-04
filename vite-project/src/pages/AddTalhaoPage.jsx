import React, { useState, useEffect } from 'react';
import './AddTalhaoPage.css';
import Topbar from '../components/Topbar';

const AddTalhaoPage = () => {
    const [nome, setNome] = useState('');
    const [propriedade, setPropriedade] = useState(''); 
    const [cultura, setCultura] = useState(''); 
    const [coordenadas, setCoordenadas] = useState(['', '', '']); 
    const [modo, setModo] = useState('manual');
    const [erroMsg, setErroMsg] = useState('');
    const [sugestoes, setSugestoes] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [propriedadesCadastradas, setPropriedadesCadastradas] = useState([])

    // const propriedadesCadastradas = [  // pra testar autocomplete
    //     "Fazenda Boa Vista",
    //     "Sítio Santa Cruz",
    //     "Chácara dos Pinhais",
    //     "Fazenda Esperança",
    //     "Sítio São José",
    //     "Chácara Bela Vista"
    // ];

    const culturas = [
        "Algodão",
        "Arroz",
        "Café",
        "Cana-de-Açúcar",
        "Feijão",
        "Milho",
        "Pasto", 
        "Soja",
        "Sorgo",
        "Trigo",
    ];


    // Função para buscar as propriedades cadastradas da API assim que a página carregar
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


    const handlePropriedadeChange = (e) => {
        const valor = e.target.value;
        setPropriedade(valor);

        const novasSugestoes = propriedadesCadastradas.filter(propriedade => 
            propriedade.toLowerCase().startsWith(valor.toLowerCase())
        );
        setSugestoes(novasSugestoes);
    };

    const handleSugestaoClick = (sugestao) => {
        setPropriedade(sugestao);
        setSugestoes([]); 
    };

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
            console.log('Talhão adicionado com sucesso:', data);
            setNome('');
            setPropriedade('');
            setCultura('');
            setCoordenadas(['', '', '']);
            setErroMsg(''); 
            setSugestoes([]); 
            setIsFocused(false);
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
    };

    const handleSubmitArquivo = (e) => {
        e.preventDefault();

        const arquivo = e.target.arquivo.files[0];
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('propriedade', propriedade);
        formData.append('cultura', cultura);
        formData.append('arquivo', arquivo);

        fetch('http://localhost:3000/novo-talhao', {
            method: 'POST',
            body: formData,
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
            console.log('Talhão adicionado com sucesso:', data);
            setNome('');
            setPropriedade('');
            setCultura('');
            setErroMsg(''); 
            setSugestoes([]); 
            setIsFocused(false); 
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
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

                {modo === 'manual' && (
                    <form onSubmit={handleSubmitManual} className="add-talhao-form">
                        <div className="form-group">
                            <label htmlFor="propriedade">Propriedade</label>
                            <input 
                                type="text" 
                                id="propriedade" 
                                value={propriedade} 
                                onChange={handlePropriedadeChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 100)}
                                required 
                            />
                            {isFocused && sugestoes.length > 0 && (
                                <ul className="suggestions-list">
                                    {sugestoes.map((sugestao, index) => (
                                        <li key={index} onClick={() => handleSugestaoClick(sugestao)}>
                                            {sugestao}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="nome">Nome do Talhão</label>
                            <input 
                                type="text" 
                                id="nome" 
                                value={nome} 
                                onChange={(e) => setNome(e.target.value)} 
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
                                <option value="">Selecione uma cultura</option>
                                {culturas.map((cultura, index) => (
                                    <option key={index} value={cultura}>{cultura}</option>
                                ))}
                            </select>
                        </div>
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
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="add-coordenada-btn" onClick={handleAddCoordenada}>
                                + Adicionar Coordenada
                            </button>
                        </div>
                        <button type="submit" className="submit-btn">Adicionar Talhão</button>
                    </form>
                )}

                {modo === 'arquivo' && (
                    <form onSubmit={handleSubmitArquivo} className="add-talhao-form">
                        <div className="form-group">
                            <label htmlFor="propriedade">Propriedade</label>
                            <input 
                                type="text" 
                                id="propriedade" 
                                value={propriedade} 
                                onChange={handlePropriedadeChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 100)}
                                required 
                            />
                            {isFocused && sugestoes.length > 0 && (
                                <ul className="suggestions-list">
                                    {sugestoes.map((sugestao, index) => (
                                        <li key={index} onClick={() => handleSugestaoClick(sugestao)}>
                                            {sugestao}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="nome">Nome do Talhão</label>
                            <input 
                                type="text" 
                                id="nome" 
                                value={nome} 
                                onChange={(e) => setNome(e.target.value)} 
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
                                <option value="">Selecione uma cultura</option>
                                {culturas.map((cultura, index) => (
                                    <option key={index} value={cultura}>{cultura}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="arquivo">Arquivo (JSON ou GeoJSON)</label>
                            <input type="file" id="arquivo" accept=".json,.geojson" required />
                        </div>
                        <button type="submit" className="submit-btn">Adicionar Talhão</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddTalhaoPage;
