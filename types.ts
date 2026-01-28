
export interface HouseSpecs {
  location: string;
  builtYear: number;
  movedYear: number;
  renovatedYear: number;
  structure: string;
  floors: number;
  areaPerFloor: number;
  totalHeatedArea: number;
}

export interface HeatingSystem {
  model: string;
  type: string;
  features: string[];
  limitations: string[];
  emitters: EmitterType[];
}

export interface EmitterSpecs {
  brand?: string;
  model?: string;
  ratedPowerW?: number; // Power at dt50 (standard EN442)
  dtRated?: number; // Usually 50
  dimensions?: string;
  area?: number; // Surface area in m2 (specific for floor heating)
}

export interface EmitterType {
  id: string;
  type: 'Radiator' | 'Golvkonvektor' | 'Golvvärme';
  location: string;
  description: string;
  tempRequirement: 'High' | 'Medium' | 'Low';
  specs?: EmitterSpecs;
  observedPeakTemp?: number; // User provided measurement
  coordinates: {
    floor: 2 | 3;
    x: number; // Percentage from left (0-100)
    y: number; // Percentage from top (0-100)
  };
}

export interface WeatherData {
  temp: number;
  condition: string;
  wind: number;
}

export interface SimulationData {
  time: string;
  flowTemp: number; // Framledning
  returnTemp: number; // Retur
  outdoorTemp: number;
  calculatedSetPoint: number;
}
