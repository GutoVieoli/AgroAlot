import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './NDVIReport.css';
import Logo from '../assets/Logo.svg'

const NDVIReport = ({ dados }) => {

    const reportRef = useRef();
    const dataAtual = new Date().toLocaleString('pt-BR');
    const [ mapaRGB, setMapaRGB ] = useState(null);

    const zoom = 16;
    const width = 1920;
    const height = 1080;

    const apiKey = import.meta.env.VITE_API_KEY;
      

    const carregarImagemComoBase64 = (url) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const base64 = canvas.toDataURL("image/png");
            setMapaRGB(base64);
        };
        img.onerror = () => {
            console.error("Erro ao carregar imagem do mapa.");
        };
        img.src = url;
    };

    // useEffect para carregar a imagem uma vez
    useEffect(() => {
        if (dados.centralizacao && Array.isArray(dados.centralizacao)) {
        const lat = dados.centralizacao[0];
        const lng = dados.centralizacao[1];
        console.log(lat, lng)
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lng},${lat}&zoom=${zoom}&size=${width}x${height}&maptype=satellite&key=${apiKey}`;
        carregarImagemComoBase64(url);
        }
    }, [dados.centralizacao]);



    
    const gerarPDF = () => {
        if (reportRef.current) {
        html2pdf()
            .from(reportRef.current)
            .set({
            margin: [1, 0.5, 1, 0.5],
            filename: 'relatorio-ndvi.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
            })
            .save();
        }
    };


  const gerarResumoPorAno = (dadosNDVI) => {
    const agrupado = {};
  
    dadosNDVI.forEach(item => {
      const [ano, mes] = item.capture_date.split('-');
      const chaveAno = ano;
      const chaveMes = `${ano}-${mes}`;
  
      if (!agrupado[chaveAno]) agrupado[chaveAno] = {};
      if (!agrupado[chaveAno][chaveMes]) agrupado[chaveAno][chaveMes] = [];
  
      agrupado[chaveAno][chaveMes].push(item.valor);
    });
  
    // Para cada ano, gera a lista de resumos mensais
    const resultado = {};
    Object.entries(agrupado).forEach(([ano, meses]) => {
      resultado[ano] = Object.entries(meses).map(([mes, valores]) => {
        const media = valores.reduce((a, b) => a + b, 0) / valores.length;
        const minimo = Math.min(...valores);
        const maximo = Math.max(...valores);
  
        // Corrige mês para exibir corretamente
        const [a, m] = mes.split('-');
        const mesFormatado = new Date(Number(a), Number(m) - 1, 1).toLocaleDateString('pt-BR', {
          month: 'short',
          year: 'numeric'
        });
  
        return {
          mes: mesFormatado,
          medio: media,
          minimo: minimo,
          maximo: maximo
        };
      });
    });
  
    return resultado; // objeto: { '2022': [...], '2023': [...], ... }
  };

  return (
    <>

      <div className="div-botao">
            <h1 onClick={gerarPDF} className='botao-baixar-relatorio'>
                Baixar Relatório do NDVI
            </h1>
        </div>

      <div ref={reportRef} style={{ padding: '40px', fontFamily: 'Arial' }}>
        <header className='cabecalhoPDF'>
          <img src={Logo} alt="Logo AgroAlot"/>
          <h1>Relatório NDVI - AgroAlot</h1>
        </header>

        <div className='dadosGerais'>
          <p><strong>Engenheiro Agrônomo: </strong>{dados.nome_engenheiro}</p>
          <p><strong>CREA: </strong> {dados.crea_engenheiro}</p>
          <br></br>
          <p><strong>Proprietátio:</strong> {dados.proprietario}</p>
          <p><strong>Propriedade:</strong> {dados.propriedade}</p>
          <p><strong>Talhão:</strong> {dados.talhao}</p>
          <p><strong>Área:</strong> {dados.area} ha</p>
          <p><strong>Cultura:</strong> {dados.cultura}</p>
          <br></br>
        </div>

        { dados.centralizacao && (
            <div className='imagemAerea'>
                <h2>Imagem aérea de referência</h2>
                <img
                    src={mapaRGB}
                    alt="Mapa estático"
                    style={{ 
                        width: '80%',
                        objectFit: 'cover',
                        margin: '5px 0' }}
                />
            </div>
        )}

        {dados.graficoNDVICompleto && (
            <div className='graficoNDVI'>
                <h2>Gráfico: NDVI completo por período</h2>
                <img
                src={dados.graficoNDVICompleto}
                alt="Gráfico NDVI"
                />
            </div>
        )}

        {dados.graficoNDVIMensal && (
            <div className='graficoNDVI'>
                <h2>Gráfico: NDVI médio mensal</h2>
                <img
                  src={dados.graficoNDVIMensal}
                  alt="Gráfico NDVI mensal"
                />
            </div>
        )}


        <div className='tabelasNDVIAno'>
          <h2>Tabelas de NDVI por mês (agrupadas por ano)</h2>
          {Object.entries(gerarResumoPorAno(dados.dadosNDVI)).map(([ano, linhas]) => (
              <div key={ano} style={{ pageBreakInside: 'avoid', marginBottom: '40px' }} className='tabelaResumo'>
                  <h3 style={{ marginTop: '18px', marginBottom: '5px' }}>Ano de referência: {ano}</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                          <th style={{ border: '1px solid #aaa' }}>Mês</th>
                          <th style={{ border: '1px solid #aaa' }}>NDVI Médio</th>
                          <th style={{ border: '1px solid #aaa' }}>NDVI Mínimo</th>
                          <th style={{ border: '1px solid #aaa' }}>NDVI Máximo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {linhas.map((linha, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #aaa' }}>{linha.mes}</td>
                            <td style={{ border: '1px solid #aaa' }}>{linha.medio.toFixed(2)}</td>
                            <td style={{ border: '1px solid #aaa' }}>{linha.minimo.toFixed(2)}</td>
                            <td style={{ border: '1px solid #aaa' }}>{linha.maximo.toFixed(2)}</td>
                        </tr>
                        ))}
                    </tbody>
                  </table>
              </div>
          ))}
        </div>


        <div className='notaDeConclusao'>
          <h2>Conclusões Técnicas</h2>
          <p>
            {dados.conclusoes}
          </p>
        </div>

        <div className='assinaturaTecnico'>
          <p>Assinatura do Técnico Responsável</p>
        </div>

        <footer style={{ marginTop: '40px', fontSize: '12px', textAlign: 'center', color: '#666' }}>
          Este relatório apresenta dados de NDVI gerados pelo AgroAlot.<br></br>Documento gerado em {dataAtual}.
        </footer>
      </div>
    </>
  );
};

export default NDVIReport;
