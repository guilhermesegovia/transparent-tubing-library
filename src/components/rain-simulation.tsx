import { useEffect, useState } from "react";
import { CloudRain, Pause, RotateCcw, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SIM, initialSimulation, ledStates, lowerSensorOk, sensorDistanceCm, simulationMessage, stepSimulation, type SimState } from "@/lib/rain-simulation";

type Box = { x: number; y: number; w: number; h: number };
const LOWER: Box = { x: 600, y: 380, w: 110, h: 90 };
const UPPER: Box = { x: 780, y: 205, w: 110, h: 95 };
const rainDrops = Array.from({ length: 22 }, (_, i) => ({ x: 218 + i * 18, delay: ((i * 37) % 10) / 10, len: 12 + (i % 3) * 5 }));

function Tank({ box, level }: { box: Box; level: number }) {
  const waterH = (box.h - 4) * level / 100;
  return (
    <g>
      <rect className="sim-glass" x={box.x} y={box.y} width={box.w} height={box.h} rx="4" />
      <rect className="sim-water" x={box.x + 3} y={box.y + box.h - 2 - waterH} width={box.w - 6} height={waterH} rx="2" />
      <rect className="sim-glass-edge" x={box.x} y={box.y} width={box.w} height={box.h} rx="4" />
      <text className="sim-level" x={box.x + box.w / 2} y={box.y + box.h / 2 + 5} textAnchor="middle">{Math.round(level)}%</text>
    </g>
  );
}

function Sensor({ x, y, triggered }: { x: number; y: number; triggered: boolean }) {
  return (
    <g className={`sim-sensor${triggered ? " is-triggered" : ""}`}>
      <path className="sim-waves" d={`M${x + 9} ${y + 20} q9 7 18 0 M${x + 4} ${y + 28} q14 10 28 0`} />
      <rect className="sim-sensor-board" x={x} y={y} width="36" height="12" rx="2" />
      <circle className="sim-sensor-eye" cx={x + 10} cy={y + 6} r="4" />
      <circle className="sim-sensor-eye" cx={x + 26} cy={y + 6} r="4" />
    </g>
  );
}

function Flow({ d, active }: { d: string; active: boolean }) {
  return (
    <g>
      <path className="sim-pipe" d={d} />
      <path className={`sim-flow${active ? " is-flowing" : ""}`} d={d} />
    </g>
  );
}

function Wire({ d, active }: { d: string; active: boolean }) {
  return (
    <g>
      <path className="sim-wire" d={d} />
      <path className={`sim-signal${active ? " is-active" : ""}`} d={d} />
    </g>
  );
}

function Led({ cx, cy, on, tone }: { cx: number; cy: number; on: boolean; tone: "red" | "blue" | "green" }) {
  return (
    <g className={`sim-led sim-led-${tone}${on ? " is-on" : ""}`}>
      <circle className="sim-led-glow" cx={cx} cy={cy} r="14" />
      <circle className="sim-led-core" cx={cx} cy={cy} r="8" />
    </g>
  );
}

