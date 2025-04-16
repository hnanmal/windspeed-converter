import { useState } from "react";
import { codeMap, windSpeed } from "../utils/calc";

export default function WindConverter() {
  const [mode, setMode] = useState("Basic");
  const [rp, setRp] = useState("");
  const [at, setAt] = useState("");
  const [vel, setVel] = useState("");
  const [code, setCode] = useState("");
  const [nRp, setNRp] = useState("");
  const [nAt, setNAt] = useState("");

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleConvert = () => {
    try {
      const RP = parseFloat(rp);
      const AT = parseFloat(at);
      const Vel = parseFloat(vel);

      let targetRP, targetAT;

      if (mode === "Basic") {
        if (!code || !(code in codeMap)) {
          alert("⚠️ Target Code를 선택해주세요.");
          return;
        }
        [targetRP, targetAT] = codeMap[code];
      } else {
        targetRP = parseFloat(nRp);
        targetAT = parseFloat(nAt);
      }

      const converted = windSpeed(RP, AT, Vel, targetRP, targetAT);
      setResult({ value: converted, targetRP, targetAT });

      const log = `${Vel} → ${converted} m/s (RP: ${RP}→${targetRP}, AT: ${AT}→${targetAT})`;
      setHistory(prev => [log, ...prev]);

    } catch (e) {
      alert("입력값을 다시 확인해주세요.");
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 space-y-6 text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">🌬️ 풍속 변환기</h2>

      {/* 모드 선택 */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Conversion Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Basic">Basic</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* 기본 입력 */}
      <div className="grid gap-4">
        <Input label="Initial return period (year)" value={rp} onChange={setRp} />
        <Input label="Initial averaging time (seconds)" value={at} onChange={setAt} />
        <Input label="Wind speed under Initial conditions (m/s)" value={vel} onChange={setVel} />
      </div>

      {/* Basic 모드 */}
      {mode === "Basic" && (
        <div className="space-y-2">
          <label className="font-semibold block">Target Code</label>
          <select
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded w-full"
          >
            <option value="">-- 코드 선택 --</option>
            {Object.keys(codeMap).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      )}

      {/* Advanced 모드 */}
      {mode === "Advanced" && (
        <div className="space-y-2">
          <Input label="Target return period (year)" value={nRp} onChange={setNRp} />
          <Input label="Target averaging time (seconds)" value={nAt} onChange={setNAt} />
        </div>
      )}

      {/* 버튼 */}
      <button
        onClick={handleConvert}
        className="bg-blue-500 hover:bg-blue-600 text-black dark:text-white font-semibold py-2 px-4 rounded w-full"
      >
        변환하기
      </button>

      {/* 결과 출력 */}
      {result && (
        <div className="text-blue-700 dark:text-blue-400 font-semibold">
          변환된 풍속: {result.value} m/s<br />
          (재현기간 {result.targetRP}년, 평균시간 {result.targetAT}초 기준)
        </div>
      )}

      {/* 히스토리 */}
      {history.length > 0 && (
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2">📜 변환 기록</h3>
          <ul className="text-sm space-y-1 max-h-40 overflow-y-auto list-disc pl-5 text-gray-700 dark:text-gray-300">
            {history.map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
