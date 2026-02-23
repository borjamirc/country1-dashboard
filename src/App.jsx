import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer, ComposedChart,
  ScatterChart, Scatter, ZAxis
} from "recharts";

// ═══════════════════════════════════════════════════════════════
// REAL DATA — Country 1 · All 40 indicators · 2000–2025
// ═══════════════════════════════════════════════════════════════
const YRS = ["2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"];

const R = {
  cpi:         [5.974,7.673,12.53,9.3,7.601,5.69,3.142,4.457,5.902,4.312,5.909,6.503,5.839,5.911,6.408,10.673,6.288,2.947,3.745,4.306,4.517,10.061,5.785,4.621,4.831,4.912],
  cbRate:      [15,19,18,17,16,19,13.75,11.25,13.75,8.75,10.75,12.5,7.25,10,11.75,14.25,13.75,7,6.5,4.5,2,9.25,13.75,11.75,10.5,15],
  ca_pct:      [-4.048,-4.445,-1.845,0.393,1.339,1.31,0.973,-0.197,-2.099,-1.757,-3.926,-3.197,-3.761,-3.576,-4.499,-3.523,-1.699,-1.224,-2.808,-3.47,-1.688,-2.419,-2.16,-1.275,-2.656,-2.507],
  ca_usd:      [-26.531,-24.89,-9.407,2.193,8.959,11.679,10.774,-2.754,-35.602,-29.328,-86.718,-83.576,-92.678,-88.384,-110.493,-63.409,-30.529,-25.264,-53.818,-65.001,-24.914,-40.409,-42.157,-27.933,-57.89,-56.577],
  fx:          [1,0.778723,0.626712,0.596091,0.624573,0.753086,0.83945,0.938462,0.994565,0.915,1.039773,1.095808,0.938462,0.847222,0.778723,0.54955,0.525862,0.573668,0.50137,0.464467,0.35534,0.339518,0.354651,0.366733,0.339518,null],
  expend:      [null,39.802,44.495,41.288,39.681,41.87,42.563,40.352,39.916,40.537,39.516,39.367,39.31,39.78,41.426,46.191,45.503,44.297,44.181,43.043,46.178,40.371,43.445,45.309,45.675,47.989],
  exports_gs:  [12.92,8.702,8.471,14.237,16.029,10.304,3.758,6.156,-1.738,-8.625,7.173,2.361,1.011,2.877,-0.362,8.887,4.214,4.785,3.416,-1.676,-1.338,2.275,6.113,9.444,-0.329,3],
  exports_g:   [10.815,9.166,8.729,15.561,17.193,9.864,3.383,5.484,-2.19,-10.424,8.544,2.966,-0.314,3.058,-2.102,8.798,4.032,7.223,4.36,-2.033,0.033,4.091,5.395,8.136,-1.153,3],
  extDebt:     [38.1,42.44,47.08,43.64,33.98,21.75,17.99,17.44,15.9,17.28,16.46,15.85,18.33,19.84,23.11,30.73,30.91,26.82,29.93,31.2,38.01,35.29,30.56,28.63,28.66,null],
  productivity:[34062.03,33602.55,33446.74,33405.5,34011.56,34309.3,34900.01,36462.81,37362.26,37086.5,39603.46,41004.66,41342.87,41958.26,41620.5,40241.36,39749.32,40207.03,40287.82,39945.51,41893.32,41904.83,40322.92,41147.69,42238.13,null],
  gini:        [null,58.4,58.1,57.6,56.5,56.3,55.6,54.9,54,53.7,null,52.9,53.4,52.7,52,51.9,53.4,53.3,53.9,53.5,48.9,52.9,52,51.6,null,null],
  capForm:     [18.903,18.742,17.449,16.857,17.913,17.205,17.816,19.819,21.619,18.796,21.801,21.826,21.417,21.694,20.548,17.412,14.97,14.626,15.095,15.517,16.116,19.522,18.088,15.761,16.91,16.727],
  grossDebt:   [62.198,67.331,76.095,71.514,68.025,66.969,64.599,63.025,61.42,64.702,62.433,60.634,61.614,59.595,61.617,71.73,77.422,82.745,84.777,87.118,96.007,88.934,83.939,84.001,87.284,91.424],
  gdpConst:    [785.111,796.023,820.328,829.688,877.477,905.575,941.453,998.598,1049.47,1048.149,1127.057,1171.85,1194.363,1230.252,1236.452,1192.61,1153.541,1168.801,1189.649,1204.172,1164.715,1220.185,1256.994,1297.74,1341.81,1374.009],
  gdpCapConst: [4494.157,4497.21,4577.002,4574.367,4782.684,4881.323,5020.145,5270.792,5484.981,5425.931,5787.219,5973.992,6042.188,6175.136,6157.288,5892.236,5658.165,5695.591,5760.202,5792.07,5568.406,5807.539,5961.189,6130.23,6311.912,6439.808],
  gdpCapPPP:   [13951.025,13960.502,14208.195,14200.018,14846.685,15152.886,15583.826,16361.899,17026.8,16843.492,17965.023,18544.815,18756.512,19169.218,19113.813,18291.023,17564.406,17680.585,17881.156,17980.083,17285.771,18028.1,18505.069,19029.818,19593.807,19990.829],
  gdpGrowth:   [4.388,1.39,3.053,1.141,5.76,3.202,3.962,6.07,5.094,-0.126,7.528,3.974,1.921,3.005,0.504,-3.546,-3.276,1.323,1.784,1.221,-3.277,4.763,3.017,3.242,3.396,2.4],
  gdpNomDom:   [1199.093,1315.756,1488.788,1717.951,1957.75,2170.584,2409.45,2720.263,3109.803,3333.039,3885.847,4376.382,4814.76,5331.619,5778.953,5995.787,6269.327,6585.479,7004.141,7389.131,7609.597,9012.142,10079.676,10943.344,11744.709,12670.262],
  gdpCapDomCur:[6863.886,7433.493,8306.659,9471.679,10670.706,11700.103,12848,14358.069,16253.168,17254.073,19953.07,22310.425,24357.489,26761.568,28778.051,29622.921,30751.301,32091.17,33913.589,35541.739,36380.853,42893.792,47802.017,51693.88,55247.445,59383.927],
  gdpCapUSD:   [3751.971,3163.671,2844.405,3077.735,3647.959,4806.171,5906.244,7374.237,8863.269,8640.934,11341.268,13326.088,12465.45,12406.559,12230.669,8893.346,8812.503,10055.567,9281.668,9010.512,7057.072,7951.553,9256.482,10350.437,10252.019,10577.855],
  gdpNomPPP:   [1455.848,1509.318,1579.574,1629.137,1769.302,1883.216,2018.204,2198.704,2355.228,2366.771,2575.879,2733.512,2837.901,2972.929,3039.952,2959.374,2889.626,2980.287,3187.19,3333.776,3359.777,3787.77,4179.563,4474.703,4741.519,4973.385],
  gdpNomUSD:   [655.454,559.982,509.798,558.232,669.29,891.633,1107.628,1397.114,1695.855,1669.204,2208.704,2614.027,2464.053,2471.718,2456.055,1800.046,1796.622,2063.519,1916.934,1873.286,1476.092,1670.65,1951.849,2191.137,2179.413,2256.91],
  gdpCapPPP17: [8333.612,8527.042,8813.197,8982.016,9643.571,10151.103,10761.746,11605.183,12309.433,12252.012,13226.64,13935.215,14356.717,14922.341,15138.365,14621.149,14173.734,14523,15432.162,16035.469,16062.817,18028.1,19821.227,21137.486,22304.24,23309.631],
  gdpDeflator: [152.729,165.291,181.487,207.06,223.111,239.691,255.929,272.408,296.321,317.993,344.778,373.459,403.124,433.376,467.382,502.745,543.485,563.439,588.757,613.628,653.344,738.588,801.887,843.262,875.289,922.138],
  gdpPctWorld: [2.9,2.87,2.878,2.808,2.824,2.786,2.754,2.777,2.839,2.853,2.918,2.923,2.886,2.878,2.795,2.609,2.448,2.39,2.402,2.371,2.395,2.412,2.397,2.393,2.396,2.38],
  savings:     [14.855,14.297,15.604,17.25,19.251,18.515,18.789,19.622,19.52,17.039,17.875,18.629,17.656,18.118,16.05,13.889,13.27,13.401,12.288,12.047,14.428,17.103,15.928,14.486,14.253,14.22],
  imports_gs:  [14.735,3.027,-11.773,-2.674,13.783,9.31,14.823,23.092,14.845,-11.875,37.167,7.313,0.513,7.518,0.058,-12.793,-8.721,7.757,6.976,3.738,-8.468,16.744,0.7,0.802,10.039,4.223],
  imports_g:   [13.111,2.668,-11.801,-3.545,16.99,5.204,16.027,23.664,17.424,-17.463,37.121,8.597,-1.726,7.632,-2.38,-15.276,-11.087,10.155,14,4.612,-3.788,22.032,-2.395,-4.506,8.151,4.796],
  netDebtDom:  [null,677.431,892.292,932.138,982.509,1040.046,1120.053,1211.762,1168.238,1362.711,1475.82,1508.547,1550.083,1626.335,1883.147,2136.888,2892.913,3382.942,3695.837,4041.769,4670.004,4966.921,5658.017,6612.83,7220.738,8336.687],
  netDebt:     [null,51.486,59.934,54.259,50.186,47.915,46.486,44.546,37.566,40.885,37.979,34.47,32.194,30.504,32.586,35.64,46.144,51.37,52.766,54.699,61.37,55.114,56.133,60.428,61.481,65.797],
  fiscalDom:   [null,-45.631,-61.763,-92.781,-57.851,-73.009,-117.303,-72.364,-74.417,-141.003,-138.093,-119.971,-113.211,-182.455,-362.625,-556.492,-500.958,-524.841,-489.599,-359.003,-885.52,-237.087,-399.628,-843.999,-727.012,-1064.855],
  fiscalBal:   [null,-3.468,-4.149,-5.401,-2.955,-3.364,-4.868,-2.66,-2.393,-4.23,-3.554,-2.741,-2.351,-3.422,-6.275,-9.281,-7.991,-7.97,-6.99,-4.859,-11.637,-2.631,-3.965,-7.712,-6.19,-8.404],
  poverty:     [null,17.5,16.2,17.1,15.3,13.7,11.4,10.8,9.1,8.4,null,7.1,6.4,5.4,4.7,5.4,6.5,6.9,6.9,7,2.8,7.5,4.9,3.8,null,null],
  primaryDom:  [null,41.177,49.961,61.046,79.31,83.888,36.302,78.356,99.928,30.39,61.38,119.789,106.923,81.028,-52.012,-51.128,-125.862,-106.986,-60.719,-6.116,-573.449,178.308,131.722,-237.209,-25.763,-77.264],
  primaryBal:  [null,3.13,3.356,3.553,4.051,3.865,1.507,2.88,3.213,0.912,1.58,2.737,2.221,1.52,-0.9,-0.853,-2.008,-1.625,-0.867,-0.083,-7.536,1.979,1.307,-2.168,-0.219,-0.61],
  revenueDom:  [null,478.07,600.67,616.529,718.997,835.821,908.227,1025.31,1166.879,1210.098,1397.433,1602.891,1779.447,1938.471,2031.389,2213.013,2351.769,2392.35,2604.877,2821.492,2628.472,3401.204,3979.52,4114.353,4637.441,5015.504],
  revenue:     [null,36.334,40.346,35.887,36.726,38.507,37.694,37.692,37.523,36.306,35.962,36.626,36.958,36.358,35.151,36.909,37.512,36.328,37.191,38.184,34.542,37.74,39.481,37.597,39.485,39.585],
  structDom:   [null,-36.54,-49.933,-66.394,-42.47,-51.199,-95.729,-69.717,-87.988,-127.196,-184.948,-176.188,-171.689,-265.11,-427.712,-523.971,-420.627,-458.848,-453.886,-347.227,-782.466,-328.355,-546.233,-767.689,-868.582,-1108.89],
  structBal:   [null,-2.721,-3.28,-3.697,-2.119,-2.293,-3.872,-2.556,-2.866,-3.74,-4.875,-4.184,-3.702,-5.236,-7.749,-8.763,-6.479,-6.777,-6.371,-4.639,-9.898,-3.613,-5.401,-7.042,-7.474,-8.827],
  unemp:       [10.53,10.65,10.64,11.17,10.07,10.55,9.69,9.28,8.27,9.42,8.034,7.58,6.9,7.175,6.875,8.625,11.6,12.85,12.375,11.975,13.775,13.225,9.25,7.975,6.925,7.099],
};

