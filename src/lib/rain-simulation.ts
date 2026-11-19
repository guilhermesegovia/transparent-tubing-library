/** Regras da simulação da maquete (níveis em % de 0 a 100, tempo em segundos). */
export const SIM = {
  rainRate: 4, // % por segundo que a chuva acrescenta ao reservatório inferior
  pumpRate: 6, // % por segundo que a bomba leva para a caixa elevada
  useRate: 3, // % por segundo usados para regar o jardim
  lowerStart: 25, // sensor inferior: nível mínimo para a bomba ligar
  lowerMin: 8, // abaixo disso a bomba desliga para não funcionar a seco
  upperFull: 95, // sensor superior: caixa elevada cheia, bomba desliga
  upperRestart: 80, // a bomba só volta a ligar quando a caixa baixa até aqui
  tankHeightCm: 12,
  sensorGapCm: 2,
} as const;

export type SimState = {
  raining: boolean;
  watering: boolean;
  lower: number;
  upper: number;
  pumpOn: boolean;
  overflow: boolean;
};

export const initialSimulation: SimState = { raining: false, watering: false, lower: 10, upper: 20, pumpOn: false, overflow: false };

/** Decisão do Arduino a partir das leituras dos dois sensores. */
export function decidePump(lower: number, upper: number, pumpOn: boolean): boolean {
  if (pumpOn) return lower > SIM.lowerMin && upper < SIM.upperFull;
  return lower >= SIM.lowerStart && upper < SIM.upperRestart;
}

export function stepSimulation(s: SimState, dt: number): SimState {
  let lower = s.lower;
  let upper = s.upper;
  let overflow = false;
  if (s.raining) {
    lower += SIM.rainRate * dt;
    if (lower >= 100) { lower = 100; overflow = true; }
  }
  const pumpOn = decidePump(lower, upper, s.pumpOn);
  if (pumpOn) {
    const moved = Math.min(SIM.pumpRate * dt, lower, 100 - upper);
    lower -= moved;
    upper += moved;
  }
  if (s.watering) upper = Math.max(0, upper - SIM.useRate * dt);
  if (lower === s.lower && upper === s.upper && pumpOn === s.pumpOn && overflow === s.overflow) return s;
  return { ...s, lower, upper, pumpOn, overflow };
}

/** Distância lida pelo sensor ultrassônico, do sensor até a superfície da água. */
export function sensorDistanceCm(level: number) {
  return SIM.sensorGapCm + SIM.tankHeightCm * (1 - level / 100);
}

/** O sensor inferior "libera" a bomba: com a bomba ligada, até o nível mínimo; desligada, a partir do nível de partida. */
export function lowerSensorOk(s: SimState) {
  return s.pumpOn ? s.lower > SIM.lowerMin : s.lower >= SIM.lowerStart;
}

export function ledStates(s: SimState) {
  return { red: !lowerSensorOk(s), blue: s.pumpOn, green: s.upper >= SIM.upperFull };
}

export function simulationMessage(s: SimState) {
  if (s.pumpOn) return "O sensor inferior detectou água suficiente. O Arduino acionou o relé e a bomba está levando a água para a caixa elevada.";
  if (s.overflow && s.raining) return "O reservatório inferior está cheio: o excesso de chuva transborda.";
  if (s.upper >= SIM.upperFull) return "O sensor superior indica caixa elevada cheia. O Arduino desligou a bomba e acendeu o LED verde.";
  if (s.raining) return "A chuva cai no telhado, escorre pela calha e desce pela tubulação até o reservatório inferior.";
  if (s.watering && s.upper > 0.5) return "A água da caixa elevada desce para regar o jardim.";
  if (!lowerSensorOk(s)) return "Pouca água no reservatório inferior (LED vermelho). A bomba aguarda o sensor detectar nível suficiente.";
  return "Sistema em espera. Inicie a chuva para ver o caminho da água.";
}
