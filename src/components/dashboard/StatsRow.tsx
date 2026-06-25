interface StatItem {
  label: string
  value: string | number
}

interface StatsRowProps {
  stats: StatItem[]
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(({ label, value }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div>
            <p className="font-display text-navy text-3xl leading-none">{value}</p>
            <p className="font-mono text-mid text-xs uppercase tracking-wide mt-1">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
