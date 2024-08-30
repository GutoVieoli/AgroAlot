// Salve este arquivo como .mjs ou garanta que seu package.json tenha "type": "module"
import * as turf from '@turf/turf';

// Defina as coordenadas do polígono
const coordinate = [
    [-21.191870, -46.019918], 
    [-21.211870, -46.019918], 
    [-21.241870, -46.069918], 
    [-21.211870, -46.099918], 
    [-21.191870, -46.099918],
    [-21.191870, -46.019918],
];

const coordinates = [
    [-46.0491207,-21.2187394],
    [-46.0497594,-21.2190624],
    [-46.0511684,-21.2198454],
    [-46.0525308,-21.2205857],
    [-46.0509493,-21.222249],
    [-46.0497443,-21.223498],
    [-46.0485045,-21.2227523],
    [-46.0477333,-21.222524],
    [-46.0471911,-21.2218801],
    [-46.0471378,-21.2217428],
    [-46.0471487,-21.2215136],
    [-46.047166,-21.2210162],
    [-46.0491207,-21.2187394],
    [-46.0491207,-21.2187394]
];

// Crie um polígono usando Turf.js
const polygon = turf.polygon([coordinates]);

// Calcule a área do polígono em metros quadrados
const area_m2 = turf.area(polygon);

// Converta a área para hectares (1 hectare = 10,000 metros quadrados)
const area_hectares = area_m2 / 10000;

console.log(`A área do polígono é de ${area_m2.toFixed(2)} metros quadrados ou ${area_hectares.toFixed(2)} hectares.`);
