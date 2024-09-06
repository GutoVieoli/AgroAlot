import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import './GraficoNDVI.css';

const GraficoNDVI = () => {
    const [dadosNDVI, setDadosNDVI] = useState([]);
    const [dataInicio, setDataInicio] = useState('2024-08-01');
    const [dataFim, setDataFim] = useState('2024-09-01');
    const [erro, setErro] = useState('');
    const chartRef = useRef(null);

    // Data atual para evitar seleção de datas futuras
    const hoje = new Date().toISOString().split('T')[0];

    // gambiarra pra simular os valores 
    const gerarDadosNDVI = () => {
        const dados = [];
        let dataInicial = new Date(dataInicio);
        let dataFinal = new Date(dataFim);

        // antiburro
        if (dataInicial > dataFinal) {
            setErro('A data de início não pode ser maior que a data de fim.');
            return;
        }

        setErro(''); 
        while (dataInicial <= dataFinal) {
            const valorNDVI = Math.random() * 100; // faz parte da gambiarra
            dados.push({ data: dataInicial.toISOString().slice(0, 10), valor: parseFloat(valorNDVI.toFixed(2)) });
            dataInicial.setDate(dataInicial.getDate() + 5); 
        }

        setDadosNDVI(dados);
    };

    // atualiza toda vez que muda as data
    useEffect(() => {
        gerarDadosNDVI();
    }, [dataInicio, dataFim]);


    const calcularMediaNDVI = () => {
        const total = dadosNDVI.reduce((acc, item) => acc + item.valor, 0);
        return (total / dadosNDVI.length).toFixed(2);
    };

    
    const ultimoNDVI = () => {
        if (dadosNDVI.length > 0) {
            return dadosNDVI[dadosNDVI.length - 1].valor.toFixed(2);
        }
        return null;
    };

    // deixar a linha colorida conforme o valor dos ndvi
    const createGradient = (ctx, area) => {
        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
        gradient.addColorStop(0, '#f44336'); // vermehlo perto do 0
        gradient.addColorStop(0.5, '#ffeb3b'); // amarelo perto do 50
        gradient.addColorStop(1, '#4caf50'); // verde perto do 100
        return gradient;
    };

    const data = {
        labels: dadosNDVI.map(item => item.data),
        datasets: [
            {
                label: 'NDVI',
                data: dadosNDVI.map(item => item.valor),
                fill: false,
                borderColor: chartRef.current ? createGradient(chartRef.current.ctx, chartRef.current.chartArea) : '#5F6F52',
                pointBackgroundColor: dadosNDVI.map(item => {
                    const valor = item.valor;
                    if (valor >= 75) return '#4caf50';
                    if (valor >= 50) return '#ffeb3b';
                    return '#f44336';
                }),
                tension: 0.4,  // viadagem das linhas e pnto do grafico
                borderWidth: 2,  
                pointRadius: 4, 
                pointHoverRadius: 6  
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // macumba do gpt 
        scales: {
            x: {
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
                max: 100, 
                ticks: {
                    stepSize: 25, 
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
            }
        }
    };

    return (
        <div className="grafico-container">
            <div className="informacoes-ndvi">
                <p>Média de NDVI: <strong>{calcularMediaNDVI()}</strong></p>
                <p>Último NDVI: <strong>{ultimoNDVI()}</strong></p>
            </div>
            {erro && <p className="erro-mensagem">{erro}</p>} {/* antiburro */}
            <div className="intervalo-datas">
                <label>
                    Data Início:
                    <input 
                        type="date" 
                        value={dataInicio} 
                        max={hoje}  //antiburro
                        onChange={(e) => setDataInicio(e.target.value)} 
                    />
                </label>
                <label>
                    Data Fim:
                    <input 
                        type="date" 
                        value={dataFim} 
                        max={hoje}  // antiburro
                        onChange={(e) => setDataFim(e.target.value)} 
                    />
                </label>
            </div>
            <div className="grafico-wrapper">
                <Line ref={chartRef} data={data} options={options} />
            </div>
        </div>
    );
};

export default GraficoNDVI;
