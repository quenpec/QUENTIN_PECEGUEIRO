import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

type Tab = 'accueil' | 'presentation' | 'parcours' | 'activite-pro' | 'activite-perso' | 'competences' | 'galerie' | 'cv' | 'projets'

const C = {
  bg:    '#f0f6fc',
  card:  '#ffffff',
  border:'#cfe0f0',
  blue:  '#0e4f8c',
  teal:  '#0891b2',
  light: '#e8f3fb',
  text:  '#0c2340',
  muted: '#3d6185',
  faint: '#7da5c4',
  serif: "'Playfair Display', serif",
  sans:  "'DM Sans', sans-serif",
  mono:  "'DM Mono', monospace",
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'accueil',        label: 'Accueil' },
  { id: 'presentation',   label: 'Présentation' },
  { id: 'parcours',       label: 'Parcours' },
  { id: 'projets',        label: 'Projets' },
  { id: 'activite-pro',   label: 'Autres Réalisations' },
  { id: 'activite-perso', label: 'Centres d’intérêt' },
  { id: 'competences',    label: 'Compétences' },
  { id: 'cv',             label: 'CV' },
  { id: 'galerie',        label: 'Galerie' },
]

// ─── Atoms ────────────────────────────────────────────────────────────────────
function Chip({ children, color = C.teal }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ fontFamily: C.mono, fontSize: 10, color, border: `1px solid ${color}50`, padding: '2px 10px', borderRadius: 2, letterSpacing: '0.06em' }}>
      {children}
    </span>
  )
}

function ScrollTopButton() {
  return (
    <button
      className="scroll-top-button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Retour en haut"
      style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 100, width: 44, height: 44, borderRadius: '50%', background: '#0e4f8c', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(14,79,140,0.30)', transition: 'background 0.2s, transform 0.2s' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#0891b2'; el.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#0e4f8c'; el.style.transform = 'translateY(0)' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
    </button>
  )
}

function ScrollDownCue({ page }: { page: Tab }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY < 120)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [page])

  return (
    <button
      type="button"
      className={`scroll-down-cue${visible ? ' is-visible' : ''}`}
      onClick={() => window.scrollBy({ top: Math.max(window.innerHeight * 0.72, 420), behavior: 'smooth' })}
      aria-label="Descendre dans la page"
      title="Descendre dans la page"
    >
      <span>Défiler</span>
      <span className="scroll-down-cue-shape" aria-hidden="true">
        <span />
      </span>
    </button>
  )
}

function PageSideDecor({ page }: { page: Tab }) {
  if (page === 'accueil') return null

  type Motif = 'airfoil' | 'assembly' | 'axes' | 'dimension' | 'gear' | 'orbit' | 'plane' | 'turbine'
  type Decoration = {
    kind: Motif
    label: string
    side: 'left' | 'right'
    top: string
    size: number
    rotate?: number
  }

  const decorations: Record<Exclude<Tab, 'accueil'>, Decoration[]> = {
    presentation: [
      { kind: 'airfoil', label: 'PROFIL NACA', side: 'left', top: '10%', size: 112, rotate: -8 },
      { kind: 'orbit', label: 'OBJECTIF 01', side: 'right', top: '34%', size: 70 },
      { kind: 'axes', label: 'REPÈRE XYZ', side: 'left', top: '67%', size: 68 },
      { kind: 'dimension', label: 'TRAJECTOIRE', side: 'right', top: '84%', size: 104 },
    ],
    parcours: [
      { kind: 'plane', label: 'CAP 2027', side: 'right', top: '9%', size: 112, rotate: -5 },
      { kind: 'orbit', label: 'EXPÉRIENCE', side: 'left', top: '31%', size: 76 },
      { kind: 'dimension', label: '3 ANNÉES', side: 'right', top: '57%', size: 106 },
      { kind: 'axes', label: 'ÉVOLUTION', side: 'left', top: '82%', size: 72 },
    ],
    projets: [
      { kind: 'gear', label: 'CONCEPTION', side: 'right', top: '7%', size: 82 },
      { kind: 'axes', label: 'CAO 3D', side: 'left', top: '25%', size: 72 },
      { kind: 'assembly', label: 'ASSEMBLAGE', side: 'right', top: '47%', size: 94 },
      { kind: 'dimension', label: 'VALIDATION', side: 'left', top: '69%', size: 108 },
      { kind: 'turbine', label: 'ITÉRATION', side: 'right', top: '88%', size: 78 },
    ],
    'activite-pro': [
      { kind: 'assembly', label: 'OUTILLAGE', side: 'left', top: '8%', size: 92 },
      { kind: 'gear', label: 'PRODUCTION', side: 'right', top: '29%', size: 80 },
      { kind: 'dimension', label: 'CONTRÔLE', side: 'left', top: '52%', size: 110 },
      { kind: 'turbine', label: 'PRÉCISION', side: 'right', top: '77%', size: 82 },
    ],
    'activite-perso': [
      { kind: 'plane', label: 'AÉRONAUTIQUE', side: 'right', top: '8%', size: 116, rotate: -7 },
      { kind: 'orbit', label: 'PASSIONS', side: 'left', top: '34%', size: 78 },
      { kind: 'airfoil', label: 'PORTANCE', side: 'right', top: '62%', size: 108, rotate: 6 },
      { kind: 'axes', label: 'DÉCOUVERTE', side: 'left', top: '84%', size: 70 },
    ],
    competences: [
      { kind: 'axes', label: 'CAO', side: 'left', top: '7%', size: 72 },
      { kind: 'gear', label: 'MÉCANIQUE', side: 'right', top: '27%', size: 84 },
      { kind: 'dimension', label: 'MÉTROLOGIE', side: 'left', top: '49%', size: 110 },
      { kind: 'turbine', label: 'MÉTHODE', side: 'right', top: '71%', size: 80 },
      { kind: 'assembly', label: 'SAVOIR-FAIRE', side: 'left', top: '89%', size: 88 },
    ],
    cv: [
      { kind: 'dimension', label: 'SYNTHÈSE', side: 'right', top: '12%', size: 108 },
      { kind: 'axes', label: 'PARCOURS', side: 'left', top: '42%', size: 72 },
      { kind: 'gear', label: 'COMPÉTENCES', side: 'right', top: '75%', size: 82 },
    ],
    galerie: [
      { kind: 'orbit', label: 'ARCHIVES', side: 'left', top: '8%', size: 76 },
      { kind: 'plane', label: 'AÉRONAUTIQUE', side: 'right', top: '29%', size: 112, rotate: -6 },
      { kind: 'gear', label: 'RÉALISATIONS', side: 'left', top: '58%', size: 82 },
      { kind: 'turbine', label: 'DÉTAILS', side: 'right', top: '83%', size: 78 },
    ],
  }

  const motifDrawing: Record<Motif, React.ReactNode> = {
    airfoil: <><path d="M8 54C30 28 68 27 93 47C66 50 35 56 8 54Z" /><path d="M13 54h74M25 44l-8-12M76 43l9-13" /></>,
    assembly: <><rect x="18" y="24" width="64" height="52" rx="4" /><circle cx="34" cy="40" r="8" /><circle cx="67" cy="60" r="10" /><path d="M42 40h25v10M18 50H7M93 50H82M50 13v11M50 76v11" /></>,
    axes: <><circle cx="45" cy="55" r="5" /><path d="M45 55V14M45 55l35 20M45 55 13 78M45 14l-5 9M45 14l5 9M80 75l-10-1M80 75l-4-9M13 78l5-9M13 78l10 1" /><text x="49" y="17">Z</text><text x="82" y="80">X</text><text x="5" y="88">Y</text></>,
    dimension: <><path d="M12 32v36M88 32v36M12 50h76M12 50l10-5M12 50l10 5M88 50l-10-5M88 50l-10 5" /><path d="M24 25h52M24 75h52" /></>,
    gear: <><circle cx="50" cy="50" r="28" /><circle cx="50" cy="50" r="10" />{Array.from({ length: 8 }, (_, index) => <path key={index} d="M47 10h6l2 13H45Z" transform={`rotate(${index * 45} 50 50)`} />)}</>,
    orbit: <><circle cx="50" cy="50" r="8" /><ellipse cx="50" cy="50" rx="40" ry="18" /><ellipse cx="50" cy="50" rx="18" ry="40" transform="rotate(38 50 50)" /><circle cx="84" cy="42" r="3" /></>,
    plane: <><path d="M8 52 41 46 58 14h9L60 44l27-4 8 6-35 9-3 29h-7l-5-26-27 7Z" /><path d="M26 49 17 37h6l16 10" /></>,
    turbine: <><circle cx="50" cy="50" r="38" /><circle cx="50" cy="50" r="11" />{Array.from({ length: 8 }, (_, index) => <path key={index} d="M50 17C59 25 62 34 58 43L50 50C47 38 43 28 50 17Z" transform={`rotate(${index * 45} 50 50)`} />)}</>,
  }

  return (
    <div className={`page-decor-layer page-decor-${page}`} aria-hidden="true">
      {decorations[page].map((decoration, index) => (
        <div
          key={`${decoration.kind}-${decoration.top}`}
          className={`technical-motif technical-motif-${decoration.kind}${['gear', 'orbit', 'turbine'].includes(decoration.kind) ? ' is-rotating' : ''}`}
          style={{
            top: decoration.top,
            [decoration.side]: 18 + (index % 2) * 12,
            width: decoration.size,
            transform: `rotate(${decoration.rotate ?? 0}deg)`,
          }}
        >
          <svg viewBox="0 0 100 100" fill="none">{motifDrawing[decoration.kind]}</svg>
          <span>{decoration.label}</span>
        </div>
      ))}
    </div>
  )
}

