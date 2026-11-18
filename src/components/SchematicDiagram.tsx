import React from 'react';
import { SchematicType } from '../types/study';

interface SchematicDiagramProps {
  type: SchematicType;
  formulaBox?: string;
}

export const SchematicDiagram: React.FC<SchematicDiagramProps> = ({ type, formulaBox }) => {
  return (
    <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3">
      <div className="flex flex-col gap-2.5">
        <div className="w-full overflow-x-auto formula-scroll">
          <svg
            viewBox="0 0 360 124"
            className="w-full max-w-[360px] h-auto mx-auto block select-none"
            role="img"
            aria-label="전력공학 회로 및 벡터 도해"
          >
            {type === 'gmr-triangle' && (
              <g>
                <line x1="90" y1="92" x2="180" y2="26" stroke="#1D4ED8" strokeWidth="1.75" strokeDasharray="4 3" />
                <line x1="180" y1="26" x2="270" y2="92" stroke="#1D4ED8" strokeWidth="1.75" strokeDasharray="4 3" />
                <line x1="90" y1="92" x2="270" y2="92" stroke="#1D4ED8" strokeWidth="1.75" strokeDasharray="4 3" />
                <circle cx="180" cy="26" r="8" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2" />
                <circle cx="90" cy="92" r="8" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2" />
                <circle cx="270" cy="92" r="8" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2" />
                <text x="180" y="29" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">A</text>
                <text x="90" y="95" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">B</text>
                <text x="270" y="95" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">C</text>
                <text x="122" y="54" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono">D₁=2m</text>
                <text x="238" y="54" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono">D₂=4m</text>
                <text x="180" y="110" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono">D₃=8m (r=4mm)</text>
              </g>
            )}

            {type === 'corona-field' && (
              <g>
                <circle cx="115" cy="62" r="32" fill="none" stroke="#D97706" strokeWidth="1.25" strokeDasharray="3 3" />
                <circle cx="115" cy="62" r="21" fill="#FEF3C7" fillOpacity="0.6" stroke="#D97706" strokeWidth="1.5" />
                <circle cx="115" cy="62" r="10" fill="#1D4ED8" />
                <text x="115" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700" fontFamily="JetBrains Mono">r</text>
                <line x1="125" y1="62" x2="265" y2="62" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" />
                <circle cx="275" cy="62" r="10" fill="#1D4ED8" />
                <text x="195" y="54" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono">선간거리 D</text>
                <text x="115" y="108" textAnchor="middle" fill="#904D00" fontSize="9.5" fontWeight="600" fontFamily="JetBrains Mono">전리 영역 (E &gt; E₀)</text>
              </g>
            )}

            {type === 'ferranti-vector' && (
              <g>
                <defs>
                  <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#1D4ED8" />
                  </marker>
                  <marker id="arrowAmber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#D97706" />
                  </marker>
                  <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#059669" />
                  </marker>
                </defs>
                <line x1="45" y1="92" x2="310" y2="92" stroke="#1D4ED8" strokeWidth="2.2" markerEnd="url(#arrowBlue)" />
                <line x1="45" y1="92" x2="45" y2="28" stroke="#059669" strokeWidth="2" markerEnd="url(#arrowGreen)" />
                <line x1="45" y1="92" x2="232" y2="72" stroke="#475569" strokeWidth="1.8" markerEnd="url(#arrowAmber)" />
                <line x1="232" y1="72" x2="310" y2="92" stroke="#D97706" strokeWidth="1.6" strokeDasharray="3 2" />
                <text x="315" y="96" fill="#1D4ED8" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono">Vr</text>
                <text x="53" y="34" fill="#059669" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">Ic (90° 앞섬)</text>
                <text x="155" y="64" fill="#0F172A" fontSize="10.5" fontWeight="700" fontFamily="JetBrains Mono">Vs (&lt; Vr)</text>
                <text x="275" y="72" fill="#D97706" fontSize="9.5" fontWeight="600" fontFamily="JetBrains Mono">jωLIc</text>
                <text x="180" y="114" textAnchor="middle" fill="#475569" fontSize="9.5" fontFamily="JetBrains Mono">경부하 시 수전단 전압 상승 (Vr &gt; Vs)</text>
              </g>
            )}

            {type === 'pi-abcd' && (
              <g>
                <line x1="30" y1="42" x2="120" y2="42" stroke="#0F172A" strokeWidth="1.8" />
                <rect x="120" y="28" width="120" height="28" rx="6" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.8" />
                <text x="180" y="46" textAnchor="middle" fill="#1D4ED8" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono">A, B, C, D</text>
                <line x1="240" y1="42" x2="330" y2="42" stroke="#0F172A" strokeWidth="1.8" />
                <line x1="30" y1="92" x2="330" y2="92" stroke="#0F172A" strokeWidth="1.8" />
                <circle cx="48" cy="42" r="3" fill="#1D4ED8" />
                <circle cx="48" cy="92" r="3" fill="#1D4ED8" />
                <text x="42" y="71" textAnchor="middle" fill="#0F172A" fontSize="10.5" fontWeight="700" fontFamily="JetBrains Mono">Vs</text>
                <text x="86" y="34" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono">Is →</text>
                <circle cx="312" cy="42" r="3" fill="#D97706" />
                <circle cx="312" cy="92" r="3" fill="#D97706" />
                <text x="318" y="71" textAnchor="middle" fill="#0F172A" fontSize="10.5" fontWeight="700" fontFamily="JetBrains Mono">Vr</text>
                <text x="275" y="34" textAnchor="middle" fill="#D97706" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono">Ir = 0 (개방)</text>
              </g>
            )}

            {type === 'sag-span' && (
              <g>
                <line x1="56" y1="26" x2="56" y2="104" stroke="#475569" strokeWidth="3" />
                <line x1="304" y1="26" x2="304" y2="104" stroke="#475569" strokeWidth="3" />
                <line x1="56" y1="34" x2="304" y2="34" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="4 3" />
                <path d="M56 34 Q180 112 304 34" fill="none" stroke="#1D4ED8" strokeWidth="2.4" />
                <line x1="180" y1="34" x2="180" y2="73" stroke="#E11D48" strokeWidth="1.8" />
                <circle cx="180" cy="73" r="3" fill="#E11D48" />
                <text x="190" y="58" fill="#E11D48" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">D = 10m</text>
                <text x="180" y="24" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono">경간 S = 200 m</text>
                <text x="180" y="106" textAnchor="middle" fill="#1D4ED8" fontSize="9.5" fontWeight="600" fontFamily="JetBrains Mono">W = 2 kg/m,  T = 1000 kg</text>
              </g>
            )}

            {type === 'percent-z' && (
              <g>
                <circle cx="52" cy="56" r="16" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2" />
                <text x="52" y="60" textAnchor="middle" fill="#1D4ED8" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono">G</text>
                <line x1="68" y1="56" x2="120" y2="56" stroke="#0F172A" strokeWidth="2" />
                <rect x="120" y="42" width="76" height="28" rx="4" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="1.8" />
                <text x="158" y="60" textAnchor="middle" fill="#1D4ED8" fontSize="10.5" fontWeight="700" fontFamily="JetBrains Mono">%Z = 20%</text>
                <line x1="196" y1="56" x2="295" y2="56" stroke="#0F172A" strokeWidth="2" />
                <line x1="275" y1="56" x2="275" y2="82" stroke="#E11D48" strokeWidth="2" />
                <path d="M266 82 L284 82 M270 87 L280 87 M273 92 L277 92" stroke="#E11D48" strokeWidth="1.8" />
                <text x="275" y="44" textAnchor="middle" fill="#E11D48" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">3φ 단락 (Is)</text>
                <text x="160" y="106" textAnchor="middle" fill="#475569" fontSize="9.5" fontFamily="JetBrains Mono">Pn = 100 MVA · Vn = 154 kV</text>
              </g>
            )}

            {type === 'fault-1lg' && (
              <g>
                <rect x="28" y="34" width="74" height="32" rx="6" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.6" />
                <text x="65" y="54" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">정상 (Z₁)</text>
                <line x1="102" y1="50" x2="140" y2="50" stroke="#0F172A" strokeWidth="1.8" />
                <rect x="140" y="34" width="74" height="32" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.6" />
                <text x="177" y="54" textAnchor="middle" fill="#904D00" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">역상 (Z₂)</text>
                <line x1="214" y1="50" x2="252" y2="50" stroke="#0F172A" strokeWidth="1.8" />
                <rect x="252" y="34" width="74" height="32" rx="6" fill="#FFF1F2" stroke="#E11D48" strokeWidth="1.6" />
                <text x="289" y="54" textAnchor="middle" fill="#E11D48" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">영상 (Z₀)</text>
                <path d="M28 50 L14 50 L14 86 L340 86 L340 50 L326 50" fill="none" stroke="#0F172A" strokeWidth="1.6" />
                <text x="180" y="106" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono">직렬 접속: Ia1 = Ia2 = Ia0,  Ig = 3·Ia0</text>
              </g>
            )}

            {type === 'petersen-coil' && (
              <g>
                <line x1="70" y1="28" x2="280" y2="28" stroke="#0F172A" strokeWidth="1.8" />
                <line x1="70" y1="50" x2="280" y2="50" stroke="#0F172A" strokeWidth="1.8" />
                <line x1="70" y1="72" x2="280" y2="72" stroke="#0F172A" strokeWidth="1.8" />
                <line x1="70" y1="28" x2="70" y2="72" stroke="#1D4ED8" strokeWidth="2.2" />
                <circle cx="70" cy="50" r="3.5" fill="#1D4ED8" />
                <line x1="70" y1="50" x2="40" y2="50" stroke="#1D4ED8" strokeWidth="1.8" />
                <rect x="24" y="64" width="32" height="22" rx="4" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.6" />
                <text x="40" y="79" textAnchor="middle" fill="#1D4ED8" fontSize="9.5" fontWeight="700" fontFamily="JetBrains Mono">L</text>
                <line x1="40" y1="50" x2="40" y2="64" stroke="#1D4ED8" strokeWidth="1.8" />
                <line x1="40" y1="86" x2="40" y2="96" stroke="#1D4ED8" strokeWidth="1.8" />
                <path d="M32 96 L48 96 M35 100 L45 100" stroke="#1D4ED8" strokeWidth="1.5" />
                <text x="235" y="100" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono">3Cs 대지정전용량 ⇄ 소호리액터 L 병렬공진</text>
              </g>
            )}

            {type === 'surge-junction' && (
              <g>
                <line x1="25" y1="56" x2="180" y2="56" stroke="#1D4ED8" strokeWidth="3" />
                <line x1="180" y1="56" x2="335" y2="56" stroke="#059669" strokeWidth="5" />
                <circle cx="180" cy="56" r="5" fill="#D97706" />
                <text x="100" y="42" textAnchor="middle" fill="#1D4ED8" fontSize="10.5" fontWeight="700" fontFamily="JetBrains Mono">가공선 Z₁ = 400Ω</text>
                <text x="260" y="42" textAnchor="middle" fill="#059669" fontSize="10.5" fontWeight="700" fontFamily="JetBrains Mono">케이블 Z₂ = 100Ω</text>
                <text x="95" y="78" textAnchor="middle" fill="#0F172A" fontSize="9.5" fontFamily="JetBrains Mono">입사파 E=100kV →</text>
                <text x="95" y="94" textAnchor="middle" fill="#E11D48" fontSize="9.5" fontFamily="JetBrains Mono">← 반사파 Er=-60kV</text>
                <text x="260" y="84" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">투과파 Et = 40kV →</text>
              </g>
            )}

            {type === 'feeder-loss' && (
              <g>
                <rect x="26" y="24" width="136" height="68" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.4" />
                <text x="94" y="42" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">단상 2선식 (1φ2W)</text>
                <line x1="46" y1="58" x2="142" y2="58" stroke="#475569" strokeWidth="1.8" />
                <line x1="46" y1="72" x2="142" y2="72" stroke="#475569" strokeWidth="1.8" />
                <text x="94" y="108" textAnchor="middle" fill="#475569" fontSize="9.5" fontFamily="JetBrains Mono">손실 P_L1 = 2·I₁²R</text>

                <rect x="198" y="24" width="136" height="68" rx="8" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.5" />
                <text x="266" y="42" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">3상 3선식 (3φ3W)</text>
                <line x1="218" y1="54" x2="314" y2="54" stroke="#1D4ED8" strokeWidth="1.8" />
                <line x1="218" y1="66" x2="314" y2="66" stroke="#1D4ED8" strokeWidth="1.8" />
                <line x1="218" y1="78" x2="314" y2="78" stroke="#1D4ED8" strokeWidth="1.8" />
                <text x="266" y="108" textAnchor="middle" fill="#1D4ED8" fontSize="9.5" fontWeight="700" fontFamily="JetBrains Mono">손실 P_L3 = 0.5·P_L1</text>
              </g>
            )}

            {type === 'voltage-drop' && (
              <g>
                <circle cx="48" cy="54" r="14" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.8" />
                <text x="48" y="58" textAnchor="middle" fill="#1D4ED8" fontSize="9.5" fontWeight="700" fontFamily="JetBrains Mono">Vs</text>
                <line x1="62" y1="54" x2="112" y2="54" stroke="#0F172A" strokeWidth="1.8" />
                <rect x="112" y="42" width="96" height="24" rx="4" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
                <text x="160" y="58" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono">R + jX</text>
                <line x1="208" y1="54" x2="275" y2="54" stroke="#0F172A" strokeWidth="1.8" />
                <rect x="275" y="38" width="54" height="32" rx="6" fill="#ECFDF5" stroke="#059669" strokeWidth="1.6" />
                <text x="302" y="58" textAnchor="middle" fill="#059669" fontSize="9.5" fontWeight="700" fontFamily="JetBrains Mono">부하+SC</text>
                <text x="180" y="98" textAnchor="middle" fill="#475569" fontSize="9.5" fontFamily="JetBrains Mono">전압강하 ΔV ≈ √3·I(R cosθ + X sinθ)</text>
              </g>
            )}

            {type === 'ratio-diff' && (
              <g>
                <rect x="142" y="26" width="76" height="44" rx="6" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.8" />
                <text x="180" y="45" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">주변압기</text>
                <text x="180" y="60" textAnchor="middle" fill="#0F172A" fontSize="10.5" fontWeight="700" fontFamily="JetBrains Mono">Y  -  Δ</text>
                <line x1="40" y1="48" x2="142" y2="48" stroke="#0F172A" strokeWidth="2" />
                <line x1="218" y1="48" x2="320" y2="48" stroke="#0F172A" strokeWidth="2" />
                <circle cx="92" cy="48" r="9" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
                <circle cx="268" cy="48" r="9" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
                <path d="M92 57 L92 94 L268 94 L268 57" fill="none" stroke="#D97706" strokeWidth="1.6" />
                <rect x="150" y="82" width="60" height="24" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.6" />
                <text x="180" y="98" textAnchor="middle" fill="#904D00" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">87T</text>
                <text x="92" y="26" textAnchor="middle" fill="#D97706" fontSize="9.5" fontWeight="700" fontFamily="JetBrains Mono">CT: Δ결선</text>
                <text x="268" y="26" textAnchor="middle" fill="#D97706" fontSize="9.5" fontWeight="700" fontFamily="JetBrains Mono">CT: Y결선</text>
              </g>
            )}
          </svg>
        </div>

        {formulaBox && (
          <div className="border-t border-dashed border-[#CBD5E1] pt-2 overflow-x-auto formula-scroll">
            <p className="font-mono-tech text-[13px] font-medium text-[#1D4ED8] whitespace-nowrap text-center">
              {formulaBox}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