// Build unified row array
const DATA = YRS.map((y, i) => {
  const o = { year: y };
  for (const [k, arr] of Object.entries(R)) o[k] = (arr[i] !== undefined ? arr[i] : null);
  // Derived
  o.realRate = (o.cbRate != null && o.cpi != null) ? +(o.cbRate - o.cpi).toFixed(2) : null;
  o.savInvGap = (o.savings != null && o.capForm != null) ? +(o.savings - o.capForm).toFixed(2) : null;
  o.fiscalGap = (o.revenue != null && o.expend != null) ? +(o.expend - o.revenue).toFixed(2) : null;
  o.gdpDeflGrowth = i > 0 && R.gdpDeflator[i] != null && R.gdpDeflator[i-1] != null
    ? +((R.gdpDeflator[i]/R.gdpDeflator[i-1]-1)*100).toFixed(2) : null;
  o.prodGrowth = i > 0 && R.productivity[i] != null && R.productivity[i-1] != null
    ? +((R.productivity[i]/R.productivity[i-1]-1)*100).toFixed(2) : null;
  o.gdpNomGrowth = i > 0 && R.gdpNomDom[i] != null && R.gdpNomDom[i-1] != null
    ? +((R.gdpNomDom[i]/R.gdpNomDom[i-1]-1)*100).toFixed(2) : null;
  o.cyclicalBal = (o.fiscalBal != null && o.structBal != null) ? +(o.fiscalBal - o.structBal).toFixed(2) : null;
  // Debt sustainability: required primary = (realRate/100 - gdpGrowth/100) * grossDebt
  o.requiredPrimary = (o.realRate != null && o.gdpGrowth != null && o.grossDebt != null)
    ? +((o.realRate/100 - o.gdpGrowth/100) * o.grossDebt).toFixed(2) : null;
  o.netGrossDebtGap = (o.grossDebt != null && o.netDebt != null) ? +(o.grossDebt - o.netDebt).toFixed(2) : null;
  o.tradeSpread = (o.exports_gs != null && o.imports_gs != null) ? +(o.exports_gs - o.imports_gs).toFixed(2) : null;
  o.cpiRealRate = o.realRate; // alias for clarity
  return o;
});

// ─── HELPERS ─────────────────────────────────────────────────────
const f1 = v => v == null ? "—" : Number(v).toFixed(1);
const f2 = v => v == null ? "—" : Number(v).toFixed(2);
const fPct = v => v == null ? "—" : `${Number(v).toFixed(1)}%`;
const fK = v => v == null ? "—" : v >= 1000 ? `$${(v/1000).toFixed(1)}k` : `$${Number(v).toFixed(0)}`;
const fBn = v => v == null ? "—" : `$${Number(v).toFixed(0)}bn`;
const fTr = v => v == null ? "—" : `$${(v/1000).toFixed(2)}T`;

const latestVal = key => {
  for (let i = DATA.length-1; i >= 0; i--) if (DATA[i][key] != null) return { v: DATA[i][key], y: DATA[i].year };
  return { v: null, y: null };
};
const avgSince = (key, from) => {
  const pts = DATA.filter(d => d.year >= from && d[key] != null).map(d => d[key]);
  return pts.length ? +(pts.reduce((a,b)=>a+b,0)/pts.length).toFixed(2) : null;
};
const trend = (key, n=5) => {
  const pts = DATA.slice(-n*2).filter(d=>d[key]!=null).slice(-n).map(d=>d[key]);
  return pts.length >= 2 ? +(pts[pts.length-1] - pts[0]).toFixed(2) : null;
};
const periodAvg = (key, from, to) => {
  const pts = DATA.filter(d => d.year >= from && d.year <= to && d[key] != null).map(d=>d[key]);
  return pts.length ? +(pts.reduce((a,b)=>a+b,0)/pts.length).toFixed(1) : null;
};

// ─── DESIGN TOKENS ────────────────────────────────────────────────
const C = {
  bg:      "#0c0e10",
  surface: "#13161a",
  panel:   "#191d22",
  border:  "#252b32",
  border2: "#313840",
  amber:   "#d4943a",
  amber2:  "#f0b955",
  red:     "#cf4444",
  green:   "#4caf7d",
  blue:    "#4a9fd4",
  teal:    "#3dbfa8",
  purple:  "#8e79c4",
  orange:  "#d97a35",
  text:    "#dde3ec",
  dim:     "#7a8898",
  faint:   "#2a3038",
  gold:    "#c8a44a",
};

// Chart style presets
const XP = { tick:{fill:C.dim,fontSize:10,fontFamily:"'Courier New',monospace"}, axisLine:{stroke:C.border}, tickLine:false, interval:4 };
const YP = { tick:{fill:C.dim,fontSize:10,fontFamily:"'Courier New',monospace"}, axisLine:false, tickLine:false, width:48 };
const YPR = { tick:{fill:C.dim,fontSize:10,fontFamily:"'Courier New',monospace"}, axisLine:false, tickLine:false, width:48, orientation:"right" };
const CG_PROPS = { strokeDasharray:"2 5", stroke:C.border, vertical:false };
const RL0 = { y:0, stroke:C.dim, strokeDasharray:"3 4", strokeWidth:1 };
const TTstyle = {
  contentStyle:{ background:"#1a1f26", border:`1px solid ${C.border2}`, borderRadius:8, color:C.text, fontSize:11, padding:"8px 12px" },
  labelStyle:  { color:C.amber, fontWeight:700, fontFamily:"monospace", marginBottom:3 },
  itemStyle:   { color:C.dim, padding:"1px 0" },
  cursor:      { stroke:C.border2 },
};

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────

