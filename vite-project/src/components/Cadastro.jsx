import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../pages/Login.module.css'

const Cadastro = () => {

    const [senha, setSenha] = useState('')
    const [confirmaSenha, setConfirmaSenha] = useState('')
    const navigate = useNavigate();

    const handleChange = (event, index) => {
        const valor = event.target.value;
        console.log('Escrevendo...', event.target.value)

        switch(index){
            case 1:
                break;
            case 2:
                setSenha(valor);
                break;
            case 3:
                setConfirmaSenha(valor);
                break;
        }
    }

    return (
        <form className={styles.loginbubble}>
            <div className={styles.titulos}>
                <h1>Cadastre-se</h1>
                <p>É rápido e fácil.</p>
            </div>

            <input 
                onChange={(event) => handleChange(event, 1)} 
                className={styles.campos} type="text" placeholder='Email' />
            <input 
                onChange={(event) => handleChange(event, 2)} 
                className={styles.campos} type="password" placeholder='Senha' />
            <input 
                onChange={(event) => handleChange(event, 3)} 
                className={styles.campos} type="password" placeholder='Confirme a senha' />
            
            {
            senha != '' && confirmaSenha !='' && senha != confirmaSenha ? 
            <p>As senhas são diferentes</p> : undefined 
            }


            <br></br>
            <button className={styles.btn} type="submit"> Criar </button>
            <p className={styles.or}> ou </p>
            <button className={styles.btn} type="button" onClick={() => navigate('/')}> Voltar </button>
        </form>
    )
}

export default Cadastro