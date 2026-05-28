import type { EstadoTurma } from '~/components/dashboard/types'

/**
 * Silhueta estilizada do Brasil com bolhas proporcionais por estado. Não é
 * cartograficamente exata — é uma referência visual. SVG puro (SSR-safe).
 */
export function BrasilMap({ estados }: { estados: EstadoTurma[] }) {
  const path = `
    M 105 22
    C 120 18, 138 24, 148 36
    C 158 46, 165 52, 172 64
    C 182 78, 188 92, 184 108
    C 178 122, 168 130, 158 138
    C 148 148, 138 156, 124 162
    C 110 166, 96 168, 84 160
    C 70 152, 60 138, 52 122
    C 46 108, 42 92, 44 76
    C 46 60, 54 48, 66 40
    C 78 30, 92 24, 105 22 Z
  `

  return (
    <svg viewBox="0 0 220 180" className="block h-auto w-full">
      <defs>
        <pattern id="brasilDots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="var(--border)" />
        </pattern>
      </defs>
      <rect width="220" height="180" fill="url(#brasilDots)" />
      <path
        d={path}
        fill="var(--primary)"
        fillOpacity="0.06"
        stroke="var(--primary)"
        strokeOpacity="0.35"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {estados.map((estado) => {
        const r = Math.max(4, Math.min(14, 4 + estado.total * 1.4))
        return (
          <g key={estado.uf}>
            <circle
              cx={estado.x + 20}
              cy={estado.y + 20}
              r={r + 4}
              fill="var(--primary)"
              fillOpacity="0.08"
            />
            <circle
              cx={estado.x + 20}
              cy={estado.y + 20}
              r={r}
              fill="var(--primary)"
              fillOpacity="0.85"
            />
            <text
              x={estado.x + 20}
              y={estado.y + 20}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="6.5"
              fontWeight="700"
              fill="white"
            >
              {estado.total}
            </text>
            <text
              x={estado.x + 20}
              y={estado.y + 20 + r + 7}
              textAnchor="middle"
              fontSize="6"
              fontWeight="600"
              fill="var(--foreground)"
              fillOpacity="0.7"
            >
              {estado.uf}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
