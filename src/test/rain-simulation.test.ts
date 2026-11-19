import { describe, expect, it } from "vitest";
import { initialSimulation, stepSimulation, decidePump, ledStates, type SimState } from "@/lib/rain-simulation";

const run = (s: SimState, seconds: number) => { let state = s; for (let i = 0; i < seconds * 10; i++) state = stepSimulation(state, 0.1); return state; };

describe("simulação da maquete", () => {
  it("a chuva enche o reservatório inferior e para quando a chuva é pausada", () => {
    const raining = run({ ...initialSimulation, raining: true, upper: 100 }, 2);
    expect(raining.lower).toBeGreaterThan(initialSimulation.lower);
    const paused = run({ ...raining, raining: false }, 2);
    expect(paused.lower).toBeCloseTo(raining.lower);
  });
  it("a bomba só liga quando o sensor inferior detecta água suficiente", () => {
    expect(decidePump(10, 20, false)).toBe(false);
    expect(decidePump(30, 20, false)).toBe(true);
  });
  it("a bomba desliga quando o sensor superior indica caixa cheia", () => {
    expect(decidePump(60, 96, true)).toBe(false);
    const full = run({ ...initialSimulation, lower: 100, upper: 50 }, 30);
    expect(full.pumpOn).toBe(false);
    expect(full.upper).toBeGreaterThanOrEqual(95);
  });
  it("os LEDs mostram nível baixo, bomba ligada e caixa cheia", () => {
    expect(ledStates({ ...initialSimulation, lower: 10 }).red).toBe(true);
    expect(ledStates({ ...initialSimulation, pumpOn: true }).blue).toBe(true);
    expect(ledStates({ ...initialSimulation, lower: 15, pumpOn: true }).red).toBe(false);
    expect(ledStates({ ...initialSimulation, upper: 96 }).green).toBe(true);
  });
});
