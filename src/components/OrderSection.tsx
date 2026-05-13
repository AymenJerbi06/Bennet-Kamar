'use client';

import { FormEvent, useState } from 'react';
import { MessageCircle } from 'lucide-react';

type FormState = {
  inquiry: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const inquiryOptions = ['Collaboration', 'Product question', 'Order issue', 'Other inquiry'];

export default function OrderSection() {
  const [form, setForm] = useState<FormState>({
    inquiry: 'Product question',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const update = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = [
      'New Bennet Kamar inquiry',
      '',
      `Type: ${form.inquiry}`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || 'Not provided'}`,
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
          <h2 className="contact-title">Contact Us</h2>

          <form className="contact-form" onSubmit={submit}>
            <div className="option-list">
              <div className="form-group-title">
                What can we help with? <span>(required)</span>
              </div>

              {inquiryOptions.map(label => (
                <label key={label} className="check-row">
                  <input
                    type="radio"
                    name="inquiry"
                    checked={form.inquiry === label}
                    onChange={() => update('inquiry', label)}
                  />
                  {label}
                </label>
              ))}
            </div>

            <label className="field">
              <span className="field-label">Name <em>(required)</em></span>
              <input
                value={form.name}
                onChange={event => update('name', event.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Email <em>(required)</em></span>
              <input
                type="email"
                value={form.email}
                onChange={event => update('email', event.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={event => update('phone', event.target.value)}
              />
            </label>

            <label className="field">
              <span className="field-label">Message <em>(required)</em></span>
              <textarea
                value={form.message}
                onChange={event => update('message', event.target.value)}
                required
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="black-btn checkout-submit">
                <MessageCircle size={20} />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
