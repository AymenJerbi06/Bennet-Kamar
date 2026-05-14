'use client';

import { useLanguage } from './LanguageProvider';

export default function StorySection() {
  const { copy } = useLanguage();

  return (
    <section id="story" className="story-section">
      <div className="story-copy">
        <h2>{copy.story.title}</h2>
        <p>
          {copy.story.body}
        </p>
      </div>
      <div className="slope bottom white" />
    </section>
  );
}
