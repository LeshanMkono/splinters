import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image src="/images/Splintersbasketball.png" alt="Splinters" width={36} height={36} className="rounded" />
            <span className="font-display text-xl tracking-widest">SPLINTERS</span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed max-w-xs">
            Nairobi&apos;s pickup basketball community. Every Saturday &amp; Sunday at Olive Crescent, Kileleshwa.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">Community</p>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href="/courts" className="hover:text-orange transition-colors">Find Courts</Link></li>
            <li><Link href="/#about" className="hover:text-orange transition-colors">About Splinters</Link></li>
            <li><Link href="/#schedule" className="hover:text-orange transition-colors">Schedule</Link></li>
            <li>
              <a href="https://kbf.co.ke" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors">
                Kenya Basketball Federation
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">Members</p>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href="/auth/login" className="hover:text-orange transition-colors">Sign In</Link></li>
            <li><Link href="/auth/register" className="hover:text-orange transition-colors">Join Free</Link></li>
            <li><Link href="/dashboard" className="hover:text-orange transition-colors">Dashboard</Link></li>
            <li><Link href="/auth/payment" className="hover:text-orange transition-colors">Pay Membership</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30 font-mono">
          <span>© {new Date().getFullYear()} Splinters Basketball. Nairobi, Kenya.</span>
          <span>splinters.co.ke</span>
        </div>
      </div>
    </footer>
  )
}
