import { useState } from "react";

function predict(iq, cgpa) {
  const iqScore = (iq - 60) / 80;
  const cgpaScore = (cgpa - 4) / 6;
  const raw = 0.45 * iqScore + 0.55 * cgpaScore;
  const probability = Math.max(0, Math.min(1, raw));
  const chance = Math.round(probability * 100);
  return {
    placed: chance >= 52,
    chance,
    iqFactor: Math.round(iqScore * 100),
    cgpaFactor: Math.round(cgpaScore * 100),
  };
}

function SliderField({ label, value, min, max, display, onChange, percent }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs tracking-widest uppercase text-zinc-500">{label}</span>
        <span className="text-sm font-mono font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-0.5 rounded-full">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #34d399 0%, #22d3ee ${percent}%, #27272a ${percent}%, #27272a 100%)`,
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-zinc-600">{min}</span>
        <span className="text-xs text-zinc-600">{Math.round((Number(min) + Number(max)) / 2)}</span>
        <span className="text-xs text-zinc-600">{max}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [iq, setIq] = useState(100);
  const [cgpa, setCgpa] = useState(7.0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(predict(iq, cgpa));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-mono relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-zinc-800">
          <span className="inline-block text-xs tracking-widest uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-4">
            ML Project · v1.0
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
            Placement<br />
            <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Predictor
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed font-light">
            Enter your IQ and CGPA to predict campus placement chances using a trained ML model.
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-7">
          <SliderField
            label="IQ Score"
            value={iq}
            min={60}
            max={140}
            display={iq}
            onChange={setIq}
            percent={((iq - 60) / 80) * 100}
          />
          <SliderField
            label="CGPA"
            value={Math.round(cgpa * 10)}
            min={40}
            max={100}
            display={cgpa.toFixed(1)}
            onChange={(v) => setCgpa(v / 10)}
            percent={((cgpa - 4) / 6) * 100}
          />

          <div className="border-t border-zinc-800 my-6" />

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-emerald-400 to-cyan-400 text-zinc-950 font-bold text-sm tracking-wider uppercase transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing…" : "Run Prediction →"}
          </button>

          {/* Result Card */}
          {result && (
            <div className="mt-5 rounded-2xl border border-zinc-800 overflow-hidden">
              {/* Verdict */}
              <div className="bg-zinc-800/60 px-6 py-4">
                <p className="text-xs tracking-widest uppercase text-zinc-500 mb-1">Prediction Result</p>
                <p className={`text-2xl font-bold tracking-tight ${result.placed ? "bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent" : "text-rose-400"}`}>
                  {result.placed ? "✓ Likely Placed" : "✗ At Risk"}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="bg-zinc-800/40 px-6 py-4 border-t border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs tracking-widest uppercase text-zinc-500">Probability</span>
                  <span className="text-base text-white font-medium">{result.chance}%</span>
                </div>
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${result.placed ? "bg-linear-to-r from-emerald-400 to-cyan-400" : "bg-linear-to-r from-rose-500 to-orange-400"}`}
                    style={{ width: `${result.chance}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 border-t border-zinc-800">
                <div className="px-6 py-4 border-r border-zinc-800 bg-zinc-800/20">
                  <p className="text-xs tracking-widest uppercase text-zinc-500 mb-1">IQ Factor</p>
                  <p className="text-lg text-white font-medium">{result.iqFactor}%</p>
                </div>
                <div className="px-6 py-4 bg-zinc-800/20">
                  <p className="text-xs tracking-widest uppercase text-zinc-500 mb-1">CGPA Factor</p>
                  <p className="text-lg text-white font-medium">{result.cgpaFactor}%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-zinc-600 tracking-wide">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 mb-0.5 animate-pulse" />
            Logistic regression · campus placement dataset
          </p>
        </div>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #34d399, #22d3ee);
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(52,211,153,0.2), 0 0 16px rgba(52,211,153,0.3);
        }
      `}</style>
    </div>
  );
}