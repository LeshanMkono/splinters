// Static — no client state needed
const SEGMENT =
  '\u25C6\u00A0SATURDAY 5:00\u00A0PM\u00A0\u00B7\u00A0OLIVE CRESCENT\u00A0\u00B7\u00A0KILELESHWA\u2003' +
  '\u25C6\u00A0SUNDAY 6:00\u00A0PM\u00A0\u00B7\u00A0PARKLANDS SPORTS CLUB\u2003' +
  '\u25C6\u00A0MEMBERSHIP KES\u00A02,000 / MONTH\u2003' +
  '\u25C6\u00A0PAYBILL\u00A0880100\u00A0\u00B7\u00A0ACCOUNT\u00A0PAYSLINTERS25\u2003' +
  '\u25C6\u00A0KBF AFFILIATED\u2003' +
  '\u25C6\u00A0NAIROBI BASKETBALL COMMUNITY\u2003'

export function Ticker() {
  return (
    <div
      className="bg-navy overflow-hidden py-3 border-y border-white/10"
      aria-hidden="true"
    >
      {/* Two copies of the segment so the loop is seamless */}
      <div className="ticker-track">
        {[0, 1].map(i => (
          <span
            key={i}
            className="inline-block px-0 font-mono text-orange text-xs uppercase tracking-widest"
          >
            {SEGMENT}
          </span>
        ))}
      </div>
    </div>
  )
}
