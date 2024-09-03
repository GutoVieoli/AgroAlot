import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';

const Cadastro = () => {

    const [erroMsg, setErroMsg] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const navigate = useNavigate();

    const erroNome = 'O nome deve ter pelo menos 4 caracteres.';
    const erroEmail = 'Insira um email válido.';

    const handleChange = (event, index) => {
        const valor = event.target.value;

        switch(index){
            case 0:
                setNome(valor);
                break;
            case 1:
                setEmail(valor);
                break;
            case 2:
                setSenha(valor);
                break;
            case 3:
                setConfirmaSenha(valor);
                break;
            default:
                break;
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        fetch("http://localhost:3000/novo-usuario", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha })
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((error) => {
                    setErroMsg(error.message);
                    throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
                });
            }
            return response.json();
        })
        .then(() => {
            navigate('/login');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const isButtonEnabled = () => {
        if (nome.length < 4 && nome.length > 0 && erroMsg === '') {
            setErroMsg(erroNome);
        } else if ((nome.length >= 4 || nome.length === 0) && erroMsg === erroNome) {
            setErroMsg('');
        } else if (!validateEmail(email) && email !== '' && erroMsg !== erroEmail) {
            setErroMsg(erroEmail);
        } else if (validateEmail(email) && erroMsg === erroEmail) {
            setErroMsg('');
        }
        return nome.length >= 4 && email !== '' && senha !== '' && confirmaSenha !== '' && senha === confirmaSenha;
    };

    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    return (
        <div className="cadastro-container">
            <div className="cadastro-box">
                <h1>Cadastre-se</h1>
                <p>É rápido e fácil.</p>

                {erroMsg && <p className="erro-msg">{erroMsg}</p>}

                <input 
                    onChange={(event) => handleChange(event, 0)} 
                    className="input-campo" 
                    type="text" 
                    placeholder="Nome" 
                />
                <input 
                    onChange={(event) => handleChange(event, 1)} 
                    className="input-campo" 
                    type="email" 
                    placeholder="Email" 
                />
                <input 
                    onChange={(event) => handleChange(event, 2)} 
                    className="input-campo" 
                    type="password" 
                    placeholder="Senha" 
                />
                <input 
                    onChange={(event) => handleChange(event, 3)} 
                    className="input-campo" 
                    type="password" 
                    placeholder="Confirme a senha" 
                />

                {senha !== '' && confirmaSenha !== '' && senha !== confirmaSenha && (
                    <p className="erro-msg">As senhas são diferentes</p>
                )}

                <button 
                    className="btn-cadastro"  
                    onClick={handleApply} 
                    type="submit"
                    disabled={!isButtonEnabled()}
                > 
                    Criar 
                </button>
                <p className="or">ou</p>
                <button className="btn-cadastro" type="button" onClick={() => navigate('/')}>Voltar</button>
            </div>
        </div>
    );
};

export default Cadastro;