function MaqueteDrawing({ sim }: { sim: SimState }) {
  const leds = ledStates(sim);
  const lowerTriggered = lowerSensorOk(sim);
  const upperTriggered = sim.upper >= SIM.upperFull;
  const wateringFlow = sim.watering && sim.upper > 0.5;
  return (
    <svg className="sim-drawing" viewBox="175 15 785 520" role="img" aria-label="Desenho da maquete: telhado com calha, tubulação, reservatório inferior, bomba, caixa elevada, sensores e, dentro da casa, Arduino, relé e LEDs">
      <rect className={`sim-sky${sim.raining ? " is-raining" : ""}`} x="0" y="0" width="960" height="470" />
      <g className={`sim-cloud${sim.raining ? " is-raining" : ""}`}>
        <ellipse cx="330" cy="62" rx="55" ry="28" /><ellipse cx="395" cy="48" rx="60" ry="36" /><ellipse cx="465" cy="62" rx="55" ry="28" /><ellipse cx="520" cy="70" rx="40" ry="20" />
      </g>
      {sim.raining && (
        <g className="sim-rain">
          {rainDrops.map(drop => <line key={drop.x} className="sim-drop" x1={drop.x} y1="92" x2={drop.x - 3} y2={92 + drop.len} style={{ animationDelay: `${drop.delay}s` }} />)}
        </g>
      )}
      <rect className="sim-ground" x="0" y="470" width="960" height="70" />

      {/* Casa */}
      <rect className="sim-wall" x="230" y="240" width="300" height="230" />
      <rect className="sim-interior" x="252" y="290" width="256" height="166" rx="6" />
      <text className="sim-small" x="264" y="308">Interior da casa</text>
      <polygon className="sim-roof" points="205,250 380,110 555,250" />
      <polygon className="sim-solar" points="262,214 318,170 342,190 286,234" />
      <text className="sim-label" x="398" y="232" textAnchor="middle">Telhado</text>

      {/* Eletrônica */}
      <rect className="sim-board" x="270" y="360" width="92" height="62" rx="4" />
      <rect className="sim-chip" x="300" y="390" width="34" height="12" rx="1" />
      <text className="sim-board-label" x="316" y="380" textAnchor="middle">Arduino</text>
      <rect className={`sim-relay${sim.pumpOn ? " is-on" : ""}`} x="380" y="368" width="46" height="36" rx="3" />
      <circle className={`sim-relay-light${sim.pumpOn ? " is-on" : ""}`} cx="417" cy="376" r="3.5" />
      <text className="sim-small" x="403" y="420" textAnchor="middle">Relé</text>
      <rect className="sim-breadboard" x="442" y="318" width="52" height="118" rx="3" />
      <text className="sim-small" x="468" y="313" textAnchor="middle">LEDs</text>
      <Led cx={468} cy={342} on={leds.red} tone="red" />
      <Led cx={468} cy={377} on={leds.blue} tone="blue" />
      <Led cx={468} cy={412} on={leds.green} tone="green" />

      {/* Água: telhado, calha e tubulação */}
      <path className={`sim-flow sim-roof-flow${sim.raining ? " is-flowing" : ""}`} d="M440 158 L546 244" />
      <rect className="sim-gutter" x="512" y="246" width="70" height="13" rx="3" />
      <path className={`sim-flow${sim.raining ? " is-flowing" : ""}`} d="M518 252 H574" />
      <text className="sim-label" x="590" y="250">Calha</text>
      <Flow d="M576 259 V330 H630 V392" active={sim.raining} />
      <text className="sim-label" x="586" y="300">Tubulação</text>

      {/* Reservatório inferior */}
      <Tank box={LOWER} level={sim.lower} />
      {sim.overflow && sim.raining && <path className="sim-flow is-flowing" d="M712 382 Q722 390 720 468" />}
      <Sensor x={655} y={366} triggered={lowerTriggered} />
      <text className="sim-label" x="696" y="362">Sensor</text>
      <text className="sim-label sim-label-ground" x="655" y="492" textAnchor="middle">Reservatório</text>
      <text className="sim-label sim-label-ground" x="655" y="508" textAnchor="middle">inferior</text>

      {/* Bomba */}
      <Flow d="M708 455 H730" active={sim.pumpOn} />
      <Flow d="M745 426 V180 H826 V214" active={sim.pumpOn} />
      <g className={`sim-pump${sim.pumpOn ? " is-on" : ""}`}>
        <rect className="sim-pump-body" x="728" y="426" width="34" height="38" rx="7" />
        <g className="sim-rotor"><circle cx="745" cy="446" r="9" /><line x1="736" y1="446" x2="754" y2="446" /><line x1="745" y1="437" x2="745" y2="455" /></g>
      </g>
      <text className="sim-label sim-label-ground" x="755" y="492" textAnchor="middle">Bomba</text>

      {/* Caixa elevada */}
      <g className="sim-stand">
        <rect x="772" y="300" width="126" height="9" rx="2" />
        <line x1="788" y1="309" x2="782" y2="470" /><line x1="882" y1="309" x2="888" y2="470" />
        <line x1="786" y1="340" x2="884" y2="420" /><line x1="884" y1="340" x2="786" y2="420" />
      </g>
      <Tank box={UPPER} level={sim.upper} />
      <Sensor x={842} y={191} triggered={upperTriggered} />
      <text className="sim-label" x="884" y="202">Sensor</text>
      <text className="sim-label sim-label-tag" x="835" y="335" textAnchor="middle">Caixa elevada</text>
      <Flow d="M890 292 H925 V446" active={wateringFlow} />
      {wateringFlow && <g className="sim-rain">{[918, 925, 932].map((x, i) => <line key={x} className="sim-drop sim-drop-short" x1={x} y1="446" x2={x} y2="454" style={{ animationDelay: `${i * 0.2}s` }} />)}</g>}
      <g className="sim-plants"><circle cx="908" cy="466" r="8" /><circle cx="926" cy="462" r="10" /><circle cx="945" cy="466" r="8" /></g>
      <text className="sim-label sim-label-ground" x="926" y="492" textAnchor="middle">Jardim</text>

      {/* Fios de sinal */}
      <Wire d="M362 386 H380" active={sim.pumpOn} />
      <Wire d="M362 372 C400 340 420 340 442 340" active={leds.red || leds.blue || leds.green} />
      <Wire d="M673 366 C673 318 470 312 340 360" active={lowerTriggered} />
      <Wire d="M860 191 C860 128 430 170 296 360" active={upperTriggered} />
      <Wire d="M426 396 C560 470 690 474 730 452" active={sim.pumpOn} />
    </svg>
  );
}

