import React, { useState, useRef, useEffect } from 'react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
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
    const [showDeletePopup, setShowDeletePopup] = useState(false); 
    const itemRef = useRef(null);

    const handleEditClick = (e) => {
        e.stopPropagation();
        setEditMode(true);
    };

    const handleOutsideClick = (e) => {
        if (itemRef.current && !itemRef.current.contains(e.target)) {
            setEditMode(false);
            setTalhoesEdit(
                talhoesEdit.map(talhao => ({ ...talhao, edit: false }))
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

    const handleCancelClick = () => {
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

    const handleTalhaoDeleteClick = (id) => {
        console.log('Excluindo talhão:', id);
        setTalhoesEdit(talhoesEdit.filter(talhao => talhao.id !== id));
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleExpandClick = (e) => {
        e.stopPropagation();
        setExpanded(false);
        setEditMode(false);
    };

    // Funções para gerenciar a exclusão da propriedade
    const handleDeletePropriedadeClick = (e) => {
        e.stopPropagation();
        setShowDeletePopup(true); 
    };

    const handleConfirmDelete = () => {
        console.log('Excluindo propriedade:', propriedade.id);
        setShowDeletePopup(false); 
        // Lógica para excluir a propriedade no backend aqui
    };

    const handleCancelDelete = () => {
        setShowDeletePopup(false); 
    };

    return (
        <div
            ref={itemRef}
            className={`propriedade-item ${expanded ? 'expanded' : ''}`}
            onClick={() => !expanded && toggleExpand()}
        >
            {editMode ? (
                <div className="edit-property-form">
                    <label htmlFor={`nome-propriedade-${propriedade.id}`}>Nome da Propriedade</label>
                    <input 
                        id={`nome-propriedade-${propriedade.id}`}
                        type="text" 
                        value={editedNome} 
                        onChange={(e) => setEditedNome(e.target.value)} 
                    />
        
                    <label htmlFor={`localizacao-propriedade-${propriedade.id}`}>Localização</label>
                    <input 
                        id={`localizacao-propriedade-${propriedade.id}`}
                        type="text" 
                        value={editedLocalizacao} 
                        onChange={(e) => setEditedLocalizacao(e.target.value)} 
                    />
        
                    <button onClick={handleSaveClick} className="save-btn">Salvar</button>
                    <button onClick={handleCancelClick} className="cancel-btn">Cancelar</button>
                </div>
            ) : (
                <>
                    <h3>{propriedade.nome}</h3>
                    {expanded && (
                        <div className="talhoes-detalhes">
                            
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
                                            <button
                                                onClick={() => handleTalhaoDeleteClick(talhao.id)}
                                                className="delete-btn"
                                            >
                                                Excluir
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
                <>
                    <FaPencilAlt 
                        className="edit-icon-property" 
                        onClick={handleEditClick} 
                    />
                    <FaTrashAlt 
                        className="delete-icon-property" 
                        onClick={handleDeletePropriedadeClick} 
                    />
                </>
            )}

            {expanded && (
                <div className="expand-icon" onClick={handleExpandClick}>
                    -
                </div>
            )}

            {/* Popup de confirmação para excluir a propriedade */}
            {showDeletePopup && (
                <div className="delete-popup-overlay">
                    <div className="delete-popup">
                        <p>Tem certeza que deseja excluir a propriedade?</p>
                        <button onClick={handleConfirmDelete} className="confirm-btn">Sim</button>
                        <button onClick={handleCancelDelete} className="cancel-btn">Não</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropriedadeItem;
