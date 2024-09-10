import React, { useState, useRef, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './PropriedadeItem.css';

const PropriedadeItem = ({ propriedade, propriedadeSelecionada, handlePropriedadeClick }) => {
    const [editMode, setEditMode] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [editedNome, setEditedNome] = useState(propriedade.nome);
    const [editedLocalizacao, setEditedLocalizacao] = useState(propriedade.localizacao);
    const [talhoesEdit, setTalhoesEdit] = useState(
        propriedade.talhoes.map(talhao => ({ ...talhao, edit: false, editedNome: talhao.nome }))
    );
    const itemRef = useRef(null);

    const handleEditClick = (e) => {
        e.stopPropagation();
        setEditMode(true);
    };

    const handleOutsideClick = (e) => {
        if (itemRef.current && !itemRef.current.contains(e.target)) {
            setEditMode(false);
            setTalhoesEdit(
                talhoesEdit.map(talhao => ({ ...talhao, edit: false })) // Fecha edição dos talhões ao clicar fora
            );
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [talhoesEdit]);

    const handleSaveClick = () => {
        console.log('Salvando alterações da propriedade:', editedNome, editedLocalizacao);
        setEditMode(false);
    };

    const handleTalhaoEditClick = (id) => {
        setTalhoesEdit(talhoesEdit.map(talhao =>
            talhao.id === id ? { ...talhao, edit: true } : talhao
        ));
    };

    const handleTalhaoSaveClick = (id) => {
        console.log('Salvando alterações do talhão:', talhoesEdit.find(talhao => talhao.id === id));
        setTalhoesEdit(talhoesEdit.map(talhao =>
            talhao.id === id ? { ...talhao, edit: false } : talhao
        ));
    };

    const handleTalhaoNomeChange = (id, newNome) => {
        setTalhoesEdit(talhoesEdit.map(talhao =>
            talhao.id === id ? { ...talhao, editedNome: newNome } : talhao
        ));
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleExpandClick = (e) => {
        e.stopPropagation();
        setExpanded(false);
    };

    return (
        <div
            ref={itemRef}
            className={`propriedade-item ${expanded ? 'expanded' : ''}`}
            onClick={() => !expanded && toggleExpand()}
        >
            {editMode ? (
                <div className="edit-mode">
                    <input
                        type="text"
                        value={editedNome}
                        onChange={(e) => setEditedNome(e.target.value)}
                        className="edit-input"
                    />
                    <input
                        type="text"
                        value={editedLocalizacao}
                        onChange={(e) => setEditedLocalizacao(e.target.value)}
                        className="edit-input"
                    />
                    <button onClick={handleSaveClick} className="save-btn">Salvar</button>
                </div>
            ) : (
                <>
                    <h3>{propriedade.nome}</h3>
                    {expanded && (
                        <div className="talhoes-detalhes">
                            <h4>Detalhes da Propriedade:</h4>
                            <p>Localização: {propriedade.localizacao}</p>
                            <p>Área Total: {propriedade.areaTotal} ha</p>
                            <h4>Talhões:</h4>
                            {talhoesEdit.map(talhao => (
                                <div key={talhao.id} className="talhao-item">
                                    {talhao.edit ? (
                                        <>
                                            <input
                                                type="text"
                                                value={talhao.editedNome}
                                                onChange={(e) => handleTalhaoNomeChange(talhao.id, e.target.value)}
                                                className="edit-input"
                                            />
                                            <button
                                                onClick={() => handleTalhaoSaveClick(talhao.id)}
                                                className="save-btn"
                                            >
                                                Salvar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to={`/mapapropriedade?talhaoId=${talhao.id}`}>
                                                {talhao.nome} - Área: {talhao.area} ha
                                            </Link>
                                            <FaPencilAlt
                                                className="edit-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTalhaoEditClick(talhao.id);
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {expanded && !editMode && (
                <FaPencilAlt 
                className="edit-icon-property" 
                onClick={handleEditClick} 
            />
            )}


            {expanded && (
                <div className="expand-icon" onClick={handleExpandClick}>
                    -
                </div>
            )}
        </div>
    );
};

export default PropriedadeItem;