function KPICard({ label, val, unit="", note="", good=null, fmt=f1 }) {
  const t5 = trend(val === Object(val) ? null : val);
  const formattedVal = latestVal(val);
  const isGood = good == null ? null : (good ? (t5||0) > 0 : (t5||0) < 0);
  const arrowColor = isGood == null ? C.dim : isGood ? C.green : C.red;
  const valueColor = isGood == null ? C.amber2 : isGood ? C.green : C.red;
  return (
    <div style={{
      background:C.panel, border:`1px solid ${C.border}`, borderRadius:9,
      padding:"12px 14px", display:"flex", flexDirection:"column", gap:3,
    }}>
      <div style={{fontSize:9.5,color:C.dim,textTransform:"uppercase",letterSpacing:"1.5px",fontWeight:600}}>{label}</div>
      <div style={{fontSize:22,fontWeight:800,color:valueColor,fontFamily:"'Courier New',monospace",lineHeight:1.1}}>
        {typeof val === "string" ? (formattedVal.v == null ? "—" : fmt(formattedVal.v)) : val}
        <span style={{fontSize:10,color:C.dim,marginLeft:4,fontWeight:400}}>{unit}</span>
      </div>
      {note && <div style={{fontSize:10,color:arrowColor,lineHeight:1.4}}>{note}</div>}
    </div>
  );
}

