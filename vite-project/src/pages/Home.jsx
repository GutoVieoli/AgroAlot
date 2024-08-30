import { Link } from 'react-router-dom'

import styles from './Home.module.css';
import sojaImage from '../assets/soja.webp';



const Home = () => {
  return (

    <div className={styles.container}>

      <Link to='/mapalivre' className={styles.block} style={{ backgroundImage: `url(${sojaImage})` }}>
        <h1>Mapa Livre</h1>
      </Link>

      <Link to='/mapapropriedade' className={styles.block} style={{ backgroundImage: `url(${sojaImage})` }}>
        <h1>Talhões</h1>
      </Link>

      <Link to='/add-talhao' className={styles.block} style={{ backgroundImage: `url(${sojaImage})` }}>
        <h1>Adicionar Talhões</h1>
      </Link>

    </div>
  );
};

export default Home;
