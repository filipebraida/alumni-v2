import { cn } from '~/lib/utils'

const FIELDS = ['situação', 'ocupação', 'setor', 'vínculo', 'salário', 'município', 'pós-grad', 'contato']

/**
 * Typographic "ruler" of the 8 MEC fields. Hints at the once-a-year gesture of
 * confirming data without turning into a form or feature list. The first two
 * marks are filled to suggest "you already started".
 */
export function EightFieldsRule() {
  return (
    <div className="mt-10 w-full max-w-2xl">
      <div className="flex items-start justify-between gap-1">
        {FIELDS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-2">
            <span className={cn('h-3 w-px', i < 2 ? 'bg-foreground/80' : 'bg-border')} />
            <span className="hidden whitespace-nowrap text-xs uppercase tracking-widest text-muted-foreground sm:block">
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground/80">
        <span>os 8 campos do MEC</span>
        <span>≈ 30 segundos · 1× por ano</span>
      </div>
    </div>
  )
}
