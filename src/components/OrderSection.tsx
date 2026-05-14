'use client';

import { FormEvent, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

type FormState = {
  inquiry: InquiryKey;
  name: string;
  email: string;
  phone: string;
  message: string;
};

type InquiryKey = 'collaboration' | 'productQuestion' | 'orderIssue' | 'other';
const inquiryOptions: InquiryKey[] = ['collaboration', 'productQuestion', 'orderIssue', 'other'];

export default function OrderSection() {
  const { copy } = useLanguage();
  const [form, setForm] = useState<FormState>({
    inquiry: 'productQuestion',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = [
      copy.contact.inquiryTitle,
      '',
      `${copy.contact.type}: ${copy.contact[form.inquiry]}`,
      `${copy.contact.name}: ${form.name}`,
      `${copy.contact.email}: ${form.email}`,
      `${copy.contact.phone}: ${form.phone || copy.contact.fallbackPhone}`,
      '',
      'Message:',
      form.message,
    ].join('\n');

    window.open(`https://wa.me/21658000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <div className="contact-media">
        <video src="/videos/hazelnut.mp4" autoPlay muted loop playsInline />
      </div>

      <section id="contact" className="contact-section">
        <div className="narrow">
          <h2 className="contact-title">{copy.contact.title}</h2>

          <form className="contact-form" onSubmit={submit}>
            <div className="option-list">
              <div className="form-group-title">
                {copy.contact.prompt} <span>{copy.contact.required}</span>
              </div>

              {inquiryOptions.map(option => (
                <label key={option} className="check-row">
                  <input
                    type="radio"
                    name="inquiry"
                    checked={form.inquiry === option}
                    onChange={() => update('inquiry', option)}
                  />
                  {copy.contact[option]}
                </label>
              ))}
            </div>

            <label className="field">
              <span className="field-label">{copy.contact.name} <em>{copy.contact.required}</em></span>
              <input
                value={form.name}
                onChange={event => update('name', event.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">{copy.contact.email} <em>{copy.contact.required}</em></span>
              <input
                type="email"
                value={form.email}
                onChange={event => update('email', event.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">{copy.contact.phone}</span>
              <input
                type="tel"
                value={form.phone}
                onChange={event => update('phone', event.target.value)}
              />
            </label>

            <label className="field">
              <span className="field-label">{copy.contact.message} <em>{copy.contact.required}</em></span>
              <textarea
                value={form.message}
                onChange={event => update('message', event.target.value)}
                required
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="black-btn checkout-submit">
                <MessageCircle size={20} />
                {copy.contact.send}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
