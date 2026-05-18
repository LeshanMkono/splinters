'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const C = {
  bg: '#FFFFFF', orange: '#E8570C', text: '#111111',
  muted: '#666666', card: '#F8F8F8', border: '#E8E8E8',
  green: '#4CAF50', red: '#DC2626',
};

const QUESTIONS = [
  { q: 'How many verified basketball courts are listed on Splinters?', options: ['18', '24', '31', '42'], answer: 2 },
  { q: 'How many districts does Splinters cover across Nairobi?', options: ['8', '10', '13', '15'], answer: 2 },
  { q: 'Which is Splinters\' only exclusive indoor court?', options: ['Parklands Sports Club', 'Nairobi International School', 'Olive Crescent', 'Karura Forest'], answer: 1 },
  { q: 'What is Splinters\' monthly fee for Elite membership?', options: ['KES 1,500', 'KES 2,000', 'KES 2,500', 'KES 3,000'], answer: 3 },
  { q: 'How many padel venues are listed on Splinters?', options: ['9', '13', '17', '22'], answer: 2 },
  { q: 'What colour represents padel courts on Splinters?', options: ['Blue', 'Green', 'Purple', 'Yellow'], answer: 1 },
  { q: 'What is Splinters\' official tagline?', options: ['Hoop Nairobi', 'Play The City', 'Connecting You To The Game', 'Find Your Court'], answer: 2 },
  { q: 'Parklands Sports Club exclusive sessions run on which day?', options: ['Friday', 'Saturday', 'Sunday', 'Monday'], answer: 1 },
  { q: 'Which district is the Parklands Sports Club court in?', options: ['Westlands', 'Kasarani', 'Parklands', 'Karen'], answer: 2 },
  { q: 'How many exclusive courts do Elite members unlock?', options: ['1', '2', '3', '5'], answer: 2 },
];

const GAME_CARDS = [
  { id: 'courtiq', badge: 'TRIVIA', emoji: '🏀', title: 'COURT IQ', sub: 'Know Your Nairobi Courts', desc: '10 questions about Splinters courts, districts & membership. How well do you know the game?', live: true },
  { id: 'hoopiq', badge: 'COMING SOON', emoji: '🧠', title: 'HOOP IQ', sub: 'Basketball Africa & Global', desc: 'Test your knowledge of African basketball history, players, and the global game.', live: false },
  { id: 'sprint', badge: 'COMING SOON', emoji: '⏱️', title: '60 SECOND SPRINT', sub: 'Name The Courts', desc: 'How many Nairobi basketball courts can you name in 60 seconds? Challenge your crew.', live: false },
  { id: 'spot', badge: 'COMING SOON', emoji: '📍', title: 'SPOT THE DISTRICT', sub: 'Court Location Quiz', desc: 'Given a clue about a court, guess which district it\'s in. Locals only.', live: false },
];

type Phase = 'hub' | 'playing' | 'results';

