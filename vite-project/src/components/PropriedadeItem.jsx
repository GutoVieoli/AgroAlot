import React, { useState, useRef, useEffect } from 'react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import './PropriedadeItem.css';

const PropriedadeItem = ({ propriedade, propriedadeSelecionada, handlePropriedadeClick }) => {
    // Estados locais para controlar a edição e a expansão
    const [editMode, setEditMode] = useState(false); 
    const [expanded, setExpanded] = useState(false);
    const [editedNome, setEditedNome] = useState(propriedade.nome); 
    const [editedLocalizacao, setEditedLocalizacao] = useState(propriedade.localizacao); 
    const [talhoesEdit, setTalhoesEdit] = useState(
        propriedade.talhoes.map(talhao => ({ ...talhao, edit: false, editedNome: talhao.nome })) 
    );
    const [showDeletePopup, setShowDeletePopup] = useState(false); 
    const itemRef = useRef(null); 

    // modo de edicao
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

    // funcao pra salvar as alteracoes do nome e localizacao
    const handleSaveClick = () => {
        console.log('Salvando alterações da propriedade:', editedNome, editedLocalizacao);
        
        setEditMode(false);
    };


    const handleTalhaoEditClick = (id) => {
        setTalhoesEdit(talhoesEdit.map(talhao =>
            talhao.id === id ? { ...talhao, edit: true } : talhao 
        ));
    };

    // funcao pra salvar o nome do talhao
    const handleTalhaoSaveClick = (id) => {
        console.log('Salvando alterações do talhão:', talhoesEdit.find(talhao => talhao.id === id));
        
        setTalhoesEdit(talhoesEdit.map(talhao =>
            talhao.id === id ? { ...talhao, edit: false } : talhao 
        ));
    };

    // funcao pra alterar nome do talhao
    const handleTalhaoNomeChange = (id, newNome) => {
        setTalhoesEdit(talhoesEdit.map(talhao =>
            talhao.id === id ? { ...talhao, editedNome: newNome } : talhao // atualiza o local o nome do talhao 
        ));
    };

    
    const toggleExpand = () => {
        setExpanded(!expanded); 
    };

    // 
    const handleExpandClick = (e) => {
        e.stopPropagation();
        setExpanded(false); 
        setEditMode(false); 
    };

    // funcao pra excluir  propriedade 
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
            {/*  edicao para o nome e localizacao  */}
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
        
                    <button onClick={handleSaveClick} className="save-btn">Salvar</button> {/* btao de salvar */}
                    <button onClick={() => setEditMode(false)} className="cancel-btn">Cancelar</button> {/* botao de cancelar */}
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
                                            <button
                                                onClick={() => setTalhoesEdit(talhoesEdit.map(t => 
                                                    t.id === talhao.id ? { ...t, edit: false } : t))}
                                                className="cancel-btn"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => console.log(`Excluindo talhão ${talhao.id}`)} // aqui  conectar ao BD para excluir
                                                className="delete-btn"
                                            >
                                                Excluir
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to={`/mapapropriedade?talhao_id=${talhao.id}`}>
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

            {/*lapisinho de edicao da propriedade */}
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

            {/* icone excluir propriedade */}
            {expanded && !editMode && (
                <FaTrashAlt
                    className="delete-icon-property"
                    onClick={() => setShowDeletePopup(true)} // Exibe o pop-up de confirmação
                />
            )}

            {/* popup de confirmação de exclusao */}
            {showDeletePopup && (
                <div className="delete-popup-overlay">
                    <div className="delete-popup">
                        <p>Tem certeza que deseja excluir esta propriedade?</p>
                        <button onClick={handleDeleteClick} className="confirm-btn">Confirmar</button> {/* Confirma a exclusão */}
                        <button onClick={() => setShowDeletePopup(false)} className="cancel-btn">Cancelar</button> {/* Cancela a exclusão */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropriedadeItem;
