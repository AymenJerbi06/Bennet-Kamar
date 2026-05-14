'use client';

import { useLanguage } from './LanguageProvider';

export default function TestimonialsSection() {
  const { copy } = useLanguage();

  return (
    <section className="testimonial-section">
      <div className="stars" aria-label={copy.testimonial.aria}>★★★★★</div>
      <blockquote className="testimonial-quote">
        “{copy.testimonial.quote}”
      </blockquote>
      <p className="testimonial-author">{copy.testimonial.author}</p>
    </section>
  );
}
