'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const SLIDES = [
  { id: 0, src: '/images/hero-1.jpg', label: 'Olive Crescent · Kileleshwa · Saturday 5PM' },
  { id: 1, src: '/images/hero-2.jpg', label: 'NIS Lavington · Parklands Sports Club · Sunday 6PM' },
  { id: 2, src: '/images/hero-3.jpg', label: 'Splinters Basketball · Nairobi · Every Weekend' },
]

const GALLERY = [
  { src: '/images/court-1.jpg', district: 'Kileleshwa · Saturday 5PM', name: 'Olive Crescent International School' },
  { src: '/images/court-2.jpg', district: 'Parklands · Sunday 6PM', name: 'Parklands Sports Club' },
  { src: '/images/court-3.jpg', district: 'Lavington · Exclusive Members', name: 'Nairobi International School' },
]

export default function HomePage() {
  const [current, setCurrent] = useState(0)
  const [label, setLabel] = useState(SLIDES[0].label)
  const [labelVisible, setLabelVisible] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 8000)
  }

  useEffect(() => { resetTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current) } }, [])

  useEffect(() => {
    setLabelVisible(false)
    const t = setTimeout(() => { setLabel(SLIDES[current].label); setLabelVisible(true) }, 350)
    return () => clearTimeout(t)
  }, [current])

  const goSlide = (i) => { setCurrent(i); resetTimer() }
  const nextSlide = () => goSlide((current + 1) % SLIDES.length)
  const prevSlide = () => goSlide((current - 1 + SLIDES.length) % SLIDES.length)

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 right-0 w-[272px] h-full bg-white border-l border-gray-200 z-50 flex flex-col pt-[72px] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <ul className="flex-1">
          {['Courts','Schedule','Community','About'].map(item => (
            <li key={item} className="border-b border-gray-100">
              <a href={`#${item.toLowerCase()}`} className="block px-7 py-4 text-[15px] font-medium text-gray-800 hover:text-[#F4622A] transition-colors" onClick={() => setSidebarOpen(false)}>{item}</a>
            </li>
          ))}
          <li className="border-b border-gray-100"><Link href="/auth/register" className="block px-7 py-4 text-[15px] font-medium text-gray-800 hover:text-[#F4622A]" onClick={() => setSidebarOpen(false)}>Join Free</Link></li>
        </ul>
        <div className="p-7 flex flex-col gap-3">
          <Link href="/auth/login" className="block text-center px-5 py-2.5 text-sm font-medium text-[#1B2B6B] border-[1.5px] border-gray-200 hover:border-[#1B2B6B] transition-colors">Sign In</Link>
          <Link href="/auth/register" className="block text-center px-5 py-2.5 text-sm font-semibold text-white bg-[#F4622A] hover:bg-[#D4501F] transition-colors">Join Free</Link>
        </div>
      </aside>

      <nav className={`fixed top-0 left-0 right-0 z-30 bg-white/97 backdrop-blur-md transition-all duration-300 ${scrolled ? 'border-b border-gray-200 shadow-sm' : ''}`}>
        <div className="max-w-[1160px] mx-auto px-8 h-[68px] flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image src="/Splintersbasketball.png" alt="Splinters Basketball" width={44} height={44} className="h-11 w-auto" />
            <span style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:'26px', letterSpacing:'0.08em', color:'#1B2B6B'}}>Splinters</span>
          </Link>
          <ul className="hidden md:flex items-center gap-0.5 flex-1">
            {['Courts','Schedule','Community','About'].map(item => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="block px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-[#1B2B6B] transition-colors relative group">
                  {item}
                  <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-[#F4622A] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden md:flex items-center gap-2.5 ml-auto">
            <Link href="/auth/login" className="px-[18px] py-2 text-[13px] font-medium text-[#1B2B6B] border-[1.5px] border-gray-200 hover:border-[#1B2B6B] transition-colors">Sign In</Link>
            <Link href="/auth/register" className="px-5 py-2 text-[13px] font-semibold text-white bg-[#F4622A] hover:bg-[#D4501F] transition-colors">Join Free</Link>
          </div>
          <button className="md:hidden ml-auto flex flex-col gap-[5px] p-2" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
            <span className={`block w-[22px] h-0.5 bg-[#1B2B6B] transition-all ${sidebarOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block w-[22px] h-0.5 bg-[#1B2B6B] transition-all ${sidebarOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-[22px] h-0.5 bg-[#1B2B6B] transition-all ${sidebarOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <main>
        <section id="hero" style={{paddingTop:'68px', background:'#1B2B6B'}}>
          <div className="relative w-full overflow-hidden" style={{height:'58vh', minHeight:'300px', maxHeight:'560px'}}>
            {SLIDES.map((slide, i) => (
              <div key={slide.id} className="absolute inset-0 transition-opacity duration-[1200ms]" style={{opacity: i === current ? 1 : 0}}>
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url(${slide.src})`}} />
                <div className="absolute inset-0" style={{background:'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 35%, rgba(27,43,107,0.55) 85%, rgba(27,43,107,0.95) 100%)'}} />
              </div>
            ))}
            <button onClick={prevSlide} className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center text-white text-xl border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-[#F4622A] hover:border-[#F4622A] transition-all">&#8249;</button>
            <button onClick={nextSlide} className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center text-white text-xl border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-[#F4622A] hover:border-[#F4622A] transition-all">&#8250;</button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 items-center">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => goSlide(i)} className="h-1.5 rounded-full transition-all duration-300" style={{width: i===current?'22px':'7px', background: i===current?'#F4622A':'rgba(255,255,255,0.35)'}} />
              ))}
            </div>
          </div>

          <div className="bg-[#1B2B6B] px-8 pt-9 pb-12">
            <div className="max-w-[1160px] mx-auto">
              <p className="flex items-center gap-2.5 mb-3.5 transition-opacity duration-350" style={{fontFamily:"'Space Mono', monospace", fontSize:'10px', letterSpacing:'0.22em', textTransform:'uppercase', color:'#F4622A', opacity: labelVisible ? 1 : 0}}>
                <span className="block w-6 h-0.5 bg-[#F4622A] flex-shrink-0" />{label}
              </p>
              <h1 className="text-white leading-[0.93] mb-[18px]" style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(52px, 8vw, 100px)', letterSpacing:'0.01em'}}>
                FIND YOUR<br /><span className="text-[#F4622A]">COURT.</span>
              </h1>
              <p className="text-white/65 text-[15px] leading-[1.75] mb-7 max-w-[480px]">
                31 verified basketball courts across Nairobi. Weekend runs every Saturday at 5PM and Sunday at 6PM. Join the community.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/auth/register" className="inline-block px-8 py-3.5 bg-[#F4622A] text-white text-[13px] font-bold tracking-[0.07em] uppercase hover:bg-[#D4501F] transition-colors">Join Free →</Link>
                <Link href="/auth/login" className="inline-block px-8 py-3.5 text-white/80 text-[13px] font-semibold tracking-[0.07em] uppercase border-[1.5px] border-white/30 hover:border-white/70 hover:text-white transition-all">Sign In</Link>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-[#1B2B6B] border-t border-white/10 py-2.5 overflow-hidden whitespace-nowrap" aria-hidden="true">
          <div className="inline-flex" style={{animation:'scroll 24s linear infinite'}}>
            {[...Array(2)].map((_, rep) => (
              <span key={rep} className="inline-flex">
                {['🏀 Saturday 5PM · Olive Crescent, Kileleshwa','Sunday 6PM · Parklands or NIS Lavington','KES 2,000 / month','31 courts mapped across Nairobi','M-Pesa Paybill 880100 · payslinters25','Supporting Kenya Basketball Federation'].map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-3.5 px-9" style={{fontFamily:"'Space Mono', monospace", fontSize:'10px', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.7)'}}>
                    {item}<span className="w-1 h-1 rounded-full bg-white/25 flex-shrink-0" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <section id="about" className="py-24 bg-white">
          <div className="max-w-[1160px] mx-auto px-8">
            <div className="grid md:grid-cols-2 gap-24 items-center">
              <div>
                <p className="flex items-center gap-2.5 mb-4" style={{fontFamily:"'Space Mono', monospace", fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#F4622A'}}>
                  <span className="block w-5 h-0.5 bg-[#F4622A]" />About Splinters
                </p>
                <h2 className="mb-5 leading-[1.02]" style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(38px, 4.5vw, 58px)', letterSpacing:'0.02em', color:'#1B2B6B'}}>
                  WE CONNECT PEOPLE TO BASKETBALL <span className="text-[#F4622A]">COURTS</span> NEAR THEM
                </h2>
                <p className="text-[15px] text-gray-500 leading-[1.8] mb-8 max-w-[480px]">
                  Splinters maps 31 verified basketball courts across Nairobi. Members get access to weekly polls, the court map, and a community of ballers who show up every Saturday at 5PM and Sunday at 6PM, rain or shine.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/auth/register" className="inline-block px-7 py-3 bg-[#F4622A] text-white text-[13px] font-bold tracking-[0.05em] uppercase hover:bg-[#D4501F] transition-colors">Register for Free</Link>
                  <Link href="/auth/register" className="inline-flex items-center gap-2.5 px-5 py-3 bg-white text-gray-700 text-[13px] font-medium border-[1.5px] border-gray-200 hover:border-gray-400 transition-all">
                    <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-0.5 bg-gray-200">
                {[{num:'31',label:'Courts Mapped'},{num:'8',label:'Districts'},{num:'2',label:'Runs / Weekend'},{num:'2025',label:'Est. Nairobi'}].map(s => (
                  <div key={s.label} className="bg-white p-8">
                    <div style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:'52px', letterSpacing:'0.02em', color:'#F4622A', lineHeight:1}}>{s.num}</div>
                    <div style={{fontFamily:"'Space Mono', monospace", fontSize:'9px', letterSpacing:'0.18em', textTransform:'uppercase', color:'#888', marginTop:'6px'}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="schedule" className="py-14 bg-[#1B2B6B]">
          <div className="max-w-[1160px] mx-auto px-8">
            <p className="flex items-center gap-2.5 mb-7" style={{fontFamily:"'Space Mono', monospace", fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)'}}>
              <span className="block w-5 h-0.5 bg-[#F4622A]" />Weekly Schedule
            </p>
            <h2 className="text-white mb-9 leading-none" style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(38px, 4.5vw, 58px)', letterSpacing:'0.02em'}}>
              WHERE <span className="text-[#F4622A]">WE RUN</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-0.5">
              {[{day:'Every Saturday',time:'5:00 PM',venue:'Olive Crescent International School',loc:'Kileleshwa, Nairobi'},{day:'Every Sunday',time:'6:00 PM',venue:'Parklands Sports Club / NIS Lavington',loc:'Rotating weekly · Check the poll'}].map(s => (
                <div key={s.day} className="p-9 border border-white/10 bg-white/[0.03]">
                  <p style={{fontFamily:"'Space Mono', monospace", fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#F4622A', marginBottom:'12px'}}>{s.day}</p>
                  <p className="text-white leading-none mb-2" style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:'48px', letterSpacing:'0.02em'}}>{s.time}</p>
                  <p className="text-white/65 text-[14px] mb-1">{s.venue}</p>
                  <p style={{fontFamily:"'Space Mono', monospace", fontSize:'12px', letterSpacing:'0.05em', color:'rgba(255,255,255,0.38)'}}>{s.loc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="courts" className="pt-24 bg-white">
          <div className="max-w-[1160px] mx-auto px-8 mb-10">
            <p className="flex items-center gap-2.5 mb-4" style={{fontFamily:"'Space Mono', monospace", fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'#F4622A'}}>
              <span className="block w-5 h-0.5 bg-[#F4622A]" />Our Courts
            </p>
            <h2 style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(38px, 4.5vw, 58px)', letterSpacing:'0.02em', color:'#1B2B6B'}}>WHERE WE PLAY</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-[3px]">
            {GALLERY.map((c, i) => (
              <div key={i} className="relative overflow-hidden group" style={{aspectRatio:'3/4'}}>
                <div className="absolute inset-0 bg-cover transition-transform duration-500 group-hover:scale-105" style={{backgroundImage:`url(${c.src})`, backgroundPosition:'center top'}} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:'linear-gradient(to top, rgba(10,10,40,0.92) 0%, transparent 52%)'}} />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300">
                  <p style={{fontFamily:"'Space Mono', monospace", fontSize:'9px', letterSpacing:'0.16em', textTransform:'uppercase', color:'#F4622A', marginBottom:'4px'}}>{c.district}</p>
                  <p className="text-white text-[14px] font-semibold">{c.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-28 bg-white">
          <div className="max-w-[1160px] mx-auto px-8 text-center">
            <div className="max-w-[560px] mx-auto">
              <p className="flex items-center justify-center gap-4 mb-5" style={{fontFamily:"'Space Mono', monospace", fontSize:'10px', letterSpacing:'0.22em', textTransform:'uppercase', color:'#F4622A'}}>
                <span className="block w-9 h-px bg-[#F4622A]" />Join the Community<span className="block w-9 h-px bg-[#F4622A]" />
              </p>
              <h2 className="mb-5 leading-[0.95]" style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(52px, 7vw, 88px)', letterSpacing:'0.02em', color:'#1B2B6B'}}>
                LOG IN AND FIND A<br /><span style={{color:'#F4622A'}}>PICKUP GAME.</span>
              </h2>
              <p className="text-[15px] text-gray-400 leading-[1.75] mb-10 max-w-[420px] mx-auto">
                Every Saturday and Sunday, Nairobi ballers vote on who is showing up. Sign in, cast your vote, and do not miss the run.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/auth/login" className="inline-block px-10 py-3.5 bg-[#F4622A] text-white text-[13px] font-bold tracking-[0.07em] uppercase hover:bg-[#D4501F] transition-colors">Log In →</Link>
                <Link href="/auth/register" className="inline-block px-10 py-3.5 text-[#1B2B6B] text-[13px] font-bold tracking-[0.07em] uppercase border-[1.5px] border-[#1B2B6B] hover:bg-[#1B2B6B] hover:text-white transition-all">Create Account</Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-[#1B2B6B] pt-14 pb-8">
          <div className="max-w-[1160px] mx-auto px-8">
            <div className="flex flex-wrap justify-between gap-12 mb-12">
              <div>
                <div className="flex items-center gap-2.5 mb-3.5">
                  <Image src="/Splintersbasketball.png" alt="Splinters" width={48} height={48} className="h-12 w-auto brightness-0 invert opacity-90" />
                  <span style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:'28px', letterSpacing:'0.08em', color:'#ffffff'}}>Splinters</span>
                </div>
                <p className="text-white/45 text-[13px] leading-relaxed max-w-[220px] mb-5">Every basketball court in Nairobi, mapped. Discover, join the community, and play.</p>
                <div className="flex gap-1.5">
                  <a href="https://www.instagram.com/splinters_basketball_" target="_blank" rel="noopener noreferrer" className="w-[34px] h-[34px] flex items-center justify-center text-white/50 border border-white/15 hover:bg-[#F4622A] hover:border-[#F4622A] hover:text-white transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="https://www.tiktok.com/@splintersbasketball_ke" target="_blank" rel="noopener noreferrer" className="w-[34px] h-[34px] flex items-center justify-center text-white/50 border border-white/15 hover:bg-[#F4622A] hover:border-[#F4622A] hover:text-white transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.02-.08z"/></svg>
                  </a>
                  <a href="https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS" target="_blank" rel="noopener noreferrer" className="w-[34px] h-[34px] flex items-center justify-center text-white/50 border border-white/15 hover:bg-[#F4622A] hover:border-[#F4622A] hover:text-white transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                </div>
              </div>
              <div className="flex gap-14 flex-wrap">
                {[
                  {title:'Courts', links:[['Olive Crescent','#'],['Parklands Sports Club','#'],['NIS Lavington','#'],['View All 31 Courts','#']]},
                  {title:'Community', links:[['Weekend Poll','/poll'],['Join WhatsApp','https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS'],['Dashboard','/dashboard'],['Membership','/auth/register']]},
                  {title:'Kenya Basketball', links:[['KBF Official','https://kenyabasketballfederation.org'],['About Splinters','#about'],['Contact','mailto:basketballsplinter@gmail.com'],['Privacy','/privacy']]},
                ].map(col => (
                  <div key={col.title}>
                    <p className="mb-4" style={{fontFamily:"'Space Mono', monospace", fontSize:'9px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)'}}>{col.title}</p>
                    <ul className="flex flex-col gap-2.5">
                      {col.links.map(([label, href]) => (
                        <li key={label}><a href={href} className="text-[13px] text-white/60 hover:text-[#F4622A] transition-colors">{label}</a></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between items-center gap-4">
              <p className="text-[12px] text-white/30">© 2025 Splinters Basketball · Nairobi, Kenya · <a href="mailto:basketballsplinter@gmail.com" className="text-[#F4622A] hover:underline">basketballsplinter@gmail.com</a></p>
              <div className="flex items-center gap-5 flex-wrap">
                {[{label:'M-Pesa Paybill',val:'880100'},{label:'Account',val:'payslinters25'},{label:'Monthly',val:'KES 2,000'}].map((item, i) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {i > 0 && <span className="w-px h-4 bg-white/15" />}
                    <span style={{fontFamily:"'Space Mono', monospace", fontSize:'9px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)'}}>{item.label}</span>
                    <span style={{fontFamily:"'Space Mono', monospace", fontSize:'13px', fontWeight:700, color:'#F4622A'}}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </>
  )
}
