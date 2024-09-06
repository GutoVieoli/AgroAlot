import { useState } from 'react';
import Map from '../components/Map';
import Topbar from '../components/Topbar';
import GraficoNDVI from '../components/GraficoNDVI';
import './BlockedMap.css';

const BlockedMap = () => {
    const [data, setData] = useState('');
    const [filtro, setFiltro] = useState('');
    const [renderizacao, setRenderizacao] = useState('');
    const [erroInvalido, setErroInvalido] = useState('');
    const [dadosNDVI, setDadosNDVI] = useState([]);


    const handleApply = () => {
        fetch('http://localhost:3000/requestMap/mapalivre', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data, filtro })
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((error) => {
                        setErroInvalido(error.message);
                        throw new Error(
                            `HTTP error! status: ${response.status}, message: ${error.message}`
                        );
                    });
                }
                return response.text();
            })
            .then((mapid) => {
                setRenderizacao(mapid);
                setErroInvalido('');
                // Aqui você pode preencher os dados de NDVI simulados
                const dadosSimulados = [
                    { data: '2024-08-01', valor: 0.7 },
                    { data: '2024-08-02', valor: 0.6 },
                    { data: '2024-08-03', valor: 0.65 },
                    { data: '2024-08-04', valor: 0.7 }
                    // Adicione mais dados simulados
                ];
                setDadosNDVI(dadosSimulados);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <Topbar />
            <div>
                <div className="dadosPropriedade">
                    <h1 className="nome">Propriedade "Campinho" - Talhão "A02"</h1>
                    <h2 className="sobre">16.45 ha - Feijão</h2>
                </div>

                <div className="areaBotoes">
                    <input
                        className="dataFiltro"
                        type="date"
                        onChange={(e) => setData(e.target.value)}
                    />

                    <select
                        className="tipoFiltro"
                        onChange={(e) => setFiltro(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Filtro
                        </option>
                        <option value="NDVI">NDVI</option>
                        <option value="NDRE">NDRE</option>
                        <option value="RGB">RGB</option>
                    </select>

                    <button className="aplicarFiltro" onClick={handleApply}>
                        APLICAR
                    </button>
                </div>

                {erroInvalido !== '' ? <p className="textErro">{erroInvalido}</p> : null}

                <Map renderizacao={renderizacao} />

                {/* aqui ta o grafico */}
                {dadosNDVI.length > 0 && <GraficoNDVI dadosNDVI={dadosNDVI} />}
            </div>
        </div>
    );
};

export default BlockedMap;
