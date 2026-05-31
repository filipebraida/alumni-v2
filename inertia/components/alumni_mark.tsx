import { useId } from 'react'
import { cn } from '~/lib/utils'

type Variant = 'light' | 'dark'

const PALETTES = {
  light: {
    petals: ['#0A5E91', '#1E9BD6', '#3FA255', '#7BD08A', '#3FA255', '#1E9BD6', '#0A5E91'],
    stemA: '#163E28',
    stemB: '#2E6B3E',
    leafA: '#5FA84F',
    leafB: '#1F4A30',
    vein: '#163E28',
    core: '#F5A623',
    pstroke: '#fff',
  },
  dark: {
    petals: ['#3A93D6', '#62C8F2', '#54C07E', '#9CE0A6', '#54C07E', '#62C8F2', '#3A93D6'],
    stemA: '#3E7A4A',
    stemB: '#6FB85C',
    leafA: '#8FD06E',
    leafB: '#3E7A4A',
    vein: '#0c2417',
    core: '#FFC857',
    pstroke: 'rgba(255,255,255,.92)',
  },
} as const

const CX = 50
const CY = 47
const N = 7
const SPAN = 150
const L_MAX = 30

function petalPath(L: number) {
  const w = L * 0.265
  const tip = -L
  return `M 0 0 C ${(-w * 0.95).toFixed(3)} ${(-L * 0.3).toFixed(2)}, ${(-w * 0.5).toFixed(3)} ${(-L * 0.94).toFixed(2)}, 0 ${tip} C ${(w * 0.5).toFixed(3)} ${(-L * 0.94).toFixed(2)}, ${(w * 0.95).toFixed(3)} ${(-L * 0.3).toFixed(2)}, 0 0 Z`
}

/**
 * Símbolo da marca "alumni" do SAE UFRRJ: caule + duas folhas (raiz, formação
 * Rural) e flor de sete pétalas em degradê (egresso que floresce). Construído
 * com a gramática de arcos e segmentos do manual da UFRRJ. Variante `dark`
 * usa paleta clareada para superfícies escuras.
 */
export function AlumniMark({
  variant = 'light',
  size = 32,
  className,
  title = 'alumni · SAE UFRRJ',
}: {
  variant?: Variant
  size?: number
  className?: string
  title?: string
}) {
  const uid = useId().replace(/:/g, '')
  const p = PALETTES[variant]

  const petals = Array.from({ length: N }, (_, i) => {
    const ang = -SPAN / 2 + i * (SPAN / (N - 1))
    const L = L_MAX * (0.74 + 0.26 * Math.cos((ang * Math.PI) / 180))
    return (
      <path
        key={i}
        d={petalPath(L)}
        transform={`translate(${CX} ${CY}) rotate(${ang})`}
        fill={p.petals[i]}
        stroke={p.pstroke}
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
    )
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={cn('shrink-0', className)}
    >
      <title>{title}</title>
      <defs>
        <linearGradient
          id={`${uid}-stem`}
          x1="0"
          y1="80"
          x2="0"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={p.stemB} />
          <stop offset="1" stopColor={p.stemA} />
        </linearGradient>
        <linearGradient
          id={`${uid}-leaf`}
          x1="0"
          y1="80"
          x2="0"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={p.leafA} />
          <stop offset="1" stopColor={p.leafB} />
        </linearGradient>
      </defs>

      <path
        d="M 48.5 48.5 C 47.8 59, 49.3 68, 49 80 L 51 80 C 50.7 68, 52.2 59, 51.5 48.5 Z"
        fill={`url(#${uid}-stem)`}
      />
      <path d="M 50 63 C 37 60, 26 66, 21 79 C 34 77, 45 72, 50 63 Z" fill={`url(#${uid}-leaf)`} />
      <path
        d="M 47.5 65 C 38 68, 30 72, 24.5 78"
        fill="none"
        stroke={p.vein}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.5}
      />
      <path d="M 50 63 C 63 60, 74 66, 79 79 C 66 77, 55 72, 50 63 Z" fill={`url(#${uid}-leaf)`} />
      <path
        d="M 52.5 65 C 62 68, 70 72, 75.5 78"
        fill="none"
        stroke={p.vein}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.5}
      />

      {petals}

      <circle cx={CX} cy={CY - 1} r={3.3} fill={p.core} stroke={p.pstroke} strokeWidth={0.8} />
    </svg>
  )
}