export default function PlayPage() {
  const [phase, setPhase] = useState<Phase>('hub');
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  const current = QUESTIONS[qIndex];

  const nextQuestion = useCallback((wasCorrect: boolean) => {
    setTimerActive(false);
    const newAnswers = [...answers, wasCorrect];
    setAnswers(newAnswers);
    if (wasCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (qIndex + 1 >= QUESTIONS.length) { setPhase('results'); }
      else { setQIndex(i => i + 1); setSelected(null); setTimeLeft(15); setTimerActive(true); }
    }, 900);
  }, [answers, qIndex]);

  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft === 0) { nextQuestion(false); return; }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft, nextQuestion]);

  function startGame() {
    setPhase('playing'); setQIndex(0); setSelected(null);
    setScore(0); setAnswers([]); setTimeLeft(15); setTimerActive(true);
  }

  function resetToHub() { setPhase('hub'); setTimerActive(false); }

  const pct = Math.round((score / QUESTIONS.length) * 100);
  const grade = pct >= 90 ? 'COURT LEGEND 👑' : pct >= 70 ? 'BALLER 🔥' : pct >= 50 ? 'GETTING THERE 💪' : 'NEED MORE RUNS 😅';

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <section style={{
        borderBottom: `1px solid ${C.border}`,
        padding: '90px 24px 44px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #FFF5F0 0%, #FFFFFF 100%)',
      }}>
        <p style={{ color: C.orange, fontSize: 11, fontWeight: 700, letterSpacing: 4, marginBottom: 10 }}>SPLINTERS</p>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(64px, 12vw, 110px)', letterSpacing: 6, margin: 0, lineHeight: 1, color: '#111' }}>
          PLAY
        </h1>
        <p style={{ color: C.muted, marginTop: 12, fontSize: 16 }}>
          Trivia, challenges & games for Nairobi hoopers
        </p>
      </section>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* HUB */}
        {phase === 'hub' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, margin: 0, color: '#111' }}>
                🏆 TOP GAMES
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
              {GAME_CARDS.map(g => (
                <div key={g.id}
                  onClick={() => g.live && startGame()}
                  style={{
                    background: '#fff', borderRadius: 16, overflow: 'hidden',
                    border: `1px solid ${C.border}`,
                    cursor: g.live ? 'pointer' : 'default',
                    opacity: g.live ? 1 : 0.55,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => { if (g.live) { e.currentTarget.style.boxShadow = '0 8px 32px rgba(232,87,12,0.14)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>

                  <div style={{
                    background: g.live ? `linear-gradient(135deg, rgba(232,87,12,0.12), #FFF5F0)` : '#F8F8F8',
                    height: 140,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <span style={{ fontSize: 48 }}>{g.emoji}</span>
                    <span style={{
                      position: 'absolute', top: 12, left: 12,
                      background: g.live ? C.orange : '#999',
                      color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: 2,
                      padding: '4px 10px', borderRadius: 4,
                    }}>{g.badge}</span>
                  </div>

                  <div style={{ padding: '18px 20px 22px' }}>
                    <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 2, margin: '0 0 2px', color: g.live ? C.orange : '#999' }}>
                      {g.title}
                    </h3>
                    <p style={{ color: '#999', fontSize: 11, fontWeight: 700, letterSpacing: 1, margin: '0 0 10px', textTransform: 'uppercase' }}>{g.sub}</p>
                    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.55, margin: 0 }}>{g.desc}</p>
                    {g.live && (
                      <button onClick={e => { e.stopPropagation(); startGame(); }}
                        style={{
                          marginTop: 18, background: C.orange, color: '#fff',
                          border: 'none', borderRadius: 8, padding: '11px 0',
                          fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: 2,
                          cursor: 'pointer', width: '100%',
                        }}>PLAY NOW →</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PLAYING */}
        {phase === 'playing' && (
          <div style={{ maxWidth: 620, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ color: C.muted, fontSize: 14 }}>
                Question <strong style={{ color: '#111' }}>{qIndex + 1}</strong> / {QUESTIONS.length}
              </span>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                border: `3px solid ${timeLeft <= 5 ? C.red : C.orange}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 15,
                color: timeLeft <= 5 ? C.red : C.orange,
              }}>{timeLeft}</div>
            </div>

            <div style={{ height: 5, background: C.border, borderRadius: 3, marginBottom: 32 }}>
              <div style={{ height: 5, background: C.orange, borderRadius: 3, width: `${(qIndex / QUESTIONS.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>

            <div style={{ background: '#FFF5F0', borderRadius: 16, padding: '30px 28px', border: `1px solid rgba(232,87,12,0.15)`, marginBottom: 18 }}>
              <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, letterSpacing: 1, lineHeight: 1.25, margin: 0, color: '#111' }}>{current.q}</p>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {current.options.map((opt, i) => {
                let bg = '#fff', border = C.border, textColor = '#111';
                if (selected !== null) {
                  if (i === current.answer) { bg = '#F0FDF4'; border = C.green; }
                  else if (i === selected) { bg = '#FEF2F2'; border = C.red; textColor = C.red; }
                }
                return (
                  <button key={i} onClick={() => { if (selected === null) { setSelected(i); setTimerActive(false); nextQuestion(i === current.answer); } }}
                    style={{
                      background: bg, border: `2px solid ${border}`, borderRadius: 12,
                      padding: '15px 20px', color: textColor, fontSize: 16, fontWeight: 600,
                      textAlign: 'left', cursor: selected !== null ? 'default' : 'pointer',
                      transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 14,
                      fontFamily: 'DM Sans, sans-serif',
                    }}>
                    <span style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: border !== C.border ? border : '#F0F0F0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 900, flexShrink: 0,
                      color: border !== C.border ? '#fff' : '#666',
                    }}>{['A','B','C','D'][i]}</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <button onClick={resetToHub} style={{
              marginTop: 24, background: 'transparent', border: `1px solid ${C.border}`,
              color: C.muted, borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
            }}>← Back to Games</button>
          </div>
        )}

        {/* RESULTS */}
        {phase === 'results' && (
          <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>{pct >= 70 ? '🏆' : pct >= 50 ? '💪' : '😅'}</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, color: C.orange, letterSpacing: 2, margin: '0 0 8px' }}>{grade}</h2>
            <p style={{ color: C.muted, marginBottom: 36, fontSize: 18 }}>
              You scored <strong style={{ color: '#111', fontSize: 26 }}>{score}/{QUESTIONS.length}</strong> — {pct}%
            </p>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              {answers.map((a, i) => (
                <div key={i} style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: a ? '#F0FDF4' : '#FEF2F2',
                  border: `2px solid ${a ? C.green : C.red}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: a ? C.green : C.red, fontWeight: 700,
                }}>{a ? '✓' : '✗'}</div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={startGame} style={{
                background: C.orange, color: '#fff', border: 'none', borderRadius: 10,
                padding: '14px 32px', fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 18, letterSpacing: 2, cursor: 'pointer',
              }}>PLAY AGAIN</button>
              <button onClick={resetToHub} style={{
                background: '#fff', color: '#111', border: `1px solid ${C.border}`,
                borderRadius: 10, padding: '14px 32px', fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 18, letterSpacing: 2, cursor: 'pointer',
              }}>ALL GAMES</button>
              <Link href="/courts" style={{
                background: '#FFF5F0', color: C.orange, border: `1px solid rgba(232,87,12,0.3)`,
                borderRadius: 10, padding: '14px 32px', fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 18, letterSpacing: 2, cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
              }}>FIND A COURT</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
