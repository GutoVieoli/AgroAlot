import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
//import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './GraficoNDVI.css';



import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);



const GraficoNDVI = ( {dadosNDVI, qtdDiasLacunas, tituloGrafico, setGrafico64} ) => {

    const [dataInicio, setDataInicio] = useState('2022-06-01');
    const [dataFim, setDataFim] = useState('2025-06-01');

    const [dataInicioFiltrada, setDataInicioFiltrada] = useState('2022-06-01');
    const [dataFimFiltrada, setDataFimFiltrada] = useState('2025-06-01');

    const [mediaNDVI, setMediaNDVI] = useState(0);
    const [ultimoNDVI, setUltimoNDVI] = useState('as');

    const [lacunas, setLacuna] = useState(null);
    const [annotations, setAnnotations] = useState(null);
    const [options, setOptions] = useState(null);

    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null);



    useEffect(() => {
        async function datas_ndvi() {
            setDataInicio(dadosNDVI[0].capture_date)
            setDataFim(dadosNDVI[dadosNDVI.length - 1].capture_date)

            setDataInicioFiltrada(dataInicio)
            setDataFimFiltrada(dataFim)

            calcularUltimoNDVI(dadosNDVI)
            calcularMediaNDVI(dadosNDVI)

            await encontrarLacunas(dadosNDVI)
        }

        datas_ndvi();
    }, []);
      
    

    useEffect(() => {
        const dadosFiltrados = filtrarDadosPorPeriodo(dadosNDVI);

        calcularUltimoNDVI(dadosFiltrados)
        calcularMediaNDVI(dadosFiltrados)

        encontrarLacunas(dadosFiltrados)
        
        setChartData({
            labels: dadosFiltrados.map(item => item.capture_date),
            datasets: [
                {
                    label: 'NDVI',
                    data: dadosFiltrados.map(item => item.valor),
                    fill: false,
                    borderColor: chartRef.current ? createGradient(chartRef.current.ctx, chartRef.current.chartArea) : '#5F6F52',
                    pointBackgroundColor: dadosFiltrados.map(item => {
                        const valor = item.valor;
                        if (valor >= 0.38) return '#4caf50';
                        if (valor >= 0.2) return '#ffeb3b';
                        return '#f44336';
                    }),
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        });

    }, [dataInicioFiltrada, dataFimFiltrada, dadosNDVI]);

    useEffect(() => {
        if(chartRef.current)
            setTimeout(() => {
                const img64 = chartRef.current.toBase64Image();
                setGrafico64(img64);
            }, 500);
    }, [chartData]);

    useEffect(() => {
        setarAnnotations()
    }, [lacunas]);
    

    useEffect(() => {
        setarOptions()
    }, [annotations]);


    const calcularMediaNDVI = (dados) => {
        const total = dados.reduce((acc, item) => acc + (item.valor), 0);
        setMediaNDVI( (total / dados.length).toFixed(2) );
    };

    
    const calcularUltimoNDVI = (dados) => {
        if (dados.length > 0) {
            setUltimoNDVI( dados[dados.length - 1].valor.toFixed(2) );
        }
        else {
            setUltimoNDVI(null);
        }
    };

    const filtrarDadosPorPeriodo = (dados) => {
        return dados.filter(item => {
            const dataItem = new Date(item.capture_date);
            return dataItem >= new Date(dataInicioFiltrada) && dataItem <= new Date(dataFimFiltrada);
        });
    };

 
    // deixar a linha colorida conforme o valor dos ndvi
    const createGradient = (ctx, area) => {
        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
        gradient.addColorStop(0, '#f44336'); // vermehlo perto do 0
        gradient.addColorStop(0.5, '#ffeb3b'); // amarelo perto do 50
        gradient.addColorStop(1, '#4caf50'); // verde perto do 100
        return gradient;
    };


    function modificarData(date, days) {
        const novaData = new Date(date);
        novaData.setDate(novaData.getDate() + days);
        return novaData;
    }

    async function encontrarLacunas(dados) {
        const allLacunas = [];
        const sortedDados = [...dados].sort((a, b) => new Date(a.capture_date) - new Date(b.capture_date));
    
        for (let i = 1; i < sortedDados.length; i++) {
            const dataAtual = new Date(sortedDados[i].capture_date);
            const dataAnterior = new Date(sortedDados[i - 1].capture_date);
            const diffDias = (dataAtual - dataAnterior) / (1000 * 60 * 60 * 24);
    
            if (diffDias > qtdDiasLacunas) {
                allLacunas.push({
                    inicio: modificarData(dataAnterior, 4),
                    fim: modificarData(dataAtual, -4)
                });
            }
        }
    
        setLacuna(allLacunas)

    }
    


    async function setarAnnotations() {
        setAnnotations(  lacunas.map((lacuna, index) => ({
                type: 'box',
                xMin: lacuna.inicio,
                xMax: lacuna.fim,
                yMin: 0,
                yMax: 0.8, // Ajuste conforme o seu eixo Y
                backgroundColor: 'rgba(0, 123, 255, 0.25)', // Azul claro semi-transparente
                borderWidth: 0,
            }))
        )

    } 


    async function setarOptions(){
        setOptions(    {
                responsive: true,
                maintainAspectRatio: false, // macumba do gpt 
                scales: {
                    x: {
                        type: 'time',
                        title: {
                            display: true,
                            text: 'Data',
                            color: '#333',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            display: false  
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'NDVI',
                            color: '#333',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        min: 0, 
                        max: 0.8, 
                        ticks: {
                            stepSize: 0.2, 
                            color: '#666',
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            color: '#ddd', 
                            borderDash: [5, 5]  
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `NDVI: ${tooltipItem.raw}`;
                            }
                        }
                    },
                    legend: {
                        display: false  
                    },
                    annotation: {
                        annotations: annotations
                    },
                    title: {
                        display: true,
                        text: tituloGrafico,
                        font: {
                          size: 18,
                          weight: "bold"
                        },
                        color: '#333',
                        padding: {
                          top: 5,
                          bottom: 10
                        }
                      }
                    }
                }
        )
    }


    // Função para salvar o gráfico como imagem
    const salvarGraficoComoImagem = () => {
        if (chartRef.current) {
            const chartInstance = chartRef.current;
            const base64Image = chartInstance.toBase64Image(); // Converte o gráfico para imagem base64
            const link = document.createElement('a');
            link.href = base64Image;
            link.download = 'grafico-ndvi.png'; // Nome do arquivo
            link.click();
        }
    };


    return (
        <div className="grafico-container">
            <div className="informacoes-ndvi">
                <p>Média de NDVI: <strong>{mediaNDVI}</strong></p>
                <p>Último NDVI: <strong>{ultimoNDVI}</strong></p>
            </div>
            <div className="intervalo-datas">
                <label>
                    Data Início:
                    <input 
                        type="date" 
                        value={dataInicioFiltrada} 
                        max={dataFim}  //antiburro
                        min={dataInicio}
                        onChange={(e) => setDataInicioFiltrada(e.target.value)} 
                    />
                </label>
                <label>
                    Data Fim:
                    <input 
                        type="date" 
                        value={dataFimFiltrada} 
                        max={dataFim}  // antiburro
                        min={dataInicio}
                        onChange={(e) => setDataFimFiltrada(e.target.value)} 
                    />
                </label>
            </div>
            <div className="grafico-wrapper">
                {chartData && <Line ref={chartRef} data={chartData} options={options} />}
            </div>
            <button onClick={salvarGraficoComoImagem} className="salvar-grafico-btn">Salvar Gráfico como Imagem</button>
        </div>
    );
};

export default GraficoNDVI;
