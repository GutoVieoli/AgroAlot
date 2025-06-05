import styles from './Login.module.css'
import { useState} from 'react'
import { useNavigate} from 'react-router-dom'

const Login = () => {

    const [senha, setSenha] = useState('')
    const [email, setEmail] = useState('')
    const [erroMsg, setErroMsg] = useState('')
    const navigate = useNavigate()

    const handleChange = (event, index) => {
        const valor = event.target.value;

        switch(index){
            case 1:
                setEmail(valor);
                break;
            case 2:
                setSenha(valor);
                break;
        }
    }

    const handleApply = async (e) => {
        e.preventDefault();
        fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ senha, email })
            })
            .then((response) => {
                if ( !response.ok ){
                    return response.json().then((error) => {
                        setErroMsg(error.message)
                        throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
                    });
                }
                return response.json()
            })
            .then((data) => {
                localStorage.setItem('tokenJWT', data.token);
                navigate('/')
            })
            .catch((error) => {
                    console.error('Error:', error);
        });
    }

    const handleCadastro = (e) => {
        e.preventDefault();
        navigate('/cadastro');
    }

    return (

        <div className={styles.alinhador}>

            <form className={styles.loginbubble} >
                <div className={styles.alignbubble}>

                    <div className={styles.secEsquerda}>

                        <div className={styles.titulos}>
                            <h1>AgroAlot</h1>
                            <p>Faça o login para continuar.</p>
                        </div>

                        <input 
                            onChange={(event) => handleChange(event, 1)} 
                            className={styles.campos} 
                            type="text" 
                            placeholder='Login' />
                        <input 
                            onChange={(event) => handleChange(event, 2)} 
                            className={styles.campos} type="password" placeholder='Senha' />
                        <br></br>

                        {erroMsg && <p className={styles.erro}>{erroMsg}</p>}

                        <button 
                            onClick={(e) => handleApply(e)}
                            className={styles.btn} > Continuar 
                        </button>
                        <p className={styles.or}> ou </p>
                        <button 
                            onClick={(e) => handleCadastro(e)}
                            className={styles.btn} > Cadastrar-se 
                        </button>
                    </div>

                    <div className={styles.secDireita}>
                        {/* <img src={Logo} style={{width: '60%', opacity: '0.9'}}></img> */}
                    </div>

                </div>
            </form> 

        </div>
    )
}

export default Login
