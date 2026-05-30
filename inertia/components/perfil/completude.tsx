type Props = {
  preenchidos: number
  total: number
}

/**
 * Ring de progresso da completude do perfil. SVG cru porque o `Progress`
 * primitivo do projeto é linear; aqui queremos circular com o número no
 * meio. Raio fixo (22) para casar com o tamanho 56x56.
 */
export function PerfilCompletude({ preenchidos, total }: Props) {
  const pct = total > 0 ? Math.round((preenchidos / total) * 100) : 0
  const r = 22
  const c = 2 * Math.PI * r

  return (
    <div className="flex items-center gap-3">
      <div className="relative grid size-14 shrink-0 place-items-center">
        <svg viewBox="0 0 56 56" className="size-14 -rotate-90">
          <title>{`${pct}% completo`}</title>
          <circle cx="28" cy="28" r={r} fill="none" stroke="var(--secondary)" strokeWidth="6" />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (c * pct) / 100}
          />
        </svg>
        <span className="absolute font-semibold text-xs tabular-nums">{pct}%</span>
      </div>
      <div>
        <div className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Completude
        </div>
        <div className="mt-0.5 font-semibold text-sm leading-tight">
          <span className="tabular-nums">{preenchidos}</span> de {total} campos
        </div>
      </div>
    </div>
  )
}
