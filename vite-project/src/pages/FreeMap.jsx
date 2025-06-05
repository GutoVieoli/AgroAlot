import { useState } from 'react'
import Map from '../components/Map'
import Topbar from '../components/Topbar'
import './FreeMap.css'

const FreeMap = () => {

    const [data, setData] = useState("")
    const [filtro, setFiltro] = useState("")
    const [renderizacao, setRenderizacao] = useState("")
    const [erroInvalido, setErroInvalido] = useState("")
    const [dataImg, setDataImg] = useState(null);

    const handleApply = () => {
        fetch("http://localhost:3000/requestMap/mapalivre", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data, filtro })
        })
        .then((response) => {
            if ( !response.ok ){
                return response.json().then((error) => {
                    setErroInvalido(error.message);
                    throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
                });
            }
            return response.json()
        })
        .then((data) => {
            setDataImg('')
            setDataImg(data.data)
            setRenderizacao(data.filtro)
            setErroInvalido()
        })
        .catch((error) => {
                console.error('Error:', error);
        });
    }

    return (
    <div>
        <Topbar />
        
        <div className='areaBotoes'>
            <input 
                className='dataFiltro' 
                type="date"  
                max={new Date().toISOString().split('T')[0]}
                min={"2022-08-01"}
                onChange={(e) => setData(e.target.value)}
            />
        
            <select className='tipoFiltro' onChange={(e) => setFiltro(e.target.value)} defaultValue="">
                <option value="" disabled>Filtro</option>
                <option value="NDVI">NDVI</option>
                <option value="RGB">RGB</option>
            </select>

            <button className='aplicarFiltro' onClick={handleApply} >APLICAR</button>

        </div>
        
        { 
                (dataImg !== null) ? 
                <p className="textDate">Data da imagem: {dataImg}</p> : null
        }
        { erroInvalido != '' ? <p className='textErro'>{ erroInvalido }</p> : null }

        <Map filtro={renderizacao} />

    </div>
    )

    
}

export default FreeMap
