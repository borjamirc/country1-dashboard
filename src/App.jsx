import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer, ComposedChart,
  ScatterChart, Scatter, ZAxis
} from "recharts";

// ═══════════════════════════════════════════════════════════════
// DATA — Country 1 · 40 indicators · 2000–2025
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
  gdpCapPPP:   [13951.025,13960.502,14208.195,14200.018,14846.685,15152.886,15583.826,16361.899,17026.8,16843.492,17965.023,18544.815,18756.512,19169.218,19113.813,18291.023,17564.406,17680.585,17881.156,17980.083,17285.771,18028.1,18505.069,19029.818,19593.807,19990.829],
  gdpGrowth:   [4.388,1.39,3.053,1.141,5.76,3.202,3.962,6.07,5.094,-0.126,7.528,3.974,1.921,3.005,0.504,-3.546,-3.276,1.323,1.784,1.221,-3.277,4.763,3.017,3.242,3.396,2.4],
  gdpNomDom:   [1199.093,1315.756,1488.788,1717.951,1957.75,2170.584,2409.45,2720.263,3109.803,3333.039,3885.847,4376.382,4814.76,5331.619,5778.953,5995.787,6269.327,6585.479,7004.141,7389.131,7609.597,9012.142,10079.676,10943.344,11744.709,12670.262],
  gdpCapUSD:   [3751.971,3163.671,2844.405,3077.735,3647.959,4806.171,5906.244,7374.237,8863.269,8640.934,11341.268,13326.088,12465.45,12406.559,12230.669,8893.346,8812.503,10055.567,9281.668,9010.512,7057.072,7951.553,9256.482,10350.437,10252.019,10577.855],
  gdpNomUSD:   [655.454,559.982,509.798,558.232,669.29,891.633,1107.628,1397.114,1695.855,1669.204,2208.704,2614.027,2464.053,2471.718,2456.055,1800.046,1796.622,2063.519,1916.934,1873.286,1476.092,1670.65,1951.849,2191.137,2179.413,2256.91],
  gdpDeflator: [152.729,165.291,181.487,207.06,223.111,239.691,255.929,272.408,296.321,317.993,344.778,373.459,403.124,433.376,467.382,502.745,543.485,563.439,588.757,613.628,653.344,738.588,801.887,843.262,875.289,922.138],
  gdpPctWorld: [2.9,2.87,2.878,2.808,2.824,2.786,2.754,2.777,2.839,2.853,2.918,2.923,2.886,2.878,2.795,2.609,2.448,2.39,2.402,2.371,2.395,2.412,2.397,2.393,2.396,2.38],
  savings:     [14.855,14.297,15.604,17.25,19.251,18.515,18.789,19.622,19.52,17.039,17.875,18.629,17.656,18.118,16.05,13.889,13.27,13.401,12.288,12.047,14.428,17.103,15.928,14.486,14.253,14.22],
  imports_gs:  [14.735,3.027,-11.773,-2.674,13.783,9.31,14.823,23.092,14.845,-11.875,37.167,7.313,0.513,7.518,0.058,-12.793,-8.721,7.757,6.976,3.738,-8.468,16.744,0.7,0.802,10.039,4.223],
  imports_g:   [13.111,2.668,-11.801,-3.545,16.99,5.204,16.027,23.664,17.424,-17.463,37.121,8.597,-1.726,7.632,-2.38,-15.276,-11.087,10.155,14,4.612,-3.788,22.032,-2.395,-4.506,8.151,4.796],
  netDebt:     [null,51.486,59.934,54.259,50.186,47.915,46.486,44.546,37.566,40.885,37.979,34.47,32.194,30.504,32.586,35.64,46.144,51.37,52.766,54.699,61.37,55.114,56.133,60.428,61.481,65.797],
  fiscalBal:   [null,-3.468,-4.149,-5.401,-2.955,-3.364,-4.868,-2.66,-2.393,-4.23,-3.554,-2.741,-2.351,-3.422,-6.275,-9.281,-7.991,-7.97,-6.99,-4.859,-11.637,-2.631,-3.965,-7.712,-6.19,-8.404],
  poverty:     [null,17.5,16.2,17.1,15.3,13.7,11.4,10.8,9.1,8.4,null,7.1,6.4,5.4,4.7,5.4,6.5,6.9,6.9,7,2.8,7.5,4.9,3.8,null,null],
  primaryBal:  [null,3.13,3.356,3.553,4.051,3.865,1.507,2.88,3.213,0.912,1.58,2.737,2.221,1.52,-0.9,-0.853,-2.008,-1.625,-0.867,-0.083,-7.536,1.979,1.307,-2.168,-0.219,-0.61],
  revenue:     [null,36.334,40.346,35.887,36.726,38.507,37.694,37.692,37.523,36.306,35.962,36.626,36.958,36.358,35.151,36.909,37.512,36.328,37.191,38.184,34.542,37.74,39.481,37.597,39.485,39.585],
  structBal:   [null,-2.721,-3.28,-3.697,-2.119,-2.293,-3.872,-2.556,-2.866,-3.74,-4.875,-4.184,-3.702,-5.236,-7.749,-8.763,-6.479,-6.777,-6.371,-4.639,-9.898,-3.613,-5.401,-7.042,-7.474,-8.827],
  unemp:       [10.53,10.65,10.64,11.17,10.07,10.55,9.69,9.28,8.27,9.42,8.034,7.58,6.9,7.175,6.875,8.625,11.6,12.85,12.375,11.975,13.775,13.225,9.25,7.975,6.925,7.099],
};

const DATA = YRS.map((y,i) => {
  const o = { year: y };
  for (const [k,arr] of Object.entries(R)) o[k] = arr[i] ?? null;
  o.realRate     = (o.cbRate!=null&&o.cpi!=null) ? +(o.cbRate-o.cpi).toFixed(2) : null;
  o.savInvGap    = (o.savings!=null&&o.capForm!=null) ? +(o.savings-o.capForm).toFixed(2) : null;
  o.fiscalGap    = (o.revenue!=null&&o.expend!=null) ? +(o.expend-o.revenue).toFixed(2) : null;
  o.gdpDeflGrowth= i>0&&R.gdpDeflator[i]!=null&&R.gdpDeflator[i-1]!=null ? +((R.gdpDeflator[i]/R.gdpDeflator[i-1]-1)*100).toFixed(2):null;
  o.prodGrowth   = i>0&&R.productivity[i]!=null&&R.productivity[i-1]!=null ? +((R.productivity[i]/R.productivity[i-1]-1)*100).toFixed(2):null;
  o.cyclicalBal  = (o.fiscalBal!=null&&o.structBal!=null) ? +(o.fiscalBal-o.structBal).toFixed(2):null;
  o.requiredPB   = (o.realRate!=null&&o.gdpGrowth!=null&&o.grossDebt!=null) ? +((o.realRate/100-o.gdpGrowth/100)*o.grossDebt).toFixed(2):null;
  o.tradeSpread  = (o.exports_gs!=null&&o.imports_gs!=null) ? +(o.exports_gs-o.imports_gs).toFixed(2):null;
  return o;
});

// ─── HELPERS ─────────────────────────────────────────────────
const f1  = v => v==null?"—":Number(v).toFixed(1);
const f2  = v => v==null?"—":Number(v).toFixed(2);
const fPct= v => v==null?"—":`${Number(v).toFixed(1)}%`;
const fK  = v => v==null?"—":v>=1000?`$${(v/1000).toFixed(1)}k`:`$${Number(v).toFixed(0)}`;
const latestVal = key => { for(let i=DATA.length-1;i>=0;i--) if(DATA[i][key]!=null) return{v:DATA[i][key],y:DATA[i].year}; return{v:null,y:null}; };
const trend = (key,n=6) => { const pts=DATA.slice(-n*2).filter(d=>d[key]!=null).slice(-n).map(d=>d[key]); return pts.length>=2?+(pts[pts.length-1]-pts[0]).toFixed(2):null; };
const periodAvg=(key,from,to)=>{ const pts=DATA.filter(d=>d.year>=from&&d.year<=to&&d[key]!=null).map(d=>d[key]); return pts.length?+(pts.reduce((a,b)=>a+b,0)/pts.length).toFixed(1):null; };

// ─── DESIGN ──────────────────────────────────────────────────
const C = { bg:"#0c0e10",surface:"#13161a",panel:"#191d22",border:"#252b32",border2:"#313840",amber:"#d4943a",amber2:"#f0b955",red:"#cf4444",green:"#4caf7d",blue:"#4a9fd4",teal:"#3dbfa8",purple:"#8e79c4",orange:"#d97a35",text:"#dde3ec",dim:"#7a8898",faint:"#2a3038",gold:"#c8a44a" };
const XP = { tick:{fill:C.dim,fontSize:10,fontFamily:"monospace"}, axisLine:{stroke:C.border}, tickLine:false, interval:4 };
const YP = { tick:{fill:C.dim,fontSize:10,fontFamily:"monospace"}, axisLine:false, tickLine:false, width:48 };
const CG_PROPS = { strokeDasharray:"2 5", stroke:C.border, vertical:false };
const RL0 = { y:0, stroke:C.dim, strokeDasharray:"3 4", strokeWidth:1 };
const TT = { contentStyle:{background:"#1a1f26",border:`1px solid ${C.border2}`,borderRadius:8,color:C.text,fontSize:11,padding:"8px 12px"}, labelStyle:{color:C.amber,fontWeight:700,fontFamily:"monospace",marginBottom:3}, itemStyle:{color:C.dim,padding:"1px 0"}, cursor:{stroke:C.border2} };

// ─── SHARED COMPONENTS ───────────────────────────────────────
function Panel({title,sub,children,h=230,cols=1}){
  return(
    <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:"15px 16px",gridColumn:cols>1?`span ${cols}`:undefined}}>
      <div style={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{fontSize:11.5,fontWeight:700,color:C.text,fontFamily:"Georgia,serif"}}>{title}</div>
        {sub&&<div style={{fontSize:9.5,color:C.dim,maxWidth:240,textAlign:"right",lineHeight:1.45}}>{sub}</div>}
      </div>
      <div style={{height:h}}>{children}</div>
    </div>
  );
}

function Callout({icon,text,color=C.dim}){
  return(
    <div style={{background:`${color}10`,border:`1px solid ${color}38`,borderRadius:8,padding:"10px 14px",fontSize:11,color:C.text,lineHeight:1.65,display:"flex",gap:10,alignItems:"flex-start"}}>
      <span style={{fontSize:15,flexShrink:0}}>{icon}</span>
      <span dangerouslySetInnerHTML={{__html:text}}/>
    </div>
  );
}

