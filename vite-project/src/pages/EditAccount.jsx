import React, { useState, useEffect } from 'react';
import './EditAccount.css';

const EditAccount = () => {
    const [userData, setUserData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmSenha: ''
    });

    const [placeholders, setPlaceholders] = useState({
        nome: '',
        email: ''
    });

    const [erroMsg, setErroMsg] = useState({
        nome: '',
        email: '',
        senha: ''
    });

    //pega dados do bd
    useEffect(() => {
        
        const token = localStorage.getItem('tokenJWT');
        fetch('http://localhost:3000/usuario', { // trocar aqui
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setPlaceholders({ nome: data.nome, email: data.email }); // teoricamente fica as credenciais antigas como placeholder
        })
        .catch((error) => console.error('Erro ao carregar dados do usuário:', error));
    }, []);

    // macumba 
    const handleChange = (event, field) => {
        const valor = event.target.value;
        setUserData({ ...userData, [field]: valor });
        validateField(field, valor);
    };

    // copieia as viadagem do cadastro
    const validateField = (field, value) => {
        let errorMsg = '';

        if (field === 'email' && value !== '' && !validateEmail(value)) {
            errorMsg = 'E-mail inválido';
        }

        if (field === 'nome' && value.length > 0 && value.length < 4) {
            errorMsg = 'O nome deve ter pelo menos 4 letras.';
        }

        if (field === 'senha' && userData.confirmSenha && value !== userData.confirmSenha) {
            errorMsg = 'As senhas não coincidem';
        }

        if (field === 'confirmSenha' && userData.senha && value !== userData.senha) {
            errorMsg = 'As senhas não coincidem';
        }

        setErroMsg({ ...erroMsg, [field]: errorMsg });
    };

    // funcao pra salvar
    const handleSubmit = (field) => {
        const token = localStorage.getItem('tokenJWT');
       
        fetch(`http://localhost:3000/editar-${field}`, {  //troca aaqui
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ [field]: userData[field] }) // enviando alteracao
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar');
            }
            return response.json();
        })
        .then(() => {
            alert(`${field.charAt(0).toUpperCase() + field.slice(1)} atualizado com sucesso!`);
        })
        .catch((error) => console.error(`Erro ao atualizar ${field}:`, error));
    };

    // funcao pra salvar a senha
    const handlePasswordSubmit = () => {
        const token = localStorage.getItem('tokenJWT');
        
        fetch('http://localhost:3000/editar-senha', {  // trocar aqui
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ senha: userData.senha }) // enviando senha nova
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar senha');
            }
            return response.json();
        })
        .then(() => {
            alert('Senha atualizada com sucesso!');
        })
        .catch((error) => console.error('Erro ao atualizar senha:', error));
    };

    // viadagem do cadastro tbm 
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    return (
        <div className="edit-account-container">
            <h1>Editar Conta</h1>

            <div className="edit-section">
                <h2>Nome</h2>
                <input 
                    type="text" 
                    name="nome" 
                    value={userData.nome} 
                    onChange={(event) => handleChange(event, 'nome')} 
                    className="input-field" 
                    placeholder={placeholders.nome}  // placeholder com o nome do bd
                />
                {erroMsg.nome && <p className="error-msg">{erroMsg.nome}</p>}
                <button onClick={() => handleSubmit('nome')} className="edit-btn" disabled={erroMsg.nome !== ''}>Salvar Nome</button>
            </div>

            <div className="edit-section">
                <h2>Email</h2>
                <input 
                    type="email" 
                    name="email" 
                    value={userData.email} 
                    onChange={(event) => handleChange(event, 'email')} 
                    className="input-field" 
                    placeholder={placeholders.email}  // placeholder com o email do bd
                />
                {erroMsg.email && <p className="error-msg">{erroMsg.email}</p>}
                <button onClick={() => handleSubmit('email')} className="edit-btn" disabled={erroMsg.email !== ''}>Salvar Email</button>
            </div>

            <div className="edit-section">
                <h2>Nova Senha</h2>
                <input 
                    type="password" 
                    name="senha" 
                    value={userData.senha} 
                    onChange={(event) => handleChange(event, 'senha')} 
                    className="input-field" 
                    placeholder="Nova senha"
                />
                {erroMsg.senha && <p className="error-msg">{erroMsg.senha}</p>}
            </div>

            <div className="edit-section">
                <h2>Confirme a Nova Senha</h2>
                <input 
                    type="password" 
                    name="confirmSenha" 
                    value={userData.confirmSenha} 
                    onChange={(event) => handleChange(event, 'confirmSenha')} 
                    className="input-field" 
                    placeholder="Confirme a nova senha"
                />
                {userData.senha !== '' && userData.confirmSenha !== '' && userData.senha !== userData.confirmSenha && (
                    <p className="error-msg">As senhas não coincidem</p>
                )}
                <button onClick={handlePasswordSubmit} className="edit-btn" disabled={userData.senha !== userData.confirmSenha}>Salvar Senha</button>
            </div>
        </div>
    );
};

export default EditAccount;
