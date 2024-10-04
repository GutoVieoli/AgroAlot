import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Map from '../components/Map';
import Topbar from '../components/Topbar';
import GraficoNDVI from '../components/GraficoNDVI';
import './BlockedMap.css';

const BlockedMap = () => {
    const effectRan = useRef(false);
    const [searchParams] = useSearchParams();

    const talhaoId = searchParams.get('talhao');
    const propriedadeId = searchParams.get('propriedade');

    const [propriedade_nome, setPropriedadeNome] = useState('Fazenda');
    const [talhao_nome, setTalhaoNome] = useState('ABC');
    const [talhao_area, setTalhaoArea] = useState(5.80);
    const [talhao_cultura, setTalhaoCultura] = useState('Milho');

    const [data, setData] = useState('');
    const [filtro, setFiltro] = useState('');
    const [renderizacao, setRenderizacao] = useState('');
    const [erroInvalido, setErroInvalido] = useState('');
    const [dadosNDVI, setDadosNDVI] = useState([]);

    useEffect( () => {
        if (effectRan.current) return;  // Impede execuções subsequentes
        async function fetchDadosTalhao() {
            try {
                const tokenJWT = localStorage.getItem('tokenJWT');
                const response = await fetch('http://localhost:3000/propriedades/dados_talhao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        propriedade_id : propriedadeId,
                        talhao_id : talhaoId,
                        tokenJWT
                    }),
                });
    
                const data = await response.json()
                setPropriedadeNome(data.data[0].nome);
                setTalhaoNome(data.data[0].talhoes[0].nome);
                setTalhaoArea(data.data[0].talhoes[0].area);
                setTalhaoCultura(data.data[0].talhoes[0].cultura);
            } catch (error) {
                console.error('Erro ao enviar dados:', error);
            }
        }

        fetchDadosTalhao();
        effectRan.current = true; // Marca que o efeito já foi executado
    }, []);

    const handleApply = () => {
        fetch('http://localhost:3000/requestMap/mapalivre', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data, filtro, talhao_id : talhaoId, })
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
                    <h1 className="nome">{propriedade_nome} - Talhão "{talhao_nome}"</h1>
                    <h2 className="sobre">{talhao_area} ha - {talhao_cultura}</h2>
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
