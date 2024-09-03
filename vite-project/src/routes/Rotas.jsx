import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home'
import FreeMap from '../pages/FreeMap';
import BlockedMap from '../pages/BlockedMap';
import Cadastro from '../components/Cadastro';
import AddTalhaoPage from '../pages/AddTalhaoPage';
import TelaPropriedade from '../pages/TelaPropriedade';


const Private = ({ Pagina }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const token = localStorage.getItem('tokenJWT');
        if (token) {
            fetch("http://localhost:3000/autenticar", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((error) => {
                        throw new Error(`HTTP error! status: ${response.status}, message: token nao serve`);
                    });
                }
                return response.json();
            })
            .then((data) => {
                setIsLoggedIn(true);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isLoggedIn ? <Pagina /> : <Navigate to="/login" />;
}


const Rotas = () => {
    return (
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<Private Pagina={Home} />} />
              <Route path='/mapalivre' element={<Private Pagina={FreeMap} />} />
              <Route path='/mapapropriedade' element={<Private Pagina={BlockedMap}/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/add-talhao" element={<Private Pagina={AddTalhaoPage} /> } />
              <Route path="/telapropriedade" element={<Private Pagina={TelaPropriedade} /> } />
              <Route path='*' element={<Login />} />
          </Routes>
      </BrowserRouter> 
    )
  }
  

export default Rotas;
