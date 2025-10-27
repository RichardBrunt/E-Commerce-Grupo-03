import React, { useEffect, useRef, useState } from 'react';

// Mapeo de IDs de categoría a videos locales y metadatos
const CATEGORY_META = {
  '1': { key: 'macbook', video: '/video/MacbookPro_Intro.mp4', title: 'MacBook Air M4', desc: 'Potencia y portabilidad en su máxima expresión.', price: '$1.499.999' },
  '2': { key: 'iphone', video: '/video/Iphone17Pro_Intro.mp4', title: 'iPhone 17 Pro', desc: 'La mejor cámara y rendimiento en tu mano.', price: '$999.999' },
  '3': { key: 'ipad', video: '/video/IpadAir_Intro.mp4', title: 'iPad Pro', desc: 'Creatividad y productividad sin límites.', price: '$799.999' },
  '4': { key: 'watch', video: '/video/AppleWatch11_Intro.mp4', title: 'Apple Watch Series', desc: 'Salud, deporte y estilo en tu muñeca.', price: '$499.999' },
  'cdbe': { key: 'airpods', video: '/video/AirPods3_Intro.mp4', title: 'AirPods Pro', desc: 'Sonido envolvente y libertad total.', price: '$299.999' },
};

export default function Banners({ categoryId, onBuy }) {
  const [fade, setFade] = useState(false);
  const videoRef = useRef(null);

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

  const meta = CATEGORY_META[categoryId] || CATEGORY_META['1'];

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
