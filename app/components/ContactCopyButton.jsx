'use client';

import { useState } from 'react';
import { CONTACT_EMAIL } from '../contact.mjs';

export default function ContactCopyButton() {
  const [message, setMessage] = useState('');
  async function copyEmail() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setMessage('Osoite kopioitu.');
    } catch {
      setMessage('Kopiointi ei onnistunut. Valitse yllä oleva osoite ja kopioi se.');
    }
  }
  return (
    <div className="contact-copy">
      <button className="copy-btn" type="button" onClick={copyEmail}>
        Kopioi sähköpostiosoite
      </button>
      <span className="copy-status" role="status" aria-live="polite">{message}</span>
    </div>
  );
}