function LevelBar({ label, level, note }: { label: string; level: number; note: string }) {
  const value = Math.round(level);
  return (
    <div className="sim-level-row">
      <div className="sim-level-head"><span>{label}</span><strong>{value}%</strong></div>
      <div className="sim-bar" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><span style={{ width: `${level}%` }} /></div>
      <small>{note}</small>
    </div>
  );
}

function StatusRow({ label, value, on }: { label: string; value: string; on: boolean }) {
  return <li className={on ? "is-on" : ""}><span className="sim-status-dot" /><span>{label}</span><strong>{value}</strong></li>;
}

export function RainSimulation() {
  const [sim, setSim] = useState<SimState>(initialSimulation);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      setSim(state => stepSimulation(state, dt));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const leds = ledStates(sim);
  const lowerCm = sensorDistanceCm(sim.lower).toFixed(1).replace(".", ",");
  const upperCm = sensorDistanceCm(sim.upper).toFixed(1).replace(".", ",");
  const lowerTriggered = lowerSensorOk(sim);
  const upperTriggered = sim.upper >= SIM.upperFull;

  return (
    <section className="simulation-block" aria-labelledby="simulacao-titulo">
      <div className="eyebrow section-label"><span className="eyebrow-dot" />SIMULAÇÃO INTERATIVA</div>
      <h2 id="simulacao-titulo">Veja a maquete funcionando.</h2>
      <p className="simulation-intro">Inicie a chuva e acompanhe a água do telhado até a caixa elevada. Os sensores medem os níveis, o Arduino decide e o relé liga a bomba.</p>
      <div className="sim-layout">
        <div className="sim-stage"><MaqueteDrawing sim={sim} /></div>
        <aside className="sim-panel" aria-label="Controles e estado da simulação">
          <div className="sim-controls">
            <Button size="lg" onClick={() => setSim(s => ({ ...s, raining: !s.raining }))} aria-pressed={sim.raining}>
              {sim.raining ? <><Pause /> Pausar chuva</> : <><CloudRain /> Iniciar chuva</>}
            </Button>
            <div className="sim-controls-row">
              <Button variant={sim.watering ? "secondary" : "outline"} onClick={() => setSim(s => ({ ...s, watering: !s.watering }))} aria-pressed={sim.watering}>
                <Sprout /> {sim.watering ? "Parar de regar" : "Regar o jardim"}
              </Button>
              <Button variant="ghost" onClick={() => setSim(initialSimulation)}><RotateCcw /> Reiniciar</Button>
            </div>
          </div>
          <p className="sim-message" aria-live="polite">{simulationMessage(sim)}</p>
          <LevelBar label="Reservatório inferior" level={sim.lower} note={`Sensor: ${lowerCm} cm até a água`} />
          <LevelBar label="Caixa elevada" level={sim.upper} note={`Sensor: ${upperCm} cm até a água`} />
          <ul className="sim-status">
            <StatusRow label="Chuva" value={sim.raining ? "Caindo" : "Parada"} on={sim.raining} />
            <StatusRow label="Sensor inferior" value={lowerTriggered ? "Água suficiente" : "Nível baixo"} on={lowerTriggered} />
            <StatusRow label="Sensor superior" value={upperTriggered ? "Caixa cheia" : "Abaixo do limite"} on={upperTriggered} />
            <StatusRow label="Relé" value={sim.pumpOn ? "Acionado" : "Desligado"} on={sim.pumpOn} />
            <StatusRow label="Bomba" value={sim.pumpOn ? "Ligada" : "Desligada"} on={sim.pumpOn} />
          </ul>
          <ul className="sim-led-legend" aria-label="LEDs indicadores">
            <li className={`sim-led-red${leds.red ? " is-on" : ""}`}><span />Vermelho: pouca água embaixo</li>
            <li className={`sim-led-blue${leds.blue ? " is-on" : ""}`}><span />Azul: bomba ligada</li>
            <li className={`sim-led-green${leds.green ? " is-on" : ""}`}><span />Verde: caixa elevada cheia</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
