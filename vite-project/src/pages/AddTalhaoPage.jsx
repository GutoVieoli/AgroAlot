import React, { useState } from 'react';
import './AddTalhaoPage.css';
import Topbar from '../components/Topbar';

const AddTalhaoPage = () => {
    const [nome, setNome] = useState('');
    const [coordenadas, setCoordenadas] = useState(['']);
    const [modo, setModo] = useState('manual');

    const handleAddCoordenada = () => {
        setCoordenadas([...coordenadas, '']);
    };

    const handleCoordenadaChange = (index, value) => {
        const novasCoordenadas = [...coordenadas];
        novasCoordenadas[index] = value;
        setCoordenadas(novasCoordenadas);
    };

    const handleRemoveCoordenada = (index) => {
        const novasCoordenadas = coordenadas.filter((_, i) => i !== index);
        setCoordenadas(novasCoordenadas);
    };

    const handleSubmitManual = (e) => {
        e.preventDefault();
        console.log("Talhão adicionado com coordenadas:", { nome, coordenadas });
        setNome('');
        setCoordenadas(['']);
    };

    const handleSubmitArquivo = (e) => {
        e.preventDefault();
        console.log("Talhão adicionado via arquivo");
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
                {modo === 'manual' && (
                    <form onSubmit={handleSubmitManual} className="add-talhao-form">
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
                                    <button 
                                        type="button" 
                                        className="remove-coordenada-btn" 
                                        onClick={() => handleRemoveCoordenada(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="add-coordenada-btn" onClick={handleAddCoordenada}>
                                mais coordenadas
                            </button>
                        </div>
                        <button type="submit" className="submit-btn">Adicionar Talhão</button>
                    </form>
                )}
                {modo === 'arquivo' && (
                    <form onSubmit={handleSubmitArquivo} className="add-talhao-form">
                        <div className="form-group">
                            <label htmlFor="nome">Nome do Talhão</label>
                            <input type="text" id="nome" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cultura">Cultura</label>
                            <input type="text" id="cultura" required />
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
