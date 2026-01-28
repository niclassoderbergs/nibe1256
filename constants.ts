
import { HouseSpecs, HeatingSystem, WeatherData, SimulationData } from './types';

export const MY_HOUSE: HouseSpecs = {
  location: 'Åre, Sverige',
  builtYear: 1890,
  movedYear: 1990,
  renovatedYear: 2015,
  structure: 'Timmerstomme (Tilläggsisolerad)',
  floors: 3,
  areaPerFloor: 80,
  totalHeatedArea: 160, // Only top two floors
};

export const MY_SYSTEM: HeatingSystem = {
  model: 'NIBE S1256-13',
  type: 'Bergvärme (Inverter)',
  features: [
    'Smart styrning (S-serien)',
    'Inverterkompressor',
    'Integrerad VVB (men används ej?)', 
    'Uppkoppling via myUplink'
  ],
  limitations: [
    'Enkelt radiatorsystem (1 krets)',
    'Ingen extern arbetstank',
    'Blandade framledningstemperaturer'
  ],
  emitters: [
    // --- PLAN 3 ---
    {
      id: '6',
      type: 'Golvkonvektor',
      location: 'Plan 3 - Allrum',
      description: 'Naturkonvektion (utan fläkt).',
      tempRequirement: 'Medium',
      specs: {
        brand: 'AQUILO (Rettig)',
        model: 'FMK-18-190-09',
        ratedPowerW: 378,
        dtRated: 50,
        dimensions: 'L: 190cm, B: 18cm, D: 9cm'
      },
      observedPeakTemp: 45, 
      coordinates: { floor: 3, x: 75, y: 40 } 
    },
    {
      id: '2a_1',
      type: 'Radiator',
      location: 'Plan 3 - Sovrum 1',
      description: 'Zehnder Charleston 2-pelare.',
      tempRequirement: 'Medium',
      specs: {
        brand: 'Zehnder',
        model: 'Charleston (7 sektioner)',
        ratedPowerW: 175,
        dtRated: 50,
        dimensions: 'H: 250mm, B: 400mm'
      },
      observedPeakTemp: 40,
      coordinates: { floor: 3, x: 22, y: 40 }
    },
    {
      id: '2a_2',
      type: 'Radiator',
      location: 'Plan 3 - Sovrum 2',
      description: 'Zehnder Charleston 2-pelare.',
      tempRequirement: 'Medium',
      specs: {
        brand: 'Zehnder',
        model: 'Charleston (7 sektioner)',
        ratedPowerW: 175,
        dtRated: 50,
        dimensions: 'H: 250mm, B: 400mm'
      },
      observedPeakTemp: 40,
      coordinates: { floor: 3, x: 22, y: 15 }
    },

    // --- PLAN 2 ---
    {
      id: '1',
      type: 'Golvkonvektor',
      location: 'Plan 2 - Matplats',
      description: 'Naturkonvektion i golvränna.',
      tempRequirement: 'Medium',
      specs: {
        brand: 'AQUILO (Rettig)',
        model: 'FMK-18-290-09',
        ratedPowerW: 606, 
        dtRated: 50,
        dimensions: 'L: 290cm, B: 18cm, D: 9cm'
      },
      observedPeakTemp: 48, 
      coordinates: { floor: 2, x: 65, y: 45 }
    },
    {
      id: '5',
      type: 'Golvkonvektor',
      location: 'Plan 2 - Vardagsrum',
      description: 'Naturkonvektion. Stort fönster.',
      tempRequirement: 'Medium',
      specs: {
        brand: 'AQUILO (Rettig)',
        model: 'FMK-18-290-09',
        ratedPowerW: 606,
        dtRated: 50,
        dimensions: 'L: 290cm, B: 18cm, D: 9cm'
      },
      observedPeakTemp: 49, 
      coordinates: { floor: 2, x: 85, y: 30 }
    },
    {
      id: '4',
      type: 'Golvkonvektor',
      location: 'Plan 2 - Altanutgång',
      description: 'Naturkonvektion. Kort modell.',
      tempRequirement: 'Medium',
      specs: {
        brand: 'AQUILO (Rettig)',
        model: 'FMK-18-100-09',
        ratedPowerW: 173,
        dtRated: 50,
        dimensions: 'L: 100cm, B: 18cm, D: 9cm'
      },
      observedPeakTemp: 48,
      coordinates: { floor: 2, x: 45, y: 92 }
    },
    {
      id: '3a',
      type: 'Golvvärme',
      location: 'Plan 2 - Badrum',
      description: 'Vattenburen golvvärme under stengolv.',
      tempRequirement: 'Low',
      specs: {
          area: 13.5
      },
      observedPeakTemp: 25, 
      coordinates: { floor: 2, x: 25, y: 65 }
    },
    {
      id: '3b',
      type: 'Golvvärme',
      location: 'Plan 2 - Entréhall',
      description: 'Vattenburen golvvärme under stengolv.',
      tempRequirement: 'Low',
      specs: {
          area: 6
      },
      observedPeakTemp: 28, 
      coordinates: { floor: 2, x: 35, y: 75 }
    }
  ]
};

export const MOCK_WEATHER: WeatherData = {
  temp: -25,
  condition: 'Klart',
  wind: 2
};

export const MOCK_CURVE_DATA: SimulationData[] = [
  { time: '00:00', flowTemp: 48, returnTemp: 40, outdoorTemp: -24, calculatedSetPoint: 49 },
  { time: '04:00', flowTemp: 47, returnTemp: 39, outdoorTemp: -25, calculatedSetPoint: 49 },
  { time: '08:00', flowTemp: 49, returnTemp: 41, outdoorTemp: -25, calculatedSetPoint: 50 },
  { time: '12:00', flowTemp: 46, returnTemp: 38, outdoorTemp: -22, calculatedSetPoint: 47 },
  { time: '16:00', flowTemp: 48, returnTemp: 40, outdoorTemp: -23, calculatedSetPoint: 48 },
  { time: '20:00', flowTemp: 49, returnTemp: 41, outdoorTemp: -25, calculatedSetPoint: 50 },
];
