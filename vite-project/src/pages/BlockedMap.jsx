import { useState } from 'react'
import Map from '../components/Map'
import './BlockedMap.css'
import Topbar from '../components/Topbar'


const BlockedMap = () => {

    const [data, setData] = useState("")
    const [filtro, setFiltro] = useState("")
    const [renderizacao, setRenderizacao] = useState("")
    const [erroInvalido, setErroInvalido] = useState("")

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
            return response.text()
        })
        .then((mapid) => {
            setRenderizacao(mapid)
            setErroInvalido()
        })
        .catch((error) => {
                console.error('Error:', error);
        });
    }

  return (
    <div>
        <Topbar />
        <div>
            
            
            <div className='dadosPropriedade'>
                <h1 className='nome' >Propriedade "Campinho" - Talhão "A02"</h1>
                <h2 className='sobre' >16.45 ha - Feijão</h2>
            </div>

            <div className='areaBotoes'>
                <input className='dataFiltro' type="date"  onChange={(e) => setData(e.target.value)}/>
            
                <select className='tipoFiltro' onChange={(e) => setFiltro(e.target.value)} defaultValue="">
                    <option value="" disabled>Filtro</option>
                    <option value="NDVI">NDVI</option>
                    <option value="NDRE">NDRE</option>
                    <option value="RGB">RGB</option>
                </select>

                <button className='aplicarFiltro' onClick={handleApply} >APLICAR</button>
            </div>

            { erroInvalido != '' ? <p className='textErro'>{ erroInvalido }</p> : null }

            <Map renderizacao={renderizacao} />

        </div>
    </div>
  )
}

export default BlockedMap
