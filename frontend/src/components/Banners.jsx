import React, { useEffect, useRef, useState } from 'react';
import useCategories from '@/hooks/useCategories.js'

// Mapeo de "familias" a videos locales y metadatos
const CATEGORY_META = {
  macbook: { key: 'macbook', video: '/video/MacbookPro_Intro.mp4', title: 'MacBook Air M4', desc: 'Potencia y portabilidad en su máxima expresión.', price: '$1.499.999' },
  iphone: { key: 'iphone', video: '/video/Iphone17Pro_Intro.mp4', title: 'iPhone 17 Pro', desc: 'La mejor cámara y rendimiento en tu mano.', price: '$999.999' },
  ipad: { key: 'ipad', video: '/video/IpadAir_Intro.mp4', title: 'iPad Pro', desc: 'Creatividad y productividad sin límites.', price: '$799.999' },
  watch: { key: 'watch', video: '/video/AppleWatch11_Intro.mp4', title: 'Apple Watch Series', desc: 'Salud, deporte y estilo en tu muñeca.', price: '$499.999' },
  airpods: { key: 'airpods', video: '/video/AirPods3_Intro.mp4', title: 'AirPods Pro', desc: 'Sonido envolvente y libertad total.', price: '$299.999' },
  default: { key: 'macbook', video: '/video/MacbookPro_Intro.mp4', title: 'Apple Store', desc: 'Todo lo que te gusta, en un solo lugar.', price: '' },
};

const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

function familyFromCategoryName(name) {
  const n = normalize(name)
  if (n.includes('airpod')) return 'airpods'
  if (n.includes('watch') || n.includes('reloj')) return 'watch'
  if (n.includes('ipad') || n.includes('tablet')) return 'ipad'
  if (n.includes('iphone')) return 'iphone'
  if (n.includes('mac') || n.includes('macbook')) return 'macbook'
  // otras familias futuras pueden agregarse acá
  return 'default'
}

export default function Banners({ categoryId, onBuy }) {
  const [fade, setFade] = useState(false);
  const videoRef = useRef(null);
  const { data: cats } = useCategories()

  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => setFade(false), 400);
    return () => clearTimeout(timeout);
  }, [categoryId]);

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Resolver familia/meta según el nombre real de la categoría
  const selected = cats.find(c => String(c.id) === String(categoryId))
  const family = selected ? familyFromCategoryName(selected.name) : 'default'
  const meta = CATEGORY_META[family] || CATEGORY_META.default;
  // Ajuste estético: para iPhone bajamos el foco del video (object-position)
  const objectPosition = family === 'iphone' ? '50% 10%' : '50% 50%'

  return (
    <section
      className="apple-hero-banner"
      style={{
        position: 'relative',
        width: '100%',
        height: '340px',
        overflow: 'hidden',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <video
        key={meta.key}
        ref={videoRef}
        src={meta.video}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
          opacity: fade ? 0 : 1,
          transition: 'opacity 0.4s ease',
          zIndex: 1,
        }}
        loop={false}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '32px',
          transform: 'translateX(-50%)',
          zIndex: 2,
        }}
      >
        <button
          style={{
            background: '#fff',
            color: '#111',
            border: 'none',
            borderRadius: '999px',
            padding: '10px 32px',
            fontWeight: 600,
            fontSize: '1.05rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          onClick={onBuy}
        >Saber más</button>
      </div>
    </section>
  );
}
