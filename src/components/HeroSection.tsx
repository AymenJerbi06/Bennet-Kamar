'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useLanguage } from './LanguageProvider';

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { copy } = useLanguage();

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.82;
  }, []);

  return (
    <section id="home" className="hero">
      <video
        ref={videoRef}
        className="hero-media"
        src="/videos/landing-vid1.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="hero-content">
        <div className="hero-mark">
          <div className="hero-logo-wrap">
            <Image
              src="/logo.jpg"
              alt="Bennet Kamar"
              width={420}
              height={420}
              priority
            />
          </div>
          <div className="hero-arabic">بنة قمر</div>
          <div className="hero-since">
            {copy.hero.homemadeBy}{' '}
            <a
              href="https://www.instagram.com/feriel_loukil/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Feriel
            </a>
          </div>
        </div>
      </div>

      <div className="slope bottom wheat" />
    </section>
  );
}