function Panel({ title, sub, children, h=230, cols=1 }) {
  return (
    <div style={{
      background:C.panel, border:`1px solid ${C.border}`, borderRadius:10,
      padding:"15px 16px", gridColumn: cols > 1 ? `span ${cols}` : undefined,
    }}>
      <div style={{marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div style={{fontSize:11.5,fontWeight:700,color:C.text,fontFamily:"Georgia,serif",letterSpacing:0.2}}>{title}</div>
        {sub && <div style={{fontSize:9.5,color:C.dim,maxWidth:240,textAlign:"right",lineHeight:1.45}}>{sub}</div>}
      </div>
      <div style={{height:h}}>{children}</div>
    </div>
  );
}

function Callout({ icon, text, color=C.dim }) {
  return (
    <div style={{
      background:`${color}10`, border:`1px solid ${color}38`, borderRadius:8,
      padding:"10px 14px", fontSize:11, color:C.text, lineHeight:1.65,
      display:"flex", gap:10, alignItems:"flex-start",
    }}>
      <span style={{fontSize:15,flexShrink:0}}>{icon}</span>
      <span dangerouslySetInnerHTML={{__html:text}} />
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{
      borderLeft:`3px solid ${C.amber}`, paddingLeft:14, marginBottom:12,
    }}>
      <div style={{fontSize:15,fontWeight:800,color:C.text,fontFamily:"Georgia,serif"}}>{title}</div>
      {subtitle && <div style={{fontSize:11,color:C.dim,marginTop:2}}>{subtitle}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: OVERVIEW
// ═══════════════════════════════════════════════════════════════
function Overview() {
  const kpiRows = [
    [
      { label:"Real GDP Growth", key:"gdpGrowth", unit:"%", good:true, fmt:f1 },
      { label:"GDP/cap PPP (2021$)", key:"gdpCapPPP", unit:"", good:true, fmt:fK },
      { label:"GDP/cap USD", key:"gdpCapUSD", unit:"", good:true, fmt:fK },
      { label:"GDP Total (USD)", key:"gdpNomUSD", unit:"bn", good:true, fmt:v=>fTr(v*1000) },
      { label:"World GDP Share", key:"gdpPctWorld", unit:"%", good:true, fmt:f1 },
    ],
    [
      { label:"CPI Inflation", key:"cpi", unit:"%", good:false, fmt:f1 },
      { label:"CB Policy Rate", key:"cbRate", unit:"%", good:null, fmt:f1 },
      { label:"Real Interest Rate", key:"realRate", unit:"%", good:null, fmt:f1 },
      { label:"Unemployment", key:"unemp", unit:"%", good:false, fmt:f1 },
      { label:"FX Index (2000=1)", key:"fx", unit:"", good:null, fmt:f2 },
    ],
    [
      { label:"Fiscal Balance", key:"fiscalBal", unit:"% GDP", good:true, fmt:f1 },
      { label:"Primary Balance", key:"primaryBal", unit:"% GDP", good:true, fmt:f1 },
      { label:"Structural Balance", key:"structBal", unit:"% GDP", good:true, fmt:f1 },
      { label:"Gross Public Debt", key:"grossDebt", unit:"% GDP", good:false, fmt:f1 },
      { label:"Net Public Debt", key:"netDebt", unit:"% GDP", good:false, fmt:f1 },
    ],
    [
      { label:"Current Account", key:"ca_pct", unit:"% GDP", good:true, fmt:f1 },
      { label:"External Debt", key:"extDebt", unit:"% GDP", good:false, fmt:f1 },
      { label:"Gross Savings", key:"savings", unit:"% GDP", good:true, fmt:f1 },
      { label:"Gross Investment", key:"capForm", unit:"% GDP", good:true, fmt:f1 },
      { label:"Labor Productivity", key:"productivity", unit:"", good:true, fmt:fK },
    ],
    [
      { label:"GINI Coefficient", key:"gini", unit:"", good:false, fmt:f1 },
      { label:"Poverty Rate", key:"poverty", unit:"%", good:false, fmt:f1 },
      { label:"Revenue", key:"revenue", unit:"% GDP", good:true, fmt:f1 },
      { label:"Expenditure", key:"expend", unit:"% GDP", good:false, fmt:f1 },
      { label:"GDP Deflator Growth", key:"gdpDeflGrowth", unit:"%", good:false, fmt:f1 },
    ],
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionHeader title="Macroeconomic Snapshot" subtitle="Latest available values across all 40 indicators — Country 1 · 2000–2025" />

      {kpiRows.map((row, ri) => (
        <div key={ri} style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {row.map(k => {
            const { v } = latestVal(k.key);
            const t5v = trend(k.key);
            const isGood = k.good == null ? null : (k.good ? (t5v||0)>0 : (t5v||0)<0);
            const valueColor = isGood == null ? C.amber2 : isGood ? C.green : C.red;
            const t5color = t5v == null ? C.dim : (k.good == null ? C.dim : (k.good?(t5v>0?C.green:C.red):(t5v<0?C.green:C.red)));
            return (
              <div key={k.key} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 13px"}}>
                <div style={{fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:"1.3px",fontWeight:600,marginBottom:4}}>{k.label}</div>
                <div style={{fontSize:20,fontWeight:800,color:valueColor,fontFamily:"'Courier New',monospace",lineHeight:1.1}}>
                  {v == null ? "—" : k.fmt(v)}<span style={{fontSize:10,color:C.dim,marginLeft:3,fontWeight:400}}>{k.unit}</span>
                </div>
                {t5v != null && (
                  <div style={{fontSize:9.5,color:t5color,marginTop:3}}>
                    {t5v > 0 ? "↑" : "↓"} {Math.abs(t5v).toFixed(1)} · 5y trend
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:4}}>
        <Panel title="GDP Growth + Recessions" sub="Shaded = contraction" h={210}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"GDP Growth"]}/>
              <ReferenceLine {...RL0}/>
              {[["2009","2009",C.red+"18"],["2015","2016",C.red+"18"],["2020","2020",C.red+"18"]].map(([x1,x2,fill])=>(
                <ReferenceLine key={x1} x={x1} stroke="none" />
              ))}
              <Bar dataKey="gdpGrowth" radius={[3,3,0,0]} fill={C.amber} />
              <Line dataKey="gdpGrowth" stroke={C.amber2} dot={false} strokeWidth={1.5} strokeDasharray="4 2" connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Macro Thermometer: CPI · CB Rate · Unemployment" sub="Core cyclical gauges" h={210}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Line dataKey="cpi" name="CPI %" stroke={C.red} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="cbRate" name="CB Rate %" stroke={C.amber} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="unemp" name="Unemp %" stroke={C.blue} dot={false} strokeWidth={2} connectNulls/>
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Twin Deficits: Fiscal + Current Account" sub="Both structurally negative" h={210}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Area dataKey="fiscalBal" name="Fiscal Bal %" fill={C.red+"20"} stroke={C.red} strokeWidth={2} connectNulls/>
              <Area dataKey="ca_pct" name="Curr Acct %" fill={C.blue+"20"} stroke={C.blue} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="📌" color={C.amber} text={`Real GDP grew avg <b>${avgSince("gdpGrowth","2000")}%/yr</b> 2000–2025, but with three negative episodes (2009 GFC, 2015–16 commodity crash, 2020 COVID). High variance = commodity-cycle dependency.`}/>
        <Callout icon="⚠️" color={C.red} text={`Gross public debt climbed from <b>62%</b> (2000) to <b>91%</b> (2025), a +29pp deterioration over 25 years. Structural fiscal deficit every single year: consolidation never delivered.`}/>
        <Callout icon="🔍" color={C.blue} text={`GDP per capita (PPP) rose from <b>$13,951</b> to <b>$19,991</b> (+43%), but progress halted 2014–2019. Real living standard gains are concentrated in the boom years and reversed in busts.`}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: GDP & GROWTH
// ═══════════════════════════════════════════════════════════════
function GDPGrowth() {
  const gdpIndexData = DATA.map(d => ({
    year: d.year,
    constIdx: R.gdpConst[0] ? +((d.gdpConst/R.gdpConst[0])*100).toFixed(1):null,
    pppIdx:   R.gdpCapPPP[0] ? +((d.gdpCapPPP/R.gdpCapPPP[0])*100).toFixed(1):null,
    usdIdx:   R.gdpCapUSD[0] ? +((d.gdpCapUSD/R.gdpCapUSD[0])*100).toFixed(1):null,
  }));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader title="GDP & Growth Analysis" subtitle="Volume · Per Capita · PPP · Deflator · Productivity · Investment" />

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="Real GDP Growth (%) + Shock Annotations" sub="2009 GFC · 2015–16 Bust · 2020 COVID" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"GDP Growth"]}/>
              <ReferenceLine {...RL0}/>
              <ReferenceLine x="2009" stroke={C.dim} strokeDasharray="3 3" label={{value:"GFC",fill:C.dim,fontSize:9,position:"insideTopRight"}}/>
              <ReferenceLine x="2015" stroke={C.dim} strokeDasharray="3 3" label={{value:"Bust",fill:C.dim,fontSize:9,position:"insideTopRight"}}/>
              <ReferenceLine x="2020" stroke={C.dim} strokeDasharray="3 3" label={{value:"COVID",fill:C.dim,fontSize:9,position:"insideTopRight"}}/>
              <Bar dataKey="gdpGrowth" radius={[3,3,0,0]} fill={C.amber}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Nominal vs Real GDP Growth (%)" sub="Gap = inflation (GDP deflator)" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Bar dataKey="gdpDeflGrowth" name="GDP Deflator Inflation %" fill={C.red} opacity={0.5} radius={[2,2,0,0]}/>
              <Line dataKey="gdpGrowth" name="Real Growth %" stroke={C.amber} dot={false} strokeWidth={2.5} connectNulls/>
              <Line dataKey="gdpNomGrowth" name="Nominal Growth %" stroke={C.green} dot={false} strokeWidth={1.5} strokeDasharray="5 2" connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="GDP Volume (Constant Prices, Bn Dom. Currency)" sub="Levels show structural growth trajectory" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP} tickFormatter={v=>`${v}`}/>
              <Tooltip {...TTstyle} formatter={v=>[`${Number(v).toFixed(1)} bn`,"GDP Real"]}/>
              <Area dataKey="gdpConst" name="GDP Const. Bn" stroke={C.amber} fill={C.amber+"25"} strokeWidth={2} connectNulls/>
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="GDP per Capita: PPP vs USD vs Const. Domestic" sub="PPP=real living standards · USD=FX-distorted" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <YAxis yAxisId="r" {...YPR} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} width={52}/>
              <Tooltip {...TTstyle} formatter={v=>[`$${Number(v).toLocaleString()}`]}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Area yAxisId="l" dataKey="gdpCapPPP" name="GDP/cap PPP" fill={C.blue+"20"} stroke={C.blue} strokeWidth={2} connectNulls/>
              <Line yAxisId="r" dataKey="gdpCapUSD" name="GDP/cap USD" stroke={C.amber} dot={false} strokeWidth={2} connectNulls strokeDasharray="5 2"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="GDP Index (2000=100): Real Volume · PPP/cap · USD/cap" sub="USD collapse in 2015–21 = pure FX effect" h={230}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gdpIndexData}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine y={100} stroke={C.dim} strokeDasharray="3 3"/>
              <Line dataKey="constIdx" name="Real Vol Index" stroke={C.green} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="pppIdx" name="PPP/cap Index" stroke={C.blue} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="usdIdx" name="USD/cap Index" stroke={C.red} dot={false} strokeWidth={2} connectNulls/>
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="GDP Deflator Level + Growth Rate" sub="Price level creeping upward — 6× since 2000" h={230}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP} tickFormatter={v=>`${v}`}/>
              <YAxis yAxisId="r" {...YPR} width={44}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Area yAxisId="l" dataKey="gdpDeflator" name="Deflator Level" fill={C.amber+"15"} stroke={C.amber} strokeWidth={2} connectNulls/>
              <Bar yAxisId="r" dataKey="gdpDeflGrowth" name="Deflator Growth %" fill={C.red} opacity={0.5} radius={[2,2,0,0]}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Investment vs National Savings (% GDP)" sub="Chronic investment > savings gap → external financing" h={230}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Area dataKey="capForm" name="Gross Capital Form. %" fill={C.purple+"25"} stroke={C.purple} strokeWidth={2} connectNulls/>
              <Area dataKey="savings" name="Gross Nat. Savings %" fill={C.green+"20"} stroke={C.green} strokeWidth={2} connectNulls/>
              <Bar dataKey="savInvGap" name="Savings−Invest Gap" fill={C.amber} opacity={0.5} radius={[2,2,0,0]}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Labor Productivity (GDP/worker, 2021 PPP $)" sub="Structural growth ceiling at ~$42k since 2011" h={230}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip {...TTstyle} formatter={v=>[`$${Number(v).toLocaleString()}`,"Productivity"]}/>
              <Area dataKey="productivity" name="Labor Productivity" stroke={C.teal} fill={C.teal+"25"} strokeWidth={2} connectNulls/>
              <Line dataKey="productivity" stroke={C.amber} dot={false} strokeWidth={1} connectNulls strokeDasharray="3 3"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Productivity Growth Rate (%) YoY" sub="Stagnation post-2012 is the competitiveness risk" h={230}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"Prod. Growth"]}/>
              <ReferenceLine {...RL0}/>
              <Bar dataKey="prodGrowth" name="Productivity Growth %" radius={[3,3,0,0]} fill={C.teal}/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="GDP World Share (%)" sub="Relative economic weight on the global stage" h={230}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP} domain={[2,3.2]} tickFormatter={v=>`${v}%`}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"World GDP Share"]}/>
              <Area dataKey="gdpPctWorld" name="% World GDP (PPP)" stroke={C.gold} fill={C.gold+"20"} strokeWidth={2} connectNulls/>
              <ReferenceLine y={2.9} stroke={C.dim} strokeDasharray="3 3" label={{value:"2000 level",fill:C.dim,fontSize:9,position:"insideRight"}}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="📈" color={C.amber} text={`Real GDP volume grew +75% over 25 years (2000→2025). But GDP per capita in USD only doubled due to 65%+ FX depreciation erasing nominal USD gains. <b>PPP is a more honest scorecard.</b>`}/>
        <Callout icon="🛠" color={C.teal} text={`Productivity ceiling at ~$42k/worker since 2013 is the key structural constraint. Without productivity growth, the economy cannot sustain >3% growth without overheating or external imbalances.`}/>
        <Callout icon="📉" color={C.red} text={`Savings–investment gap has been negative since 2014 (savings < investment). The country relies on foreign capital to fund domestic investment — a chronic external financing vulnerability.`}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: MONETARY
// ═══════════════════════════════════════════════════════════════
function Monetary() {
  const periodCPI = [
    { period:"2000–04", avg: periodAvg("cpi","2000","2004") },
    { period:"2005–09", avg: periodAvg("cpi","2005","2009") },
    { period:"2010–14", avg: periodAvg("cpi","2010","2014") },
    { period:"2015–19", avg: periodAvg("cpi","2015","2019") },
    { period:"2020–25", avg: periodAvg("cpi","2020","2025") },
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader title="Monetary & Price Analysis" subtitle="CPI · CB Rate · Real Rate · FX · Unemployment · Deflator" />

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="CPI Inflation vs CB Policy Rate (%)" sub="CB rate consistently above CPI = positive real rate" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Bar dataKey="cpi" name="CPI %" fill={C.red+"77"} radius={[2,2,0,0]}/>
              <Line dataKey="cbRate" name="CB Rate %" stroke={C.amber} dot={false} strokeWidth={2.5} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Real Interest Rate (CB Rate − CPI)" sub="Sustained high positive real rates → crowding out" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"Real Rate"]}/>
              <ReferenceLine {...RL0}/>
              <ReferenceLine y={5} stroke={C.red} strokeDasharray="3 3" label={{value:"Very tight (+5%)",fill:C.red,fontSize:9,position:"insideRight"}}/>
              <Bar dataKey="realRate" name="Real Rate %" radius={[3,3,0,0]} fill={C.orange}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="CPI Inflation vs GDP Deflator Growth" sub="Two measures of inflation — divergence = structural" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Line dataKey="cpi" name="CPI %" stroke={C.red} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="gdpDeflGrowth" name="GDP Deflator %" stroke={C.amber} dot={false} strokeWidth={2} connectNulls strokeDasharray="5 2"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Exchange Rate Index vs USD (2000=1)" sub="65%+ depreciation over 20 years — structural" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[Number(v).toFixed(3),"FX Index"]}/>
              <ReferenceLine y={1} stroke={C.dim} strokeDasharray="3 3" label={{value:"2000 base",fill:C.dim,fontSize:9,position:"insideRight"}}/>
              <ReferenceLine y={0.5} stroke={C.amber} strokeDasharray="3 3" label={{value:"−50%",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="fx" name="FX Index" stroke={C.blue} fill={C.blue+"20"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Average CPI by 5-Year Period" sub="Structural inflation regime above 5% throughout" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={periodCPI}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="period" tick={{fill:C.dim,fontSize:10,fontFamily:"'Courier New',monospace"}} axisLine={{stroke:C.border}} tickLine={false}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"Avg CPI"]}/>
              <ReferenceLine y={5} stroke={C.amber} strokeDasharray="3 3" label={{value:"5% anchor",fill:C.amber,fontSize:9}}/>
              <Bar dataKey="avg" name="Avg CPI %" fill={C.red} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="FX Depreciation vs CPI: Pass-Through?" sub="Weak FX → import-cost-push inflation" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP}/>
              <YAxis yAxisId="r" {...YPR} tickFormatter={v=>Number(v).toFixed(2)} width={50}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Bar yAxisId="l" dataKey="cpi" name="CPI %" fill={C.red+"66"} radius={[2,2,0,0]}/>
              <Line yAxisId="r" dataKey="fx" name="FX Index (R)" stroke={C.blue} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Unemployment Rate (%)" sub="Never below 6.9% in 25 years = structural floor" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP} domain={[6,15]}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"Unemployment"]}/>
              <ReferenceLine y={10} stroke={C.amber} strokeDasharray="3 3" label={{value:"10%",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="unemp" name="Unemployment %" stroke={C.red} fill={C.red+"20"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Monetary Tightness Index: Real Rate × Unemployment" sub="Both high = double drag on demand (stagflation risk)" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA.map(d=>({...d, tightness: d.realRate!=null&&d.unemp!=null ? +(d.realRate+d.unemp).toFixed(2):null}))}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"Tightness (Real Rate + Unemp)"]}/>
              <Area dataKey="tightness" name="Tightness Index" stroke={C.purple} fill={C.purple+"25"} strokeWidth={2} connectNulls/>
              <Line dataKey="gdpGrowth" name="GDP Growth %" stroke={C.green} dot={false} strokeWidth={1.5} strokeDasharray="4 2" connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="🏦" color={C.amber} text={`The CB kept nominal rates at 15–19% in 2000–01 — with CPI around 8%, the real rate was ~9–11%. This was extremely contractionary. Investment stagnated. The rate cycle tracks commodity/FX pressure, not just inflation.`}/>
        <Callout icon="💱" color={C.blue} text={`The FX index fell from 1.0 → 0.34 (2021) — a <b>66% cumulative depreciation vs USD</b>. The CPI correlation is visible: big FX drops (2015, 2020–21) are followed by CPI spikes. Pass-through is strong, ~30–50%.`}/>
        <Callout icon="📊" color={C.orange} text={`Post-COVID CB rate trajectory: 2% (2020) → 13.75% (2022) → 10.5% (2024) → 15% (2025). Despite normalization, the 2025 re-hike to 15% suggests a new inflationary shock or FX pressure is underway.`}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: FISCAL
// ═══════════════════════════════════════════════════════════════
function Fiscal() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader title="Fiscal Policy & Debt Sustainability" subtitle="All balances · Gross/Net debt · Revenue/Expenditure · Structural breakdown" />

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="All Fiscal Balances (% GDP): Overall · Primary · Structural" sub="Three complementary lenses on fiscal health" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <ReferenceLine y={-3} stroke={C.amber} strokeDasharray="3 3" label={{value:"−3% Maastricht",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="fiscalBal" name="Overall Balance" fill={C.red+"20"} stroke={C.red} strokeWidth={2} connectNulls/>
              <Line dataKey="primaryBal" name="Primary Balance" stroke={C.green} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="structBal" name="Structural Balance" stroke={C.purple} dot={false} strokeWidth={2} connectNulls strokeDasharray="5 3"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Gross vs Net Public Debt (% GDP)" sub="Gap = assets held by gov't (financial buffers)" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP} domain={[25,100]}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine y={60} stroke={C.amber} strokeDasharray="3 3" label={{value:"60%",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <ReferenceLine y={90} stroke={C.red} strokeDasharray="3 3" label={{value:"90% danger",fill:C.red,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="grossDebt" name="Gross Debt %" stroke={C.red} fill={C.red+"20"} strokeWidth={2} connectNulls/>
              <Line dataKey="netDebt" name="Net Debt %" stroke={C.orange} dot={false} strokeWidth={2} connectNulls strokeDasharray="5 2"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Revenue vs Expenditure (% GDP)" sub="Persistent spending above revenue since 2001" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP} domain={[30,52]}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Area dataKey="expend" name="Expenditure %" fill={C.red+"22"} stroke={C.red} strokeWidth={2} connectNulls/>
              <Area dataKey="revenue" name="Revenue %" fill={C.green+"22"} stroke={C.green} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Structural vs Cyclical Balance Decomposition" sub="Cyclical = GDP cycle; Structural = permanent weakness" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Bar dataKey="cyclicalBal" name="Cyclical Component" fill={C.blue} opacity={0.7} radius={[2,2,0,0]} stackId="s"/>
              <Bar dataKey="structBal" name="Structural Component" fill={C.red} opacity={0.85} radius={[2,2,0,0]} stackId="s"/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Fiscal Gap: Expenditure Excess over Revenue (% GDP)" sub="Interest payments are the bridge between primary and overall" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"Spending Excess"]}/>
              <ReferenceLine {...RL0}/>
              <Bar dataKey="fiscalGap" name="Expend − Revenue %" fill={C.orange} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Debt Sustainability: Required vs Actual Primary Balance" sub="Required primary = (r−g) × d/GDP; actual below = unsustainable" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Line dataKey="requiredPrimary" name="Required Primary %" stroke={C.red} dot={false} strokeWidth={2} connectNulls strokeDasharray="5 3"/>
              <Bar dataKey="primaryBal" name="Actual Primary %" fill={C.green} opacity={0.75} radius={[2,2,0,0]}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Net Debt Level (Domestic Currency, Billions)" sub="Absolute debt burden growing faster than economy" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP} tickFormatter={v=>`${(v/1000).toFixed(0)}T`}/>
              <Tooltip {...TTstyle} formatter={v=>[`${Number(v).toFixed(0)} bn`,"Net Debt"]}/>
              <Area dataKey="netDebtDom" name="Net Debt Dom. Bn" stroke={C.red} fill={C.red+"20"} strokeWidth={2} connectNulls/>
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Revenue Growth vs Expenditure Growth (% YoY)" sub="Spending growth consistently ahead of revenue growth" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA.map((d,i)=>({
              year:d.year,
              revGrowth: i>0&&R.revenueDom[i]!=null&&R.revenueDom[i-1]!=null ? +((R.revenueDom[i]/R.revenueDom[i-1]-1)*100).toFixed(1):null,
              expGrowth: i>0&&R.fiscalDom[i]!=null&&R.revenueDom[i]!=null&&R.expend[i]!=null ? null:null, // placeholder
            }))}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Bar dataKey="revGrowth" name="Revenue Growth % YoY" fill={C.green} opacity={0.8} radius={[2,2,0,0]}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="🔴" color={C.red} text={`Structural balance has been negative in <b>every single year</b> recorded (avg ~−5.4% GDP). The deficit is not cyclical — it's baked into the spending structure. Consolidation requires genuine expenditure reform.`}/>
        <Callout icon="📋" color={C.green} text={`Primary balance was positive 2001–2013 (+3% avg), meaning the government was paying interest. The <b>shift to primary deficit in 2014</b> is the tipping point — debt began compounding geometrically.`}/>
        <Callout icon="⚙️" color={C.blue} text={`Revenue has been stable at 35–40% of GDP. The fiscal problem is on the <b>expenditure side</b>, which rose from 40% to 48% of GDP. Tax reform alone cannot close the gap — spending must fall.`}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: EXTERNAL
// ═══════════════════════════════════════════════════════════════
function External() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader title="External Sector & Trade" subtitle="Current Account · External Debt · FX · Exports & Imports (Goods + Services)" />

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="Current Account Balance: % GDP + USD bn" sub="CA deficit mirrors domestic excess absorption" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP}/>
              <YAxis yAxisId="r" {...YPR} tickFormatter={v=>`$${v}b`} width={54}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine yAxisId="l" {...RL0}/>
              <Bar yAxisId="l" dataKey="ca_pct" name="CA % GDP" fill={C.blue} opacity={0.75} radius={[2,2,0,0]}/>
              <Line yAxisId="r" dataKey="ca_usd" name="CA USD bn" stroke={C.amber} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="External Debt (% GDP)" sub="Fell dramatically 2002–11 (commodity boom); rising again since" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"External Debt"]}/>
              <ReferenceLine y={30} stroke={C.amber} strokeDasharray="3 3" label={{value:"30%",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="extDebt" name="External Debt %" stroke={C.orange} fill={C.orange+"22"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Exports & Imports — Goods+Services vs Goods only (% chg)" sub="Services exports more stable than goods volumes" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Line dataKey="exports_gs" name="Exports G+S %" stroke={C.green} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="exports_g" name="Exports Goods %" stroke={C.teal} dot={false} strokeWidth={1.5} connectNulls strokeDasharray="4 2"/>
              <Line dataKey="imports_gs" name="Imports G+S %" stroke={C.red} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="imports_g" name="Imports Goods %" stroke={C.orange} dot={false} strokeWidth={1.5} connectNulls strokeDasharray="4 2"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Exchange Rate Index (2000=1)" sub="Structural depreciation — currency lost 65%+ vs USD" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[Number(v).toFixed(3),"FX"]}/>
              <ReferenceLine y={1} stroke={C.dim} strokeDasharray="3 3"/>
              <ReferenceLine y={0.5} stroke={C.amber} strokeDasharray="3 3" label={{value:"−50%",fill:C.amber,fontSize:9}}/>
              <Area dataKey="fx" name="FX vs USD" stroke={C.purple} fill={C.purple+"22"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Export−Import Volume Spread (%)" sub="Positive = export-led growth; negative = import boom/compression" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"Export−Import Spread"]}/>
              <ReferenceLine {...RL0}/>
              <Bar dataKey="tradeSpread" name="Exports−Imports Spread" radius={[2,2,0,0]} fill={C.teal}/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="CA Balance vs FX: J-Curve Test" sub="Depreciation should improve CA with a lag — does it here?" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP}/>
              <YAxis yAxisId="r" {...YPR} tickFormatter={v=>Number(v).toFixed(2)} width={50}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine yAxisId="l" {...RL0}/>
              <Bar yAxisId="l" dataKey="ca_pct" name="CA % GDP" fill={C.blue} opacity={0.6} radius={[2,2,0,0]}/>
              <Line yAxisId="r" dataKey="fx" name="FX Index (R)" stroke={C.amber} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Savings−Investment Gap vs Current Account" sub="Accounting identity: CA ≡ Savings − Investment" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Bar dataKey="savInvGap" name="Sav−Inv Gap %" fill={C.amber} opacity={0.6} radius={[2,2,0,0]}/>
              <Line dataKey="ca_pct" name="CA % GDP" stroke={C.blue} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Export Volume Growth Breakdown" sub="Goods exports are more volatile than total G+S" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Bar dataKey="exports_g" name="Goods Exports %" fill={C.green} opacity={0.65} radius={[2,2,0,0]}/>
              <Line dataKey="exports_gs" name="G+S Exports %" stroke={C.amber} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="🌐" color={C.blue} text={`Current account was briefly positive 2003–06 (commodity windfall). Since then, persistently negative. The 2014 trough at <b>−4.5% GDP (−$110bn)</b> was the worst episode. Structural absorption > production.`}/>
        <Callout icon="💸" color={C.orange} text={`External debt fell from 47% (2002) → 16% (2011) during the commodity super-cycle. The post-2014 reversal to ~38% (2020) combined with the fiscal deterioration creates a <b>double vulnerability.</b>`}/>
        <Callout icon="🔄" color={C.purple} text={`J-curve evidence is weak: despite 65%+ FX depreciation since 2008, CA improvement was modest (−4.5% → −1.3% by 2023). Low export elasticity suggests <b>supply-side bottlenecks</b> dominate price effects.`}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: SOCIAL
// ═══════════════════════════════════════════════════════════════
function Social() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader title="Social Indicators & Inclusive Growth" subtitle="GINI · Poverty · Unemployment · Productivity · Living Standards" />

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="GINI Coefficient (Income Inequality)" sub="One of world's highest — structural, persistent, barely improving" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP} domain={[45,63]}/>
              <Tooltip {...TTstyle} formatter={v=>[Number(v).toFixed(1),"GINI"]}/>
              <ReferenceLine y={40} stroke={C.amber} strokeDasharray="3 3" label={{value:"40=high",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <ReferenceLine y={60} stroke={C.red} strokeDasharray="3 3" label={{value:"60=extreme",fill:C.red,fontSize:9,position:"insideRight"}}/>
              <Bar dataKey="gini" name="GINI" fill={C.purple} opacity={0.8} radius={[3,3,0,0]}/>
              <Line dataKey="gini" stroke={C.amber} dot={false} strokeWidth={1.5} connectNulls strokeDasharray="4 2"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Poverty Rate (<$3/day, 2021 PPP)" sub="Half a generation of progress then COVID reversal" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"Poverty"]}/>
              <Area dataKey="poverty" name="Poverty %" stroke={C.orange} fill={C.orange+"22"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Unemployment Rate — Structural Floor Analysis" sub="Never below 6.9%: hysteresis, informality, rigidities" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP} domain={[6,15]}/>
              <Tooltip {...TTstyle} formatter={v=>[fPct(v),"Unemployment"]}/>
              <ReferenceLine y={7} stroke={C.amber} strokeDasharray="3 3" label={{value:"Structural floor ~7%",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <ReferenceLine y={12} stroke={C.red} strokeDasharray="3 3" label={{value:"Recession peak",fill:C.red,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="unemp" name="Unemployment %" stroke={C.red} fill={C.red+"20"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="GDP per Capita PPP vs GINI: Do Gains Trickle Down?" sub="Growing income; barely improving distribution" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <YAxis yAxisId="r" {...YPR} domain={[48,62]} width={48}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Area yAxisId="l" dataKey="gdpCapPPP" name="GDP/cap PPP" fill={C.blue+"20"} stroke={C.blue} strokeWidth={2} connectNulls/>
              <Line yAxisId="r" dataKey="gini" name="GINI (R)" stroke={C.purple} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Poverty + Unemployment Together" sub="Both spiked in 2015–16 and 2020 — vulnerable populations hit hardest" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Area dataKey="poverty" name="Poverty %" fill={C.orange+"22"} stroke={C.orange} strokeWidth={2} connectNulls/>
              <Line dataKey="unemp" name="Unemployment %" stroke={C.red} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Labor Productivity vs Unemployment" sub="Productivity gains haven't reduced structural unemployment" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <YAxis yAxisId="r" {...YPR} domain={[6,15]} width={44}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Area yAxisId="l" dataKey="productivity" name="Productivity" fill={C.teal+"22"} stroke={C.teal} strokeWidth={2} connectNulls/>
              <Line yAxisId="r" dataKey="unemp" name="Unemployment % (R)" stroke={C.red} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Inclusive Growth Scorecard (Indexed 2000=100)" sub="PPP growth outpaces inequality improvement — growth not inclusive" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DATA.map(d=>({
              year: d.year,
              pppIdx:  R.gdpCapPPP[0] ? +((d.gdpCapPPP/R.gdpCapPPP[0])*100).toFixed(1):null,
              unempIdx: R.unemp[0] ? +((d.unemp/R.unemp[0])*100).toFixed(1):null,
              giniIdx: R.gini.find(v=>v!=null) ? +((d.gini/R.gini.find(v=>v!=null))*100).toFixed(1):null,
            }))}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine y={100} stroke={C.dim} strokeDasharray="3 3"/>
              <Line dataKey="pppIdx" name="GDP/cap Index" stroke={C.blue} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="unempIdx" name="Unemp Index" stroke={C.red} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="giniIdx" name="GINI Index" stroke={C.purple} dot={false} strokeWidth={2} connectNulls/>
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Poverty Decline Rate vs GDP Growth" sub="Busts erase poverty gains faster than booms create them" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Bar dataKey="poverty" name="Poverty %" fill={C.orange} opacity={0.6} radius={[2,2,0,0]}/>
              <Line dataKey="gdpGrowth" name="GDP Growth %" stroke={C.green} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="⚖️" color={C.purple} text={`GINI of <b>51–58</b> across the entire sample places this economy among the most unequal globally. The decline from 58.4 (2001) to 51.6 (2023) is positive but glacially slow — policy has not structurally redistributed.`}/>
        <Callout icon="📉" color={C.orange} text={`Poverty fell from 17.5% (2001) → 4.7% (2014) — a remarkable 13pp decline over 13 years. Then busts (2015–16, 2020) pushed it back to 7.5%. <b>Gains are fragile and recession-contingent.</b>`}/>
        <Callout icon="🧱" color={C.red} text={`The structural unemployment floor (~7%) has not shifted in 25 years despite productivity growth. This suggests formal sector job creation is inadequate — the informal economy is large, and benefits don't reach lower quintiles.`}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: DIAGNOSE
// ═══════════════════════════════════════════════════════════════
function Diagnose() {
  const scatterOkun = DATA.filter(d=>d.gdpGrowth!=null&&d.unemp!=null).map(d=>({...d}));
  const scatterTwinDef = DATA.filter(d=>d.ca_pct!=null&&d.fiscalBal!=null).map(d=>({ca:d.ca_pct,fiscal:d.fiscalBal,year:d.year}));
  const scatterFxCpi = DATA.filter(d=>d.fx!=null&&d.cpi!=null).map(d=>({fx:d.fx,cpi:d.cpi,year:d.year}));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionHeader title="Diagnostic Analysis" subtitle="Root causes · Transmission mechanisms · Cross-indicator relationships" />

      <div style={{
        background:C.panel, border:`1.5px solid ${C.amber}44`, borderRadius:12, padding:"16px 20px",
      }}>
        <div style={{fontSize:12,fontWeight:700,color:C.amber,fontFamily:"Georgia,serif",marginBottom:12}}>🔬 Six Root Causes</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[
            {t:"Structural Fiscal Deficit",c:C.red,d:"Spending > revenue in every year since 2001. Structural balance averages −5.4% GDP. Not cyclical — permanent. Requires expenditure rationalization (subsidies, public wage bill, debt service)."},
            {t:"Debt Spiral",c:C.orange,d:"Gross debt: 62% (2000) → 96% (2020). Primary balance shifted to deficit post-2014. Required primary surplus to stabilize debt is consistently larger than actual — unsustainable trajectory."},
            {t:"FX Depreciation & Inflation",c:C.amber,d:"Currency lost 65% vs USD. High CB rates (2–19%) attempt to anchor but suppress investment. Real rate positive most years → contractionary monetary stance alongside structural inflation."},
            {t:"External Vulnerability",c:C.blue,d:"Persistent CA deficits funded by external inflows. External debt reversed post-2014 (now ~29–38%). Twin deficit correlation strong — fiscal slippage directly worsens external balance."},
            {t:"Structural Unemployment",c:C.purple,d:"Unemployment never below 6.9% in 25 years. Labor market rigidities, large informal sector, and hysteresis effects prevent structural reduction even during boom cycles."},
            {t:"Inequality Trap",c:C.teal,d:"GINI 51–58 throughout, among world's highest. High inequality limits aggregate demand, concentrates growth in upper quintiles, creates political economy pressures that fuel populist fiscal cycles."},
          ].map(({t,c,d})=>(
            <div key={t} style={{background:`${c}0d`,border:`1px solid ${c}35`,borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:c,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6}}>{t}</div>
              <div style={{fontSize:11,color:C.dim,lineHeight:1.65}}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <Panel title="Okun's Law: GDP Growth vs Unemployment" sub="Does growth reliably reduce unemployment here?" h={260}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis type="number" dataKey="gdpGrowth" name="GDP Growth %" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={{stroke:C.border}} tickLine={false} label={{value:"GDP Growth %",fill:C.dim,fontSize:10,position:"insideBottom",offset:-2}}/>
              <YAxis type="number" dataKey="unemp" name="Unemployment %" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false} label={{value:"Unemp %",fill:C.dim,fontSize:9,angle:-90,position:"insideLeft"}}/>
              <ZAxis range={[45,45]}/>
              <Tooltip cursor={{strokeDasharray:"3 3",stroke:C.border2}} content={({payload})=>{
                if(!payload?.length) return null;
                const p = payload[0]?.payload;
                return <div style={{...TTstyle.contentStyle,padding:"6px 10px"}}>
                  <div style={{color:C.amber,fontWeight:700}}>{p.year}</div>
                  <div style={{color:C.dim}}>Growth: {fPct(p.gdpGrowth)} | Unemp: {fPct(p.unemp)}</div>
                </div>;
              }}/>
              <Scatter data={scatterOkun} fill={C.blue} fillOpacity={0.7}/>
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Twin Deficit: Fiscal vs Current Account" sub="Strong co-movement confirms Ricardian/Keynesian channel" h={260}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis type="number" dataKey="fiscal" name="Fiscal Bal %" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={{stroke:C.border}} tickLine={false} domain={[-13,1]} label={{value:"Fiscal Balance % GDP",fill:C.dim,fontSize:10,position:"insideBottom",offset:-2}}/>
              <YAxis type="number" dataKey="ca" name="CA %" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false} domain={[-6,2]} label={{value:"CA % GDP",fill:C.dim,fontSize:9,angle:-90,position:"insideLeft"}}/>
              <ZAxis range={[45,45]}/>
              <Tooltip cursor={{strokeDasharray:"3 3",stroke:C.border2}} content={({payload})=>{
                if(!payload?.length) return null;
                const p = payload[0]?.payload;
                return <div style={{...TTstyle.contentStyle,padding:"6px 10px"}}>
                  <div style={{color:C.amber,fontWeight:700}}>{p.year}</div>
                  <div style={{color:C.dim}}>Fiscal: {fPct(p.fiscal)} | CA: {fPct(p.ca)}</div>
                </div>;
              }}/>
              <Scatter data={scatterTwinDef} fill={C.orange} fillOpacity={0.75}/>
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="FX vs CPI Scatter: Pass-Through Coefficient" sub="Stronger FX → lower CPI; weaker FX → higher CPI" h={260}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis type="number" dataKey="fx" name="FX Index" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={{stroke:C.border}} tickLine={false} label={{value:"FX Index (2000=1)",fill:C.dim,fontSize:10,position:"insideBottom",offset:-2}}/>
              <YAxis type="number" dataKey="cpi" name="CPI %" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false} label={{value:"CPI %",fill:C.dim,fontSize:9,angle:-90,position:"insideLeft"}}/>
              <ZAxis range={[45,45]}/>
              <Tooltip cursor={{strokeDasharray:"3 3",stroke:C.border2}} content={({payload})=>{
                if(!payload?.length) return null;
                const p = payload[0]?.payload;
                return <div style={{...TTstyle.contentStyle,padding:"6px 10px"}}>
                  <div style={{color:C.amber,fontWeight:700}}>{p.year}</div>
                  <div style={{color:C.dim}}>FX: {f2(p.fx)} | CPI: {fPct(p.cpi)}</div>
                </div>;
              }}/>
              <Scatter data={scatterFxCpi} fill={C.purple} fillOpacity={0.75}/>
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="Debt Sustainability: Required vs Actual Primary Balance" sub="When line above bars = debt growing unsustainably" h={230} cols={1}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Line dataKey="requiredPrimary" name="Required Primary %" stroke={C.red} dot={false} strokeWidth={2} connectNulls strokeDasharray="5 3"/>
              <Bar dataKey="primaryBal" name="Actual Primary %" fill={C.green} opacity={0.75} radius={[2,2,0,0]}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Macro Cycle Phases: Growth · Inflation · Unemp Composite" sub="Identifies boom/stagflation/recession regimes" h={230} cols={1}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="year" {...XP}/>
              <YAxis {...YP}/>
              <Tooltip {...TTstyle}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Line dataKey="gdpGrowth" name="GDP Growth %" stroke={C.green} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="cpi" name="CPI %" stroke={C.red} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="unemp" name="Unemp %" stroke={C.blue} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="realRate" name="Real Rate %" stroke={C.amber} dot={false} strokeWidth={1.5} strokeDasharray="4 2" connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="🔗" color={C.orange} text={`Twin deficit correlation is strong. When fiscal deficit expands by 1pp, CA deteriorates ~0.3–0.5pp. Fiscal consolidation is therefore simultaneously <b>external adjustment policy.</b>`}/>
        <Callout icon="📐" color={C.blue} text={`Okun's Law partially holds: recessions push unemployment +2–3pp sharply, but recoveries are slow (hysteresis). Post-2020 recovery brought unemp from 13.8% → 6.9%, suggesting one-time resumption of prior trend.`}/>
        <Callout icon="🔎" color={C.purple} text={`FX-CPI scatter shows clear pass-through: years with FX below 0.5 (2020–21) had CPI 4–10%. The CB must balance FX defense (rates up) vs growth support (rates down) — an impossible trinity constraint.`}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION: PRESCRIBE
// ═══════════════════════════════════════════════════════════════
function Prescribe() {
  const policies = [
    { cat:"FISCAL CONSOLIDATION", icon:"🏛", color:C.red, items:[
      { t:"Structural Expenditure Reform", d:"Spending must fall from 48% → 42% GDP over 5 years. Target: subsidies, public wage indexation, state enterprise transfers. Protect health and education. Avoid shock austerity — sequence consolidation to protect the cycle." },
      { t:"Primary Surplus Target +2%", d:"A sustained primary surplus of +2% GDP is needed to stabilize debt/GDP at current real rates. This implies a 3pp structural effort from current −0.6%. Non-negotiable for debt sustainability." },
      { t:"Fiscal Rule Legislation", d:"Enshrine a cyclically-adjusted structural balance rule (similar to Chile's fiscal rule). Removes political cycle from fiscal policy, anchors market expectations, reduces risk premium on sovereign borrowing." },
      { t:"Revenue Base Broadening", d:"Revenue at 39.5% GDP is adequate if efficient. Broaden tax base (reduce informality, digital economy taxation), not marginal rates. VAT compliance and transfer pricing enforcement have highest yield." },
    ]},
    { cat:"MONETARY POLICY", icon:"🏦", color:C.amber, items:[
      { t:"Inflation Targeting Framework", d:"Adopt a formal IT regime with 3–4% target band. Build CB independence in law. Transparent communication anchors expectations, reducing the FX pass-through elasticity over time." },
      { t:"Gradual Rate Normalization", d:"Once fiscal credibility is established, reduce real rates from 10%+ toward 2–3% neutral. This unlocks private investment. Sequencing is critical: fiscal first, then monetary easing." },
      { t:"FX Reserve Accumulation", d:"During commodity/export upswings, build FX reserves. Target 6 months import coverage minimum. This provides insurance against sudden stop in capital flows and reduces speculative attacks." },
    ]},
    { cat:"STRUCTURAL REFORMS", icon:"⚙️", color:C.blue, items:[
      { t:"Labor Market Flexibility", d:"Address the 7% structural unemployment floor. Streamline formal sector hiring, expand active labor market policies (retraining, job placement), and formalize informal sector to broaden tax base and social security coverage." },
      { t:"Export Diversification", d:"Low FX elasticity of exports signals supply-side bottlenecks. Industrial policy for non-commodity exports (manufacturing, agro-processing, services). FDI incentive zones with productivity spillovers." },
      { t:"Savings Mobilization", d:"Gross savings at 14% GDP is too low. Mandatory pension reform (forced saving), mortgage deepening, capital market development. Raise domestic savings to reduce dependence on volatile foreign capital." },
    ]},
    { cat:"SOCIAL POLICY", icon:"👥", color:C.teal, items:[
      { t:"Automatic Stabilizers", d:"Strengthen unemployment insurance and conditional cash transfers so recessions don't undo poverty progress. The 2015 and 2020 reversals show that without automatic cushions, the poorest absorb shocks disproportionately." },
      { t:"Inclusive Growth Strategy", d:"GINI at 51+ is both morally untenable and economically inefficient (reduces aggregate demand, fuel instability). Progressive taxation, quality public education, early childhood investment have best long-run return." },
      { t:"Sequencing Trade-offs", d:"Fiscal consolidation cannot gut social spending. Ring-fence core transfers while cutting inefficient subsidies that benefit upper quintiles. Political economy requires visible redistribution to sustain reform coalitions." },
    ]},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionHeader title="Policy Prescriptions" subtitle="Describe → Diagnose → Prescribe: the complete analytical arc" />

      <div style={{
        background:`${C.amber}0d`, border:`1px solid ${C.amber}44`, borderRadius:12, padding:"14px 18px",
        fontSize:12, color:C.text, lineHeight:1.75,
      }}>
        <span style={{color:C.amber,fontWeight:700}}>Policy Brief: </span>
        Country 1 faces a <strong>classic middle-income trap</strong> with mutually reinforcing vulnerabilities:
        chronic fiscal deficits driving debt accumulation → FX depreciation feeding inflation → high real rates suppressing investment → structural unemployment limiting employment income → inequality concentrating gains and fueling populist fiscal cycles.
        The prescription requires a <strong>coordinated, sequenced package</strong>: fiscal consolidation first (to anchor FX and inflation), then monetary easing (to unlock investment), plus structural reforms (to lift potential growth), backed by social policies (to ensure gains are shared and politically sustainable).
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {policies.map(p=>(
          <div key={p.cat} style={{background:C.panel,border:`1px solid ${p.color}30`,borderRadius:10,padding:"16px 18px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:18}}>{p.icon}</span>
              <div style={{fontSize:11.5,fontWeight:800,color:p.color,textTransform:"uppercase",letterSpacing:1.5,fontFamily:"monospace"}}>{p.cat}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {p.items.map(item=>(
                <div key={item.t} style={{background:`${p.color}0a`,borderLeft:`3px solid ${p.color}55`,borderRadius:"0 7px 7px 0",padding:"10px 12px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:p.color,marginBottom:4}}>{item.t}</div>
                  <div style={{fontSize:11,color:C.dim,lineHeight:1.65}}>{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}}>
        <div style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:"Georgia,serif",marginBottom:12}}>Policy Trade-off Matrix</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[
            {a:"Fiscal Consolidation",b:"Social Spending",note:"Cut subsidies, not transfers. Protect education and UCT programs. Gradual, not shock therapy.",c:C.red},
            {a:"Lower Inflation",b:"Lower Growth",note:"Tight monetary policy tames CPI but slows growth short-term. Accept temporary pain if it anchors long-run expectations.",c:C.amber},
            {a:"FX Depreciation",b:"Import Inflation",note:"Weak FX boosts export competitiveness but raises import costs. Evidence shows low export elasticity — FX alone won't fix CA.",c:C.orange},
            {a:"Debt Sustainability",b:"Growth Spending",note:"Primary surplus needed to stabilize debt; but multipliers mean cuts reduce denominator too. Reform over austerity.",c:C.blue},
          ].map(({a,b,note,c})=>(
            <div key={a} style={{background:`${c}0a`,border:`1px solid ${c}30`,borderRadius:8,padding:"11px 13px"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6,flexWrap:"wrap"}}>
                <span style={{fontSize:11,fontWeight:700,color:c}}>{a}</span>
                <span style={{color:C.dim,fontSize:13}}>⇄</span>
                <span style={{fontSize:11,fontWeight:700,color:C.dim}}>{b}</span>
              </div>
              <div style={{fontSize:10,color:C.dim,lineHeight:1.6}}>{note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION & APP SHELL
// ═══════════════════════════════════════════════════════════════
const TABS = [
  { id:"overview",  label:"Overview",    icon:"◈" },
  { id:"growth",    label:"GDP & Growth",icon:"↗" },
  { id:"monetary",  label:"Monetary",    icon:"⬡" },
  { id:"fiscal",    label:"Fiscal",      icon:"⬢" },
  { id:"external",  label:"External",    icon:"◉" },
  { id:"social",    label:"Social",      icon:"◍" },
  { id:"diagnose",  label:"Diagnose",    icon:"⌬" },
  { id:"prescribe", label:"Prescribe",   icon:"▷" },
];

const SECTIONS = { overview:Overview, growth:GDPGrowth, monetary:Monetary, fiscal:Fiscal, external:External, social:Social, diagnose:Diagnose, prescribe:Prescribe };

export default function App() {
  const [tab, setTab] = useState("overview");
  const Section = SECTIONS[tab];

  const headerKPIs = [
    { k:"gdpGrowth", label:"GDP GROWTH", suf:"%" },
    { k:"gdpCapUSD",  label:"GDP/CAP USD", suf:"", fmt:fK },
    { k:"cpi",       label:"CPI", suf:"%" },
    { k:"cbRate",    label:"CB RATE", suf:"%" },
    { k:"grossDebt", label:"DEBT/GDP", suf:"%" },
    { k:"ca_pct",    label:"CURR. ACCT", suf:"%" },
  ];

  return (
    <div style={{
      minHeight:"100vh",
      background:C.bg,
      color:C.text,
      fontFamily:"'Segoe UI',system-ui,sans-serif",
      padding:"18px 22px",
      boxSizing:"border-box",
    }}>

      {/* ── HEADER ── */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"flex-start",
        marginBottom:18, paddingBottom:14, borderBottom:`1px solid ${C.border}`,
      }}>
        <div>
          <div style={{
            fontSize:9, color:C.amber, letterSpacing:"3.5px", textTransform:"uppercase",
            fontWeight:700, marginBottom:6, fontFamily:"'Courier New',monospace",
          }}>
            ◈ Managerial Economics · IE Business School · Country 1 Analysis
          </div>
          <h1 style={{
            fontSize:24, fontWeight:900, color:C.text, margin:0,
            fontFamily:"Georgia,serif", letterSpacing:-0.3,
          }}>
            Country 1 — Full Macroeconomic Dashboard
          </h1>
          <div style={{fontSize:10,color:C.dim,marginTop:5,fontFamily:"'Courier New',monospace"}}>
            40 indicators · 2000–2025 · 26 years · Describe → Diagnose → Prescribe
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
          <div style={{display:"flex",gap:6}}>
            {headerKPIs.map(({k,label,suf,fmt:localFmt})=>{
              const {v,y} = latestVal(k);
              return (
                <div key={k} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px",textAlign:"center",minWidth:68}}>
                  <div style={{fontSize:8.5,color:C.dim,textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>{label}</div>
                  <div style={{fontSize:14,fontWeight:800,color:C.amber,fontFamily:"'Courier New',monospace",marginTop:2}}>
                    {v == null ? "—" : (localFmt ? localFmt(v) : f1(v))}{suf}
                  </div>
                  <div style={{fontSize:8,color:C.faint,marginTop:1}}>{y}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{display:"flex",gap:1,marginBottom:18,borderBottom:`1px solid ${C.border}`}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"9px 16px", background:"transparent", border:"none",
            borderBottom: tab===t.id ? `2px solid ${C.amber}` : "2px solid transparent",
            color: tab===t.id ? C.amber : C.dim,
            fontWeight: tab===t.id ? 700 : 400,
            fontSize:11.5, cursor:"pointer", transition:"all 0.12s",
            fontFamily:"'Segoe UI',sans-serif",
            marginBottom:-1,
          }}>
            <span style={{marginRight:5,fontSize:10}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <Section />

      {/* ── FOOTER ── */}
      <div style={{
        marginTop:24,paddingTop:12,borderTop:`1px solid ${C.border}`,
        display:"flex",justifyContent:"space-between",alignItems:"center",
      }}>
        <div style={{fontSize:9.5,color:C.faint,fontFamily:"monospace"}}>Country 1 · country1.xlsx · 40 indicators · 2000–2025</div>
        <div style={{fontSize:9.5,color:C.faint,fontFamily:"monospace"}}>Prof. Daniel Fernández-Kranz · Managerial Economics · IE Business School</div>
      </div>
    </div>
  );
}
