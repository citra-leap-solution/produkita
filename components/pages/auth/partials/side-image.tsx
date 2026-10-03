'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const W = 799
const H = 1080

export default function AuthSideImage() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const compute = () => {
      const r = el.getBoundingClientRect()
      setScale(Math.min(r.width / W, r.height / H, 1))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      // PERUBAHAN: Tambahkan `sticky top-0 h-screen` dan kembalikan ke `items-center`
      className="hidden lg:flex flex-1 overflow-hidden items-center justify-center sticky top-0 h-screen"
      style={{
        background: 'linear-gradient(324.43deg, #1d4ed8 67.04%, #2563eb 80.48%, #60a5fa 100%)'
      }}
    >
      <div
        className="relative shrink-0"
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          // PERUBAHAN: Kembalikan ke center agar gambar diposisikan presisi di tengah layar
          transformOrigin: 'center center',
          overflow: 'hidden',
        }}
      >
        {/* Glow 1 */}
        <div className="absolute pointer-events-none" style={{ width: 237.24, height: 237.24, left: 96.77, top: 899.7, background: 'radial-gradient(70.71% 70.71% at 50% 50%, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%)', borderRadius: 118.62 }} />

        {/* Glow 2 */}
        <div className="absolute pointer-events-none" style={{ width: 170.81, height: 170.81, left: 666.15, top: 529.6, background: 'radial-gradient(70.71% 70.71% at 50% 50%, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0) 70%)', borderRadius: 85.4062 }} />

        {/* Vertical Line */}
        <div className="absolute pointer-events-none" style={{ width: 0.47, height: 307.46, left: 798.53, top: 670.05, background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(0, 0, 0, 0) 100%)' }} />

        {/* Garis Penghubung */}
        <svg className="absolute inset-0 pointer-events-none z-10" width={W} height={H}>
          {/* Dari Card 1 (Kiri Atas) ke Tengah */}
          <path d="M 286 246 C 350 246, 380 300, 420 380" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="420" cy="380" r="3" fill="white" opacity="0.85" />

          {/* Dari Card 2 (Kiri Bawah) ke Tengah */}
          <path d="M 298 620 C 350 620, 360 550, 420 500" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="420" cy="500" r="3" fill="white" opacity="0.85" />

          {/* Dari Card 3 (Kanan Atas) ke Tengah */}
          <path d="M 468 350 C 430 350, 400 300, 370 250" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="370" cy="250" r="3" fill="white" opacity="0.9" />

          {/* Dari Card 4 (Kanan Bawah) ke Tengah */}
          <path d="M 506 671 C 450 671, 420 600, 380 550" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="380" cy="550" r="3" fill="white" opacity="0.9" />
        </svg>

        {/* Rectangle 8 Gradient Overlay */}
        <div className="absolute pointer-events-none z-10" style={{ width: 799, height: 282, left: 0, top: 558, background: 'linear-gradient(180deg, rgba(29, 78, 216, 0) 0%, rgba(29, 78, 216, 0.25) 12.17%, rgba(29, 78, 216, 0.75) 29.19%, #1d4ed8 53.44%)' }} />

        {/* Main Image 67 */}
        <div className="absolute z-0" style={{ left: 81, top: 229, width: 637, height: 530 }}>
          <Image src="/assets/auth/image 67.png" alt="Scan QR" fill className="object-contain" priority />
        </div>

        {/* --- Card 1: NAMA PRODUK --- */}
        <div
          className="absolute box-border z-20"
          style={{
            left: 78, top: 162, width: 208.77, height: 169.86,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '0.632639px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0px 15.1833px 45.55px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(5px)',
            borderRadius: 17.0812
          }}
        >
          <div className="absolute" style={{ width: 2.85, height: 100.59, left: 206.24, top: 34.64, background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #60a5fa 25%, #2563eb 50%, #60a5fa 75%, rgba(0, 0, 0, 0) 100%)', filter: 'drop-shadow(0px 0px 7.59166px rgba(96, 165, 250, 0.6))', borderRadius: 93.9468 }} />
          <div className="absolute" style={{ left: 21.35, top: 21.74, width: 166.07 }}>
            <span style={{ fontSize: 9.48958, letterSpacing: 0.948958, textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.45)' }}>NAMA PRODUK</span>
          </div>
          <div className="absolute" style={{ left: 21.35, top: 45.55, width: 166.07 }}>
            <span style={{ fontWeight: 800, fontSize: 17.0812, lineHeight: '20px', color: '#FFFFFF' }}>Susu Segar<br/>Full Cream</span>
          </div>
          <div className="absolute" style={{ width: 70.22, height: 21.83, left: 21.47, top: 99.49, background: 'rgba(37, 99, 235, 0.35)', borderRadius: 47.4479, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 10.4385, letterSpacing: 0.313156, color: 'rgba(255, 255, 255, 0.9)', width: '100%', textAlign: 'center' }}>Minuman</span>
          </div>
          <div className="absolute" style={{ width: 64.53, height: 21.83, left: 98.28, top: 99.49, background: 'rgba(74, 222, 128, 0.2)', borderRadius: 47.4479, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 10.4385, letterSpacing: 0.313156, color: '#4ADE80', width: '100%', textAlign: 'center' }}>✓ BPOM</span>
          </div>
          <div className="absolute" style={{ left: 21.35, top: 132.23 }}>
            <span style={{ fontSize: 10.4385, color: 'rgba(255, 255, 255, 0.4)' }}>UMKM Nusantara · 1000 ml</span>
          </div>
        </div>

        {/* --- Card 2: INFO PRODUK --- */}
        <div
          className="absolute box-border z-20"
          style={{
            left: 90, top: 526, width: 208.77, height: 199.28,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '0.632639px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0px 15.1833px 45.55px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(5px)',
            borderRadius: 17.0812
          }}
        >
          <div className="absolute" style={{ width: 2.85, height: 118.62, left: 206.24, top: 40.33, background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #60a5fa 25%, #2563eb 50%, #60a5fa 75%, rgba(0, 0, 0, 0) 100%)', filter: 'drop-shadow(0px 0px 7.59166px rgba(96, 165, 250, 0.6))', borderRadius: 93.9468 }} />
          <div className="absolute" style={{ left: 21.35, top: 21.51 }}>
            <span style={{ fontSize: 9.48958, letterSpacing: 0.948958, textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.45)' }}>INFO PRODUK</span>
          </div>
          <div className="absolute flex flex-col" style={{ left: 21.35, top: 46.97, width: 166.07, height: 130.96, gap: 8.22 }}>
             <Row label="Volume" val="1.000 ml" labelWidth={40} valWidth={48} />
             <Row label="Expired" val="Des 2025" labelWidth={40} valWidth={55} />
             <Row label="BPOM" val="MD 123456" labelWidth={34} valWidth={64} />
             <Row label="Barcode" val="6901234567" labelWidth={44} valWidth={72} />
          </div>
        </div>

        {/* --- Card 3: INFORMASI PERUSAHAAN --- */}
        <div
          className="absolute box-border z-20"
          style={{
            left: 468, top: 224, width: 227.75, height: 252.42,
            background: 'rgba(255, 255, 255, 0.09)',
            border: '0.632639px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0px 18.9792px 53.1416px rgba(0, 0, 0, 0.38)',
            backdropFilter: 'blur(2px)',
            borderRadius: 18.9792
          }}
        >
          <div className="absolute" style={{ width: 2.85, height: 140.45, left: -0.32, top: 55.99, background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #93c5fd 25%, #2563eb 50%, #93c5fd 75%, rgba(0, 0, 0, 0) 100%)', filter: 'drop-shadow(0px 0px 9.48958px rgba(147, 197, 253, 0.55))', borderRadius: 93.9468 }} />
          <div className="absolute" style={{ left: 23.25, top: 23.33 }}>
            <span style={{ fontWeight: 700, fontSize: 9.48958, letterSpacing: 1.13875, textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)' }}>INFORMASI PERUSAHAAN</span>
          </div>
          <div className="absolute flex flex-col" style={{ left: 23.25, top: 50.69, width: 181.25, height: 137.6, gap: 9.17 }}>
            <Row label="Nama" val="PT Nusantara" labelWidth={31} valWidth={75} />
            <Row label="Kota" val="Bandung, ID" labelWidth={24} valWidth={67} />
            <Row label="Berdiri" val="2018" labelWidth={35} valWidth={28} />
            <Row label="Sertifikat" val="ISO 9001" color="#4ADE80" labelWidth={48} valWidth={52} />
          </div>
          <div className="absolute box-border flex items-center" style={{ left: 23.25, top: 201.5, width: 181.25, height: 27.52, borderTop: '0.632639px solid rgba(255, 255, 255, 0.08)', padding: '11.3875px 0px 0px 0.158088px', gap: 5.56 }}>
            <div style={{ width: 5.69, height: 5.69, background: '#4ADE80', boxShadow: '0px 0px 5.69375px rgba(74, 222, 128, 0.9)', borderRadius: 2.84687 }} />
            <span style={{ fontSize: 10.4385, lineHeight: '16px', color: 'rgba(255, 255, 255, 0.5)', width: 123 }}>Bisnis Aktif & Terverifikasi</span>
          </div>
        </div>

        {/* --- Card 4: SARAN PENYAJIAN --- */}
        <div
          className="absolute box-border z-20"
          style={{
            left: 506, top: 540, width: 227.75, height: 263.81,
            background: 'rgba(255, 255, 255, 0.09)',
            border: '0.632639px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0px 18.9792px 53.1416px rgba(0, 0, 0, 0.38)',
            backdropFilter: 'blur(5px)',
            borderRadius: 18.9792
          }}
        >
          <div className="absolute" style={{ width: 2.85, height: 147.09, left: -0.32, top: 58.36, background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #93c5fd 25%, #2563eb 50%, #93c5fd 75%, rgba(0, 0, 0, 0) 100%)', filter: 'drop-shadow(0px 0px 9.48958px rgba(147, 197, 253, 0.55))', borderRadius: 93.9468 }} />
          <div className="absolute" style={{ left: 23.25, top: 23.41 }}>
            <span style={{ fontWeight: 700, fontSize: 9.48958, letterSpacing: 1.13875, textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)' }}>SARAN PENYAJIAN</span>
          </div>
          <div className="absolute flex flex-col" style={{ left: 23.25, top: 50.77, width: 181.25, height: 189.79, gap: 10.12 }}>
            <ServeRow icon="🌡" text="Sajikan dingin 4–8°C" textWidth={112} />
            <ServeRow icon="🥛" text="Kocok sebelum diminum" textWidth={131} />
            <ServeRow icon="⏱️" text="Habiskan dalam 2 hari" textWidth={118} />
            <ServeRow icon="🚫" text="Jangan dibekukan" textWidth={99} />
          </div>
        </div>

        {/* Text Area */}
        <div className="absolute flex flex-col z-20" style={{ left: 63, top: 857, width: 671, height: 79, gap: 10, alignItems: 'flex-start' }}>
          <h2 style={{ fontWeight: 600, fontSize: 26, lineHeight: '31px', color: '#FFFFFF', width: 671, height: 31, margin: 0 }}>
            Digitalisasikan produk dan operasional bisnis Anda.
          </h2>
          <p style={{ fontWeight: 400, fontSize: 16, lineHeight: '19px', color: '#FFFFFF', opacity: 0.5, width: 557, height: 38, margin: 0 }}>
            Permudah akses informasi produk dan kelola bisnis lebih efisien dengan layanan terintegrasi.
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({ label, val, color='#FFFFFF', labelWidth, valWidth }: { label: string; val: string; color?: string; labelWidth: number; valWidth: number }) {
  return (
    <div className="box-border flex flex-row justify-between items-center" style={{ width: '100%', height: 26.57, borderBottom: '0.632639px solid rgba(255, 255, 255, 0.07)', paddingBottom: 8.54062 }}>
      <span style={{ fontWeight: 400, fontSize: 11.3875, lineHeight: '17px', color: 'rgba(255, 255, 255, 0.4)', width: labelWidth }}>{label}</span>
      <span style={{ fontWeight: 700, fontSize: 11.3875, lineHeight: '17px', color: color, width: valWidth, textAlign: 'right' }}>{val}</span>
    </div>
  )
}

function ServeRow({ icon, text, textWidth }: { icon: string; text: string; textWidth: number }) {
  return (
    <div className="box-border flex flex-row items-center" style={{ width: '100%', height: 39.86, borderBottom: '0.632639px solid rgba(255, 255, 255, 0.06)', paddingBottom: 10.4385, gap: 11.17 }}>
      <div className="flex flex-row justify-center items-center" style={{ width: 28.47, height: 28.47, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 9.48958 }}>
        <span style={{ fontWeight: 400, fontSize: 13.2854, color: '#0A0A0A' }}>{icon}</span>
      </div>
      <span style={{ fontWeight: 500, fontSize: 11.3875, lineHeight: '15px', color: 'rgba(255, 255, 255, 0.85)', width: textWidth }}>{text}</span>
    </div>
  )
}