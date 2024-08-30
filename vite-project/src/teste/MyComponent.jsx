import React from 'react';
import NDVIGraph from './NDVIGraph';

const MyComponent = () => {
  // Exemplo de dados de média de NDVI
  const jsonData = [
    { data: '2024-06-18', media_ndvi: 0.75 },
    { data: '2024-06-17', media_ndvi: 0.68 },
    { data: '2024-06-16', media_ndvi: 0.72 },
    { data: '2024-06-15', media_ndvi: 0.73 },
    { data: '2024-06-14', media_ndvi: 0.78 },
    { data: '2024-06-13', media_ndvi: 0.85 },
    // mais dados...
  ];

  return (
    <div>
      <h2>Gráfico de Média de NDVI</h2>
      <NDVIGraph data={jsonData} />
    </div>
  );
};

export default MyComponent;