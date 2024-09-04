import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'

const Cadastro = () => {

    const [erroMsg, setErroMsg] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const navigate = useNavigate();

    const erroNome = 'O nome deve ter pelo menos 4 letras.';
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
        <div className={styles.alinhador}>

            <form className={styles.loginbubble} >
                <div className={styles.alignbubble}>

                    <div className={styles.secEsquerda}>

                        <div className={styles.titulos}>
                            <h1>Cadastre-se</h1>
                            <p>É rápido e fácil.</p>
                        </div>

                        <input 
                            onChange={(event) => handleChange(event, 0)} 
                            className={styles.campos} 
                            type="text" 
                            placeholder="Nome" 
                        />
                        <input 
                            onChange={(event) => handleChange(event, 1)} 
                            className={styles.campos} 
                            type="email" 
                            placeholder="Email" 
                        />
                        <input 
                            onChange={(event) => handleChange(event, 2)} 
                            className={styles.campos} 
                            type="password" 
                            placeholder="Senha" 
                        />
                        <input 
                            onChange={(event) => handleChange(event, 3)} 
                            className={styles.campos} 
                            type="password" 
                            placeholder="Confirme a senha" 
                        />

                        {erroMsg && <p className={styles.erro}>{erroMsg}</p>}
                        {senha !== '' && confirmaSenha !== '' && senha !== confirmaSenha && (
                            <p className={styles.erro}>As senhas são diferentes</p>
                        )}

                        <button 
                            className={styles.btn} 
                            onClick={handleApply} 
                            type="submit"
                            disabled={!isButtonEnabled()}
                            > Criar 
                        </button>
                        <p className={styles.or}>ou</p>
                        <button 
                            className={styles.btn}  
                            type="button" 
                            onClick={() => navigate('/')}
                            >Voltar
                        </button>
                    </div>

                    <div className={styles.secDireita}>
                        {/* <img src={Logo} style={{width: '60%', opacity: '0.9'}}></img> */}
                    </div>

                </div>
            </form>

        </div>
    );
};

export default Cadastro;
