export interface ExternalLink {
  href: string;
  label: string;
}

// Texto livre do admin: aceita com ou sem protocolo, mas só gera link http(s)
export function externalLink(value: string): ExternalLink | null {
  const text = value.trim();
  if (!text) return null;

  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    if (!url.hostname.includes('.')) return null;
    const path = url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '');
    return { href: url.href, label: `${url.hostname.replace(/^www\./, '')}${path}` };
  } catch {
    return null;
  }
}

export function phoneHref(phone: string): string | null {
  const digits = phone.replace(/[^\d+]/g, '');
  return /\d{8,}/.test(digits) ? `tel:${digits}` : null;
}
