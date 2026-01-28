
/**
 * Calculates the estimated actual power output of a radiator/convector
 * based on observed surface/water temperature vs rated temperature.
 */
export const calculateActualPower = (
  ratedPower: number,
  observedTemp: number,
  roomTemp: number = 21,
  ratedDt: number = 50 
): number => {
  if (!ratedPower || !observedTemp) return 0;
  const actualDt = observedTemp - roomTemp;
  if (actualDt <= 0) return 0;
  const correctionFactor = Math.pow(actualDt / ratedDt, 1.3);
  return Math.round(ratedPower * correctionFactor);
};

/**
 * Estimates power output for floor heating based on area and surface temperature.
 * Rule of thumb: Heat emission ~ 11 W/m2/K difference between surface and room.
 */
export const calculateFloorHeatingPower = (
    area: number,
    surfaceTemp: number,
    roomTemp: number = 21
): number => {
    if (!area || !surfaceTemp) return 0;
    const diff = surfaceTemp - roomTemp;
    if (diff <= 0) return 0;
    
    // Coefficient approx 11 W/m2K for stone/tile floors
    const powerPerM2 = 11 * diff; 
    return Math.round(area * powerPerM2);
};

export const calculateEfficiencyPercent = (
  ratedPower: number,
  actualPower: number
): number => {
  if (!ratedPower) return 0;
  return Math.round((actualPower / ratedPower) * 100);
}

export const calculateHousePowerDemand = (outdoorTemp: number): number => {
  const indoorTemp = 21;
  const kFactor = 175; 
  const freeHeat = 800; 
  const deltaT = indoorTemp - outdoorTemp;
  if (deltaT <= 0) return 0;
  const demandW = (deltaT * kFactor) - freeHeat;
  return Math.max(0, Math.round(demandW));
};
