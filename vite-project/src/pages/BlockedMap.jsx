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
    const [talhaoIdSelecionado, setTalhaoIdSelecionado] = useState(null);

    const [data, setData] = useState('');
    const [filtro, setFiltro] = useState('');
    const [renderizacao, setRenderizacao] = useState('');
    const [erroInvalido, setErroInvalido] = useState('');
    const [dadosNDVI, setDadosNDVI] = useState([]);

    const [nuvensAprox, setNuvensAprox] = useState(null);
    const [dataImg, setDataImg] = useState(null);

    async function fetchDadosTalhao(propriedade_id, talhao_id) {
        try {
            const tokenJWT = localStorage.getItem('tokenJWT');
            const response = await fetch('http://localhost:3000/propriedades/dados_talhao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    propriedade_id,
                    talhao_id,
                    tokenJWT
                }),
            });

            const data = await response.json()
            setPropriedadeNome(data.data[0].nome);
            setTalhaoNome(data.data[0].talhoes[0].nome);
            setTalhaoArea(data.data[0].talhoes[0].area);
            setTalhaoCultura(data.data[0].talhoes[0].cultura);

            setTalhaoIdSelecionado(talhao_id)
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    }

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
                    setTalhoes(propriedadeSelecionada.talhoes);
                } else {
                    console.error('Propriedade não encontrada');
                }
            } catch (error) {
                console.error('Erro ao carregar propriedades:', error);
            }
        }

        fetchTalhoesDaPropriedade();
        fetchDadosTalhao(propriedadeId, talhaoIdParam);
    }, [propriedadeId, talhaoIdParam]);

    const handleApply = () => {
        fetch('http://localhost:3000/requestMap/mapatalhao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data, filtro, talhao_id: talhaoIdSelecionado })
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
            return response.json();
        })
        .then((data) => {
            console.log(data)
            setNuvensAprox(data.nuvens)
            setDataImg(data.data)

            setRenderizacao(data.filtro);
            setErroInvalido('');

            handleNDVI()
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };


    const handleNDVI = () => {
        fetch(`http://localhost:3000/ndvi/historico/${talhaoIdSelecionado}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
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
            return response.json();
        })
        .then((data) => {
            console.log(data)
            // setNuvensAprox(data.nuvens)
            // setDataImg(data.data)

            // setRenderizacao(data.filtro);
            // setErroInvalido('');
            // // Aqui você pode preencher os dados de NDVI simulados
            // const dadosSimulados = [
            //     { data: '2024-08-01', valor: 0.7 },
            //     { data: '2024-08-02', valor: 0.6 },
            //     { data: '2024-08-03', valor: 0.65 },
            //     { data: '2024-08-04', valor: 0.7 }
            // ];
            if (data.ndvis && Array.isArray(data.ndvis)) {

                const dadosConvertidos = data.ndvis.map(item => ({
                    ...item,
                    valor: Number(item.valor),
                    cloud_percentage: Number(item.cloud_percentage),
                    capture_date: item.capture_date,
                }));
                setDadosNDVI(dadosConvertidos);
            } else {
                setErro('Formato de dados inesperado');
            }
            
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };



    const handleChangeTalhao = (e) => {
        setTalhaoIdSelecionado(e.target.value);

        fetchDadosTalhao(propriedadeId, e.target.value);
    };

    return (
        <div>
            <Topbar />

            <div className="dadosPropriedade">
                <h1 className="nome">{propriedade_nome} - Talhão "{talhao_nome}"</h1>
                <h2 className="sobre">{talhao_area} ha - {talhao_cultura}</h2>
            </div>

            <div className="areaBotoes">
                <select className="talhaoDropdown" onChange={handleChangeTalhao} value={talhaoIdSelecionado || ''}>
                    <option key={talhaoIdParam} value={talhaoIdParam}>
                        {talhao_nome} - {talhao_area} ha
                    </option>
                    {talhoes.length > 0 ? (
                        talhoes.map((talhao) => (
                            talhao.nome != talhao_nome ?
                                <option key={talhao.id} value={talhao.id}>
                                    {talhao.nome} - {talhao.area} ha
                                </option>
                            : null
                        ))
                    ) : (
                        <option disabled>Nenhum talhão disponível</option>
                    )}
                </select>

                <input
                    className="dataFiltro"
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    min={"2022-11-01"}
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

            {
                (nuvensAprox !== null && nuvensAprox >= 10) ?
                <p className="textNuvem">Pode haver distorções na imagem devido a quantidade de nuvens na área. Aproximadamente {nuvensAprox}%</p> : null
            }
            { 
                (dataImg !== null &&  nuvensAprox !== null) ? 
                <p className="textDate">Data da imagem: {dataImg}</p> : null
            }
            {
                erroInvalido !== '' ? 
                <p className="textErro">{erroInvalido}</p> : null
            }

            <Map renderizacao={renderizacao} />

            {dadosNDVI.length > 0 && <GraficoNDVI dadosNDVI={dadosNDVI} />}
        </div>
    );
};

export default BlockedMap;
