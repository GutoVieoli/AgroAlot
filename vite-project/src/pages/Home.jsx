import { Link } from 'react-router-dom'

import styles from './Home.module.css';
import livreImage from '../assets/livre.jpeg';
import talhaoImage from '../assets/talhao.png'
import tratorImage from '../assets/trator.webp'




const Home = () => {
  return (

    <div className={styles.container}>

      <Link to='/mapalivre' className={styles.block} style={{ backgroundImage: `url(${livreImage})` }}>
        <h1>Mapa Livre</h1>
      </Link>

      <Link to='/telapropriedade' className={styles.block} style={{ backgroundImage: `url(${tratorImage})` }}>
        <h1>Propriedeades e culturas</h1>
      </Link>

      <Link to='/add-talhao' className={styles.block} style={{ backgroundImage: `url(${talhaoImage})` }}>
        <h1>Adicionar Talhões</h1>
      </Link>

    </div>
  );
};

export default Home;
