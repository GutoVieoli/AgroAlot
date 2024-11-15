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
    const [showTalhaoEditModal, setShowTalhaoEditModal] = useState(false); // Estado do modal de edição do talhão
    const [talhaoToEdit, setTalhaoToEdit] = useState(null); // Talhão sendo editado no modal
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

    const handleTalhaoEditClick = (id) => {
        if (window.innerWidth <= 768) { 
            // Exibe o modal em telas menores (mobile)
            setTalhaoToEdit(talhoesEdit.find(talhao => talhao.id === id)); 
            setShowTalhaoEditModal(true); 
        } else {
            // Ativa o modo de edição inline em telas maiores (desktop)
            setTalhoesEdit(talhoesEdit.map(talhao =>
                talhao.id === id ? { ...talhao, edit: true } : talhao 
            ));
        }
    };

    const handleTalhaoSaveClick = (id) => {
        if (window.innerWidth <= 768) { 
            // Fechar o modal em telas menores
            console.log('Salvando alterações do talhão:', talhaoToEdit);
            setTalhoesEdit(talhoesEdit.map(talhao =>
                talhao.id === talhaoToEdit.id ? { ...talhaoToEdit, edit: false } : talhao 
            ));
            setShowTalhaoEditModal(false);
        } else {
            // Fechar o modo de edição inline em telas maiores
            console.log('Salvando alterações do talhão:', talhoesEdit.find(talhao => talhao.id === id));
            setTalhoesEdit(talhoesEdit.map(talhao =>
                talhao.id === id ? { ...talhao, edit: false } : talhao 
            ));
        }
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
        setEditMode(false); 
    };

    const handleDeleteClick = () => {
        console.log('Excluindo propriedade:', propriedade.id);
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
                    <div className="action-buttons">
                        <button onClick={handleSaveClick} className="save-btn">Salvar</button>
                        <button onClick={() => setEditMode(false)} className="cancel-btn">Cancelar</button>
                    </div>
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
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => handleTalhaoSaveClick(talhao.id)}
                                                    className="save-btn"
                                                >
                                                    Salvar
                                                </button>
                                                <button
                                                    onClick={() => setTalhoesEdit(talhoesEdit.map(t => 
                                                        t.id === talhao.id ? { ...t, edit: false } : t))}
                                                    className="cancel-btn"
                                                >
                                                    Cancelar
                                                </button>
                                                <FaTrashAlt
                                                    onClick={() => console.log(`Excluindo talhão ${talhao.id}`)} 
                                                    className="delete-icon"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Link to={`/mapapropriedade?propriedade=${propriedade.id}&talhao=${talhao.id}`}>
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
            {expanded && !editMode && (
                <FaTrashAlt
                    className="delete-icon-property"
                    onClick={() => setShowDeletePopup(true)} 
                />
            )}
            {showDeletePopup && (
                <div className="delete-popup-overlay">
                    <div className="delete-popup">
                        <p>Tem certeza que deseja excluir esta propriedade?</p>
                        <button onClick={handleDeleteClick} className="confirm-btn">Confirmar</button>
                        <button onClick={() => setShowDeletePopup(false)} className="cancel-btn">Cancelar</button>
                    </div>
                </div>
            )}

            {/* Modal de Edição do Talhão */}
            {showTalhaoEditModal && talhaoToEdit && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Editar Talhão</h3>
                        <input
                            type="text"
                            value={talhaoToEdit.editedNome}
                            onChange={(e) => setTalhaoToEdit({ ...talhaoToEdit, editedNome: e.target.value })}
                        />
                        <div className="action-buttons">
                            <button onClick={() => handleTalhaoSaveClick(talhaoToEdit.id)} className="save-btn">Salvar</button>
                            <button onClick={() => setShowTalhaoEditModal(false)} className="cancel-btn">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropriedadeItem;
