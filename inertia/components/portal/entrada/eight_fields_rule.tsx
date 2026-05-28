const FIELDS = ['situação', 'ocupação', 'setor', 'vínculo', 'salário', 'município', 'pós-grad', 'contato']

/**
 * Typographic "ruler" of the 8 MEC fields. Hints at the once-a-year gesture of
 * confirming data without turning into a form or feature list. Marks are
 * uniform — this is the public page, the visitor hasn't started anything.
 */
export function EightFieldsRule() {
  return (
    <div className="mt-10 w-full max-w-2xl">
      <div className="flex items-start justify-between gap-1">
        {FIELDS.map((label) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-2">
            <span className="h-3 w-px bg-border" />
            <span className="hidden whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground md:block">
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-col gap-1 text-xs uppercase tracking-wide text-muted-foreground/80 sm:flex-row sm:items-center sm:justify-between">
        <span>os 8 campos do MEC</span>
        <span>≈ 30 segundos · 1× por ano</span>
      </div>
    </div>
  )
}
