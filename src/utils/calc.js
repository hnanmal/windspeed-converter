import { go, range, find } from "fxjs";

// 하드코딩된 보정 계수 테이블 (Ce_x, Ce_y)
export const Ce_x = [
  1.014427093, 1.239688571, 1.581491544, 2.046642511, 2.845255728, 4.129173595,
  6.437380435, 8.212274407, 11.09433023, 13.95193761, 18.58024011, 23.3660208,
  31.56620663, 42.03772369, 53.62823059, 70.40271776, 91.10968418, 116.2301553,
  146.1679833, 181.2027783, 227.8758435, 290.7050432, 376.2077022, 578.1664373,
  792.3395838, 1166.47122, 1645.031368, 2128.870776, 2677.211841, 3464.637916,
  5000, 10000,
];

export const Ce_y = [
  1.570909091, 1.563636364, 1.554545455, 1.541818182, 1.525454545, 1.505454545,
  1.472727273, 1.452727273, 1.427272727, 1.403636364, 1.376363636, 1.354545455,
  1.321818182, 1.290909091, 1.261818182, 1.229090909, 1.2, 1.176363636,
  1.154545455, 1.136363636, 1.12, 1.105454545, 1.089090909, 1.069090909,
  1.054545455, 1.036363636, 1.023636364, 1.014545455, 1.009090909, 1, 1, 1,
];

// 보간 함수 (선형 보간)
export function interpolate(x_list, y_list, x) {
  const i = go(
    range(0, x_list.length - 1),
    find(i => x_list[i] <= x && x <= x_list[i + 1])
  );

  if (i !== undefined) {
    const x0 = x_list[i], x1 = x_list[i + 1];
    const y0 = y_list[i], y1 = y_list[i + 1];
    const ratio = (x - x0) / (x1 - x0);
    return y0 + ratio * (y1 - y0);
  }

  return x < x_list[0] ? y_list[0] : y_list[y_list.length - 1];
}

// 재현기간, 평균시간 기반 풍속 변환 공식
export function windSpeed(RP, AT, Vel, nRP, nAT) {
  const C_RPover50 = 0.36 + 0.1 * Math.log(12 * RP);
  const C_nRPover50 = 0.36 + 0.1 * Math.log(12 * nRP);
  const C_ATover3600 = interpolate(Ce_x, Ce_y, AT);
  const C_nATover3600 = interpolate(Ce_x, Ce_y, nAT);
  const result = (C_nRPover50 / C_RPover50) * (C_nATover3600 / C_ATover3600) * Vel;
  return Math.round(result * 100) / 100;
}

// 기본 코드셋 (Basic 모드에서 사용)
export const codeMap = {
  "ASCE 7-05": [50, 3],
  "EN 1991.1.4": [50, 600],
  "KDS 41 10 15": [100, 600],
  "KDS 41 12 00": [500, 600],
  "ASCE 7-10 category I": [300, 3],
  "ASCE 7-10 category II": [700, 3],
  "ASCE 7-10 category III": [1700, 3],
  "BS 6399": [50, 3600],
};
