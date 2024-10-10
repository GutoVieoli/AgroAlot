import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Map from '../components/Map';
import Topbar from '../components/Topbar';
import GraficoNDVI from '../components/GraficoNDVI';
import './BlockedMap.css';

const BlockedMap = () => {
    const [searchParams] = useSearchParams();

    const talhaoIdParam = searchParams.get('talhao');
    const propriedadeId = searchParams.get('propriedade');

    const [propriedade_nome, setPropriedadeNome] = useState('');
    const [talhao_nome, setTalhaoNome] = useState('');
    const [talhao_area, setTalhaoArea] = useState(0);
    const [talhao_cultura, setTalhaoCultura] = useState('');
    const [talhoes, setTalhoes] = useState([]);
    const [talhaoSelecionado, setTalhaoSelecionado] = useState(null);

    const [data, setData] = useState('');
    const [filtro, setFiltro] = useState('');
    const [renderizacao, setRenderizacao] = useState('');
    const [erroInvalido, setErroInvalido] = useState('');
    const [dadosNDVI, setDadosNDVI] = useState([]);

    useEffect(() => {
        async function fetchTalhoesDaPropriedade() {
            try {
                const tokenJWT = localStorage.getItem('tokenJWT');
                const response = await fetch('http://localhost:3000/propriedades/listar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        tokenJWT
                    }),
                });
                const data = await response.json();
                const propriedades = data.propriedades;

                // Encontra a propriedade selecionada pelo ID
                const propriedadeSelecionada = propriedades.find(
                    (propriedade) => propriedade.id === parseInt(propriedadeId)
                );

                if (propriedadeSelecionada) {
                    setPropriedadeNome(propriedadeSelecionada.nome);
                    setTalhoes(propriedadeSelecionada.talhoes);

                    // Define o talhão inicial
                    const talhaoInicial = propriedadeSelecionada.talhoes.find(
                        (talhao) => talhao.id === parseInt(talhaoIdParam)
                    ) || propriedadeSelecionada.talhoes[0];

                    if (talhaoInicial) {
                        setTalhaoSelecionado(talhaoInicial.id);
                        setTalhaoNome(talhaoInicial.nome);
                        setTalhaoArea(talhaoInicial.area);
                        setTalhaoCultura(talhaoInicial.cultura);
                    } else {
                        console.error('Talhão não encontrado');
                    }
                } else {
                    console.error('Propriedade não encontrada');
                }
            } catch (error) {
                console.error('Erro ao carregar propriedades:', error);
            }
        }

        fetchTalhoesDaPropriedade();
    }, [propriedadeId, talhaoIdParam]);

    const handleApply = () => {
        fetch('http://localhost:3000/requestMap/mapalivre', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data, filtro, talhao_id: talhaoSelecionado })
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
            ];
            setDadosNDVI(dadosSimulados);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleChangeTalhao = (e) => {
        const talhaoIdSelecionado = e.target.value;
        const talhao = talhoes.find(t => t.id === parseInt(talhaoIdSelecionado));

        if (talhao) {
            setTalhaoNome(talhao.nome);
            setTalhaoArea(talhao.area);
            setTalhaoCultura(talhao.cultura);
            setTalhaoSelecionado(talhao.id);

            // Opcional: Resetar outros estados se necessário
            setRenderizacao('');
            setDadosNDVI([]);
        }
    };

    return (
        <div>
            <Topbar />
            <div className="container-detalhes maior-container">
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

                    <select className="talhaoDropdown" onChange={handleChangeTalhao} value={talhaoSelecionado || ''}>
                        {talhoes.length > 0 ? (
                            talhoes.map((talhao) => (
                                <option key={talhao.id} value={talhao.id}>
                                    {talhao.nome} - {talhao.area} ha
                                </option>
                            ))
                        ) : (
                            <option disabled>Nenhum talhão disponível</option>
                        )}
                    </select>
                </div>

                {erroInvalido !== '' ? <p className="textErro">{erroInvalido}</p> : null}

                <Map renderizacao={renderizacao} />

                {dadosNDVI.length > 0 && <GraficoNDVI dadosNDVI={dadosNDVI} />}
            </div>
        </div>
    );
};

export default BlockedMap;
