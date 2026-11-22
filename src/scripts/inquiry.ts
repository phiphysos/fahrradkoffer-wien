/**
 * Anfrageformular → vorausgefüllte E-Mail (mailto).
 * Es gibt kein Backend: Die Nachricht wird erst verschickt,
 * wenn Besucher:innen sie in ihrem E-Mail-Programm absenden.
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function todayIso(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

export function initInquiry(): void {
  const form = document.querySelector<HTMLFormElement>('#inquiry-form');
  const done = document.querySelector<HTMLElement>('#inquiry-done');
  if (!form || !done) return;

  const recipient = form.dataset.email ?? '';
  const productName = form.dataset.product ?? 'Fahrradkoffer';
  const name = form.querySelector<HTMLInputElement>('#f-name')!;
  const email = form.querySelector<HTMLInputElement>('#f-email')!;
  const start = form.querySelector<HTMLInputElement>('#f-start')!;
  const end = form.querySelector<HTMLInputElement>('#f-end')!;
  const message = form.querySelector<HTMLTextAreaElement>('#f-message')!;
  const reopen = done.querySelector<HTMLAnchorElement>('#inquiry-reopen')!;
  const copyBtn = done.querySelector<HTMLButtonElement>('#inquiry-copy')!;
  const copyLabel = copyBtn.querySelector<HTMLElement>('[data-copy-label]')!;
  const backBtn = done.querySelector<HTMLButtonElement>('#inquiry-back')!;

  let submitted = false;
  let lastText = '';

  // Datumsgrenzen: kein Beginn in der Vergangenheit, Ende nicht vor Beginn.
  const today = todayIso();
  start.min = today;
  end.min = today;
  start.addEventListener('change', () => {
    end.min = start.value || today;
    if (start.value && !end.value) end.value = start.value;
  });

  function setError(input: HTMLInputElement, text: string): boolean {
    const el = document.getElementById(`${input.id}-error`);
    if (text) {
      input.setAttribute('aria-invalid', 'true');
      if (el) {
        el.textContent = text;
        el.hidden = false;
      }
      return false;
    }
    input.removeAttribute('aria-invalid');
    if (el) {
      el.textContent = '';
      el.hidden = true;
    }
    return true;
  }

  function checkDate(input: HTMLInputElement, emptyText: string): string {
    const v = input.value.trim();
    if (!v) return emptyText;
    if (!ISO_DATE.test(v)) return 'Bitte gib ein gültiges Datum ein.';
    return '';
  }

  function validate(): HTMLInputElement[] {
    const invalid: HTMLInputElement[] = [];
    const check = (input: HTMLInputElement, text: string) => {
      if (!setError(input, text)) invalid.push(input);
    };

    check(name, name.value.trim() ? '' : 'Bitte gib deinen Namen ein.');

    const mail = email.value.trim();
    check(
      email,
      !mail
        ? 'Bitte gib deine E-Mail-Adresse ein.'
        : email.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)
          ? 'Bitte gib eine gültige E-Mail-Adresse ein.'
          : '',
    );

    let startErr = checkDate(start, 'Bitte wähle den Mietbeginn.');
    if (!startErr && start.value < today) startErr = 'Der Mietbeginn darf nicht in der Vergangenheit liegen.';
    check(start, startErr);

    let endErr = checkDate(end, 'Bitte wähle das Mietende.');
    if (!endErr && !startErr && end.value < start.value) endErr = 'Das Mietende darf nicht vor dem Mietbeginn liegen.';
    check(end, endErr);

    return invalid;
  }

  function buildMail(): { subject: string; body: string } {
    const cases = (form!.querySelector<HTMLInputElement>('input[name="Koffer"]:checked')?.value ?? '1').trim();
    const from = formatDate(start.value);
    const to = formatDate(end.value);
    const note = message.value.trim();

    const subject = `Anfrage Fahrradkoffer: ${from} – ${to}, ${cases} Koffer`;
    const lines = [
      'Hallo,',
      '',
      `ich möchte gerne ${cases === '1' ? 'einen Fahrradkoffer' : `${cases} Fahrradkoffer`} (${productName}) mieten.`,
      '',
      `Name: ${name.value.trim()}`,
      `E-Mail: ${email.value.trim()}`,
      `Mietbeginn: ${from}`,
      `Mietende: ${to}`,
      `Anzahl Koffer: ${cases}`,
    ];
    if (note) lines.push('', 'Nachricht:', note);
    lines.push('', 'Ich freue mich auf eine Rückmeldung zur Verfügbarkeit.', '', 'Viele Grüße', name.value.trim());

    return { subject, body: lines.join('\r\n') };
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitted = true;

    const invalid = validate();
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const { subject, body } = buildMail();
    const href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    lastText = `An: ${recipient}\r\nBetreff: ${subject}\r\n\r\n${body}`;
    reopen.href = href;

    window.location.href = href;

    window.setTimeout(() => {
      form.hidden = true;
      done.hidden = false;
      done.focus();
    }, 300);
  });

  // Nach dem ersten Absenden live neu prüfen.
  [name, email, start, end].forEach((input) => {
    input.addEventListener('input', () => submitted && validate());
    input.addEventListener('change', () => submitted && validate());
  });

  copyBtn.addEventListener('click', async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(lastText);
      ok = true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = lastText;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ok = document.execCommand('copy');
      ta.remove();
    }
    copyLabel.textContent = ok ? 'Kopiert ✓' : 'Kopieren nicht möglich';
    window.setTimeout(() => (copyLabel.textContent = 'Text kopieren'), 2500);
  });

  backBtn.addEventListener('click', () => {
    done.hidden = true;
    form.hidden = false;
    name.focus();
  });
}