function SectionTitle({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div className="section-title" style={{ marginBottom: 48 }}>
      <div style={{ fontFamily: C.mono, fontSize: 11, color: C.teal, letterSpacing: '0.14em', marginBottom: 10 }}>{num}</div>
      <h2 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 'clamp(28px,4vw,44px)', color: C.text, margin: 0, lineHeight: 1.15 }}>{children}</h2>
      <div style={{ marginTop: 14, width: 48, height: 2, background: C.teal, borderRadius: 1 }} />
    </div>
  )
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
function Ticker() {
  const items = [
    '✦ BUT GMP — IUT d\'Orléans',
    '✦ Cursus BUT GMP · 3 ans d’alternance',
    '✦ CATIA V5 · Creo · Usinage CN',
    '✦ Gestion de projet',
    '✦ Bac STI2D — mention bien',
    '✦ Curieux · Appliqué · Déterminé · Patient',
    '✦ Aéronautique & Industrie',
    '✦ Service Outillage',
    '✦ Parcours à l’IUT d’Orléans',
    '✦ Anglais · Espagnol',
  ]
  // duplicate for seamless loop
  const track = [...items, ...items]

  return (
    <div style={{ background: C.blue, overflow: 'hidden', padding: '14px 0', borderTop: `1px solid ${C.border}` }}>
      <div className="ticker-track">
        {track.map((item, i) => (
          <span key={i} style={{
            fontFamily: C.mono, fontSize: 12, color: 'rgba(255,255,255,0.85)',
            letterSpacing: '0.08em', whiteSpace: 'nowrap',
            padding: '0 36px',
          }}>{item}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Accordion ───────────────────────────────────────────────────────────────
function Accordion({ header, children, accentColor = C.teal }: {
  header: React.ReactNode
  children: React.ReactNode
  accentColor?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: `1px solid ${open ? accentColor : C.border}`,
      borderRadius: 10, overflow: 'hidden',
      transition: 'border-color 0.25s',
      background: C.card,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, textAlign: 'left',
        }}
      >
        <div style={{ flex: 1 }}>{header}</div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: open ? accentColor : C.light,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s, transform 0.3s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke={open ? 'white' : accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      <div className={`accordion-body${open ? ' open' : ''}`}>
        <div>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('[data-image-lightbox="true"]')) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(12,35,64,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        className="modal-shell"
        onClick={e => e.stopPropagation()}
        style={{
          background: C.card, borderRadius: 14, overflow: 'hidden',
          maxWidth: 680, width: '100%', maxHeight: '88vh', overflowY: 'auto',
          boxShadow: '0 24px 80px rgba(12,35,64,0.28)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 10,
            background: C.light, border: 'none', cursor: 'pointer',
            width: 32, height: 32, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: C.blue, fontWeight: 700,
          }}
        >×</button>
        {children}
      </div>
    </div>
  )
}

function ZoomableImage({
  src,
  alt,
  imageStyle,
  containerStyle,
  loading,
}: {
  src: string
  alt: string
  imageStyle?: React.CSSProperties
  containerStyle?: React.CSSProperties
  loading?: 'eager' | 'lazy'
}) {
  const [open, setOpen] = useState(false)
  const cropClass = src === '/GABARIT_LISSAGE.png'
    ? 'crop-gabarit-lissage'
    : src === '/OT_POINT_EPURE.png'
      ? 'crop-point-epure'
      : ''

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <>
      <div className={`zoomable-image ${cropClass}`} style={containerStyle}>
        <img src={src} alt={alt} loading={loading} style={imageStyle} />
        <button
          type="button"
          className="zoomable-image-button"
          aria-label={`Agrandir l’image : ${alt}`}
          title="Agrandir l’image"
          onClick={event => {
            event.preventDefault()
            event.stopPropagation()
            setOpen(true)
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4M11 8v6M8 11h6" />
          </svg>
          <span>Agrandir</span>
        </button>
      </div>

      {open && createPortal(
        <div
          data-image-lightbox="true"
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Image agrandie : ${alt}`}
          onClick={event => {
            event.stopPropagation()
            setOpen(false)
          }}
        >
          <button
            type="button"
            className="image-lightbox-close"
            aria-label="Fermer l’image agrandie"
            onClick={event => {
              event.stopPropagation()
              setOpen(false)
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <div className="image-lightbox-content" onClick={event => event.stopPropagation()}>
            {cropClass ? (
              <div className={`image-lightbox-crop ${cropClass}`}>
                <img src={src} alt={alt} />
              </div>
            ) : (
              <img src={src} alt={alt} />
            )}
            <p>{alt}</p>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

// ─── Animated plane — silhouette Airbus A320 ─────────────────────────────────
function AnimatedPlane() {
  return (
    <>
      <style>{`
        @keyframes flyAirbus {
          0%   { transform: translateX(-200px) translateY(10px); opacity: 0; }
          6%   { opacity: 1; }
          45%  { transform: translateX(38vw) translateY(-10px); }
          55%  { transform: translateX(48vw) translateY(-14px); }
          94%  { opacity: 1; }
          100% { transform: translateX(108vw) translateY(-4px); opacity: 0; }
        }
        @keyframes contrail {
          0%,4% { opacity: 0; }
          10%   { opacity: 0.55; }
          90%   { opacity: 0.45; }
          100%  { opacity: 0; }
        }
        .airbus-fly  { animation: flyAirbus 22s cubic-bezier(.4,0,.6,1) infinite; will-change: transform; }
        .airbus-trail{ animation: contrail 22s cubic-bezier(.4,0,.6,1) infinite; }
      `}</style>
      <div style={{ position: 'absolute', top: '34%', left: 0, right: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
        <div className="airbus-fly" style={{ display: 'inline-flex', alignItems: 'center' }}>
          {/* Contrail lines */}
          <div className="airbus-trail" style={{ display: 'flex', flexDirection: 'column', gap: 5, marginRight: 0 }}>
            <div style={{ width: 180, height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.75))', borderRadius: 1 }} />
            <div style={{ width: 130, height: 1.5, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.5))', borderRadius: 1, marginLeft: 20 }} />
          </div>

          {/* Airbus A320 side-view SVG — white with blue accent */}
          <svg width="120" height="50" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Fuselage — long tube */}
            <ellipse cx="62" cy="25" rx="52" ry="9" fill="white" />
            <ellipse cx="108" cy="25" rx="8" ry="7" fill="white" />
            {/* Nose cone */}
            <path d="M110 22 Q120 25 110 28 Z" fill="white" />
            {/* Cockpit windows */}
            <ellipse cx="105" cy="23" rx="3.5" ry="2" fill="#cfe0f0" opacity="0.8" />
            <ellipse cx="99" cy="22.5" rx="2.5" ry="1.8" fill="#cfe0f0" opacity="0.6" />
            {/* Cabin windows row */}
            {[88, 80, 72, 64, 56, 48, 40, 32].map(x => (
              <rect key={x} x={x} y="22" width="4" height="3" rx="1" fill="#b8d8f0" opacity="0.7" />
            ))}
            {/* Main wing — wide swept */}
            <path d="M55 25 L20 44 L15 44 L14 41 L50 27 Z" fill="white" opacity="0.95" />
            <path d="M55 25 L22 10 L18 10 L17 13 L50 23 Z" fill="white" opacity="0.85" />
            {/* Wing engine left (under) */}
            <rect x="30" y="41" width="18" height="6" rx="3" fill="#e8f3fb" stroke="rgba(14,79,140,0.3)" strokeWidth="0.5" />
            <ellipse cx="30" cy="44" rx="4" ry="4" fill="#cfe0f0" />
            {/* Wing engine right (above) */}
            <rect x="28" y="9" width="16" height="5" rx="2.5" fill="#e8f3fb" stroke="rgba(14,79,140,0.3)" strokeWidth="0.5" />
            <ellipse cx="28" cy="11.5" rx="3.5" ry="3.5" fill="#cfe0f0" />
            {/* Horizontal stabilizer */}
            <path d="M14 25 L0 32 L0 30 L12 24 Z" fill="white" opacity="0.85" />
            <path d="M14 25 L1 19 L1 21 L12 26 Z" fill="white" opacity="0.75" />
            {/* Vertical stabilizer */}
            <path d="M14 25 L11 11 L16 11 L18 25 Z" fill="white" />
            {/* Blue stripe along fuselage */}
            <path d="M18 22.5 Q62 21 108 22" stroke="#0891b2" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            {/* Winglet */}
            <path d="M20 44 L16 48 L18 48 L21 45 Z" fill="white" opacity="0.9" />
            <path d="M22 10 L18 6 L20 6 L23 9 Z" fill="white" opacity="0.8" />
          </svg>
        </div>
      </div>
    </>
  )
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className="portfolio-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(255,255,255,0.97)', borderBottom: `1px solid ${C.border}`, backdropFilter: 'blur(12px)', boxShadow: scrolled ? '0 2px 16px rgba(14,79,140,0.08)' : 'none', transition: 'box-shadow 0.3s' }}>
      <div className="portfolio-nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: 58 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 3, height: 30, background: `linear-gradient(180deg,${C.teal},${C.blue})`, borderRadius: 2 }} />
          <div>
            <div style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 17, color: C.blue, lineHeight: 1.1 }}>Quentin Pecegueiro</div>
            <div style={{ fontFamily: C.mono, fontSize: 9, color: C.faint, letterSpacing: '0.1em', marginTop: 2 }}>Technicien CAO · Aéronautique</div>
          </div>
        </div>
        <div className="hidden xl:flex" style={{ alignItems: 'center', gap: 2 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => onSelect(tab.id)} style={{ fontFamily: C.sans, fontWeight: active === tab.id ? 600 : 400, fontSize: 13, color: active === tab.id ? C.blue : C.muted, background: active === tab.id ? C.light : 'none', border: 'none', cursor: 'pointer', padding: '6px 14px', borderRadius: 6, borderBottom: active === tab.id ? `2px solid ${C.teal}` : '2px solid transparent', transition: 'all 0.15s' }}>{tab.label}</button>
          ))}
        </div>
        <button className="xl:hidden" onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.blue, fontSize: 22 }}>☰</button>
      </div>
      {open && (
        <div className="mobile-nav-menu" style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: '8px 0' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { onSelect(tab.id); setOpen(false) }} style={{ display: 'block', width: '100%', textAlign: 'left', fontFamily: C.sans, fontSize: 14, color: active === tab.id ? C.blue : C.muted, background: 'none', borderTop: 'none', borderRight: 'none', borderBottom: 'none', cursor: 'pointer', padding: '12px 28px', borderLeft: active === tab.id ? `3px solid ${C.teal}` : '3px solid transparent' }}>{tab.label}</button>
          ))}
        </div>
      )}
    </nav>
  )
}

// ─── ACCUEIL ──────────────────────────────────────────────────────────────────
function HomePage({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const [contactPanel, setContactPanel] = useState<'linkedin' | 'email' | null>(null)
  const [contactPanelClosing, setContactPanelClosing] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [phoneCopied, setPhoneCopied] = useState(false)
  const linkedinUrl = 'https://www.linkedin.com/in/quentin-pecegueiro/'
  const phoneNumber = '+33 7 68 77 43 25'
  const contactFieldStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: C.sans,
    fontSize: 14,
    color: C.text,
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    padding: '11px 13px',
    outlineColor: C.teal,
  }

  async function copyPhoneNumber() {
    try {
      await navigator.clipboard.writeText(phoneNumber)
    } catch {
      const input = document.createElement('input')
      input.value = phoneNumber
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setPhoneCopied(true)
    window.setTimeout(() => setPhoneCopied(false), 2200)
  }

  function closeContactPanel() {
    if (!contactPanel || contactPanelClosing) return
    setContactPanelClosing(true)
    window.setTimeout(() => {
      setContactPanel(null)
      setContactPanelClosing(false)
    }, 320)
  }

  function toggleContactPanel(panel: 'linkedin' | 'email') {
    if (contactPanel === panel) {
      closeContactPanel()
      return
    }
    setContactPanelClosing(false)
    setEmailStatus('idle')
    setContactPanel(panel)
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 58px)' }}>
      <div className="home-hero" style={{ position: 'relative', height: 'calc(100vh - 58px)', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1751496631409-09d26da24c41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1800" alt="Moteur d’avion en coupe présentant ses composants mécaniques" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(95deg,rgba(255,255,255,0.96) 38%,rgba(255,255,255,0.5) 65%,rgba(255,255,255,0) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left,rgba(14,79,140,0.18) 0%,transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(28px,7vw,110px)' }}>
          <div className="home-hero-portrait" style={{ width: 'clamp(120px,15vw,170px)', height: 'clamp(120px,15vw,170px)', minWidth: 'clamp(120px,15vw,170px)', minHeight: 'clamp(120px,15vw,170px)', padding: 6, marginBottom: 18, overflow: 'hidden', borderRadius: '50%', background: 'rgba(255,255,255,0.94)', border: `2px solid ${C.teal}`, boxShadow: '0 16px 45px rgba(8,48,86,0.24)', boxSizing: 'border-box', alignSelf: 'flex-start', flex: '0 0 auto' }}>
            <img
              src="/portrait-quentin.png"
              alt="Portrait professionnel de Quentin Pecegueiro"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%', display: 'block', borderRadius: '50%' }}
            />
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 11, color: C.teal, letterSpacing: '0.15em', marginBottom: 16 }}>BUT GMP · GÉNIE MÉCANIQUE ET PRODUCTIQUE</div>
          <h1 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 'clamp(48px,8vw,100px)', color: C.blue, lineHeight: 0.95, margin: '0 0 20px' }}>
            Quentin<br /><em style={{ color: C.teal, fontStyle: 'italic' }}>Pecegueiro</em>
          </h1>
          <p style={{ fontFamily: C.sans, fontSize: 17, color: C.muted, maxWidth: 520, lineHeight: 1.75, marginBottom: 36 }}>
            Futur ingénieur passionné par l&apos;aéronautique et l&apos;automobile, je vous invite à plonger au cœur de mon parcours professionnel et personnel !
          </p>
          <button onClick={() => onNavigate('presentation')} style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 14, padding: '13px 32px', background: C.blue, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', width: 'fit-content', boxShadow: '0 4px 16px rgba(14,79,140,0.25)', transition: 'background 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.teal }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.blue }}>Me découvrir →</button>
        </div>
      </div>

      {/* ── Transition hero → sommaire ── */}
      <div style={{ position: 'relative', height: 72, overflow: 'hidden', marginTop: -2 }}>
        <style>{`
          @keyframes scanH { 0%{transform:translateX(-100%)} 100%{transform:translateX(100vw)} }
          @keyframes blinkDot { 0%,100%{opacity:0.15} 50%{opacity:0.8} }
          .scan-line { animation: scanH 3.6s linear infinite; }
          .blink-d1  { animation: blinkDot 1.8s ease-in-out infinite; }
          .blink-d2  { animation: blinkDot 1.8s ease-in-out 0.6s infinite; }
          .blink-d3  { animation: blinkDot 1.8s ease-in-out 1.2s infinite; }
        `}</style>
        {/* Fond dégradé reliant le blanc cassé du hero au bg du sommaire */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(244,248,251,0) 0%, ${C.bg} 100%)` }} />
        {/* Barre diagonale SVG */}
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d="M0 72 L0 52 Q360 8 720 14 Q1080 20 1440 0 L1440 72 Z" fill={C.bg} />
          {/* Ligne technique sur la courbe */}
          <path d="M0 52 Q360 8 720 14 Q1080 20 1440 0" fill="none" stroke={C.teal} strokeWidth="1.5" strokeOpacity="0.35" />
        </svg>
        {/* Ligne de scan animée */}
        <div className="scan-line" style={{ position: 'absolute', top: 28, left: 0, width: 120, height: 1, background: `linear-gradient(90deg, transparent, ${C.teal}, transparent)`, pointerEvents: 'none' }} />
        {/* Points clignotants */}
        <div className="blink-d1" style={{ position: 'absolute', top: 34, left: '25%', width: 5, height: 5, borderRadius: '50%', background: C.teal }} />
        <div className="blink-d2" style={{ position: 'absolute', top: 22, left: '52%', width: 5, height: 5, borderRadius: '50%', background: C.blue }} />
        <div className="blink-d3" style={{ position: 'absolute', top: 14, left: '78%', width: 5, height: 5, borderRadius: '50%', background: C.teal }} />
      </div>

      {/* ── Sommaire ── */}
      <div className="home-section" style={{ background: C.bg, padding: 'clamp(56px,8vw,96px) clamp(28px,7vw,110px)', position: 'relative', overflow: 'hidden' }}>
        {/* Éléments animés décoratifs en arrière-plan */}
        <style>{`
          @keyframes orbitSlow { 0%{transform:rotate(0deg) translateX(32px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(32px) rotate(-360deg)} }
          @keyframes orbitMed  { 0%{transform:rotate(0deg) translateX(22px) rotate(0deg)} 100%{transform:rotate(-360deg) translateX(22px) rotate(360deg)} }
          @keyframes driftUp   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
          @keyframes spinGear  { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
          .bg-icon-1 { animation: driftUp 4.2s ease-in-out infinite; }
          .bg-icon-2 { animation: driftUp 5.1s ease-in-out 0.8s infinite; }
          .bg-icon-3 { animation: driftUp 3.8s ease-in-out 1.4s infinite; }
          .bg-icon-4 { animation: driftUp 4.7s ease-in-out 0.3s infinite; }
          .spin-gear  { animation: spinGear 8s linear infinite; }
        `}</style>
        {/* Icônes flottantes bg */}
        <div style={{ position: 'absolute', top: 28, left: '6%', opacity: 0.06, fontSize: 80, pointerEvents: 'none' }} className="bg-icon-1">✈️</div>
        <div style={{ position: 'absolute', bottom: 20, left: '18%', opacity: 0.05, fontSize: 64, pointerEvents: 'none' }} className="bg-icon-2">⚙️</div>
        <div style={{ position: 'absolute', top: 40, right: '8%', opacity: 0.06, fontSize: 72, pointerEvents: 'none' }} className="bg-icon-3">🔧</div>
        <div style={{ position: 'absolute', bottom: 40, right: '20%', opacity: 0.05, fontSize: 56, pointerEvents: 'none' }} className="bg-icon-4">📐</div>

        {/* Petites stats animées */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px,5vw,64px)', marginBottom: 48, flexWrap: 'wrap' }}>
          {[
            { val: '3', unit: 'ans', label: "d’alternance", color: C.blue },
            { val: '+6', unit: '', label: 'réalisations', color: C.teal },
            { val: '3', unit: '', label: 'logiciels CAO maîtrisés', color: C.blue },
            { val: 'BUT', unit: 'GMP', label: 'IUT d’Orléans', color: C.teal },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 'clamp(28px,4vw,44px)', color: s.color, lineHeight: 1 }}>
                {s.val}<span style={{ fontSize: '0.45em', verticalAlign: 'super', fontFamily: C.mono, fontWeight: 400, letterSpacing: '0.05em' }}>{s.unit}</span>
              </div>
              <div style={{ fontFamily: C.mono, fontSize: 10, color: C.faint, letterSpacing: '0.1em', marginTop: 6 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Intro sommaire */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: C.mono, fontSize: 11, color: C.teal, letterSpacing: '0.16em', marginBottom: 10 }}>APERÇU DU PORTFOLIO</div>
            <h2 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 'clamp(26px,3.5vw,40px)', color: C.text, margin: '0 0 14px' }}>Ce que vous trouverez ici</h2>
            <p style={{ fontFamily: C.sans, fontSize: 15, color: C.faint, maxWidth: 680, margin: '0 auto' }}>Un aperçu de mon parcours, de mes compétences et de mes réalisations. Chaque section renvoie directement à l’onglet correspondant.</p>
          </div>

          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>

            {/* Parcours */}
            <div style={{ background: C.card, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: C.blue, padding: '20px 24px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>🎓</span>
                <div>
                  <div style={{ fontFamily: C.mono, fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', marginBottom: 3 }}>FORMATION & EXPÉRIENCE</div>
                  <div style={{ fontFamily: C.serif, fontSize: 18, color: '#fff', fontWeight: 600 }}>Parcours</div>
                </div>
              </div>
              <div style={{ padding: '20px 24px', flex: 1 }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { y: '2024–2027', t: 'BUT GMP — IUT d\'Orléans', c: C.blue },
                    { y: '2024–2027', t: 'Trois ans d’alternance chez Saint-Gobain Sully', c: C.teal },
                    { y: 'juillet 2024', t: 'Bac STI2D ITEC — mention bien', c: C.blue },
                    { y: '2022–2023', t: 'SNU — phases 1 et 2 validées', c: C.teal },
                  ].map(item => (
                    <li key={item.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.c, flexShrink: 0, marginTop: 6 }} />
                      <div>
                        <div style={{ fontFamily: C.mono, fontSize: 9, color: item.c, letterSpacing: '0.08em', marginBottom: 2 }}>{item.y}</div>
                        <div style={{ fontFamily: C.sans, fontSize: 13, color: C.text }}>{item.t}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: '0 24px 20px' }}>
                <button onClick={() => onNavigate('parcours')} style={{ width: '100%', fontFamily: C.sans, fontWeight: 600, fontSize: 13, padding: '10px 0', background: C.light, color: C.blue, border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.blue; el.style.color = '#fff' }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.light; el.style.color = C.blue }}>Voir le parcours complet →</button>
              </div>
            </div>

            {/* Compétences */}
            <div style={{ background: C.card, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: C.teal, padding: '20px 24px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>⚙️</span>
                <div>
                  <div style={{ fontFamily: C.mono, fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', marginBottom: 3 }}>SAVOIR-FAIRE</div>
                  <div style={{ fontFamily: C.serif, fontSize: 18, color: '#fff', fontWeight: 600 }}>Compétences</div>
                </div>
              </div>
              <div style={{ padding: '20px 24px', flex: 1 }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: C.mono, fontSize: 9, color: C.blue, letterSpacing: '0.1em', marginBottom: 8 }}>LOGICIELS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['CATIA V5', 'Creo', 'SolidWorks', 'Geomagic'].map(s => (
                      <span key={s} style={{ fontFamily: C.mono, fontSize: 10, color: C.blue, background: C.light, padding: '3px 10px', borderRadius: 4 }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: C.mono, fontSize: 9, color: C.teal, letterSpacing: '0.1em', marginBottom: 8 }}>TECHNIQUES</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['Usinage CN & traditionnel', 'Documentation industrielle', 'Gestion de projet'].map(s => (
                      <span key={s} style={{ fontFamily: C.mono, fontSize: 10, color: C.teal, background: '#e0f5fa', padding: '3px 10px', borderRadius: 4 }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: C.mono, fontSize: 9, color: '#4a6fa5', letterSpacing: '0.1em', marginBottom: 8 }}>SAVOIR-ÊTRE</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['Curieux', 'Appliqué', 'Déterminé', 'Perfectionniste', 'Patient'].map(s => (
                      <span key={s} style={{ fontFamily: C.mono, fontSize: 10, color: '#4a6fa5', background: '#eef2f8', padding: '3px 10px', borderRadius: 4 }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: '0 24px 20px' }}>
                <button onClick={() => onNavigate('competences')} style={{ width: '100%', fontFamily: C.sans, fontWeight: 600, fontSize: 13, padding: '10px 0', background: '#e0f5fa', color: C.teal, border: `1px solid ${C.teal}30`, borderRadius: 6, cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.teal; el.style.color = '#fff' }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#e0f5fa'; el.style.color = C.teal }}>Voir les compétences →</button>
              </div>
            </div>

            {/* Réalisations */}
            <div style={{ background: C.card, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: 'linear-gradient(135deg,#0e4f8c,#0891b2)', padding: '20px 24px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>🔧</span>
                <div>
                  <div style={{ fontFamily: C.mono, fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', marginBottom: 3 }}>OUTILLAGES & PROJETS</div>
                  <div style={{ fontFamily: C.serif, fontSize: 18, color: '#fff', fontWeight: 600 }}>Réalisations</div>
                </div>
              </div>
              <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { t: 'Gabarit PB droit — contrôle du pare-brise', tag: 'Outillage' },
                  { t: 'Gabarit de lissage — impression 3D', tag: 'Fabrication' },
                  { t: "Masters d’outillage en composite", tag: 'Composite' },
                  { t: "Outillage point d’épure — CATIA V5", tag: 'CAO' },
                  { t: 'Outillage squelette — Daher', tag: 'Tôlerie' },
                ].map(item => (
                  <div key={item.t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontFamily: C.sans, fontSize: 12, color: C.muted, flex: 1 }}>{item.t}</div>
                    <span style={{ fontFamily: C.mono, fontSize: 9, color: C.teal, background: '#e0f5fa', padding: '2px 8px', borderRadius: 3, flexShrink: 0 }}>{item.tag}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '0 24px 20px' }}>
                <button onClick={() => onNavigate('activite-pro')} style={{ width: '100%', fontFamily: C.sans, fontWeight: 600, fontSize: 13, padding: '10px 0', background: C.light, color: C.blue, border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.blue; el.style.color = '#fff' }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = C.light; el.style.color = C.blue }}>Voir les réalisations →</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Contact */}
      <div id="contact" className="contact-section" style={{ background: C.blue, padding: 'clamp(48px,6vw,80px) clamp(28px,7vw,110px)', scrollMarginTop: 58 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', marginBottom: 8 }}>Restons en contact</div>
          <h2 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 'clamp(24px,3vw,36px)', color: '#fff', margin: '0 0 40px' }}>Me contacter</h2>
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
            {[
              { label: 'LinkedIn', sub: 'Quentin Pecegueiro', href: linkedinUrl, bg: '#0a66c2', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
              { label: 'Email', sub: 'quenpec4580@gmail.com', href: 'mailto:quenpec4580@gmail.com', bg: C.teal, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> },
              { label: 'Téléphone', sub: phoneCopied ? 'Numéro copié' : phoneNumber, href: 'tel:+33768774325', bg: 'rgba(255,255,255,0.2)', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg> },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                target={item.label === 'LinkedIn' ? undefined : item.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-expanded={item.label === 'LinkedIn' ? contactPanel === 'linkedin' && !contactPanelClosing : item.label === 'Email' ? contactPanel === 'email' && !contactPanelClosing : undefined}
                onClick={e => {
                  if (item.label === 'LinkedIn') {
                    e.preventDefault()
                    toggleContactPanel('linkedin')
                  }
                  if (item.label === 'Email') {
                    e.preventDefault()
                    toggleContactPanel('email')
                  }
                  if (item.label === 'Téléphone') {
                    e.preventDefault()
                    void copyPhoneNumber()
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', background: (item.label === 'LinkedIn' && contactPanel === 'linkedin') || (item.label === 'Email' && contactPanel === 'email') ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)', border: (item.label === 'LinkedIn' && contactPanel === 'linkedin') || (item.label === 'Email' && contactPanel === 'email') ? '1px solid rgba(255,255,255,0.65)' : '1px solid rgba(255,255,255,0.15)', borderRadius: 8, textDecoration: 'none', transition: 'background 0.2s, border-color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.16)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = (item.label === 'LinkedIn' && contactPanel === 'linkedin') || (item.label === 'Email' && contactPanel === 'email') ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 8, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{item.sub}</div>
                </div>
              </a>
            ))}
          </div>

          {contactPanel === 'linkedin' && (
            <div className={`${contactPanelClosing ? 'contact-panel-closing' : 'contact-panel-opening'} grid grid-cols-1 md:grid-cols-[minmax(180px,260px)_minmax(0,1fr)]`} style={{ marginTop: 24, background: '#fff', borderRadius: 12, padding: 'clamp(24px,4vw,40px)', boxShadow: '0 18px 50px rgba(4,32,61,0.24)', gap: 'clamp(24px,5vw,56px)', alignItems: 'center', position: 'relative' }}>
              <button
                onClick={closeContactPanel}
                aria-label="Réduire la section LinkedIn"
                style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: C.light, color: C.blue, border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 700 }}
              >
                ×
              </button>
              <a data-gallery-ignore="true" href={linkedinUrl} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', maxWidth: 260, margin: '0 auto', padding: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10 }}>
                <img src="/linkedin-qr.png" alt="QR code vers le profil LinkedIn de Quentin Pecegueiro" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </a>
              <div style={{ paddingRight: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: '#0a66c2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <svg width="25" height="25" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </div>
                <div style={{ fontFamily: C.mono, fontSize: 10, color: C.teal, letterSpacing: '0.12em', marginBottom: 8 }}>PROFIL PROFESSIONNEL</div>
                <h3 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 'clamp(24px,3vw,34px)', color: C.text, margin: '0 0 12px' }}>Retrouvez-moi sur LinkedIn</h3>
                <p style={{ fontFamily: C.sans, fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 520, margin: '0 0 24px' }}>
                  Scannez le QR code ou utilisez le bouton pour accéder directement au profil LinkedIn de Quentin Pecegueiro.
                </p>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: C.sans, fontWeight: 600, fontSize: 14, padding: '13px 24px', background: '#0a66c2', color: '#fff', borderRadius: 6, textDecoration: 'none', boxShadow: '0 4px 14px rgba(10,102,194,0.24)' }}
              >
                Ouvrir le profil LinkedIn
                <span aria-hidden="true">→</span>
              </a>
              </div>
            </div>
          )}

          {contactPanel === 'email' && (
            <div className={contactPanelClosing ? 'contact-panel-closing' : 'contact-panel-opening'} style={{ marginTop: 24, background: '#fff', borderRadius: 12, padding: 'clamp(24px,4vw,40px)', boxShadow: '0 18px 50px rgba(4,32,61,0.24)', position: 'relative' }}>
              <button
                onClick={closeContactPanel}
                aria-label="Réduire le formulaire de contact"
                style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: C.light, color: C.blue, border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 700 }}
              >
                ×
              </button>
              <div style={{ maxWidth: 760 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div style={{ fontFamily: C.mono, fontSize: 10, color: C.teal, letterSpacing: '0.12em', marginBottom: 8 }}>FORMULAIRE DE CONTACT</div>
                <h3 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 'clamp(24px,3vw,34px)', color: C.text, margin: '0 0 10px' }}>Envoyez-moi un message</h3>
                <p style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, lineHeight: 1.7, margin: '0 0 26px' }}>
                  Votre message sera envoyé directement à <strong style={{ color: C.blue }}>quenpec4580@gmail.com</strong>.
                </p>
                <form
                  className="grid grid-cols-1 md:grid-cols-2"
                  onSubmit={async e => {
                    e.preventDefault()
                    const form = e.currentTarget
                    const data = new FormData(form)
                    setEmailStatus('sending')
                    try {
                      const response = await fetch('https://formsubmit.co/ajax/quenpec4580@gmail.com', {
                        method: 'POST',
                        headers: { Accept: 'application/json' },
                        body: data,
                      })
                      if (!response.ok) throw new Error('Échec de l’envoi')
                      form.reset()
                      setEmailStatus('success')
                    } catch {
                      setEmailStatus('error')
                    }
                  }}
                  style={{ gap: 16 }}
                >
                  <input type="hidden" name="_subject" value="Nouveau message depuis le portfolio" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="text" name="_honey" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
                  <label style={{ fontFamily: C.sans, fontSize: 13, color: C.text, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    Nom
                    <input name="name" type="text" required autoComplete="name" style={contactFieldStyle} />
                  </label>
                  <label style={{ fontFamily: C.sans, fontSize: 13, color: C.text, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    Adresse e-mail
                    <input name="email" type="email" required autoComplete="email" style={contactFieldStyle} />
                  </label>
                  <label style={{ fontFamily: C.sans, fontSize: 13, color: C.text, display: 'flex', flexDirection: 'column', gap: 7, gridColumn: '1 / -1' }}>
                    Objet
                    <input name="subject" type="text" required defaultValue="Contact depuis le portfolio" style={contactFieldStyle} />
                  </label>
                  <label style={{ fontFamily: C.sans, fontSize: 13, color: C.text, display: 'flex', flexDirection: 'column', gap: 7, gridColumn: '1 / -1' }}>
                    Message
                    <textarea name="message" required rows={6} style={{ ...contactFieldStyle, resize: 'vertical', minHeight: 140 }} />
                  </label>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div aria-live="polite" style={{ fontFamily: C.sans, fontSize: 13, color: emailStatus === 'success' ? C.teal : emailStatus === 'error' ? '#b42318' : C.muted }}>
                      {emailStatus === 'success' && 'Votre message a bien été envoyé.'}
                      {emailStatus === 'error' && 'L’envoi a échoué. Veuillez réessayer.'}
                    </div>
                    <button disabled={emailStatus === 'sending'} type="submit" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: C.sans, fontWeight: 600, fontSize: 14, padding: '13px 24px', background: C.teal, color: '#fff', border: 'none', borderRadius: 6, cursor: emailStatus === 'sending' ? 'wait' : 'pointer', opacity: emailStatus === 'sending' ? 0.7 : 1, boxShadow: '0 4px 14px rgba(8,145,178,0.24)' }}>
                      {emailStatus === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── PRÉSENTATION ─────────────────────────────────────────────────────────────
function PagePresentation() {
  return (
    <div className="page-shell" style={{ padding: 'clamp(48px,8vw,96px) clamp(28px,7vw,110px)', maxWidth: 1100, margin: '0 auto' }}>
      <SectionTitle num="01 — Présentation">Qui suis-je ?</SectionTitle>

      {/* Vidéo de présentation */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ position: 'relative', aspectRatio: '16/9', background: C.light, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 28px rgba(14,79,140,0.12)' }}>
          <iframe
            src="https://www.youtube.com/embed/06YoAzk4IpU"
            title="Vidéo de présentation de Quentin Pecegueiro"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        </div>
      </div>

      {/* Bio */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: 22, color: C.blue, marginBottom: 20 }}>À propos</h3>
        <p style={{ fontFamily: C.sans, fontSize: 16, color: C.muted, lineHeight: 1.85, marginBottom: 18 }}>
          Mon parcours académique a débuté par un baccalauréat <span className="fg-inline-bold">STI2D, spécialité Innovation technologique et éco-conception</span>. Après avoir découvert les sciences de l’ingénieur en classe de seconde, j’ai souhaité approfondir mes connaissances techniques et développer mon intérêt pour la conception et les systèmes technologiques.
        </p>
        <p style={{ fontFamily: C.sans, fontSize: 16, color: C.muted, lineHeight: 1.85, marginBottom: 18 }}>
          J’ai ensuite poursuivi en <span className="fg-inline-bold">BUT Génie Mécanique et Productique (GMP)</span> en apprentissage, dans la continuité de mon parcours. La spécialisation automobile proposée par l’<span className="fg-inline-bold">IUT d’Orléans</span> a conforté mon choix de m’orienter vers le génie mécanique. L’alternance représentait également une étape essentielle pour découvrir le monde professionnel, acquérir une expérience concrète sur le terrain et faire le lien entre les connaissances théoriques et leur application pratique en entreprise.
        </p>
        <p style={{ fontFamily: C.sans, fontSize: 16, color: C.muted, lineHeight: 1.85, margin: 0 }}>
          Au fil de ce parcours et de l’acquisition de nouvelles compétences techniques, j’ai développé une véritable passion pour l’aéronautique, un domaine qui suscite particulièrement mon intérêt pour ses exigences technologiques et ses défis en matière d’ingénierie. Je souhaite ainsi poursuivre mes études et approfondir mes connaissances afin de devenir, à terme, <span className="fg-inline-bold">ingénieur spécialisé dans le secteur aéronautique</span>.
        </p>
      </div>

      {/* Qualités */}
      <div>
        <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: 22, color: C.blue, marginBottom: 24 }}>Mes qualités</h3>
        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
          {[
            { t: 'Respectueux', ico: '🤝', d: 'Sens de la relation, du collectif et des autres.' },
            { t: 'Appliqué', ico: '🎯', d: 'Rigueur et soin dans chaque tâche réalisée.' },
            { t: 'Déterminé', ico: '🚀', d: "Engagement total et persévérance dans mes objectifs." },
            { t: 'Autonome', ico: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><path d="m17 11 2 2 4-4"/></svg>, d: 'Capacité à avancer seul et à prendre des initiatives.' },
            { t: 'Organisé', ico: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 9h6M9 13h6M9 17h4"/></svg>, d: 'Planification claire et respect des priorités.' },
          ].map(item => (
            <div key={item.t} style={{ background: C.light, border: `1px solid ${C.border}`, borderRadius: 10, padding: '18px 16px' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{item.ico}</div>
              <div style={{ fontFamily: C.sans, fontSize: 13, fontWeight: 600, color: C.blue, marginBottom: 6 }}>{item.t}</div>
              <div style={{ fontFamily: C.sans, fontSize: 12, color: C.faint, lineHeight: 1.5 }}>{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── PARCOURS ─────────────────────────────────────────────────────────────────
function PageParcours() {
  type TimelineItem = {
    year: string
    title: string
    org: string
    desc: string
    choice?: string
    gains?: string
    logo?: string
    website?: string
    websiteLabel?: string
  }

  const formations: TimelineItem[] = [
    { year: '2024–2027', title: 'BUT Génie mécanique et productique', org: "IUT d’Orléans — trois ans d’alternance", desc: "Cursus de trois années en alternance, combinant théorie universitaire et pratique industrielle chez Saint-Gobain Sully.", logo: '/IUT.jfif', website: 'https://www.univ-orleans.fr/fr/iut-orleans', websiteLabel: "Découvrir le site de l’IUT d’Orléans" },
    { year: 'juillet 2024', title: 'Baccalauréat STI2D — ITEC', org: 'Lycée technique', desc: 'Spécialité innovation technologique et éco-conception. Mention bien.' },
    { year: '2023', title: 'SNU — Phases 1 et 2 validées', org: 'Service national universel', desc: 'Validation des deux phases du SNU entre 2022 et 2023.', logo: '/SNU.jpg' },
    { year: 'juin 2021', title: 'Brevet des collèges', org: 'Collège', desc: 'Mention très bien.' },
    { year: '2019', title: 'PSC1', org: 'Prévention et secours civiques', desc: 'Diplôme de prévention et secours civiques de niveau 1.' },
  ]
  const experiences: TimelineItem[] = [
    {
      year: 'sept. 2024 – juin 2027',
      title: 'Alternance — apprenti technicien CAO',
      org: 'Saint-Gobain Sully',
      desc: "Trois années d’alternance au sein du service Outillage de l’entreprise Saint-Gobain Sully, consacrées à la conception, à l’innovation, à la fabrication et à la maintenance d’outillages industriels, en parallèle de ma formation à l’IUT d’Orléans.",
      choice: "J’ai choisi l’alternance pour confronter rapidement les connaissances acquises en BUT GMP aux réalités de l’industrie. Intégrer Saint-Gobain Sully représentait aussi l’opportunité de découvrir le secteur aéronautique à travers des projets techniques concrets et exigeants.",
      gains: "Cette expérience m’a permis de progresser en CAO, en conception et en suivi de fabrication d’outillages. Elle m’a également appris à gagner en autonomie, à communiquer avec différents métiers et à prendre en compte les contraintes de qualité, de délai et de sécurité propres à un environnement industriel.",
      logo: '/saint_gobain.png',
      website: 'https://www.saint-gobain-aerospace.com/',
      websiteLabel: 'Découvrir Saint-Gobain Aerospace',
    },
    {
      year: 'fév. 2023',
      title: 'Phase 2 SNU',
      org: 'Base aérienne 123 — Orléans-Bricy',
      desc: "Mission d’intérêt général sous la forme d’une immersion d’une semaine au sein de la base aérienne 123 d’Orléans-Bricy.",
      choice: "J’ai choisi d’effectuer cette mission sur une base aérienne afin d’approfondir mon intérêt pour l’aéronautique et de découvrir le fonctionnement d’un environnement militaire, ses métiers et ses exigences.",
      gains: "Cette immersion m’a apporté une meilleure compréhension du secteur aérien et de la diversité de ses métiers. Elle a renforcé mon sens de la rigueur, de la ponctualité et des responsabilités, tout en confirmant mon envie de construire mon parcours dans l’aéronautique.",
      logo: '/Bricy.jfif',
    },
    {
      year: 'juin 2022',
      title: 'Phase 1 SNU',
      org: 'Service national universel',
      desc: "Séjour de cohésion de deux semaines au lac d’Éguzon, rythmé par des activités collectives et la découverte de métiers du service public, notamment ceux des pompiers et des gendarmes.",
      choice: "J’ai choisi de participer au SNU pour vivre une expérience collective en dehors de mon environnement habituel, découvrir différentes formes d’engagement et mieux comprendre le rôle des services publics.",
      gains: "Ce séjour m’a appris à m’adapter à un nouveau cadre, à respecter une organisation commune et à coopérer avec des personnes aux profils variés. Il a développé mon esprit d’équipe, mon autonomie et ma capacité à m’investir dans un objectif collectif.",
      logo: '/SNU.jpg',
    },
    {
      year: 'déc. 2021',
      title: 'Stage de 3e',
      org: 'Entreprise BCI — Gien',
      desc: "Stage d’observation d’une semaine au sein du bureau d’études de l’entreprise BCI à Gien, spécialisée dans la fabrication de modules et de cages d’escalier pour les chantiers.",
      choice: "J’ai choisi un bureau d’études pour découvrir la manière dont une idée technique devient un produit fabriqué et pour vérifier mon intérêt pour la conception, le dessin industriel et les métiers de l’ingénierie.",
      gains: "Cette première immersion en entreprise m’a permis de comprendre les principales étapes d’un projet, de la lecture du besoin à la fabrication. Elle a confirmé mon attrait pour les domaines techniques et a orienté la suite de mon parcours vers la STI2D puis le génie mécanique.",
    },
  ]

  function Timeline({ items, color }: { items: TimelineItem[]; color: string }) {
    return (
      <div style={{ position: 'relative', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ position: 'absolute', left: 0, top: 8, bottom: 0, width: 2, background: `linear-gradient(180deg,${color},transparent)`, borderRadius: 1 }} />
        {items.map((item, i) => (
          <div key={i} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: -28, top: 20, width: 9, height: 9, borderRadius: '50%', background: color, border: '2px solid white', boxShadow: `0 0 0 2px ${color}40` }} />
            <Accordion accentColor={color} header={
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {item.logo && (
                  <img
                    src={item.logo}
                    alt={item.org}
                    style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 6, background: '#f4f8fb', padding: 4, flexShrink: 0, border: `1px solid ${C.border}` }}
                  />
                )}
                <div>
                  <div style={{ marginBottom: 5 }}><Chip color={color}>{item.year}</Chip></div>
                  <div style={{ fontFamily: C.serif, fontSize: 15, color: C.text, lineHeight: 1.3 }}>{item.title}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 10, color, marginTop: 4 }}>{item.org}</div>
                </div>
              </div>
            }>
              <div style={{ padding: '16px 20px 20px' }}>
                <p style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
                {item.choice && item.gains && (
                  <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
                    <div style={{ padding: '14px 16px', background: C.light, borderLeft: `3px solid ${color}`, borderRadius: '0 6px 6px 0' }}>
                      <div style={{ fontFamily: C.mono, fontSize: 10, color, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>POURQUOI CE CHOIX ?</div>
                      <p style={{ fontFamily: C.sans, fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>{item.choice}</p>
                    </div>
                    <div style={{ padding: '14px 16px', background: '#fff', border: `1px solid ${C.border}`, borderLeft: `3px solid ${color}`, borderRadius: '0 6px 6px 0' }}>
                      <div style={{ fontFamily: C.mono, fontSize: 10, color, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>CE QUE CELA M’A APPORTÉ</div>
                      <p style={{ fontFamily: C.sans, fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>{item.gains}</p>
                    </div>
                  </div>
                )}
                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '10px 14px', background: color, color: '#fff', borderRadius: 6, fontFamily: C.sans, fontSize: 12, fontWeight: 600, textDecoration: 'none', boxShadow: `0 4px 14px ${color}30` }}
                  >
                    {item.websiteLabel}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                    </svg>
                  </a>
                )}
              </div>
            </Accordion>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="page-shell" style={{ padding: 'clamp(48px,8vw,96px) clamp(28px,7vw,110px)', maxWidth: 1100, margin: '0 auto' }}>
      <SectionTitle num="02 — Parcours">Formation et expériences</SectionTitle>
      <p style={{ fontFamily: C.sans, fontSize: 15, color: C.faint, lineHeight: 1.8, maxWidth: 820, marginTop: -32, marginBottom: 48 }}>
        Retrouvez ici l’ensemble de mon parcours scolaire et professionnel : mes formations diplômantes, mes trois années d’alternance chez Saint-Gobain Sully et mes engagements extrascolaires. Cliquez sur chaque entrée pour afficher le détail.
      </p>
      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div>
          <div style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: 18, color: C.blue, marginBottom: 24 }}>Formation</div>
          <Timeline items={formations} color={C.blue} />
        </div>
        <div>
          <div style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: 18, color: C.teal, marginBottom: 24 }}>Expériences</div>
          <Timeline items={experiences} color={C.teal} />
        </div>
      </div>
    </div>
  )
}

// ─── RÉALISATIONS ─────────────────────────────────────────────────────────────
function PageActivitePro() {
  const [selected, setSelected] = useState<number | null>(null)

  const realisations = [
    {
      title: 'Gabarit PB droit — sortie des sondes du montant inférieur',
      client: 'Saint-Gobain Sully — Service Outillage',
      year: '2024–2025',
      tags: ['Gabarit', 'Outillage', 'Aéronautique'],
      desc: "Gabarit de contrôle en matière plastique transparente pour le pare-brise droit. Référence 374-334-52-1 IND0.",
      imgs: ['/GABARIT.png'],
      detail: "Réalisation d’un gabarit de contrôle dimensionnel en plastique transparent pour le pare-brise droit — sortie des sondes du montant inférieur (référence pièce : 374-334-52-1 IND0). Ce gabarit permet de vérifier et de contrôler le positionnement des sondes de température sur un vitrage. Il est utilisé en production pour le contrôle systématique des pièces fabriquées. La matière transparente a été choisie pour permettre une visualisation directe des repères lors du contrôle. La conception a nécessité une grande rigueur ainsi qu’une maîtrise des tolérances géométriques propres aux équipements aéronautiques.",
      context: "Ce projet s’est inscrit dans ma mission de support au service Outillage lors de mes trois années d’alternance chez Saint-Gobain Sully. Il m’a permis de développer mes compétences en lecture de plan, cotation fonctionnelle et conception d’outils de contrôle adaptés aux exigences du secteur aéronautique. J’ai travaillé en autonomie sous la supervision du responsable outillage, en lien direct avec les opérateurs de production.",
    },
    {
      title: 'Gabarit de lissage',
      client: 'Saint-Gobain Sully — Service Outillage',
      year: '2024–2025',
      tags: ['Impression 3D', 'Gabarit', 'GMP'],
      desc: "Gabarit courbe imprimé en 3D pour le contrôle et le lissage de profils aéronautiques.",
      imgs: ['/GABARIT_LISSAGE.png'],
      detail: "Conception et fabrication par impression 3D d’un gabarit de lissage à profil courbe. Cet outillage sert au contrôle et à la mise en forme de zones de joint sur le contour d’un vitrage aéronautique. La forme en arc assure la continuité de surface sur les zones à rayon de courbure constant. Le choix de l’impression 3D a permis d’obtenir rapidement une géométrie complexe, à moindre coût par rapport à d’autres méthodes de fabrication. La matière plastique utilisée offre à la fois la rigidité nécessaire au contrôle et une légèreté appréciable lors de la manipulation.",
      context: "La conception a été réalisée à l’aide d’un logiciel de CAO, à partir du profil nominal défini dans les modèles 3D du vitrage. Ce projet m’a permis de consolider mes compétences en modélisation 3D et d’appréhender les contraintes liées à l’impression additive dans un environnement industriel aéronautique.",
    },
    {
      title: "Masters d’outillage",
      client: 'Saint-Gobain Sully — Service Outillage',
      year: '2024–2025',
      tags: ['Master', 'Composite', 'Outillage'],
      desc: "Fabrication de masters d'outillage en composite et mousse utilisés comme références dimensionnelles pour la production.",
      imgs: ['/MASTER.png'],
      detail: "Réalisation de masters d’outillage de grandes dimensions en matériaux composites et en mousse structurelle. Ces masters servent de références géométriques pour la fabrication des outillages de production. Ils définissent la surface nominale de la pièce avec une grande précision, et leur conditionnement sur palette assure leur transport et leur conservation dans de bonnes conditions. Chaque master est élaboré à partir de données numériques issues de la CAO et nécessite un travail de finition soigné pour garantir la fidélité de la surface de référence.",
      context: "La réalisation de masters implique une coordination étroite avec le bureau d’études et les équipes de fabrication. J’ai participé activement à la préparation des matériaux, au drapage composite et au contrôle dimensionnel final, renforçant ainsi ma compréhension des procédés de fabrication en composites dans le secteur aéronautique.",
    },
    {
      title: "Outillage point d’épure — CAO CATIA V5",
      client: "Saint-Gobain Sully — Bureau d’études",
      year: '2024–2025',
      tags: ['CATIA V5', 'CAO', "Point d’épure"],
      desc: "Modélisation 3D d’un outillage point d’épure sous CATIA V5. Conception bicorps pour un positionnement précis.",
      imgs: ['/OT_POINT_EPURE.png'],
      detail: "Modélisation complète sous CATIA V5 d’un outillage point d’épure. La conception bicorps (corps magenta et corps jaune) définit les deux parties constitutives de l’outillage et leurs interfaces fonctionnelles. Le point d’épure est un point de référence géométrique clé utilisé pour positionner et contrôler les pièces aéronautiques dans l’espace tridimensionnel. La modélisation paramétrique permet d’adapter rapidement l’outillage à différentes variantes de pièces tout en conservant les contraintes géométriques essentielles.",
      context: "Ce travail de modélisation CAO a précédé la fabrication physique de l’outillage et a nécessité une maîtrise approfondie de CATIA V5, notamment des modules Part Design et Assembly Design. Il m’a permis de développer une approche méthodique de la conception d’outillages et de renforcer ma capacité à travailler à partir de données numériques de référence.",
    },
    {
      title: "Modification d’un outillage d’injection de joint",
      client: 'Saint-Gobain Sully — Service Outillage',
      year: '2024–2025',
      tags: ['CATIA V5', 'Métrologie', 'Modification outillage'],
      desc: "Modification d’un outillage d’injection de joint afin de contrôler une cote avec une précision au dixième de millimètre.",
      imgs: ['/MODIFICATION_OUTILLAGE_INJECTION_ENSEMBLE.png', '/MODIFICATION_OUTILLAGE_INJECTION_DETAIL.png'],
      detail: "Étude et modification sous CAO d’un outillage utilisé pour l’injection d’un joint. L’objectif était d’intégrer un dispositif de contrôle permettant de vérifier directement une cote fonctionnelle avec une précision au dixième de millimètre. Le travail a porté sur le positionnement du système de mesure, son accessibilité et son intégration à proximité de la zone injectée, tout en conservant les fonctions de maintien et de serrage déjà présentes sur l’outillage.",
      context: "Cette modification m’a permis de mettre en pratique mes compétences en analyse d’un outillage existant, en conception sous CATIA V5 et en métrologie. Elle illustre l’importance d’adapter les moyens de production pour rendre les contrôles plus précis, répétables et directement exploitables par les opérateurs.",
    },
    {
      title: 'Étude CAO d’une structure support',
      client: 'Projet de conception mécanique',
      year: 'Étude CAO',
      tags: ['CAO', 'Structure', 'Surfaces'],
      desc: "Modélisation d’une structure support courbe intégrant son châssis, ses renforts et sa surface fonctionnelle.",
      imgs: ['/cao-structure-support.png'],
      detail: "Conception numérique d’un ensemble support à géométrie courbe. Le modèle rassemble la surface supérieure, le cadre périphérique et les éléments tubulaires qui assurent le maintien de l’ensemble. La modélisation permet de contrôler l’encombrement, la continuité des formes et la cohérence des interfaces avant fabrication.",
      context: "Cette étude illustre mon travail de décomposition d’un ensemble complexe en sous-éléments fonctionnels. Elle mobilise des compétences en lecture de formes, construction surfacique, assemblage et vérification visuelle d’une architecture mécanique.",
    },
    {
      title: 'Étude d’un assemblage mécanique en coupe',
      client: 'Projet de conception mécanique',
      year: 'Étude CAO',
      tags: ['Assemblage', 'Chaîne de cotes', 'Mécanique'],
      desc: "Analyse en coupe d’un mécanisme afin de vérifier l’implantation de l’axe, des paliers et des éléments de fixation.",
      imgs: ['/cao-assemblage-axe.png'],
      detail: "Durant mon cursus en BUT GMP, les modules de ce type ont été omniprésents. En effet, l’étude et la modélisation d’un système mécanique constituent une grande partie de notre savoir-faire. Dans cet exemple, il a fallu étudier le produit, mais également dimensionner les éléments de guidage et de transmission. Nous avons d’abord réalisé une étude préliminaire sur papier afin de nous former au dessin industriel. Nous sommes ensuite passés à la partie CAO, où nous avons intégré les éléments de bridage et de transmission (roulements, vis, entretoises, etc.).",
      context: "Ce travail m’a permis d’approfondir l’analyse des liaisons mécaniques, la lecture d’un assemblage en coupe et la prise en compte des contraintes de montage. Il met également en évidence l’importance de la chaîne de cotes dans le bon fonctionnement d’un mécanisme.",
    },
    {
      title: 'Conception CAO d’un produit mécanique',
      client: 'Projet de conception mécanique',
      year: 'Étude CAO',
      tags: ['Modélisation 3D', 'Assemblage', 'Conception'],
      desc: "Vue éclatée d’un produit caréné comprenant sa structure, son support supérieur et un sous-ensemble rotatif.",
      imgs: [
        '/cao-produit-mecanique.png',
        '/aeroglisseur-thermoformage.jpg',
        '/aeroglisseur-assemblage.jpg',
        '/aeroglisseur-prototype.jpg',
      ],
      galleryAtBottom: true,
      detail: "L’objectif de ce sujet était de concevoir un design innovant, capable de s’adapter au châssis existant, tout en proposant un concept original dans l’industrie du jouet. Plutôt que de suivre la conception classique d’un véhicule à quatre roues, pour lequel le châssis avait initialement été prévu, nous avons choisi d’explorer une approche atypique en développant un aéroglisseur. Ce choix nous a permis de sortir des codes traditionnels du secteur et de proposer une conception différenciante, alliant créativité, innovation et adaptation aux contraintes techniques du châssis. Nous avons donc utilisé l’impression 3D ainsi que le thermoformage afin de réaliser ce prototype.",
      context: "La réalisation de cet assemblage a renforcé ma capacité à organiser une arborescence CAO, à concevoir des pièces complémentaires et à produire une représentation claire pour expliquer le montage d’un produit.",
    },
    {
      title: 'Outillage squelette — pare-brise gauche Daher',
      client: 'Saint-Gobain Sully — Service Outillage',
      year: '2025',
      tags: ['Squelette', 'Daher', 'Tôlerie'],
      desc: "Réalisation d’un outillage squelette métallique pour le pare-brise gauche Daher. Gabarit de mise en forme et de contrôle.",
      imgs: ['/OT_SQUELETTE.png'],
      detail: "Au sein de la production de Saint-Gobain, il existe plusieurs types d’outillages ; les outillages de type « squelette » en font partie. Le principe consiste à réaliser des outillages mécano-soudés, parfois articulés, qui donnent sa forme au vitrage. Celui-ci vient en appui sur une fine bande, ce qui permet d’obtenir de meilleures caractéristiques optiques.",
      context: "Réalisé en autonomie tout au long de mes trois années d’alternance, cet outillage illustre ma progression dans la maîtrise des techniques d’outillage aéronautique. J’ai géré l’ensemble du processus : lecture du plan de définition, débit de matière, traçage, découpe, assemblage et contrôle final. Ce projet a renforcé mes compétences en tôlerie de précision et en outillage de référence.",
    },
  ]

  const r = selected !== null ? realisations[selected] : null

  return (
    <div className="page-shell" style={{ padding: 'clamp(48px,8vw,96px) clamp(28px,7vw,110px)', maxWidth: 1200, margin: '0 auto' }}>
      <SectionTitle num="03 — Autres réalisations">Réalisations et autres projets</SectionTitle>
      <p style={{ fontFamily: C.sans, fontSize: 15, color: C.faint, lineHeight: 1.8, maxWidth: 820, marginTop: -32, marginBottom: 48 }}>
        Découvrez ici les réalisations complémentaires effectuées durant mes trois années d’alternance chez Saint-Gobain Sully : gabarits, outillages de contrôle et études spécifiques. Cliquez sur une carte pour afficher le descriptif complet avec photos et explications.
      </p>

      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: 20 }}>
        {realisations.map((item, i) => (
          <div
            key={i}
            onClick={() => setSelected(i)}
            style={{
              background: C.blue, border: `1px solid ${C.blue}`, borderRadius: 10,
              overflow: 'hidden', cursor: 'pointer',
              transition: 'box-shadow 0.2s, transform 0.2s',
              display: 'flex', flexDirection: 'column',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 6px 24px rgba(14,79,140,0.35)'; el.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)' }}
          >
            {/* Image contenue sur fond légèrement plus clair */}
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: item.imgs.length > 1 && !item.galleryAtBottom ? '1fr 1fr' : '1fr', gap: 8 }}>
                {(item.galleryAtBottom ? item.imgs.slice(0, 1) : item.imgs).map((img, j) => (
                  <ZoomableImage
                    key={j}
                    src={img}
                    alt={item.title}
                    containerStyle={{ height: 150 }}
                    imageStyle={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: 6, background: 'rgba(255,255,255,0.06)' }}
                  />
                ))}
              </div>
            </div>

            {/* Titre sur fond bleu */}
            <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ fontFamily: C.mono, fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', marginBottom: 5 }}>{item.client.toUpperCase()}</div>
              <div style={{ fontFamily: C.serif, fontSize: 16, color: '#ffffff', lineHeight: 1.25, fontWeight: 600 }}>{item.title}</div>
              <div style={{ marginTop: 8 }}>
                <span style={{ fontFamily: C.mono, fontSize: 10, color: C.teal, border: `1px solid ${C.teal}60`, padding: '2px 10px', borderRadius: 2, letterSpacing: '0.06em' }}>{item.year}</span>
              </div>
            </div>

            {/* Texte descriptif sur fond bleu */}
            <div style={{ padding: '12px 18px 18px', flex: 1 }}>
              <p style={{ fontFamily: C.sans, fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: '0 0 12px' }}>{item.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {item.tags.map(t => (
                  <span key={t} style={{ fontFamily: C.mono, fontSize: 10, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.25)', padding: '2px 10px', borderRadius: 2, letterSpacing: '0.06em' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {r && (
        <Modal onClose={() => setSelected(null)}>
          {/* Image(s) sur fond clair */}
          <div style={{ background: '#f0f6fc', padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: r.imgs.length > 1 && !r.galleryAtBottom ? '1fr 1fr' : '1fr', gap: 10 }}>
              {(r.galleryAtBottom ? r.imgs.slice(0, 1) : r.imgs).map((img, j) => (
                <ZoomableImage
                  key={j}
                  src={img}
                  alt={r.title}
                  containerStyle={{ height: 'clamp(180px,35vw,240px)' }}
                  imageStyle={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: 6 }}
                />
              ))}
            </div>
          </div>
          {/* Texte sur fond blanc pur — scrollable via la molette */}
          <div style={{ background: '#ffffff', padding: '24px 32px 40px' }}>
            <div style={{ fontFamily: C.mono, fontSize: 9, color: C.teal, letterSpacing: '0.1em', marginBottom: 8 }}>{r.client.toUpperCase()}</div>
            <h3 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 22, color: C.text, margin: '0 0 10px', lineHeight: 1.2 }}>{r.title}</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              <Chip color={C.blue}>{r.year}</Chip>
              {r.tags.map(t => <Chip key={t} color={C.teal}>{t}</Chip>)}
            </div>
            {/* Résumé */}
            <div style={{ background: '#f0f6fc', borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: `3px solid ${C.teal}`, padding: '12px 16px', borderRadius: '0 6px 6px 0', marginBottom: 20 }}>
              <p style={{ fontFamily: C.sans, fontSize: 14, color: C.text, lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>{r.desc}</p>
            </div>
            {/* Détail développé */}
            <h4 style={{ fontFamily: C.serif, fontSize: 15, color: C.blue, margin: '0 0 10px', fontWeight: 600 }}>Détail de la réalisation</h4>
            <p style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, lineHeight: 1.85, margin: '0 0 20px' }}>{r.detail}</p>
            {/* Contexte & apports */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
              <h4 style={{ fontFamily: C.serif, fontSize: 15, color: C.blue, margin: '0 0 10px', fontWeight: 600 }}>Contexte & apports</h4>
              <p style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, lineHeight: 1.85, margin: 0 }}>{r.context}</p>
            </div>
            {r.galleryAtBottom && r.imgs.length > 1 && (
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginTop: 28 }}>
                <div style={{ fontFamily: C.mono, fontSize: 10, color: C.teal, letterSpacing: '0.12em', marginBottom: 14 }}>GALERIE</div>
                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
                  {r.imgs.slice(1).map((img, j) => (
                    <ZoomableImage
                      key={img}
                      src={img}
                      alt={`${r.title} — photo ${j + 2}`}
                      loading="lazy"
                      containerStyle={{ height: 220, borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.light }}
                      imageStyle={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: C.card }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── PROJETS ──────────────────────────────────────────────────────────────────
function PageProjets() {
  const [activeSaeStudy, setActiveSaeStudy] = useState(0)

  type ProjectSection = {
    title: string
    eyebrow: string
    paragraphs: React.ReactNode[]
    imgs: string[]
    captions: string[]
    imageLayout?: 'grid' | 'stack'
  }

  type Project = {
    num: string
    title: string
    lieu: string
    imgs: string[]
    texte: string[]
    rapport?: string
    sections?: ProjectSection[]
    studies?: {
      label: string
      title: string
      img: string
      caption: string
    }[]
  }

  const projets: Project[] = [
    {
      num: '01',
      title: 'Outillage Neotech — positionnement de pare-brise',
      lieu: 'Saint-Gobain Sully — Neotech · 2024–2025',
      imgs: [],
      rapport: '/rapport_apprentissage.pdf',
      texte: [],
      sections: [
        {
          eyebrow: '01 — CONTEXTE',
          title: 'Contexte du projet',
          paragraphs: [
            "Le projet Neotech répond au besoin de positionner avec précision différents pare-brise aéronautiques afin de réaliser des opérations de contrôle dans des conditions répétables. L’outillage devait maintenir chaque vitrage dans une position précise, définie dans une autre étude, tout en facilitant les réglages nécessaires aux différentes références étudiées.",
            "La solution retenue repose sur une structure en profilés d’aluminium, équipée de supports réglables, de points d’appui localisés et de systèmes de serrage rapides. Cette architecture associe rigidité, accessibilité et modularité pour sécuriser la mise en position du vitrage.",
          ],
          imgs: ['/OT_NEOTECH.png', '/OT_NEOTECH2.png'],
          captions: ['Vue générale du premier outillage Neotech réalisé', 'Détail des systèmes de maintien et de réglage sur le deuxième outillage Neotech réalisé'],
        },
        {
          eyebrow: '02 — MÉTHODE',
          title: 'Étapes de réalisation',
          paragraphs: [
            "La réalisation a commencé par l’analyse du besoin, des références de vitrages et du fonctionnement de l’installation existante. Les zones de maintien, les amplitudes de réglage et les contraintes d’accès ont ensuite été définies avant la modélisation.",
            "Après validation du principe, les composants ont été dimensionnés et intégrés à la maquette numérique. La fabrication a regroupé la préparation des profilés et des pièces spécifiques, puis l’assemblage, le montage des appuis et l’installation des éléments de réglage. Une phase finale de mise au point a permis d’ajuster les positions et de préparer la documentation d’utilisation.",
          ],
          imgs: [],
          captions: [],
        },
        {
          eyebrow: '03 — CONCEPTION',
          title: 'Deux études CAO complémentaires',
          paragraphs: [
            <>
              La première étude CAO porte sur une seule référence : <span className="fg-inline-bold">Vitrage A320 latéral ouvrant</span>. Elle vise à valider la méthode de conception et de travail afin d’aboutir à un outillage unique par référence, intégrant le positionnement du vitrage gauche et droit, plutôt que de recourir à quatre plots unitaires indépendants. La représentation sans vitrage permet de vérifier l’architecture de l’outillage, les interfaces, les dégagements ainsi que l’accessibilité aux organes de réglage.
            </>,
            <>
              La seconde étude reprend le principe validé lors de la première, en y intégrant un objectif complémentaire de <span className="fg-inline-bold">gain de temps lors des opérations de réglage</span>. Elle vise à définir un positionnement commun pour quatre références : <span className="fg-inline-bold">A320 latéral ouvrant gauche et droit, ainsi qu’A320 latéral arrière gauche et droit</span>. Le principe retenu consiste à harmoniser les réglages de positionnement afin de limiter les ajustements nécessaires lors du passage d’une référence à une autre.
            </>,
            <>
              Chaque outillage intégrant le positionnement des vitrages gauche et droit, cette seconde étude aboutira à la conception de <span className="fg-inline-bold">deux outillages distincts, utilisant les mêmes réglages de positionnement</span>. L’intégration des vitrages dans les assemblages CAO permettra de vérifier leur enveloppe, la cohérence des points d’appui, leur maintien dans la position de contrôle ainsi que l’absence d’interférences avec la structure de l’outillage.
            </>,
          ],
          imgs: ['/NEOTECH_CAO_ETUDE_1.png', '/NEOTECH_CAO_ETUDE_2.png'],
          captions: ['Étude CAO 1 — architecture et positionnement des supports', 'Étude CAO 2 — validation de l’assemblage avec le vitrage'],
        },
        {
          eyebrow: '04 — VALIDATION',
          title: 'Tests, vérifications et fiche de positionnement',
          paragraphs: [
            "Les essais ont consisté à installer le vitrage, contrôler sa stabilité, vérifier la répétabilité des réglages et confirmer l’accessibilité des différents points de mesure. Les positions des traverses et des posages ont été relevées afin de pouvoir reproduire rapidement une configuration validée.",
            "Une fiche de positionnement rassemble les paramètres nécessaires à chaque référence : angle de l’axe Z, valeur de l’inclinomètre, hauteur de colonne, positions des traverses, réglages des posages, distances de contrôle, hauteur d’œil et épaisseur du vitrage. Elle sert de référence lors des montages suivants et contribue à la traçabilité des contrôles.",
          ],
          imgs: ['/NEOTECH_FICHE_POSITIONNEMENT.png'],
          captions: ['Exemple de fiche de positionnement et de contrôle — A320 arrière droit'],
        },
        {
          eyebrow: '05 — ÉTUDE ÉCONOMIQUE',
          title: 'Comparaison des deux solutions',
          paragraphs: [
            "L’étude économique met en regard deux périmètres. La première solution est dédiée à une référence A320 latérale ouvrante gauche. Elle représente environ 50 heures de CAO, 30 heures de réflexion, 6 000 € de matière et 2 500 € de découpe, auxquels s’ajoutent les temps de résine, d’assemblage et de vérification.",
            "La seconde solution élargit le principe à quatre références : latérales ouvrantes gauche et droite, puis latérales arrière gauche et droite. Le coût matière et le coût de découpe restent maîtrisés grâce à la mutualisation de la structure. Le temps de montage et de réglage, auparavant proche de trois minutes, est ramené à environ 30 secondes ou une minute après le premier réglage selon la référence.",
            "Cette comparaison montre l’intérêt d’un outillage réglable et réutilisable : l’investissement initial en conception est compensé par des réglages plus rapides, une meilleure répétabilité et la possibilité de traiter plusieurs configurations avec une même base.",
          ],
          imgs: ['/NEOTECH_ETUDE_ECONOMIQUE_1.png', '/NEOTECH_ETUDE_ECONOMIQUE_2.png'],
          captions: ['Première étude économique — solution dédiée', 'Deuxième étude économique — solution mutualisée pour quatre références'],
          imageLayout: 'stack',
        },
      ],
    },
    {
      num: '02',
      title: "Projet du module BE8 — Conception d’un système mécanique simple",
      lieu: "IUT d’Orléans — BUT GMP · 2024",
      imgs: [],
      studies: [
        {
          label: 'Réalisation 01',
          title: 'Produit final (genouillère)',
          img: '/outillage-reglable.jpg',
          caption: 'Réalisation finale du mécanisme',
        },
        {
          label: 'Réalisation 02',
          title: 'Outillage de perçage imprimé en 3D',
          img: '/prototype-impression-3d.jpg',
          caption: 'Prototype de support imprimé en 3D utilisé pour valider la géométrie',
        },
        {
          label: 'Réalisation 03',
          title: "Outillage d’assemblage (soudage)",
          img: '/montage-mecanique.jpg',
          caption: 'Montage mécanique réalisé pour assurer le positionnement',
        },
      ],
      texte: [
        "Dans le cadre des modules de bureau d’études du BUT GMP à l’IUT d’Orléans, j’ai participé en groupe à la conception complète d’un système mécanique. Ce type de projet vise à mettre en pratique l’ensemble des compétences acquises au cours de la formation universitaire.",
        "Le projet impliquait une phase d’analyse fonctionnelle du besoin, une étude de conception préliminaire puis détaillée, suivie d’une modélisation 3D à l’aide d’un logiciel de CAO (CATIA V5 ou Creo Parametric selon les projets). Les contraintes techniques, économiques et environnementales ont été intégrées dès les premières étapes.",
        "Le mécanisme a été réparti entre les membres du groupe selon ses pièces élémentaires et leurs méthodes de fabrication, comme le mécano-soudage ou la fonderie. J’ai personnellement été chargé de la fabrication d’une pièce mécano-soudée. Cette mission a nécessité la conception des outillages d’usinage et de soudage, ainsi que la préparation des programmes d’usinage indispensables à sa réalisation.",
        "Ce type de projet académique permet de développer des compétences transversales essentielles : travail en équipe, gestion du temps, communication technique et rigueur documentaire. Il prépare directement aux exigences des environnements industriels professionnels.",
      ],
    },
  ]

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* En-tête avec logos et phrase d'intro */}
      <div className="projects-header" style={{ background: C.blue, padding: 'clamp(40px,6vw,72px) clamp(28px,7vw,110px) clamp(32px,4vw,48px)' }}>
        {/* Logos institutions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 36, flexWrap: 'wrap' }}>
          <div style={{ background: 'white', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}>
            <img src="/IUT.jfif" alt="IUT d’Orléans" style={{ height: 40, objectFit: 'contain', display: 'block' }} />
          </div>
          <div style={{ background: 'white', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}>
            <img src="/saint_gobain.png" alt="Saint-Gobain" style={{ height: 40, objectFit: 'contain', display: 'block' }} />
          </div>
        </div>
        {/* Titre + intro */}
        <div style={{ maxWidth: 1000 }}>
          <div style={{ fontFamily: C.mono, fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.16em', marginBottom: 12 }}>04 — PROJETS PRINCIPAUX</div>
          <h2 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 'clamp(28px,4vw,48px)', color: '#fff', margin: '0 0 20px', lineHeight: 1.15 }}>Plongez au cœur de mes projets</h2>
          <p style={{ fontFamily: C.sans, fontSize: 16, color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, maxWidth: 900, margin: 0 }}>
            Je vous invite à découvrir les projets qui ont marqué mon BUT GMP et mes trois années d’alternance chez Saint-Gobain Sully. Parcourez leurs contextes, leurs objectifs et les méthodes employées pour entrer concrètement dans mon univers technique.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 24 }}>
            <p style={{ fontFamily: C.sans, fontSize: 13, color: '#fff', lineHeight: 1.6, margin: 0 }}>
              Envie d’en savoir plus sur mes missions et ma démarche ? Je vous invite à jeter un œil à mon rapport d’apprentissage.
            </p>
            <a href="/rapport_apprentissage.pdf" download
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: C.sans, fontWeight: 600, fontSize: 13, padding: '10px 18px', background: '#fff', color: C.blue, border: '1px solid rgba(255,255,255,0.8)', borderRadius: 6, textDecoration: 'none', boxShadow: '0 4px 14px rgba(12,35,64,0.18)', transition: 'transform 0.2s, box-shadow 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 7px 18px rgba(12,35,64,0.24)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 4px 14px rgba(12,35,64,0.18)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Découvrez mon rapport d’apprentissage
              <span style={{ fontFamily: C.mono, fontSize: 10, opacity: 0.65 }}>PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Corps — liste de projets style Wikipedia */}
      <div className="projects-body" style={{ position: 'relative', maxWidth: 1000, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(28px,7vw,110px)' }}>
        {projets.map((p, pi) => (
          <article key={pi} style={{ marginBottom: pi < projets.length - 1 ? 80 : 0 }}>
            {/* Numéro + titre */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6 }}>
              <span style={{ fontFamily: C.mono, fontSize: 28, color: C.teal, fontWeight: 700, lineHeight: 1, flexShrink: 0 }}>{p.num}</span>
              <h3 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 'clamp(20px,2.5vw,28px)', color: C.text, margin: 0, lineHeight: 1.2 }}>{p.title}</h3>
            </div>
            {/* Lieu / date */}
            <div style={{ fontFamily: C.mono, fontSize: 11, color: C.teal, letterSpacing: '0.08em', marginBottom: 24 }}>{p.lieu}</div>
            {/* Séparateur */}
            <div style={{ height: 2, background: `linear-gradient(90deg,${C.teal},transparent)`, borderRadius: 1, marginBottom: 28 }} />
            {p.sections ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>
                {p.sections.map((section, si) => (
                  <section key={section.title} style={{ paddingLeft: 20, borderLeft: `3px solid ${si % 2 === 0 ? C.teal : C.blue}` }}>
                    <div style={{ fontFamily: C.mono, fontSize: 10, color: C.teal, letterSpacing: '0.12em', marginBottom: 8 }}>{section.eyebrow}</div>
                    <h4 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 'clamp(19px,2.2vw,25px)', color: C.text, margin: '0 0 18px', lineHeight: 1.25 }}>{section.title}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {section.paragraphs.map((para, ti) => (
                        <p key={ti} style={{ fontFamily: C.sans, fontSize: 15, color: C.muted, lineHeight: 1.85, margin: 0 }}>{para}</p>
                      ))}
                    </div>
                    {section.imgs.length > 0 && (
                      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: section.imageLayout === 'stack' || section.imgs.length === 1 ? '1fr' : 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, marginTop: 24 }}>
                        {section.imgs.map((img, j) => (
                          <figure key={img} style={{ margin: 0 }}>
                            <ZoomableImage
                              src={img}
                              alt={section.captions[j]}
                              containerStyle={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}
                              imageStyle={{ width: '100%', maxHeight: section.imageLayout === 'stack' ? 380 : 360, objectFit: 'contain', display: 'block', background: '#f4f8fb' }}
                            />
                            <figcaption style={{ fontFamily: C.mono, fontSize: 10, color: C.faint, marginTop: 8, textAlign: 'center', letterSpacing: '0.04em' }}>{section.captions[j]}</figcaption>
                          </figure>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            ) : (
              <>
                {p.studies && (
                  <div style={{ marginBottom: 32 }}>
                    <div
                      role="tablist"
                      aria-label={`Études du ${p.title}`}
                      style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: 6, marginBottom: 20, background: C.light, border: `1px solid ${C.border}`, borderRadius: 8 }}
                    >
                      {p.studies.map((study, studyIndex) => {
                        const isActive = activeSaeStudy === studyIndex
                        return (
                          <button
                            key={study.label}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`sae-study-panel-${studyIndex}`}
                            id={`sae-study-tab-${studyIndex}`}
                            onClick={() => setActiveSaeStudy(studyIndex)}
                            style={{
                              flex: '1 1 150px',
                              padding: '11px 16px',
                              border: `1px solid ${isActive ? C.teal : 'transparent'}`,
                              borderRadius: 6,
                              background: isActive ? C.card : 'transparent',
                              color: isActive ? C.blue : C.muted,
                              boxShadow: isActive ? '0 3px 12px rgba(14,79,140,0.12)' : 'none',
                              cursor: 'pointer',
                              fontFamily: C.sans,
                              textAlign: 'left',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <span style={{ display: 'block', fontFamily: C.mono, fontSize: 9, color: C.teal, letterSpacing: '0.1em', marginBottom: 3 }}>{study.label}</span>
                            <span style={{ display: 'block', fontSize: 13, fontWeight: 600 }}>{study.title}</span>
                          </button>
                        )
                      })}
                    </div>
                    {p.studies.map((study, studyIndex) => (
                      <div
                        key={study.img}
                        id={`sae-study-panel-${studyIndex}`}
                        role="tabpanel"
                        aria-labelledby={`sae-study-tab-${studyIndex}`}
                        hidden={activeSaeStudy !== studyIndex}
                      >
                        <figure style={{ margin: 0 }}>
                          <ZoomableImage
                            src={study.img}
                            alt={study.caption}
                            containerStyle={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}
                            imageStyle={{ width: '100%', height: 'clamp(280px,46vw,520px)', objectFit: 'contain', display: 'block', background: '#f4f8fb' }}
                          />
                          <figcaption style={{ fontFamily: C.mono, fontSize: 10, color: C.faint, marginTop: 8, textAlign: 'center', letterSpacing: '0.04em' }}>{study.caption}</figcaption>
                        </figure>
                      </div>
                    ))}
                  </div>
                )}
                {/* Images */}
                {p.imgs.length > 0 && (
                  <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: p.imgs.length > 1 ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 32 }}>
                    {p.imgs.map((img, j) => (
                      <figure key={j} style={{ margin: 0 }}>
                        <ZoomableImage
                          src={img}
                          alt={`${p.title} — vue ${j + 1}`}
                          imageStyle={{ width: '100%', borderRadius: 8, border: `1px solid ${C.border}`, display: 'block', background: '#f4f8fb' }}
                        />
                        <figcaption style={{ fontFamily: C.mono, fontSize: 10, color: C.faint, marginTop: 6, textAlign: 'center', letterSpacing: '0.06em' }}>Vue {j + 1} — {p.title}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}
                {/* Paragraphes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {p.texte.map((para, ti) => (
                    <p key={ti} style={{ fontFamily: C.sans, fontSize: 15, color: C.muted, lineHeight: 1.85, margin: 0 }}>{para}</p>
                  ))}
                </div>
              </>
            )}
            {/* Séparateur bas */}
            {pi < projets.length - 1 && (
              <div style={{ height: 1, background: C.border, marginTop: 80 }} />
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

// ─── CENTRES D’INTÉRÊT ────────────────────────────────────────────────────────
function PageActivitePerso() {
  const [selected, setSelected] = useState<number | null>(null)

  const loisirs = [
    {
      title: 'Faire du sport',
      ico: '01',
      desc: "Du sport en club à la course à pied, une pratique fondée sur l’esprit d’équipe et le dépassement de soi.",
      tags: ['Course à pied', 'Sport en club', 'Solidarité'],
      detail: "Depuis mon enfance, j’ai toujours pratiqué un sport en club : judo, basket-ball, boxe et football. Ces disciplines m’ont permis de développer mon esprit d’équipe. Durant ma vie étudiante, j’ai commencé la course à pied et participé à différentes épreuves, parfois pour soutenir une cause — comme les Foulées roses, engagées dans la lutte contre le cancer du sein — et parfois simplement pour le dépassement de soi.",
      imgs: ['/interet-course-1.jpg', '/interet-course-2.jpg', '/interet-sport-course-competition.jpg'],
      imageFit: 'cover' as const,
    },
    {
      title: 'Assister à des événements sportifs',
      ico: '02',
      desc: "Découvrir différentes disciplines à travers les compétitions et les performances de haut niveau.",
      tags: ['Handball', 'Football', 'Basket-ball'],
      detail: "Regarder du sport de haut niveau est pour moi une manière de découvrir différentes disciplines, comme le handball, le football ou le basket-ball. Grâce à ma localisation à Orléans, j’ai pu assister à de nombreux événements de ce type et apprécier l’intensité, la technique et l’ambiance propres aux grandes compétitions.",
      imgs: ['/interet-sport-handball.jpg', '/interet-evenement-basket.jpg', '/interet-evenement-football.jpg'],
      imageFit: 'cover' as const,
    },
    {
      title: 'BDE GMP',
      ico: '03',
      desc: "Un engagement dans la vie étudiante en tant que secrétaire du BDE GMP de l’IUT d’Orléans.",
      tags: ['Secrétaire', 'Vie étudiante', 'Organisation'],
      detail: "J’ai fait partie du BDE GMP de l’IUT d’Orléans en tant que secrétaire. J’ai donc été chargé de la communication et des partenariats au sein du BDE. Avec les autres membres, nous avons participé à l’animation de la vie étudiante et organisé différents événements, notamment une Course contre la Faim. Cette expérience m’a permis de contribuer à un projet collectif tout en développant mon sens de l’organisation.",
      imgs: ['/interet-bde-gmp.png'],
      imageFit: 'contain' as const,
    },
    {
      title: 'Rassemblements et salons automobiles',
      ico: '04',
      desc: "Partager une passion pour les voitures anciennes et découvrir les nouvelles technologies automobiles.",
      tags: ['Voitures anciennes', 'Salons', 'Innovation'],
      detail: "Avec des amis, je participe à des rassemblements de voitures anciennes. Nous apprécions également les salons automobiles, qui permettent de découvrir de nouveaux modèles, d’observer les évolutions du secteur et de mieux comprendre les technologies qui façonnent l’automobile de demain.",
      imgs: ['/interet-rassemblement-auto.jpg', '/interet-salon-auto-f1.jpg', '/interet-salon-auto-classiques.jpg'],
      imageFit: 'cover' as const,
    },
    {
      title: 'Meetings aériens',
      ico: '05',
      desc: "Découvrir des aéronefs exceptionnels et approfondir ma passion pour l’aviation militaire.",
      tags: ['Aéronautique', 'Aviation militaire', 'Meetings'],
      detail: "Après ma deuxième phase du SNU, je me suis passionné pour l’aviation, et plus particulièrement pour l’aviation militaire. J’assiste régulièrement à des meetings aériens : ces événements me permettent de découvrir des appareils exceptionnels, d’observer leurs caractéristiques et de mieux connaître l’histoire et les technologies du monde aéronautique.",
      imgs: ['/interet-meeting-aerien-1.jpg', '/interet-meeting-aerien-2.jpg', '/interet-meeting-aerien-3.jpg', '/interet-meeting-aerien-4.jpg'],
      imageFit: 'cover' as const,
    },
  ]

  const l = selected !== null ? loisirs[selected] : null

  return (
    <div className="page-shell" style={{ padding: 'clamp(48px,8vw,96px) clamp(28px,7vw,110px)', maxWidth: 1200, margin: '0 auto' }}>
      <SectionTitle num="04 — Centres d’intérêt">Passions & activités</SectionTitle>
      <p style={{ fontFamily: C.sans, fontSize: 15, color: C.faint, lineHeight: 1.8, maxWidth: 820, marginTop: -32, marginBottom: 48 }}>
        En complément de mon cursus et de mon expérience professionnelle, je cultive plusieurs passions qui nourrissent ma créativité et mon sens du dépassement de soi. Cliquez sur une carte pour en savoir plus.
      </p>

      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
        {loisirs.map((item, i) => (
          <div
            key={i}
            onClick={() => setSelected(i)}
            style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
              overflow: 'hidden', cursor: 'pointer',
              transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = C.blue; el.style.boxShadow = '0 4px 20px rgba(14,79,140,0.12)'; el.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = C.border; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)' }}
          >
            {item.imgs.length > 0 ? (
              <div style={{ height: 160, position: 'relative' }}>
                <ZoomableImage
                  src={item.imgs[0]}
                  alt={item.title}
                  loading="lazy"
                  containerStyle={{ width: '100%', height: '100%' }}
                  imageStyle={{ width: '100%', height: '100%', objectFit: item.imageFit, display: 'block', background: item.imageFit === 'contain' ? C.light : C.card }}
                />
                <div style={{ position: 'absolute', bottom: 10, right: 10, background: C.blue, borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 13 }}>↗</span>
                </div>
              </div>
            ) : (
              <div style={{ height: 100, background: C.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>{item.ico}</div>
            )}
            <div style={{ padding: '16px 18px 18px' }}>
              <div style={{ fontFamily: C.serif, fontSize: 17, color: C.text, marginBottom: 8 }}>{item.title}</div>
              <p style={{ fontFamily: C.sans, fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 12 }}>{item.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{item.tags.map(t => <Chip key={t} color={C.blue}>{t}</Chip>)}</div>
            </div>
          </div>
        ))}
      </div>

      {l && (
        <Modal onClose={() => setSelected(null)}>
          {l.imgs.length > 0 ? (
            <ZoomableImage
              src={l.imgs[0]}
              alt={`${l.title} — image de couverture`}
              containerStyle={{ height: 'clamp(240px,42vw,360px)', background: C.light, borderBottom: `1px solid ${C.border}` }}
              imageStyle={{ width: '100%', height: '100%', objectFit: l.imageFit, display: 'block', background: l.imageFit === 'contain' ? C.light : C.card }}
            />
          ) : (
            <div style={{ height: 100, background: C.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52 }}>{l.ico}</div>
          )}
          <div style={{ padding: '28px 32px 36px' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              {l.tags.map(t => <Chip key={t} color={C.blue}>{t}</Chip>)}
            </div>
            <h3 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: 24, color: C.text, margin: '0 0 14px', lineHeight: 1.2 }}>{l.title}</h3>
            <p style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20 }}>{l.desc}</p>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
              <p style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0 }}>{l.detail}</p>
            </div>
            {l.imgs.length > 1 && (
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginTop: 28 }}>
                <div style={{ fontFamily: C.mono, fontSize: 10, color: C.teal, letterSpacing: '0.12em', marginBottom: 14 }}>GALERIE</div>
                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
                  {l.imgs.slice(1).map((img, j) => (
                    <ZoomableImage
                      key={img}
                      src={img}
                      alt={`${l.title} — photo ${j + 2}`}
                      loading="lazy"
                      containerStyle={{ height: 220, borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.light }}
                      imageStyle={{ width: '100%', height: '100%', objectFit: l.imageFit, display: 'block', background: C.card }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── COMPÉTENCES ──────────────────────────────────────────────────────────────
function PageCompetences() {
  const logiciels = [
    { label: 'CATIA V5', desc: 'Modélisation de pièces et d’assemblages, conception d’outillages' },
    { label: 'Creo Parametric', desc: 'Conception paramétrique, mise en plan' },
    { label: 'SolidWorks', desc: 'Conception et modélisation 3D de pièces et d’ensembles mécaniques' },
    { label: 'Geomagic', desc: 'Logiciel de métrologie et d’analyse de données de mesure 3D' },
    { label: 'Odoo, Teams & Excel', desc: 'Planification, suivi d’avancement, partage d’informations et gestion de projet' },
    { label: 'Word', desc: 'Lecture, rédaction et mise en forme de documentation industrielle' },
  ]

  const techniques = [
    { label: 'Conception assistée par ordinateur', desc: 'Modélisation mécanique avec CATIA V5, Creo Parametric et SolidWorks' },
    { label: 'Usinage à commande numérique', desc: 'Préparation et réalisation d’opérations d’usinage sur machines à commande numérique' },
    { label: 'Usinage traditionnel', desc: 'Mise en œuvre des procédés conventionnels de fabrication mécanique' },
    { label: 'Documentation industrielle', desc: 'Lecture et rédaction de documents techniques adaptés à un environnement industriel' },
    { label: 'Gestion de projet', desc: 'Organisation, coordination et suivi des activités à l’aide d’Odoo, Teams et Excel' },
    { label: 'Métrologie', desc: 'Exploitation de Geomagic pour les activités de mesure et de contrôle' },
  ]

  const savoirEtre = [
    { label: 'Curieux', ico: '🔍', desc: 'Je cherche à comprendre en profondeur les sujets qui m\'intéressent et j\'aime apprendre de nouvelles techniques.' },
    { label: 'Appliqué', ico: '🎯', desc: 'Je m\'investis pleinement dans chaque tâche, avec le souci du travail bien fait et de la qualité rendue.' },
    { label: 'Déterminé', ico: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a6fa5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22a10 10 0 1 0-10-10"/><path d="M12 18a6 6 0 1 0-6-6"/><path d="M12 14a2 2 0 1 0-2-2"/><path d="m22 2-7 7"/><path d="M16 2h6v6"/></svg>, desc: 'Je reste engagé face aux difficultés et je mobilise les efforts nécessaires pour atteindre les objectifs fixés.' },
    { label: 'Perfectionniste', ico: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a6fa5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 2.2 4.5L19 8.2l-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8L5 8.2l4.8-.7Z"/><path d="m17 18 1.2 2.5L21 21l-2 1.9"/></svg>, desc: 'Je porte une attention particulière aux détails et cherche à améliorer la précision comme la qualité de mes réalisations.' },
    { label: 'Patient', ico: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a6fa5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>, desc: 'Je prends le temps d’analyser les situations et de progresser méthodiquement, même lorsque les tâches demandent plusieurs ajustements.' },
  ]

  const colBlue = C.blue
  const colTeal = C.teal
  const colSlate = '#4a6fa5'

  return (
    <div className="page-shell" style={{ padding: 'clamp(48px,8vw,96px) clamp(28px,7vw,110px)', maxWidth: 1200, margin: '0 auto' }}>
      <SectionTitle num="05 — Compétences">Savoir-faire & Qualités</SectionTitle>
      <p style={{ fontFamily: C.sans, fontSize: 15, color: C.faint, lineHeight: 1.8, maxWidth: 820, marginTop: -32, marginBottom: 48 }}>
        Un aperçu synthétique de mes compétences techniques, logicielles et comportementales, organisées en trois catégories. Vous y trouverez également mes certifications obtenues au cours de ma formation.
      </p>

      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 32 }}>

        {/* ── Logiciels ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: colBlue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18 }}>💻</span>
            </div>
            <div style={{ fontFamily: C.serif, fontSize: 18, color: colBlue, fontWeight: 600 }}>Logiciels et outils</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {logiciels.map(s => (
              <div key={s.label} style={{ background: C.card, borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `4px solid ${colBlue}`, borderRadius: '0 8px 8px 0', padding: '14px 16px' }}>
                <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: C.sans, fontSize: 12, color: C.faint, lineHeight: 1.55 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Techniques ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: colTeal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18 }}>⚙️</span>
            </div>
            <div style={{ fontFamily: C.serif, fontSize: 18, color: colTeal, fontWeight: 600 }}>Compétences techniques</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {techniques.map(s => (
              <div key={s.label} style={{ background: C.card, borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `4px solid ${colTeal}`, borderRadius: '0 8px 8px 0', padding: '14px 16px' }}>
                <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: C.sans, fontSize: 12, color: C.faint, lineHeight: 1.55 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Savoir-être ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: colSlate, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18 }}>🌟</span>
            </div>
            <div style={{ fontFamily: C.serif, fontSize: 18, color: colSlate, fontWeight: 600 }}>Savoir-être</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {savoirEtre.map(s => (
              <div key={s.label} style={{ background: C.card, borderTop: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, borderLeft: `4px solid ${colSlate}`, borderRadius: '0 8px 8px 0', padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.2 }}>{s.ico}</span>
                <div>
                  <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: C.sans, fontSize: 12, color: C.faint, lineHeight: 1.55 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Certifications */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 40, marginTop: 48 }}>
        <div style={{ fontFamily: C.serif, fontSize: 20, color: C.text, marginBottom: 20 }}>Formations et certifications</div>
        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {([
            ['BUT GMP', 'IUT d’Orléans — alternance', colBlue],
            ['Bac STI2D ITEC', 'Mention bien — juillet 2024', colBlue],
            ['SNU phases 1 et 2', 'Validées en 2022–2023', colTeal],
            ['PSC1', 'Secourisme — 2019', colTeal],
            ['Brevet', 'Mention très bien — 2021', colSlate],
            ['Permis B', 'Obtenu janvier 2024', colSlate],
          ] as [string, string, string][]).map(([t, o, col]) => (
            <div key={t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: col, borderRadius: '8px 8px 0 0' }} />
              <div style={{ fontFamily: C.serif, fontSize: 14, color: C.text, marginBottom: 5, marginTop: 4 }}>{t}</div>
              <div style={{ fontFamily: C.mono, fontSize: 10, color: C.faint }}>{o}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── GALERIE ──────────────────────────────────────────────────────────────────
function PageGalerie() {
  const groups = [
    {
      title: 'Projets',
      description: 'De la conception aux vérifications, ces documents retracent les principales étapes techniques et économiques du projet.',
      images: [
        { src: '/OT_NEOTECH.png', caption: 'Vue générale de l’outillage Neotech', fit: 'contain' },
        { src: '/OT_NEOTECH2.png', caption: 'Détail des systèmes de maintien et de réglage', fit: 'contain' },
        { src: '/NEOTECH_CAO_ETUDE_1.png', caption: 'Étude CAO 1 — architecture de l’outillage', fit: 'contain' },
        { src: '/NEOTECH_CAO_ETUDE_2.png', caption: 'Étude CAO 2 — assemblage avec le vitrage', fit: 'contain' },
        { src: '/NEOTECH_FICHE_POSITIONNEMENT.png', caption: 'Exemple de fiche de positionnement et de contrôle', fit: 'contain' },
        { src: '/NEOTECH_ETUDE_ECONOMIQUE_1.png', caption: 'Première étude économique — solution dédiée', fit: 'contain' },
        { src: '/NEOTECH_ETUDE_ECONOMIQUE_2.png', caption: 'Deuxième étude économique — solution mutualisée', fit: 'contain' },
        { src: '/outillage-reglable.jpg', caption: 'SAÉ 2 — Outillage de maintien réglable', fit: 'cover' },
        { src: '/prototype-impression-3d.jpg', caption: 'SAÉ 2 — Prototype de support imprimé en 3D', fit: 'cover' },
        { src: '/montage-mecanique.jpg', caption: 'SAÉ 2 — Montage mécanique de positionnement', fit: 'cover' },
      ],
    },
    {
      title: 'Autres réalisations',
      description: 'Une sélection de gabarits, masters et outillages conçus ou réalisés dans un contexte industriel aéronautique.',
      images: [
        { src: '/GABARIT.png', caption: 'Gabarit de contrôle pour pare-brise droit', fit: 'contain' },
        { src: '/GABARIT_LISSAGE.png', caption: 'Gabarit de lissage réalisé par impression 3D', fit: 'contain' },
        { src: '/MASTER.png', caption: 'Masters d’outillage en matériaux composites et en mousse', fit: 'contain' },
        { src: '/OT_POINT_EPURE.png', caption: 'Étude CAO d’un outillage point d’épure', fit: 'contain' },
        { src: '/MODIFICATION_OUTILLAGE_INJECTION_ENSEMBLE.png', caption: 'Vue d’ensemble de l’outillage d’injection de joint modifié', fit: 'contain' },
        { src: '/MODIFICATION_OUTILLAGE_INJECTION_DETAIL.png', caption: 'Détail du dispositif de contrôle d’une cote au dixième', fit: 'contain' },
        { src: '/cao-structure-support.png', caption: 'Étude CAO d’une structure support courbe', fit: 'contain' },
        { src: '/cao-assemblage-axe.png', caption: 'Analyse en coupe d’un assemblage mécanique', fit: 'contain' },
        { src: '/cao-produit-mecanique.png', caption: 'Vue éclatée d’un produit mécanique', fit: 'contain' },
        { src: '/aeroglisseur-thermoformage.jpg', caption: 'Thermoformage de la coque de l’aéroglisseur', fit: 'contain' },
        { src: '/aeroglisseur-assemblage.jpg', caption: 'Assemblage du prototype d’aéroglisseur', fit: 'contain' },
        { src: '/aeroglisseur-prototype.jpg', caption: 'Prototype final de l’aéroglisseur', fit: 'contain' },
        { src: '/OT_SQUELETTE.png', caption: 'Outillage squelette pour pare-brise gauche Daher', fit: 'contain' },
      ],
    },
    {
      title: 'Centres d’intérêt',
      description: 'Les images de mes activités sportives, de mon engagement étudiant et de mes passions automobile et aéronautique.',
      images: [
        { src: '/interet-course-1.jpg', caption: 'Course à pied — participation à une épreuve sportive', fit: 'cover' },
        { src: '/interet-course-2.jpg', caption: 'Course à pied — effort collectif et dépassement de soi', fit: 'cover' },
        { src: '/interet-sport-course-competition.jpg', caption: 'Course en compétition', fit: 'cover' },
        { src: '/interet-sport-handball.jpg', caption: 'Rencontre de handball de haut niveau à Orléans', fit: 'cover' },
        { src: '/interet-evenement-basket.jpg', caption: 'Match de basket-ball de haut niveau à Orléans', fit: 'cover' },
        { src: '/interet-evenement-football.jpg', caption: 'Match de football au stade', fit: 'cover' },
        { src: '/interet-bde-gmp.png', caption: 'BDE GMP de l’IUT d’Orléans', fit: 'contain' },
        { src: '/interet-rassemblement-auto.jpg', caption: 'Rassemblement de voitures anciennes', fit: 'cover' },
        { src: '/interet-salon-auto-f1.jpg', caption: 'Découverte d’une monoplace lors d’un salon automobile', fit: 'cover' },
        { src: '/interet-salon-auto-classiques.jpg', caption: 'Véhicules de collection présentés en salon', fit: 'cover' },
        { src: '/interet-meeting-aerien-1.jpg', caption: 'Meeting aérien — démonstration en vol', fit: 'cover' },
        { src: '/interet-meeting-aerien-2.jpg', caption: 'Meeting aérien — appareil militaire en présentation', fit: 'cover' },
        { src: '/interet-meeting-aerien-3.jpg', caption: 'Meeting aérien — découverte des aéronefs', fit: 'cover' },
        { src: '/interet-meeting-aerien-4.jpg', caption: 'Meeting aérien — passion pour l’aviation militaire', fit: 'cover' },
      ],
    },
  ] as const

  return (
    <div className="page-shell" style={{ padding: 'clamp(48px,8vw,96px) clamp(28px,7vw,110px)', maxWidth: 1300, margin: '0 auto' }}>
      <SectionTitle num="06 — Galerie">Galerie du portfolio</SectionTitle>
      <p style={{ fontFamily: C.sans, fontSize: 15, color: C.faint, lineHeight: 1.8, maxWidth: 860, marginTop: -32, marginBottom: 56 }}>
        Cet onglet répertorie uniquement les images des rubriques Projets, Autres Réalisations et Centres d’intérêt. Survolez un visuel puis utilisez le bouton central pour l’agrandir.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        {groups.map((group, gi) => (
          <section key={group.title}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 22 }}>
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.teal, paddingTop: 5 }}>{String(gi + 1).padStart(2, '0')}</span>
              <div>
                <h3 style={{ fontFamily: C.serif, fontSize: 24, color: C.text, margin: '0 0 6px' }}>{group.title}</h3>
                <p style={{ fontFamily: C.sans, fontSize: 13, color: C.faint, lineHeight: 1.65, margin: 0, maxWidth: 720 }}>{group.description}</p>
              </div>
            </div>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 18 }}>
              {group.images.map(image => (
                <div key={image.src} style={{ display: 'flex', flexDirection: 'column', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 28px rgba(14,79,140,0.14)' }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}>
                  <div style={{ height: 190, background: C.light, overflow: 'hidden' }}>
                    <ZoomableImage
                      src={image.src}
                      alt={image.caption}
                      loading="lazy"
                      containerStyle={{ width: '100%', height: '100%' }}
                      imageStyle={{ width: '100%', height: '100%', objectFit: image.fit, display: 'block' }}
                    />
                  </div>
                  <div style={{ padding: '13px 15px 15px', fontFamily: C.sans, fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{image.caption}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

// ─── CV ───────────────────────────────────────────────────────────────────────
function PageCV() {
  return (
    <div className="page-shell" style={{ padding: 'clamp(48px,8vw,96px) clamp(28px,7vw,110px)', maxWidth: 1100, margin: '0 auto' }}>
      <SectionTitle num="07 — CV">Mon parcours en un coup d’œil</SectionTitle>
      <p style={{ fontFamily: C.sans, fontSize: 15, color: C.faint, lineHeight: 1.8, maxWidth: 820, marginTop: -32, marginBottom: 48 }}>
        Vous souhaitez mieux connaître mon profil ? Je vous invite à parcourir mon CV directement ici ou à le garder à portée de main en le téléchargeant au format PDF.
      </p>
      <div className="responsive-grid cv-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, alignItems: 'start' }}>
        <div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 24px rgba(14,79,140,0.07)' }}>
            <img src="/cv-quentin-2026.png" alt="CV Quentin Pecegueiro" style={{ width: '100%', display: 'block' }} />
          </div>
          <div className="cv-file-meta" style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 6 }}>
            <span style={{ fontFamily: C.mono, fontSize: 10, color: C.faint }}>CV_QUENTIN_PECEGUEIRO_2026.pdf</span>
            <Chip color={C.blue}>Page 1/1</Chip>
          </div>
        </div>
        <div>
          <p style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 28 }}>Envie d’avoir une vue d’ensemble de mon parcours, de mes expériences et de mes compétences en Génie Mécanique et Productique ? Retrouvez toutes les informations essentielles dans mon CV.</p>
          <a href="/CV_QUENTIN_PECEGUEIRO_2026.pdf" download="CV_Quentin_Pecegueiro.pdf" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: C.sans, fontWeight: 600, fontSize: 14, padding: '14px 20px', background: C.blue, color: '#fff', borderRadius: 6, textDecoration: 'none', marginBottom: 12, boxShadow: '0 4px 14px rgba(14,79,140,0.2)' }}>
            <span>↓ Gardez mon CV à portée de main</span>
            <span style={{ fontFamily: C.mono, fontSize: 10, opacity: 0.7 }}>PDF</span>
          </a>
          <a href="https://www.linkedin.com/in/quentin-pecegueiro/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: C.sans, fontWeight: 500, fontSize: 14, padding: '12px 20px', background: 'transparent', color: C.blue, border: `1px solid ${C.border}`, borderRadius: 6, textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={C.blue}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            Voir le profil LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const [phoneCopied, setPhoneCopied] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = value
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }
  }

  async function copyPhoneNumber() {
    const phoneNumber = '+33 7 68 77 43 25'
    await copyToClipboard(phoneNumber)
    setPhoneCopied(true)
    window.setTimeout(() => setPhoneCopied(false), 2200)
  }

  async function copyEmailAddress() {
    await copyToClipboard('quenpec4580@gmail.com')
    setEmailCopied(true)
    window.setTimeout(() => setEmailCopied(false), 2200)
  }

  const footerActionStyle: React.CSSProperties = {
    fontFamily: C.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.82)',
    background: 'transparent',
    textDecoration: 'none',
    padding: '7px 12px',
    border: '1px solid rgba(255,255,255,0.28)',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s',
  }

  return (
    <footer className="site-footer" style={{ background: C.blue, padding: '20px clamp(28px,7vw,110px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
      <span style={{ fontFamily: C.mono, fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>© 2024 Quentin Pecegueiro · BUT GMP · Aéronautique</span>
      <div className="footer-actions" style={{ display: 'flex', gap: 12 }}>
        <a
          href="https://www.linkedin.com/in/quentin-pecegueiro/"
          target="_blank"
          rel="noreferrer"
          style={footerActionStyle}
          aria-label="Ouvrir le profil LinkedIn de Quentin Pecegueiro"
        >
          LinkedIn
        </a>
        <button
          type="button"
          onClick={copyEmailAddress}
          style={footerActionStyle}
          aria-label="Copier l’adresse e-mail de Quentin Pecegueiro"
          aria-live="polite"
          title="Copier l’adresse quenpec4580@gmail.com"
        >
          {emailCopied ? 'Email copié !' : 'Email'}
        </button>
        <button
          type="button"
          onClick={copyPhoneNumber}
          style={footerActionStyle}
          aria-live="polite"
          title="Copier le numéro +33 7 68 77 43 25"
        >
          {phoneCopied ? 'Numéro copié !' : 'Téléphone'}
        </button>
      </div>
    </footer>
  )
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState<Tab>('accueil')
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [active])

  const page: Record<Tab, React.ReactNode> = {
    accueil:          <HomePage onNavigate={setActive} />,
    presentation:     <PagePresentation />,
    parcours:         <PageParcours />,
    'activite-pro':   <PageActivitePro />,
    projets:          <PageProjets />,
    'activite-perso': <PageActivitePerso />,
    competences:      <PageCompetences />,
    galerie:          <PageGalerie />,
    cv:               <PageCV />,
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <NavBar active={active} onSelect={setActive} />
      <main style={{ paddingTop: 58 }} key={active} className={`page-stage page-stage-${active} fade-in-up`}>
        {page[active]}
        <PageSideDecor page={active} />
        <ScrollDownCue page={active} />
      </main>
      <Footer />
      <ScrollTopButton />
    </div>
  )
}