function SectionHeader({title,subtitle}){
  return(
    <div style={{borderLeft:`3px solid ${C.amber}`,paddingLeft:14,marginBottom:12}}>
      <div style={{fontSize:15,fontWeight:800,color:C.text,fontFamily:"Georgia,serif"}}>{title}</div>
      {subtitle&&<div style={{fontSize:11,color:C.dim,marginTop:2}}>{subtitle}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// OVERVIEW
// ═══════════════════════════════════════════════════════════════
function Overview(){
  const kpiRows=[
    [{label:"Real GDP Growth",key:"gdpGrowth",unit:"%",good:true},{label:"GDP/cap PPP",key:"gdpCapPPP",unit:"",good:true,fmt:fK},{label:"GDP/cap USD",key:"gdpCapUSD",unit:"",good:true,fmt:fK},{label:"CPI Inflation",key:"cpi",unit:"%",good:false},{label:"Unemployment",key:"unemp",unit:"%",good:false}],
    [{label:"CB Policy Rate",key:"cbRate",unit:"%",good:null},{label:"Real Interest Rate",key:"realRate",unit:"%",good:null},{label:"Fiscal Balance",key:"fiscalBal",unit:"% GDP",good:true},{label:"Primary Balance",key:"primaryBal",unit:"% GDP",good:true},{label:"Structural Balance",key:"structBal",unit:"% GDP",good:true}],
    [{label:"Gross Public Debt",key:"grossDebt",unit:"% GDP",good:false},{label:"Net Public Debt",key:"netDebt",unit:"% GDP",good:false},{label:"Current Account",key:"ca_pct",unit:"% GDP",good:true},{label:"External Debt",key:"extDebt",unit:"% GDP",good:false},{label:"Labor Productivity",key:"productivity",unit:"",good:true,fmt:fK}],
    [{label:"Gross Savings",key:"savings",unit:"% GDP",good:true},{label:"Gross Investment",key:"capForm",unit:"% GDP",good:true},{label:"Revenue",key:"revenue",unit:"% GDP",good:true},{label:"GINI",key:"gini",unit:"",good:false},{label:"Poverty Rate",key:"poverty",unit:"%",good:false}],
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionHeader title="Macroeconomic Snapshot" subtitle="Latest available values across all indicators — Country 1 · 2000–2025"/>
      {kpiRows.map((row,ri)=>(
        <div key={ri} style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {row.map(k=>{
            const {v,y}=latestVal(k.key);
            const t5=trend(k.key);
            const isGood=k.good==null?null:(k.good?(t5||0)>0:(t5||0)<0);
            const vc=isGood==null?C.amber2:isGood?C.green:C.red;
            const tc=t5==null?C.dim:(k.good==null?C.dim:(k.good?(t5>0?C.green:C.red):(t5<0?C.green:C.red)));
            return(
              <div key={k.key} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 13px"}}>
                <div style={{fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:"1.3px",fontWeight:600,marginBottom:4}}>{k.label}</div>
                <div style={{fontSize:20,fontWeight:800,color:vc,fontFamily:"monospace",lineHeight:1.1}}>
                  {v==null?"—":(k.fmt?k.fmt(v):f1(v))}<span style={{fontSize:10,color:C.dim,marginLeft:3,fontWeight:400}}>{k.unit}</span>
                </div>
                {t5!=null&&<div style={{fontSize:9.5,color:tc,marginTop:3}}>{t5>0?"↑":"↓"} {Math.abs(t5).toFixed(1)} · 5y trend</div>}
                {t5==null&&<div style={{fontSize:9,color:C.faint,marginTop:3}}>as of {y}</div>}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <Panel title="Real GDP Growth — Business Cycle" sub="Shaded years = contraction" h={210}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT} formatter={v=>[fPct(v),"GDP Growth"]}/>
              <ReferenceLine {...RL0}/>
              <ReferenceLine x="2009" stroke={C.dim} strokeDasharray="3 3" label={{value:"GFC",fill:C.dim,fontSize:9,position:"insideTopRight"}}/>
              <ReferenceLine x="2015" stroke={C.dim} strokeDasharray="3 3" label={{value:"Bust",fill:C.dim,fontSize:9,position:"insideTopRight"}}/>
              <ReferenceLine x="2020" stroke={C.dim} strokeDasharray="3 3" label={{value:"COVID",fill:C.dim,fontSize:9,position:"insideTopRight"}}/>
              <Bar dataKey="gdpGrowth" radius={[3,3,0,0]} fill={C.amber}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="CPI · CB Rate · Unemployment" sub="Macro thermometer" h={210}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Line dataKey="cpi" name="CPI %" stroke={C.red} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="cbRate" name="CB Rate %" stroke={C.amber} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="unemp" name="Unemp %" stroke={C.blue} dot={false} strokeWidth={2} connectNulls/>
            </LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Twin Deficits: Fiscal + Current Account" sub="Both structurally negative" h={210}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Area dataKey="fiscalBal" name="Fiscal Bal %" fill={C.red+"20"} stroke={C.red} strokeWidth={2} connectNulls/>
              <Area dataKey="ca_pct" name="Curr. Acct %" fill={C.blue+"20"} stroke={C.blue} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="📌" color={C.amber} text="Real GDP averaged ~<b>2.5%/yr</b> over 2000–2025 with three recessions (2009, 2015–16, 2020). After a COVID rebound of +4.8% in 2021, growth has stabilised near 2.4–3.4% — at or below the economy's estimated steady-state rate, consistent with a middle-income trap."/>
        <Callout icon="⚠️" color={C.red} text="Gross public debt climbed from <b>60% (2011) → 91% (2025)</b>. With r=15% and g≈5.5%, the automatic annual debt increase is (15%−5.5%)×91.4% ≈ <b>8.7% GDP/year</b> — a trajectory no growth scenario can offset without primary surplus."/>
        <Callout icon="🔍" color={C.blue} text="Labour productivity has been <b>stagnant at ~$41k/worker since 2011</b>. The economy is growing by deploying more inputs, not by using them more efficiently. In Solow terms: factor accumulation near diminishing returns, no TFP improvement."/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GDP (simplified for space — same as before)
// ═══════════════════════════════════════════════════════════════
function GDPGrowth(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader title="GDP & Growth Analysis" subtitle="Volume · Per Capita · PPP · Deflator · Productivity · World Share"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="Real GDP Growth (%) — Shock Annotations" sub="2009 GFC · 2015–16 Commodity Bust · 2020 COVID" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT} formatter={v=>[fPct(v),"GDP Growth"]}/>
              <ReferenceLine {...RL0}/>
              <ReferenceLine x="2009" stroke={C.dim} strokeDasharray="3 3" label={{value:"GFC",fill:C.dim,fontSize:9,position:"insideTopRight"}}/>
              <ReferenceLine x="2015" stroke={C.dim} strokeDasharray="3 3" label={{value:"Bust",fill:C.dim,fontSize:9,position:"insideTopRight"}}/>
              <ReferenceLine x="2020" stroke={C.dim} strokeDasharray="3 3" label={{value:"COVID",fill:C.dim,fontSize:9,position:"insideTopRight"}}/>
              <Bar dataKey="gdpGrowth" radius={[3,3,0,0]} fill={C.amber}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="GDP per Capita: PPP vs USD" sub="USD collapse in 2015 & 2020 = FX depreciation, not real loss" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <YAxis yAxisId="r" orientation="right" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} tickLine={false} axisLine={false} width={52} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip {...TT} formatter={v=>[`$${Number(v).toLocaleString()}`]}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Area yAxisId="l" dataKey="gdpCapPPP" name="GDP/cap PPP" fill={C.blue+"20"} stroke={C.blue} strokeWidth={2} connectNulls/>
              <Line yAxisId="r" dataKey="gdpCapUSD" name="GDP/cap USD" stroke={C.amber} dot={false} strokeWidth={2} connectNulls strokeDasharray="5 2"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Investment vs National Savings (% GDP)" sub="Persistent negative gap → chronic external financing need" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Area dataKey="capForm" name="Investment %" fill={C.purple+"25"} stroke={C.purple} strokeWidth={2} connectNulls/>
              <Area dataKey="savings" name="Savings %" fill={C.green+"20"} stroke={C.green} strokeWidth={2} connectNulls/>
              <Bar dataKey="savInvGap" name="Sav−Inv Gap" fill={C.amber} opacity={0.5} radius={[2,2,0,0]}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Labour Productivity Stagnation (2021 PPP $/worker)" sub="Stagnation band $39.5k–$42.5k since 2011 — ≈0% real growth/year" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip {...TT} formatter={v=>[`$${Number(v).toLocaleString()}`,"Productivity"]}/>
              <ReferenceLine y={39500} stroke={C.dim} strokeDasharray="2 4" label={{value:"Stagnation band",fill:C.dim,fontSize:9,position:"insideTopRight"}}/>
              <ReferenceLine y={42500} stroke={C.dim} strokeDasharray="2 4"/>
              <Area dataKey="productivity" stroke={C.teal} fill={C.teal+"25"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="GDP World Share (%)" sub="Declining relative weight — not converging" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP} domain={[2,3.2]} tickFormatter={v=>`${v}%`}/>
              <Tooltip {...TT} formatter={v=>[fPct(v),"World GDP Share"]}/>
              <Area dataKey="gdpPctWorld" stroke={C.gold} fill={C.gold+"20"} strokeWidth={2} connectNulls/>
              <ReferenceLine y={2.9} stroke={C.dim} strokeDasharray="3 3" label={{value:"2000 level",fill:C.dim,fontSize:9,position:"insideRight"}}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Gross Capital Formation — Falling Investment Capacity" sub="From 21% (2011) → 16.7% (2025). Crowded out by debt service." h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP} domain={[12,24]}/>
              <Tooltip {...TT} formatter={v=>[fPct(v),"Investment"]}/>
              <ReferenceLine y={20} stroke={C.amber} strokeDasharray="3 3" label={{value:"20% benchmark",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="capForm" stroke={C.purple} fill={C.purple+"25"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="📈" color={C.amber} text="GDP/cap in PPP rose from $13,951 → $19,991 (+43%) over 25 years, but gains stalled 2014–2019. The <b>divergence between PPP and USD indices</b> after 2015 reflects pure FX depreciation — real living standards grew, USD representation collapsed."/>
        <Callout icon="🛠" color={C.teal} text="Labour productivity net change 2011–2024: <b>+3.0% over 13 years</b> (≈0% per year). This confirms the <b>ISI legacy failure mode</b>: firms protected from competition never achieved the scale or efficiency discipline of export-oriented industrialization."/>
        <Callout icon="📉" color={C.purple} text="Capital formation fell from 21.8% (2011) → 16.7% (2025) — <b>dangerously low</b> for an economy needing infrastructure and industrial modernization. Interest payments consuming ~20% of revenues have systematically crowded out public investment capacity."/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MONETARY
// ═══════════════════════════════════════════════════════════════
function Monetary(){
  const periodCPI=[
    {period:"2000–04",avg:periodAvg("cpi","2000","2004")},{period:"2005–09",avg:periodAvg("cpi","2005","2009")},
    {period:"2010–14",avg:periodAvg("cpi","2010","2014")},{period:"2015–19",avg:periodAvg("cpi","2015","2019")},
    {period:"2020–25",avg:periodAvg("cpi","2020","2025")},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader title="Monetary Policy & Stagflation" subtitle="Fiscal Dominance · CPI · Real Rate · FX Pass-Through · Monetary Paralysis"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="CPI Inflation vs CB Benchmark Rate (%)" sub="Rate consistently above CPI = positive real rate, but driven by risk premium" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Bar dataKey="cpi" name="CPI %" fill={C.red+"77"} radius={[2,2,0,0]}/>
              <Line dataKey="cbRate" name="CB Rate %" stroke={C.amber} dot={false} strokeWidth={2.5} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Real Interest Rate = CB Rate − CPI" sub="~+10% in 2025 = not demand management, but sovereign risk premium" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT} formatter={v=>[fPct(v),"Real Rate"]}/>
              <ReferenceLine {...RL0}/>
              <ReferenceLine y={5} stroke={C.red} strokeDasharray="3 3" label={{value:"Very tight (+5%)",fill:C.red,fontSize:9,position:"insideRight"}}/>
              <Bar dataKey="realRate" name="Real Rate %" radius={[3,3,0,0]} fill={C.orange}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Exchange Rate Index vs USD (2000=1)" sub="−66% depreciation since 2000. Pass-through feeds domestic inflation." h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT} formatter={v=>[Number(v).toFixed(3),"FX"]}/>
              <ReferenceLine y={1} stroke={C.dim} strokeDasharray="3 3"/>
              <ReferenceLine y={0.5} stroke={C.amber} strokeDasharray="3 3" label={{value:"−50%",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="fx" stroke={C.blue} fill={C.blue+"20"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Average CPI by 5-Year Period" sub="Inflation regime never fell sustainably below 5%" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={periodCPI}>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis dataKey="period" tick={{fill:C.dim,fontSize:10}} axisLine={{stroke:C.border}} tickLine={false}/>
              <YAxis {...YP}/><Tooltip {...TT} formatter={v=>[fPct(v),"Avg CPI"]}/>
              <ReferenceLine y={5} stroke={C.amber} strokeDasharray="3 3" label={{value:"5% anchor",fill:C.amber,fontSize:9}}/>
              <Bar dataKey="avg" fill={C.red} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Unemployment Rate — Structural Stagflation" sub="High unemployment + high inflation simultaneously = stagflation signature" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP} domain={[6,15]}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine y={10} stroke={C.amber} strokeDasharray="3 3" label={{value:"10%",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="unemp" name="Unemployment %" stroke={C.red} fill={C.red+"20"} strokeWidth={2} connectNulls/>
              <Line dataKey="cpi" name="CPI %" stroke={C.orange} dot={false} strokeWidth={1.5} connectNulls strokeDasharray="4 2"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="FX Depreciation vs CPI: Pass-Through Evidence" sub="Weak FX → import-cost-push inflation → CB raises rates → debt costs rise" h={220}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP}/>
              <YAxis yAxisId="r" orientation="right" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} tickLine={false} axisLine={false} width={50} tickFormatter={v=>Number(v).toFixed(2)}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Bar yAxisId="l" dataKey="cpi" name="CPI %" fill={C.red+"66"} radius={[2,2,0,0]}/>
              <Line yAxisId="r" dataKey="fx" name="FX Index (R)" stroke={C.blue} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="🏦" color={C.amber} text="The CB raised rates from 2% (2020) → 15% (2025). This is <b>fiscal dominance in implicit form</b>: the high rate reflects sovereign risk premium, not excess demand management. It raises debt service costs (~7.8% GDP) and widens the deficit it tries to contain."/>
        <Callout icon="🔄" color={C.red} text="Self-defeating monetary loop: FX depreciation → import inflation → CB hikes → debt service rises → fiscal deficit widens → sovereign risk premium rises → FX depreciates further. <b>Until fiscal dominance is resolved, CB rate decisions cannot function as genuine monetary policy.</b>"/>
        <Callout icon="📊" color={C.orange} text="Inflation is <b>supply-side and expectations-driven</b>, not excess-demand. Higher rates suppress output without durably reducing inflation — this generates stagflation rather than resolving it. The AD-AS transmission is broken under fiscal dominance. The CB is trapped."/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FISCAL
// ═══════════════════════════════════════════════════════════════
function Fiscal(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader title="Fiscal Policy & Debt Dynamics" subtitle="All balances · Debt snowball · Revenue vs Expenditure · Structural breakdown · Sustainability"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="All Fiscal Balances (% GDP)" sub="Overall · Primary · Structural — three lenses on fiscal health" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <ReferenceLine y={-3} stroke={C.amber} strokeDasharray="3 3" label={{value:"−3%",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="fiscalBal" name="Overall Balance" fill={C.red+"20"} stroke={C.red} strokeWidth={2} connectNulls/>
              <Line dataKey="primaryBal" name="Primary Balance" stroke={C.green} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="structBal" name="Structural Balance" stroke={C.purple} dot={false} strokeWidth={2} connectNulls strokeDasharray="5 3"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Gross Public Debt (% GDP) — Debt Snowball" sub="ΔD/Y ≈ (r−g)·D/Y − PB. With r=15%, g=5.5%: +8.7pp/yr automatically" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP} domain={[50,105]}/>
              <Tooltip {...TT} formatter={v=>[fPct(v),"Gross Debt"]}/>
              <ReferenceLine y={60} stroke={C.amber} strokeDasharray="3 3" label={{value:"60%",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <ReferenceLine y={90} stroke={C.red} strokeDasharray="3 3" label={{value:"90% danger",fill:C.red,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="grossDebt" stroke={C.red} fill={C.red+"20"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Revenue vs Expenditure (% GDP)" sub="Expenditure at 48% approaches European welfare levels without comparable income" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP} domain={[30,52]}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Area dataKey="expend" name="Expenditure %" fill={C.red+"22"} stroke={C.red} strokeWidth={2} connectNulls/>
              <Area dataKey="revenue" name="Revenue %" fill={C.green+"22"} stroke={C.green} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Structural vs Cyclical Balance Decomposition" sub="Structural balance = negative even at full employment → spending crisis, not cycle" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/><ReferenceLine {...RL0}/>
              <Bar dataKey="cyclicalBal" name="Cyclical Component" fill={C.blue} opacity={0.7} radius={[2,2,0,0]} stackId="s"/>
              <Bar dataKey="structBal" name="Structural Component" fill={C.red} opacity={0.85} radius={[2,2,0,0]} stackId="s"/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Debt Sustainability: Required vs Actual Primary Balance" sub="Required PB = (r−g)×D/GDP. Bar below line = debt compounding" h={230}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/><ReferenceLine {...RL0}/>
              <Line dataKey="requiredPB" name="Required Primary %" stroke={C.red} dot={false} strokeWidth={2} connectNulls strokeDasharray="5 3"/>
              <Bar dataKey="primaryBal" name="Actual Primary %" fill={C.green} opacity={0.75} radius={[2,2,0,0]}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Net vs Gross Public Debt (% GDP)" sub="Financial assets held partially offset gross exposure" h={230}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP} domain={[25,100]}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine y={60} stroke={C.amber} strokeDasharray="3 3" label={{value:"60%",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="grossDebt" name="Gross Debt %" stroke={C.red} fill={C.red+"20"} strokeWidth={2} connectNulls/>
              <Line dataKey="netDebt" name="Net Debt %" stroke={C.orange} dot={false} strokeWidth={2} connectNulls strokeDasharray="5 2"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="🔴" color={C.red} text="Structural balance has been <b>negative in every single year</b> (avg ~−5.4% GDP). Even at full potential output the country runs large deficits — this is a spending-driven fiscal crisis, not a cyclical shortfall. Expenditure at 48% GDP with revenues at 39.5% = structural 9pp gap."/>
        <Callout icon="📋" color={C.green} text="Primary balance was positive 2001–2013 (avg +2.3%), meaning fiscal effort existed. The <b>2014 shift to primary deficit is the tipping point</b>: interest payments consuming ~7.8% GDP (≈20% of revenues) now compound the debt snowball automatically."/>
        <Callout icon="⚙️" color={C.blue} text="Revenue is stable at 35–40% of GDP — the problem is expenditure, not taxation. Consolidation requires <b>expenditure rationalization</b>: regressive subsidies, public wage bill, state enterprise transfers. Tax rate hikes alone cannot close a 9pp structural gap."/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXTERNAL
// ═══════════════════════════════════════════════════════════════
function External(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader title="External Sector & Twin Deficit" subtitle="Current Account · FX · Trade Volumes · External Debt · J-Curve Test"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="Current Account Balance: % GDP + USD bn" sub="External deficit = fiscal deficit counterpart via savings-investment identity" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP}/>
              <YAxis yAxisId="r" orientation="right" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} tickLine={false} axisLine={false} width={54} tickFormatter={v=>`$${v}b`}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine yAxisId="l" {...RL0}/>
              <Bar yAxisId="l" dataKey="ca_pct" name="CA % GDP" fill={C.blue} opacity={0.7} radius={[2,2,0,0]}/>
              <Line yAxisId="r" dataKey="ca_usd" name="CA USD bn" stroke={C.amber} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="External Debt (% GDP)" sub="Fell 2002–11 (commodity boom); rising again post-2014" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT} formatter={v=>[fPct(v),"External Debt"]}/>
              <ReferenceLine y={30} stroke={C.amber} strokeDasharray="3 3" label={{value:"30%",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="extDebt" stroke={C.orange} fill={C.orange+"22"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Exports & Imports Volume Growth (%)" sub="Import collapse 2015–16 aligns with recession and FX depreciation" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/><ReferenceLine {...RL0}/>
              <Line dataKey="exports_gs" name="Exports G+S %" stroke={C.green} dot={false} strokeWidth={2} connectNulls/>
              <Line dataKey="imports_gs" name="Imports G+S %" stroke={C.red} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="FX vs CA: J-Curve Test" sub="65% depreciation, but CA only improved modestly → low export elasticity" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP}/>
              <YAxis yAxisId="r" orientation="right" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} tickLine={false} axisLine={false} width={50} tickFormatter={v=>Number(v).toFixed(2)}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine yAxisId="l" {...RL0}/>
              <Bar yAxisId="l" dataKey="ca_pct" name="CA % GDP" fill={C.blue} opacity={0.6} radius={[2,2,0,0]}/>
              <Line yAxisId="r" dataKey="fx" name="FX Index (R)" stroke={C.amber} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="🌐" color={C.blue} text="National income identity: <b>(G−T) = (S−I) + CA</b>. Country 1's fiscal deficit of −8.4% GDP, combined with insufficient private savings to fund investment, forces a CA deficit of ~−2.5% GDP. The external deficit is not independent — it's a direct consequence of fiscal imbalance."/>
        <Callout icon="💱" color={C.orange} text="FX depreciation driven by external financing needs passes directly into domestic inflation, prompting the CB to raise rates, which raises debt service and widens the fiscal deficit further — a <b>classic reinforcing twin-deficit loop</b>. Fixing the fiscal deficit will automatically ease CA pressure."/>
        <Callout icon="🔄" color={C.purple} text="J-curve evidence is weak: 65% FX depreciation since 2008, but CA only improved from −4.5% to −1.3% by 2023. <b>Low export elasticity</b> confirms supply-side bottlenecks — ISI-legacy firms lack competitive discipline to scale exports even when currency makes them cheap."/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SOCIAL
// ═══════════════════════════════════════════════════════════════
function Social(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader title="Social Indicators & Inclusive Growth" subtitle="GINI · Poverty · Unemployment · Productivity · Political Economy Constraints"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="GINI Coefficient — Among World's Highest" sub="51.6 (2023): limits human capital investment, constrains reform coalitions" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP} domain={[45,63]}/>
              <Tooltip {...TT} formatter={v=>[f1(v),"GINI"]}/>
              <ReferenceLine y={55} stroke={C.amber} strokeDasharray="3 3" label={{value:"Very high",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Bar dataKey="gini" fill={C.purple} opacity={0.8} radius={[3,3,0,0]}/>
              <Line dataKey="gini" stroke={C.amber} dot={false} strokeWidth={1.5} connectNulls strokeDasharray="4 2"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Poverty Rate (<$3/day, 2021 PPP)" sub="Near-tripled 2.8% → 7.5% in 2020–21: a decade of gains lost in one shock" h={250}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT} formatter={v=>[fPct(v),"Poverty"]}/>
              <Area dataKey="poverty" stroke={C.orange} fill={C.orange+"22"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="GDP/cap PPP vs GINI: Growth Without Distribution" sub="Rising income barely moved inequality — growth concentrated at top" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/>
              <YAxis yAxisId="l" {...YP} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <YAxis yAxisId="r" orientation="right" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} tickLine={false} axisLine={false} width={48} domain={[48,62]}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <Area yAxisId="l" dataKey="gdpCapPPP" name="GDP/cap PPP" fill={C.blue+"20"} stroke={C.blue} strokeWidth={2} connectNulls/>
              <Line yAxisId="r" dataKey="gini" name="GINI (R)" stroke={C.purple} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Unemployment — Structural Floor ~7%" sub="Hysteresis: busts permanently exclude workers. Informality absorbs the rest." h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP} domain={[6,15]}/>
              <Tooltip {...TT} formatter={v=>[fPct(v),"Unemployment"]}/>
              <ReferenceLine y={7} stroke={C.amber} strokeDasharray="3 3" label={{value:"Structural floor",fill:C.amber,fontSize:9,position:"insideRight"}}/>
              <Area dataKey="unemp" stroke={C.red} fill={C.red+"20"} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <Callout icon="⚖️" color={C.purple} text="GINI of 51–58 throughout the entire sample. High inequality constrains long-run convergence by <b>limiting human capital investment at the lower end</b> of the income distribution (a direct Solow-model implication) and imposes a binding political economy constraint on any adjustment package."/>
        <Callout icon="📉" color={C.orange} text="Poverty fell 17.5% (2001) → 4.7% (2014) — a significant achievement. Then the <b>poverty rate nearly tripled (2.8% → 7.5%)</b> between 2020 and 2021 alone, reversing over a decade of gains. Any consolidation that fails to protect lower-income households faces severe social instability risks."/>
        <Callout icon="🧱" color={C.red} text="The structural unemployment floor (~7%) has not shifted in 25 years despite productivity gains. This narrows the feasible policy set: <b>fiscal consolidation cannot gut social transfers</b>. Ring-fencing unconditional cash transfers for the poorest quintile is an economic necessity, not a political concession."/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DIAGNOSE — aligned to report
// ═══════════════════════════════════════════════════════════════
function Diagnose(){
  const scatterOkun = DATA.filter(d=>d.gdpGrowth!=null&&d.unemp!=null);
  const scatterTwin = DATA.filter(d=>d.ca_pct!=null&&d.fiscalBal!=null).map(d=>({ca:d.ca_pct,fiscal:d.fiscalBal,year:d.year}));
  const scatterFxCpi= DATA.filter(d=>d.fx!=null&&d.cpi!=null).map(d=>({fx:d.fx,cpi:d.cpi,year:d.year}));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionHeader title="Diagnosis: Root Causes" subtitle="i > g Debt Trap · Fiscal Dominance · Twin Deficit · ISI Legacy · Middle-Income Trap"/>

      {/* Root cause cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[
          {num:"01",t:"The i > g Debt Trap",c:C.red,d:"The most fundamental diagnosis is arithmetic. With r = 15%, g ≈ 5.5%, D/Y = 91.4%, and PB = −0.6% of GDP, the debt-dynamics identity (ΔD/Y ≈ (r−g)·D/Y − PB) implies the automatic annual debt increase from the r−g differential alone is (15% − 5.5%) × 91.4% ≈ 8.7% of GDP per year. Adding the primary deficit, total debt dynamics imply an increase of approximately 9.3% of GDP per year without adjustment — a trajectory that no credible growth scenario can offset. This is not a cyclical problem. The structural balance of −8.8% of GDP confirms that even at full potential output, the fiscal position is deeply unsustainable. The economy is in a structural debt trap, not a temporary recessionary gap."},
          {num:"02",t:"Fiscal Dominance: Monetary Policy Paralysis",c:C.amber,d:"Fiscal dominance occurs when the scale of government borrowing causes the central bank to subordinate its price stability mandate to fiscal financing needs. Country 1 exhibits the implicit form. The CB has raised rates to 15% ostensibly to combat inflation, but this has directly increased the government's debt service bill (~7.8% of GDP, consuming ~20% of revenues), worsened the fiscal deficit, raised sovereign risk premiums, put further pressure on the exchange rate, and fed back into inflation through import price pass-through. Inflation here is supply-side and expectations-driven — imported via currency depreciation and fiscal spending, not excess demand. Higher rates suppress output without durably reducing inflation, generating stagflation. The CB is trapped. Until the government's intertemporal budget constraint is credibly expected to hold, CB rate decisions function as risk-premium signals rather than genuine demand management tools."},
          {num:"03",t:"Twin Deficit Dynamics",c:C.blue,d:"The national income identity Y = C + I + G + NX implies that the fiscal deficit and the current account deficit are algebraically linked through the saving-investment balance: (G − T) = (S − I) + CA. Country 1's fiscal deficit of −8.4% of GDP, combined with a private savings rate insufficient to fully fund domestic investment (savings 14.2% vs investment 16.7% of GDP), forces a current account deficit of approximately −2.5% of GDP. Currency depreciation driven by this financing need passes through into domestic inflation, prompting the CB to raise interest rates, which raises debt service costs and widens the fiscal deficit further — a classic reinforcing loop. The current account deficit is not an independent problem: it is a consequence of the fiscal imbalance. Addressing the fiscal deficit will automatically reduce external financing needs and ease FX pressure."},
          {num:"04",t:"Structural Stagnation: ISI Legacy & Middle-Income Trap",c:C.teal,d:"Country 1's productivity flatline since 2011 represents the long-run structural dimension of the crisis. Labour productivity has stagnated near $41,000 PPP for fourteen years despite employment growth, indicating that total factor productivity (the Solow residual: technology, institutions, human capital) has not improved. The economy is growing by deploying more inputs, not by using them more efficiently — a pattern converging toward stagnation as diminishing returns to capital accumulation increase. The structural profile (persistent CA deficits, low R&D, commodity-export dependence, uncompetitive domestic manufacturing, falling capital formation from 21% → 16.7% of GDP) is consistent with the failure mode of Import Substituting Industrialization (ISI): firms protected from competition never achieve the scale or competitive discipline to survive without protection. Capital formation has fallen dangerously low, and interest payments consuming 20% of revenues have systematically crowded out the public investment needed to enable structural transformation."},
        ].map(({num,t,c,d})=>(
          <div key={num} style={{background:C.panel,border:`1px solid ${c}35`,borderRadius:10,padding:"16px 18px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{fontSize:10,fontWeight:800,color:c,fontFamily:"monospace",background:`${c}20`,padding:"3px 8px",borderRadius:4}}>ROOT CAUSE {num}</div>
              <div style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:"Georgia,serif"}}>{t}</div>
            </div>
            <div style={{fontSize:11,color:C.dim,lineHeight:1.75}}>{d}</div>
          </div>
        ))}
      </div>

      {/* Key equation highlight */}
      <div style={{background:`${C.amber}0d`,border:`1px solid ${C.amber}44`,borderRadius:10,padding:"14px 20px"}}>
        <div style={{fontSize:11,fontWeight:700,color:C.amber,marginBottom:8,fontFamily:"monospace",letterSpacing:1}}>DEBT DYNAMICS EQUATION</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
          {[
            {label:"Nominal interest rate (r)",value:"15.0%",note:"CB benchmark rate 2025",c:C.red},
            {label:"Nominal GDP growth (g)",value:"~5.5%",note:"Real growth + inflation",c:C.green},
            {label:"r − g differential",value:"+9.5pp",note:"Automatic debt engine",c:C.red},
            {label:"Auto. debt increase/yr",value:"~8.7% GDP",note:"(r−g) × 91.4% debt",c:C.red},
          ].map(({label,value,note,c})=>(
            <div key={label} style={{background:`${c}0d`,border:`1px solid ${c}30`,borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{label}</div>
              <div style={{fontSize:20,fontWeight:800,color:c,fontFamily:"monospace"}}>{value}</div>
              <div style={{fontSize:10,color:C.dim,marginTop:3}}>{note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scatter diagnostics */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <Panel title="Okun's Law: GDP Growth vs Unemployment" sub="Asymmetric: busts raise unemp fast, recoveries bring it back slowly (hysteresis)" h={260}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis type="number" dataKey="gdpGrowth" name="GDP Growth %" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={{stroke:C.border}} tickLine={false} label={{value:"GDP Growth %",fill:C.dim,fontSize:10,position:"insideBottom",offset:-2}}/>
              <YAxis type="number" dataKey="unemp" name="Unemp %" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false} label={{value:"Unemp %",fill:C.dim,fontSize:9,angle:-90,position:"insideLeft"}}/>
              <ZAxis range={[45,45]}/>
              <Tooltip cursor={{strokeDasharray:"3 3",stroke:C.border2}} content={({payload})=>{
                if(!payload?.length)return null;
                const p=payload[0]?.payload;
                return <div style={{...TT.contentStyle,padding:"6px 10px"}}><div style={{color:C.amber,fontWeight:700}}>{p.year}</div><div style={{color:C.dim}}>Growth: {fPct(p.gdpGrowth)} | Unemp: {fPct(p.unemp)}</div></div>;
              }}/>
              <Scatter data={scatterOkun} fill={C.blue} fillOpacity={0.75}/>
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Twin Deficit: Fiscal vs Current Account" sub="Strong correlation confirms (G−T) = (S−I) + CA identity" h={260}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis type="number" dataKey="fiscal" name="Fiscal Bal %" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={{stroke:C.border}} tickLine={false} domain={[-13,1]} label={{value:"Fiscal Balance % GDP",fill:C.dim,fontSize:10,position:"insideBottom",offset:-2}}/>
              <YAxis type="number" dataKey="ca" name="CA %" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false} domain={[-6,2]} label={{value:"CA % GDP",fill:C.dim,fontSize:9,angle:-90,position:"insideLeft"}}/>
              <ZAxis range={[45,45]}/>
              <Tooltip cursor={{strokeDasharray:"3 3",stroke:C.border2}} content={({payload})=>{
                if(!payload?.length)return null;
                const p=payload[0]?.payload;
                return <div style={{...TT.contentStyle,padding:"6px 10px"}}><div style={{color:C.amber,fontWeight:700}}>{p.year}</div><div style={{color:C.dim}}>Fiscal: {fPct(p.fiscal)} | CA: {fPct(p.ca)}</div></div>;
              }}/>
              <Scatter data={scatterTwin} fill={C.orange} fillOpacity={0.75}/>
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="FX vs CPI: Pass-Through Evidence" sub="Lower FX index → higher CPI. Depreciation is an inflation source." h={260}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid {...CG_PROPS}/>
              <XAxis type="number" dataKey="fx" name="FX Index" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={{stroke:C.border}} tickLine={false} label={{value:"FX Index (2000=1)",fill:C.dim,fontSize:10,position:"insideBottom",offset:-2}}/>
              <YAxis type="number" dataKey="cpi" name="CPI %" tick={{fill:C.dim,fontSize:10,fontFamily:"monospace"}} axisLine={false} tickLine={false} label={{value:"CPI %",fill:C.dim,fontSize:9,angle:-90,position:"insideLeft"}}/>
              <ZAxis range={[45,45]}/>
              <Tooltip cursor={{strokeDasharray:"3 3",stroke:C.border2}} content={({payload})=>{
                if(!payload?.length)return null;
                const p=payload[0]?.payload;
                return <div style={{...TT.contentStyle,padding:"6px 10px"}}><div style={{color:C.amber,fontWeight:700}}>{p.year}</div><div style={{color:C.dim}}>FX: {f2(p.fx)} | CPI: {fPct(p.cpi)}</div></div>;
              }}/>
              <Scatter data={scatterFxCpi} fill={C.purple} fillOpacity={0.75}/>
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRESCRIBE — aligned to report (3-phase sequencing)
// ═══════════════════════════════════════════════════════════════
function Prescribe(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionHeader title="Policy Prescription: Sequenced Adjustment" subtitle="Fiscal Credibility First → Monetary Normalisation → Structural Transformation"/>

      <div style={{background:`${C.amber}0d`,border:`1px solid ${C.amber}44`,borderRadius:12,padding:"14px 20px",fontSize:12,color:C.text,lineHeight:1.8}}>
        <span style={{color:C.amber,fontWeight:700}}>Central Thesis: </span>
        Country 1 is a commodity-dependent, ISI-legacy, upper-middle-income, twin-deficit, high-inequality emerging market in a <strong>self-reinforcing fiscal-monetary trap</strong>. The preceding diagnosis points to a sequenced, three-phase adjustment: <strong>fiscal credibility must come first</strong>, because no monetary, exchange rate, or structural policy can operate effectively while the government's solvency is in doubt. Monetary normalisation follows once the fiscal anchor is established. Structural transformation is a medium-run imperative that cannot be front-loaded but must be planned from the outset. <strong>Premature sequencing — structural reform before fiscal stabilisation, or monetary easing before fiscal credibility — risks unravelling all three.</strong>
      </div>

      {/* 3-Phase sequencing table */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}}>
        <div style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:"Georgia,serif",marginBottom:14}}>Policy Sequencing — Table 5</div>
        <div style={{display:"grid",gridTemplateColumns:"120px 1fr 1fr 1fr 1fr",gap:0}}>
          {/* Header */}
          {["Phase","Goal","Fiscal","Monetary","Structural"].map((h,i)=>(
            <div key={h} style={{background:C.surface,padding:"10px 12px",fontSize:10,fontWeight:700,color:C.amber,textTransform:"uppercase",letterSpacing:1,borderRight:i<4?`1px solid ${C.border}`:undefined,borderBottom:`2px solid ${C.amber}44`}}>{h}</div>
          ))}
          {/* Phase 1 */}
          {[
            {v:"Phase 1\n(Year 1)",c:C.red},
            {v:"Stabilise"},
            {v:"Announce credible primary surplus target (+2% GDP). Legislate multi-year fiscal plan. Eliminate off-budget items."},
            {v:"Maintain 15% rate until fiscal credibility is established. Legislate CB independence."},
            {v:"Publish formalisation roadmap. Engage IMF / World Bank for programme support and signalling."},
          ].map(({v,c},i)=>(
            <div key={i} style={{background:`${C.red}09`,padding:"10px 12px",fontSize:11,color:i===0?C.red:C.text,fontWeight:i===0?700:400,lineHeight:1.6,borderRight:i<4?`1px solid ${C.border}`:undefined,borderBottom:`1px solid ${C.border}`,whiteSpace:i===0?"pre-line":undefined}}>{v}</div>
          ))}
          {/* Phase 2 */}
          {[
            {v:"Phase 2\n(Yrs 2–3)",c:C.amber},
            {v:"Consolidate"},
            {v:"Achieve +1.5–2.0% primary surplus. Broaden tax base, reduce informality. Ring-fence social protection."},
            {v:"Begin data-dependent rate cuts as inflation anchors below 6%. Adopt formal inflation targeting framework."},
            {v:"Simplify business registration. Launch targeted export promotion in comparative-advantage sectors."},
          ].map(({v,c},i)=>(
            <div key={i} style={{background:`${C.amber}09`,padding:"10px 12px",fontSize:11,color:i===0?C.amber:C.text,fontWeight:i===0?700:400,lineHeight:1.6,borderRight:i<4?`1px solid ${C.border}`:undefined,borderBottom:`1px solid ${C.border}`,whiteSpace:i===0?"pre-line":undefined}}>{v}</div>
          ))}
          {/* Phase 3 */}
          {[
            {v:"Phase 3\n(Yrs 3–5)"},
            {v:"Transform"},
            {v:"Sustain primary surplus. Redirect debt-service savings to education and infrastructure investment."},
            {v:"Normalise rates toward 7–9% nominal. Active managed-float exchange rate policy."},
            {v:"Scale EOI framework: R&D incentives, export corridors, cluster industrial policy. Human capital investment."},
          ].map(({v},i)=>(
            <div key={i} style={{background:`${C.green}09`,padding:"10px 12px",fontSize:11,color:i===0?C.green:C.text,fontWeight:i===0?700:400,lineHeight:1.6,borderRight:i<4?`1px solid ${C.border}`:undefined,whiteSpace:i===0?"pre-line":undefined}}>{v}</div>
          ))}
        </div>
      </div>

      {/* Detailed prescriptions */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[
          {cat:"PHASE 1: FISCAL CONSOLIDATION",icon:"🏛",color:C.red,items:[
            {t:"Primary Surplus Target +2.0–2.5% GDP",d:"A swing of approximately 2.6–3.1 percentage points from the current primary deficit of −0.6%. Comparable to successful consolidations in Brazil (2015–17) and Portugal (2011–14). At this level, with nominal growth near 5.5% and a gradually compressing r−g differential, the debt-to-GDP ratio stabilizes and begins to fall."},
            {t:"Expenditure-Led Consolidation",d:"Revenue at 39.5% is adequate if efficient. An efficiency audit identifies regressive subsidies (energy, transport) for reform. Public wage indexation reform. State enterprise transfer reduction. Unconditional cash transfers for the poorest quintile are ring-fenced — the 2021 poverty spike (2.8% → 7.5%) demonstrates how quickly gains can be reversed."},
            {t:"Revenue Base Broadening",d:"Reduce informality (ISI legacy that limits fiscal capacity). Digitalize payments to reduce the cash economy. Strengthen VAT enforcement. Reform natural resource royalties. Progressive property/wealth tax improves fiscal and distributional outcomes simultaneously without raising statutory marginal rates."},
          ]},
          {cat:"PHASE 2: MONETARY NORMALISATION",icon:"🏦",color:C.amber,items:[
            {t:"Hold Rates Until Fiscal Credibility is Established",d:"The CB should hold rates at 15% until a legislated multi-year consolidation plan and at least one year of primary surplus delivery is unambiguously established. Premature rate cuts will be interpreted as fiscal accommodation, triggering capital outflows, FX depreciation, and renewed inflation pass-through. The precedent is clear: Argentina (2016) and Turkey (2021) cut rates before resolving fiscal imbalances and experienced currency crises."},
            {t:"Data-Dependent Rate Reduction Path",d:"Once the fiscal anchor holds, reduce rates targeting a real rate consistent with inflation stabilization (~4–5% real, implying nominal rates of 8–10% against a 3–4% inflation target). At this point, CB rate decisions transition from risk-premium signaling to genuine monetary policy — the AD-AS transmission restores as investment and consumption respond through real channels."},
            {t:"CB Independence + Managed Float",d:"Legislate CB independence, insulating it from fiscal pressure via transparent mandate definition. Manage the FX rate within a managed-float framework — avoiding both an unsustainable peg and a pure float that amplifies inflation expectations. Accumulate FX reserves during export upswings as insurance against sudden stops."},
          ]},
          {cat:"PHASE 3: STRUCTURAL TRANSFORMATION",icon:"⚙️",color:C.blue,items:[
            {t:"From ISI Legacy to Export-Oriented Industrialization",d:"Reorient industrial policy from protection to performance. The Krugman-Obstfeld economies-of-scale framework justifies selective, time-limited support for industries with latent comparative advantage and learning-by-doing potential — conditional on export performance and subject to sunset clauses that prevent capture by domestic incumbents."},
            {t:"Three Structural Priorities",d:"(1) Formalization: reducing the regulatory burden that drives informality raises productivity, tax revenues, social insurance coverage, and firm investment simultaneously. (2) Export promotion: building export corridors in comparative-advantage sectors (agribusiness, selective manufacturing, resource processing) disciplines firms through international competition. (3) Human capital: systematic investment in technical/vocational education expands productive capacity and addresses the supply-side dimension of stagflation."},
          ]},
          {cat:"SOCIAL PROTECTION & SEQUENCING",icon:"👥",color:C.teal,items:[
            {t:"Ring-Fence Core Social Transfers",d:"Social protection must be insulated not as a political concession but as economic necessity. Any consolidation that fails to protect lower-income households faces severe social instability risks, narrowing the feasible adjustment set substantially. Protect unconditional cash transfers and health spending; cut regressive energy and transport subsidies that benefit upper quintiles."},
            {t:"Key Trade-off: Fiscal Multiplier vs Long-run Sustainability",d:"Fiscal consolidation in a recessionary gap generates short-run output contraction through the fiscal multiplier (~0.5–1.0 for emerging economies). A phased schedule front-loading revenue measures over expenditure cuts mitigates but cannot eliminate this cost. The intertemporal counter-argument: disorderly debt restructuring, if adjustment is deferred, imposes far larger and more persistent output losses than managed consolidation."},
          ]},
        ].map(p=>(
          <div key={p.cat} style={{background:C.panel,border:`1px solid ${p.color}30`,borderRadius:10,padding:"16px 18px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:18}}>{p.icon}</span>
              <div style={{fontSize:11,fontWeight:800,color:p.color,textTransform:"uppercase",letterSpacing:1.5,fontFamily:"monospace"}}>{p.cat}</div>
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
        <div style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:"Georgia,serif",marginBottom:12}}>Critical Trade-Off Matrix</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[
            {a:"Fiscal Consolidation",b:"Short-run Output",note:"Multiplier ~0.5–1.0. Phased schedule and front-loading revenue over cuts mitigates cost. Intertemporal case: managed adjustment < disorderly restructuring.",c:C.red},
            {a:"Hold CB Rate",b:"Private Investment",note:"Maintaining 15% while necessary for credibility crushes private investment. Fiscal credibility is the pre-condition for lower rates — the sequence matters.",c:C.amber},
            {a:"FX Depreciation",b:"Import Inflation",note:"Weak FX should boost export competitiveness, but low export elasticity (ISI legacy) means pass-through to CPI dominates. FX alone cannot fix the CA.",c:C.orange},
            {a:"Debt Sustainability",b:"Social Spending",note:"Primary surplus requires expenditure cuts. Ring-fence transfers; cut subsidies. Political economy requires visible redistribution to sustain reform coalitions.",c:C.blue},
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
// FORECAST — Scenario modelling 2026–2030
// ═══════════════════════════════════════════════════════════════

// Debt dynamics: d(t+1) = d(t) * (1 + r/100 - g/100) - pb
function buildForecast(scenario){
  const FYR = ["2025","2026","2027","2028","2029","2030"];
  const S = {
    noReform:    { pb:[-0.6,-1.2,-2.0,-3.0,-4.0,-5.0],  r:[15,16,17,17.5,18,19],   g:[2.4,1.5,0.5,0,-1,-2],    cpi:[4.9,6.5,9,11,13,15],   unemp:[7.1,8,10,12,13,14] },
    reform:      { pb:[-0.6,0.5,1.5,2.0,2.5,2.5],       r:[15,15,13,11,9,8],        g:[2.4,2.0,2.8,3.2,3.5,4.0], cpi:[4.9,5.5,4.5,3.8,3.2,3.0], unemp:[7.1,7.5,7.2,6.8,6.3,5.8] },
    imf:         { pb:[-0.6,1.0,2.5,3.0,3.0,3.0],       r:[15,14,11,9,7.5,7],       g:[2.4,1.5,3.0,4.0,4.5,4.5], cpi:[4.9,6.0,5.0,4.0,3.2,3.0], unemp:[7.1,8.5,7.5,6.5,5.8,5.5] },
  };
  const s = S[scenario];
  let debt = 91.4;
  return FYR.map((yr,i)=>{
    const d = +debt.toFixed(1);
    if(i<FYR.length-1) debt = debt*(1+s.r[i]/100-s.g[i]/100)-s.pb[i];
    return { year:yr, debt:d, primaryBal:s.pb[i], cbRate:s.r[i], gdpGrowth:s.g[i], cpi:s.cpi[i], unemp:s.unemp[i] };
  });
}

function Forecast(){
  const [scenario,setScenario] = useState("reform");

  const SCENARIOS = {
    noReform:{ label:"No Reform", color:C.red,   desc:"Fiscal deficit continues to widen. Debt compounds at 9%+ GDP/year. CB is forced to raise rates further to defend currency. Stagflation deepens. Debt crisis likely by 2028–29." },
    reform:  { label:"Report Recommendation", color:C.amber, desc:"Gradual Reform per Group 1 report: Phase 1 stabilises (primary surplus target +2%), Phase 2 consolidates (rate cuts begin), Phase 3 transforms. Debt stabilises ~95% then declines." },
    imf:     { label:"IMF Program", color:C.blue, desc:"Accelerated fiscal adjustment with IMF support. Sharper short-run pain (higher unemployment in Year 1–2), but faster credibility gains compress risk premium and allow faster rate normalisation." },
  };

  const fData = buildForecast(scenario);
  // Historical + forecast combined for debt chart
  const debtHistorical = DATA.filter(d=>d.year>="2015").map(d=>({year:d.year, historical:d.grossDebt}));
  const forecastLine = fData.map(d=>({year:d.year, [scenario]:d.debt}));

  // Merge for combined chart
  const allYears = [...new Set([...debtHistorical.map(d=>d.year),...forecastLine.map(d=>d.year)])];
  const combinedDebt = allYears.map(y=>{
    const h = debtHistorical.find(d=>d.year===y);
    const f = forecastLine.find(d=>d.year===y);
    return { year:y, historical:h?.historical??null, forecast:f?.[scenario]??null };
  });

  const sc = SCENARIOS[scenario];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionHeader title="Scenario Forecast 2026–2030" subtitle="Projected macro trajectories under three policy paths — based on debt dynamics model"/>

      {/* Scenario selector */}
      <div style={{display:"flex",gap:10}}>
        {Object.entries(SCENARIOS).map(([key,s])=>(
          <button key={key} onClick={()=>setScenario(key)} style={{
            flex:1,padding:"14px 16px",background:scenario===key?`${s.color}22`:C.panel,
            border:`2px solid ${scenario===key?s.color:C.border}`,borderRadius:10,cursor:"pointer",textAlign:"left",transition:"all 0.15s",
          }}>
            <div style={{fontSize:11,fontWeight:700,color:s.color,marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:10,color:C.dim,lineHeight:1.5}}>{s.desc}</div>
          </button>
        ))}
      </div>

      {/* KPI projections */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
        {fData.slice(1).map(d=>(
          <div key={d.year} style={{background:C.panel,border:`1px solid ${sc.color}33`,borderRadius:9,padding:"12px 13px"}}>
            <div style={{fontSize:11,fontWeight:700,color:sc.color,fontFamily:"monospace",marginBottom:8}}>{d.year}</div>
            {[
              {l:"Debt/GDP",v:`${d.debt.toFixed(1)}%`,c:d.debt>95?C.red:d.debt>85?C.amber:C.green},
              {l:"Primary Bal",v:`${d.primaryBal>0?"+":""}${d.primaryBal.toFixed(1)}%`,c:d.primaryBal>0?C.green:C.red},
              {l:"CB Rate",v:`${d.cbRate}%`,c:d.cbRate>12?C.red:d.cbRate>8?C.amber:C.green},
              {l:"GDP Growth",v:`${d.gdpGrowth>0?"+":""}${d.gdpGrowth.toFixed(1)}%`,c:d.gdpGrowth>3?C.green:d.gdpGrowth>1?C.amber:C.red},
              {l:"CPI",v:`${d.cpi}%`,c:d.cpi>8?C.red:d.cpi>5?C.amber:C.green},
              {l:"Unemp",v:`${d.unemp}%`,c:d.unemp>11?C.red:d.unemp>8?C.amber:C.green},
            ].map(({l,v,c})=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:9,color:C.dim}}>{l}</span>
                <span style={{fontSize:10,fontWeight:700,color:c,fontFamily:"monospace"}}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Panel title="Public Debt Trajectory: Historical + Forecast (% GDP)" sub="Dashed = projection. Historical context from 2015." h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedDebt}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP} domain={[60,130]}/>
              <Tooltip {...TT}/>
              <Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine y={90} stroke={C.red} strokeDasharray="3 3" label={{value:"90%",fill:C.red,fontSize:9,position:"insideRight"}}/>
              <ReferenceLine x="2025" stroke={C.amber} strokeDasharray="3 3" label={{value:"Forecast →",fill:C.amber,fontSize:9,position:"insideTopLeft"}}/>
              <Area dataKey="historical" name="Historical Debt %" stroke={C.dim} fill={C.dim+"20"} strokeWidth={2} connectNulls/>
              <Line dataKey="forecast" name={`${sc.label} Forecast %`} stroke={sc.color} dot={true} strokeWidth={2.5} connectNulls strokeDasharray="6 3"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Primary Balance Path (% GDP)" sub="+2% target is the minimum needed to stabilise debt" h={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={fData}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT} formatter={v=>[fPct(v),"Primary Balance"]}/>
              <ReferenceLine {...RL0}/>
              <ReferenceLine y={2} stroke={C.green} strokeDasharray="3 3" label={{value:"Stability target +2%",fill:C.green,fontSize:9,position:"insideRight"}}/>
              <Bar dataKey="primaryBal" name="Primary Bal %" radius={[3,3,0,0]} fill={sc.color}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="GDP Growth + Unemployment Forecast" sub="Short-run pain vs long-run gain depends on sequencing speed" h={230}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={fData}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine {...RL0}/>
              <Bar dataKey="gdpGrowth" name="GDP Growth %" fill={C.green} opacity={0.7} radius={[3,3,0,0]}/>
              <Line dataKey="unemp" name="Unemployment %" stroke={C.red} dot={false} strokeWidth={2} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="CB Rate + CPI Convergence Path" sub="Target: nominal rate 8–10%, CPI 3–4%, real rate 4–5%" h={230}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={fData}>
              <CartesianGrid {...CG_PROPS}/><XAxis dataKey="year" {...XP}/><YAxis {...YP}/>
              <Tooltip {...TT}/><Legend wrapperStyle={{fontSize:10,color:C.dim}}/>
              <ReferenceLine y={4} stroke={C.green} strokeDasharray="3 3" label={{value:"CPI target",fill:C.green,fontSize:9,position:"insideRight"}}/>
              <Bar dataKey="cpi" name="CPI %" fill={C.red+"77"} radius={[2,2,0,0]}/>
              <Line dataKey="cbRate" name="CB Rate %" stroke={C.amber} dot={false} strokeWidth={2.5} connectNulls/>
            </ComposedChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Scenario comparison summary */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}}>
        <div style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:"Georgia,serif",marginBottom:12}}>2030 Outcome Comparison</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[
            {key:"noReform",debt:"~130%+",pb:"-5%",rate:"19%",g:"-2%",verdict:"DEBT CRISIS",vc:C.red,vd:"Debt spiral triggers disorderly restructuring. Output loss far exceeds managed consolidation cost."},
            {key:"reform",debt:"~88%",pb:"+2.5%",rate:"8%",g:"+4%",verdict:"STABILISED",vc:C.amber,vd:"Debt stabilises and begins declining. Investment recovers as real rates fall. Structural transformation underway."},
            {key:"imf",debt:"~78%",pb:"+3%",rate:"7%",g:"+4.5%",verdict:"NORMALISED",vc:C.blue,vd:"Faster debt reduction. Higher short-term unemployment cost (Year 1–2), but faster credibility gains and rate normalisation."},
          ].map(({key,debt,pb,rate,g,verdict,vc,vd})=>(
            <div key={key} style={{background:`${vc}0a`,border:`2px solid ${scenario===key?vc:`${vc}30`}`,borderRadius:9,padding:"14px 16px",transition:"border-color 0.2s"}}>
              <div style={{fontSize:11,fontWeight:700,color:vc,marginBottom:8}}>{SCENARIOS[key].label}</div>
              {[["Debt/GDP 2030",debt],["Primary Balance",pb],["CB Rate",rate],["GDP Growth",g]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:10,color:C.dim}}>{l}</span>
                  <span style={{fontSize:11,fontWeight:700,color:C.text,fontFamily:"monospace"}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:8,background:`${vc}15`,borderRadius:6,padding:"6px 8px"}}>
                <div style={{fontSize:10,fontWeight:700,color:vc,marginBottom:3}}>{verdict}</div>
                <div style={{fontSize:10,color:C.dim,lineHeight:1.5}}>{vd}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHOCKS — Interactive shock analysis
// ═══════════════════════════════════════════════════════════════
const SHOCKS = [
  {
    id:"commodity",icon:"🛢",label:"Commodity Price Crash",color:C.orange,
    desc:"A 30–40% fall in commodity export prices (e.g. oil, metals, agriculture). Country 1's commodity-dependent export base and ISI legacy make this a primary vulnerability. Think 2015–16 or the post-2014 bust.",
    immediate:[
      {var:"GDP Growth",impact:"−2 to −3pp",dir:"down",note:"Export revenues collapse, investment contracts sharply"},
      {var:"Fiscal Revenue",impact:"−3 to −5% GDP",dir:"down",note:"Commodity royalties and corporate taxes fall"},
      {var:"Current Account",impact:"−2 to −3% GDP",dir:"down",note:"Export value falls while import demand remains"},
      {var:"FX Rate",impact:"−15 to −25%",dir:"down",note:"Currency depreciates as export earnings fall"},
      {var:"CPI",impact:"+2 to +4pp",dir:"up",note:"FX depreciation passes through to import prices"},
      {var:"Unemployment",impact:"+2 to +3pp",dir:"up",note:"Commodity sector and supply chain job losses"},
    ],
    responses:[
      {label:"Accommodate (Counter-cyclical)",color:C.blue,pros:["Cushions short-run output contraction","Maintains social spending","Prevents hysteresis in labour market"],cons:["Widens fiscal deficit further","Accelerates debt accumulation","Triggers sovereign risk premium spike","May force sharper adjustment later"],verdict:"RISKY — Given pre-existing 91% debt, additional accommodation risks a debt crisis. Only viable if commodity shock is clearly temporary and financing is available at acceptable rates."},
      {label:"Adjust (Pro-cyclical Consolidation)",color:C.amber,pros:["Preserves fiscal credibility","Limits debt trajectory deterioration","Signal of commitment helps FX stabilisation"],cons:["Amplifies GDP contraction","Higher unemployment in short run","Poverty spike risk given 7.5% base"],verdict:"RECOMMENDED — Painful but necessary. Front-load expenditure cuts on subsidies (not transfers). Seek IMF Flexible Credit Line for insurance. Communicate adjustment path clearly to anchor expectations."},
    ]
  },
  {
    id:"suddenstop",icon:"🚫",label:"Sudden Stop in Capital Flows",color:C.red,
    desc:"Global investor risk-off triggers rapid reversal of portfolio and direct investment inflows. With persistent CA deficits, Country 1 is acutely vulnerable: external financing (~2.5% GDP/yr) would need to be adjusted overnight.",
    immediate:[
      {var:"FX Rate",impact:"−20 to −40%",dir:"down",note:"Sharp depreciation as capital exits"},
      {var:"CB Rate",impact:"+3 to +6pp",dir:"up",note:"CB forced to hike aggressively to defend currency"},
      {var:"GDP Growth",impact:"−3 to −5pp",dir:"down",note:"Investment collapses, confidence shock"},
      {var:"Fiscal Balance",impact:"−2 to −3% GDP",dir:"down",note:"Higher debt service costs in domestic currency"},
      {var:"CPI",impact:"+4 to +8pp",dir:"up",note:"Rapid FX pass-through to all imported goods"},
      {var:"External Debt (dom. currency)",impact:"+30 to +50%",dir:"up",note:"Currency mismatch amplifies foreign debt burden"},
    ],
    responses:[
      {label:"FX Peg Defense (Rate Hikes)",color:C.red,pros:["Stabilises FX in short run","Signals CB commitment"],cons:["Destroys private investment","Deepens recession severely","Unsustainable if reserves insufficient","Eventual forced devaluation worse"],verdict:"NOT RECOMMENDED — Without sufficient FX reserves (Country 1 has limited buffer), a peg defense is ultimately futile. It delays and amplifies the adjustment at higher cost."},
      {label:"Managed Float + IMF Program",color:C.green,pros:["IMF program provides external anchoring","Restores market confidence quickly","Financing bridge avoids forced deleveraging","Structural conditionality accelerates reform"],cons:["Short-run austerity requirements","Political cost of conditionality","Requires fast institutional coordination"],verdict:"RECOMMENDED — IMF Emergency Financing Facility or Stand-By Arrangement. Allow orderly FX adjustment, use IMF financing as bridge, commit to fiscal path. Resolves the sudden stop at lower long-run cost."},
    ]
  },
  {
    id:"globalrecession",icon:"🌍",label:"Global Recession",color:C.blue,
    desc:"A synchronized global downturn (comparable to 2009 GFC) reduces external demand for exports, tightens global financial conditions, and raises risk premiums across emerging markets. Country 1's openness and commodity dependence amplify the transmission.",
    immediate:[
      {var:"Export Volume",impact:"−8 to −12%",dir:"down",note:"Global demand for commodities collapses (as in 2009: −8.6% exports)"},
      {var:"GDP Growth",impact:"−2 to −4pp",dir:"down",note:"Net export and investment channel transmission"},
      {var:"Current Account",impact:"−1 to −2% GDP",dir:"down",note:"Export collapse exceeds import compression"},
      {var:"Sovereign Spreads",impact:"+200 to +400bp",dir:"up",note:"EM risk premium spikes in global risk-off"},
      {var:"Unemployment",impact:"+2 to +4pp",dir:"up",note:"Export sector and domestically traded sector"},
      {var:"Fiscal Balance",impact:"−2 to −3% GDP",dir:"down",note:"Automatic stabilisers plus revenue compression"},
    ],
    responses:[
      {label:"Fiscal Stimulus",color:C.purple,pros:["Offsets demand contraction","Prevents poverty reversal","Infrastructure investment has multiplier"],cons:["Already at 91% debt — fiscal space is minimal","Market may treat stimulus as insolvency signal","Financing cost may spike to double digits"],verdict:"LIMITED — Some automatic stabiliser activation is appropriate (do not cut in a recession), but discretionary stimulus is not available given debt trajectory. The 2020 COVID experience (−11.6% fiscal deficit) shows the cost."},
      {label:"Structural Resilience Building",color:C.teal,pros:["Uses recession to accelerate structural reforms","Export diversification reduces commodity exposure","Labour market reform during slack period"],cons:["Reforms take years to show results","Political resistance highest during downturn","Short-run output cost of restructuring"],verdict:"RECOMMENDED (medium run) — Use the global recession to accelerate formalisation and export diversification. Protect core social transfers. Avoid discretionary fiscal expansion. Communicate medium-term consolidation path to maintain market access."},
    ]
  },
  {
    id:"politicalcrisis",icon:"⚡",label:"Political / Governance Crisis",color:C.purple,
    desc:"A political disruption — election uncertainty, populist policy reversal, corruption scandal, or institutional breakdown — that undermines reform credibility and triggers a confidence shock. The most common mechanism in Latin American ISI-legacy economies.",
    immediate:[
      {var:"Sovereign Risk Premium",impact:"+300 to +600bp",dir:"up",note:"Market reprices government solvency immediately"},
      {var:"FX Rate",impact:"−20 to −35%",dir:"down",note:"Capital flight from political uncertainty"},
      {var:"CB Rate (forced)",impact:"+3 to +5pp",dir:"up",note:"CB emergency hikes to prevent currency collapse"},
      {var:"Investment",impact:"−10 to −20%",dir:"down",note:"FDI and domestic capex freeze pending clarity"},
      {var:"Fiscal Balance",impact:"−2 to −4% GDP",dir:"down",note:"Spending commitments made for political support"},
      {var:"Debt Service (dom. curr.)",impact:"+15 to +30%",dir:"up",note:"FX depreciation raises cost of foreign debt"},
    ],
    responses:[
      {label:"Populist Accommodation",color:C.red,pros:["Short-run political support","Reduces social unrest risk"],cons:["Destroys market credibility immediately","Triggers debt spiral acceleration","Argentina-style outcome likely within 2–3 years","Poverty and unemployment ultimately higher"],verdict:"NOT RECOMMENDED — The political economy attraction is understandable but the economic consequence is severe. A credibility collapse in a 91%-debt, 15%-rate economy has no soft landing."},
      {label:"Credibility Anchoring via Institutions",color:C.green,pros:["Preserves market access at reasonable rates","CB independence legislation is permanent","IMF/World Bank signalling calms investors quickly","Cross-party fiscal rule harder to reverse"],cons:["Requires political coalition building","Short-run political cost","May require technocratic government"],verdict:"RECOMMENDED — Legislate CB independence, announce multi-year fiscal path with IMF endorsement, ring-fence reform agenda in institutional framework. The reform window after a crisis is often the only political moment available — use it."},
    ]
  },
  {
    id:"climate",icon:"🌊",label:"Climate / Natural Disaster Shock",color:C.teal,
    desc:"A major climate event (flooding, drought, extreme weather) hits agricultural output, infrastructure, and public finances. Increasingly material for commodity-dependent emerging economies. Consistent with Country 1's hydrology-sensitive export base.",
    immediate:[
      {var:"Agricultural Output",impact:"−10 to −30%",dir:"down",note:"Drought/flood directly destroys crop production"},
      {var:"GDP Growth",impact:"−1 to −2pp",dir:"down",note:"Agriculture and food processing transmission"},
      {var:"CPI (food)",impact:"+3 to +8pp",dir:"up",note:"Food price spike hits poorest households hardest"},
      {var:"Fiscal Balance",impact:"−1 to −3% GDP",dir:"down",note:"Emergency reconstruction spending, revenue loss"},
      {var:"Current Account",impact:"−0.5 to −1.5% GDP",dir:"down",note:"Food import needs rise as production falls"},
      {var:"Poverty Rate",impact:"+1 to +3pp",dir:"up",note:"Food inflation disproportionately affects poor"},
    ],
    responses:[
      {label:"Emergency Fiscal Response Only",color:C.orange,pros:["Rapid short-run disaster relief","Maintains political legitimacy"],cons:["No structural adaptation","Next shock equally damaging","Fiscal cost without resilience dividend","Climate risk reprices sovereign debt"],verdict:"INSUFFICIENT — Emergency spending is necessary but not sufficient. Without structural adaptation investment, the same shock recurs at increasing frequency and cost."},
      {label:"Resilience + Green Transition",color:C.teal,pros:["Infrastructure investment reduces future shock exposure","Green bonds access international climate finance","Diversifies export base (renewable energy)","Aligns with multilateral financing availability"],cons:["Requires fiscal space (constrained)","Long lead times before benefits materialise","Coordination complexity with fiscal consolidation"],verdict:"RECOMMENDED — Use multilateral green finance (World Bank, IDB, GCF) to fund adaptation investment off-budget. Climate resilience investment is one area where additional public spending has high social return AND access to concessional financing, reducing the fiscal cost."},
    ]
  },
];

function Shocks(){
  const [selected,setSelected] = useState("commodity");
  const shock = SHOCKS.find(s=>s.id===selected);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionHeader title="Unexpected Shocks & Policy Responses" subtitle="Select a shock to see its transmission mechanisms and optimal policy response options"/>

      {/* Shock selector */}
      <div style={{display:"flex",gap:8}}>
        {SHOCKS.map(s=>(
          <button key={s.id} onClick={()=>setSelected(s.id)} style={{
            flex:1,padding:"12px 10px",background:selected===s.id?`${s.color}22`:C.panel,
            border:`2px solid ${selected===s.id?s.color:C.border}`,borderRadius:9,cursor:"pointer",textAlign:"center",transition:"all 0.15s",
          }}>
            <div style={{fontSize:20,marginBottom:5}}>{s.icon}</div>
            <div style={{fontSize:10,fontWeight:700,color:selected===s.id?s.color:C.dim,lineHeight:1.3}}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Shock description */}
      <div style={{background:`${shock.color}0d`,border:`1px solid ${shock.color}44`,borderRadius:10,padding:"14px 18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontSize:22}}>{shock.icon}</span>
          <div style={{fontSize:14,fontWeight:700,color:shock.color,fontFamily:"Georgia,serif"}}>{shock.label}</div>
        </div>
        <div style={{fontSize:12,color:C.text,lineHeight:1.7}}>{shock.desc}</div>
      </div>

      {/* Immediate impact */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}}>
        <div style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:"Georgia,serif",marginBottom:12}}>⚡ Immediate Transmission: Impact on Key Variables</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {shock.immediate.map(({var:v,impact,dir,note})=>(
            <div key={v} style={{background:dir==="down"?`${C.red}0a`:`${C.orange}0a`,border:`1px solid ${dir==="down"?C.red:C.orange}30`,borderRadius:8,padding:"10px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div style={{fontSize:10,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:0.8}}>{v}</div>
                <div style={{fontSize:13,fontWeight:800,color:dir==="down"?C.red:C.orange,fontFamily:"monospace"}}>{impact}</div>
              </div>
              <div style={{fontSize:10,color:C.dim,lineHeight:1.5}}>{note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy responses */}
      <div style={{fontSize:12,fontWeight:700,color:C.text,fontFamily:"Georgia,serif"}}>🔧 Policy Response Options</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {shock.responses.map(resp=>(
          <div key={resp.label} style={{background:C.panel,border:`2px solid ${resp.color}44`,borderRadius:10,padding:"16px 18px"}}>
            <div style={{fontSize:13,fontWeight:700,color:resp.color,fontFamily:"Georgia,serif",marginBottom:12}}>{resp.label}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div style={{background:`${C.green}0a`,border:`1px solid ${C.green}30`,borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:10,fontWeight:700,color:C.green,marginBottom:6,textTransform:"uppercase",letterSpacing:0.8}}>✓ Arguments For</div>
                {resp.pros.map(p=><div key={p} style={{fontSize:10,color:C.dim,marginBottom:4,paddingLeft:8,borderLeft:`2px solid ${C.green}44`}}>{p}</div>)}
              </div>
              <div style={{background:`${C.red}0a`,border:`1px solid ${C.red}30`,borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:10,fontWeight:700,color:C.red,marginBottom:6,textTransform:"uppercase",letterSpacing:0.8}}>✗ Arguments Against</div>
                {resp.cons.map(c=><div key={c} style={{fontSize:10,color:C.dim,marginBottom:4,paddingLeft:8,borderLeft:`2px solid ${C.red}44`}}>{c}</div>)}
              </div>
            </div>
            <div style={{background:`${resp.color}15`,border:`1px solid ${resp.color}44`,borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:10,fontWeight:700,color:resp.color,marginBottom:4}}>VERDICT</div>
              <div style={{fontSize:11,color:C.text,lineHeight:1.6}}>{resp.verdict}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Country 1 specific vulnerability note */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px"}}>
        <div style={{fontSize:11,fontWeight:700,color:C.amber,marginBottom:10,fontFamily:"monospace",letterSpacing:1}}>COUNTRY 1 SPECIFIC VULNERABILITY CONTEXT</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[
            {t:"Pre-existing fragilities amplify all shocks",d:"91% debt/GDP, −8.4% fiscal deficit, 15% CB rate, −2.5% CA, 7% structural unemployment — Country 1 enters any shock with minimal buffers and no fiscal space. The response options are fundamentally constrained.",c:C.red},
            {t:"Sequencing of reform matters for shock resilience",d:"The report's 3-phase sequence was designed precisely to rebuild buffers. Each phase completed increases resilience to future shocks: Phase 1 reduces debt vulnerability, Phase 2 restores monetary tools, Phase 3 diversifies the economy.",c:C.amber},
            {t:"Social protection is shock-absorber infrastructure",d:"With GINI 51.6 and poverty at 3.8%, a shock hitting the lower quintiles can rapidly reverse development gains (as in 2021: 2.8% → 7.5% poverty). Automatic stabilisers are the most cost-effective shock response instrument available.",c:C.teal},
          ].map(({t,d,c})=>(
            <div key={t} style={{background:`${c}0a`,border:`1px solid ${c}30`,borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:c,marginBottom:6}}>{t}</div>
              <div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════════
const TABS = [
  {id:"overview",  label:"Overview",     icon:"◈"},
  {id:"growth",    label:"GDP & Growth", icon:"↗"},
  {id:"monetary",  label:"Monetary",     icon:"⬡"},
  {id:"fiscal",    label:"Fiscal",       icon:"⬢"},
  {id:"external",  label:"External",     icon:"◉"},
  {id:"social",    label:"Social",       icon:"◍"},
  {id:"diagnose",  label:"Diagnose",     icon:"⌬"},
  {id:"prescribe", label:"Prescribe",    icon:"▷"},
  {id:"forecast",  label:"Forecast",     icon:"⟶"},
  {id:"shocks",    label:"Shocks",       icon:"⚡"},
];
const SECTIONS = { overview:Overview, growth:GDPGrowth, monetary:Monetary, fiscal:Fiscal, external:External, social:Social, diagnose:Diagnose, prescribe:Prescribe, forecast:Forecast, shocks:Shocks };

export default function App(){
  const [tab,setTab] = useState("overview");
  const Section = SECTIONS[tab];

  const headerKPIs = [
    {k:"gdpGrowth",label:"GDP GROWTH",suf:"%"},
    {k:"gdpCapUSD", label:"GDP/CAP USD",suf:"",fmt:fK},
    {k:"cpi",       label:"CPI",suf:"%"},
    {k:"cbRate",    label:"CB RATE",suf:"%"},
    {k:"grossDebt", label:"DEBT/GDP",suf:"%"},
    {k:"ca_pct",    label:"CURR. ACCT",suf:"%"},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",padding:"18px 22px",boxSizing:"border-box"}}>
      {/* HEADER */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>
        <div>
          <div style={{fontSize:9,color:C.amber,letterSpacing:"3.5px",textTransform:"uppercase",fontWeight:700,marginBottom:6,fontFamily:"monospace"}}>◈ Managerial Economics · IE Business School · IMBA 2026 · Group 1</div>
          <h1 style={{fontSize:24,fontWeight:900,color:C.text,margin:0,fontFamily:"Georgia,serif",letterSpacing:-0.3}}>Country 1 — Macroeconomic Assessment</h1>
          <div style={{fontSize:10,color:C.dim,marginTop:5,fontFamily:"monospace"}}>A Case of Fiscal Dominance and the Twin Deficit Trap · 40 indicators · 2000–2025 · Describe → Diagnose → Prescribe</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
          <div style={{display:"flex",gap:6}}>
            {headerKPIs.map(({k,label,suf,fmt:lf})=>{
              const {v,y}=latestVal(k);
              return(
                <div key={k} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px",textAlign:"center",minWidth:68}}>
                  <div style={{fontSize:8.5,color:C.dim,textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>{label}</div>
                  <div style={{fontSize:14,fontWeight:800,color:C.amber,fontFamily:"monospace",marginTop:2}}>{v==null?"—":(lf?lf(v):f1(v))}{suf}</div>
                  <div style={{fontSize:8,color:C.faint,marginTop:1}}>{y}</div>
                </div>
              );
            })}
          </div>
          <div style={{fontSize:9,color:C.faint,fontFamily:"monospace"}}>A. Alsharif · C. Cavallero · A. Choraria · A. Grassl · J. Guijarro · B. Mir · T. Warrier</div>
        </div>
      </div>

      {/* TABS */}
      <div style={{display:"flex",gap:1,marginBottom:18,borderBottom:`1px solid ${C.border}`}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"9px 14px",background:"transparent",border:"none",
            borderBottom:tab===t.id?`2px solid ${t.id==="forecast"?C.blue:t.id==="shocks"?C.red:C.amber}`:"2px solid transparent",
            color:tab===t.id?(t.id==="forecast"?C.blue:t.id==="shocks"?C.red:C.amber):C.dim,
            fontWeight:tab===t.id?700:400,fontSize:11,cursor:"pointer",transition:"all 0.12s",marginBottom:-1,
          }}>
            <span style={{marginRight:4,fontSize:10}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <Section/>

      {/* FOOTER */}
      <div style={{marginTop:24,paddingTop:12,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:9.5,color:C.faint,fontFamily:"monospace"}}>Country 1 · country1.xlsx · 40 indicators · 2000–2025 · Interactive dashboard</div>
        <div style={{fontSize:9.5,color:C.faint,fontFamily:"monospace"}}>Prof. Daniel Fernández-Kranz · Managerial Economics · IE Business School</div>
      </div>
    </div>
  );
}
