import React, { useState } from 'react';

const AddTalhaoPage = () => {
    const [nome, setNome] = useState('');
    const [area, setArea] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Talhão adicionado:", { nome, area });
        setNome('');
        setArea('');
    };

    return (
        <div>
            <h1>Adicionar Novo Talhão</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                    placeholder="Nome do Talhão" 
                />
                <input 
                    type="number" 
                    value={area} 
                    onChange={(e) => setArea(e.target.value)} 
                    placeholder="Área (ha)" 
                />
                <button type="submit">Adicionar Talhão</button>
            </form>
        </div>
    );
};

export default AddTalhaoPage;
