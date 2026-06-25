import { cn } from '@/lib/utils'
import type { VoteChoice } from '@/types'

interface VoteOptionProps {
  choice: VoteChoice
  count: number
  total: number
  selected: boolean
  disabled: boolean
  onVote: (choice: VoteChoice) => void
}

const CONFIG: Record<VoteChoice, { label: string; emoji: string; color: string; bg: string; bar: string }> = {
  yes:   { label: 'In',    emoji: '✅', color: 'text-green-700',  bg: 'bg-green-50  border-green-200',  bar: 'bg-green-500' },
  maybe: { label: 'Maybe', emoji: '❓', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', bar: 'bg-yellow-400' },
  no:    { label: 'Out',   emoji: '❌', color: 'text-red-700',    bg: 'bg-red-50    border-red-200',    bar: 'bg-red-400' },
}

export function VoteOption({ choice, count, total, selected, disabled, onVote }: VoteOptionProps) {
  const { label, emoji, color, bg, bar } = CONFIG[choice]
  const pct = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <button
      onClick={() => !disabled && onVote(choice)}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'w-full text-left rounded-lg border-2 px-4 py-3.5 transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2',
        selected
          ? cn(bg, 'border-current shadow-sm scale-[1.01]')
          : 'border-gray-100 bg-white hover:border-gray-300',
        disabled && !selected && 'cursor-default opacity-80',
        disabled && selected && 'cursor-default'
      )}
    >
      <div className="flex items-center justify-between mb-2.5">
        {/* Left: emoji + label */}
        <div className="flex items-center gap-2.5">
          <span className="text-lg" aria-hidden="true">{emoji}</span>
          <span className={cn('font-semibold text-sm font-sans', selected ? color : 'text-navy')}>
            {label}
          </span>
          {selected && (
            <span className={cn('font-mono text-xs uppercase tracking-wide', color)}>
              · Your vote
            </span>
          )}
        </div>

        {/* Right: count + pct */}
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm font-semibold text-navy">{count}</span>
          <span className="font-mono text-xs text-mid">{pct}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="vote-bar">
        <div
          className={cn('vote-bar-fill', bar)}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </button>
  )
}
