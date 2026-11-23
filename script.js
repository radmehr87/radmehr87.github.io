(() => {
  const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const glyphs = ['💗','💖','💕','❤️','💞','🩷','💓'];

  // floating hearts
  const sky = document.getElementById('sky');
  function spawn() {
    if (document.hidden) return;
    const h = document.createElement('span');
    h.className = 'float';
    h.textContent = glyphs[Math.random() * glyphs.length | 0];
    const size = 14 + Math.random() * 26;
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = size + 'px';
    h.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
    h.style.setProperty('--rot', (Math.random() * 80 - 40) + 'deg');
    h.style.animationDuration = (7 + Math.random() * 7) + 's';
    sky.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
  if (!reduce) { for (let i = 0; i < 8; i++) setTimeout(spawn, i * 300); setInterval(spawn, 650); }

  // burst of hearts at a point
  function burst(x, y, n = 10) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'pop';
      p.textContent = glyphs[Math.random() * glyphs.length | 0];
      p.style.left = x + 'px'; p.style.top = y + 'px';
      const a = Math.random() * Math.PI * 2, r = 50 + Math.random() * 80;
      p.style.setProperty('--dx', Math.cos(a) * r + 'px');
      p.style.setProperty('--dy', Math.sin(a) * r - 30 + 'px');
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }
  document.addEventListener('pointerdown', e => {
    if (!e.target.closest('button, a')) burst(e.clientX, e.clientY, 5);
  });

  // fill the heart
  const heart = document.getElementById('bigHeart');
  const fill = document.getElementById('fill');
  const pct = document.getElementById('pct');
  const hint = document.getElementById('heartHint');
  const reveal = document.getElementById('reveal');
  const steps = ['ادامه بده…', 'یه کم دیگه…', 'داره پر می‌شه…', 'تقریباً رسیدیم…'];
  let level = 0;
  heart.addEventListener('click', e => {
    const r = heart.getBoundingClientRect();
    burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2, 8);
    if (level >= 100) { burst(r.left + r.width / 2, r.top + r.height / 2, 18); return; }
    level = Math.min(100, level + 10);
    fill.setAttribute('y', 92 - 92 * level / 100);
    pct.textContent = fa(level) + '٪';
    hint.textContent = steps[Math.min(steps.length - 1, Math.floor(level / 30))];
    if (level === 100) {
      heart.classList.add('full');
      pct.textContent = '💗';
      hint.textContent = 'پر شد، درست مثل دل من.';
      reveal.classList.add('show');
      burst(r.left + r.width / 2, r.top + r.height / 2, 30);
    }
  });

  // envelope
  const env = document.getElementById('envelope');
  const letter = document.getElementById('letter');
  env.addEventListener('click', () => {
    const open = env.classList.toggle('open');
    env.setAttribute('aria-expanded', open);
    env.querySelector('.env-label').textContent = open ? 'بستن نامه' : 'بازش کن';
    letter.hidden = !open;
    if (open) {
      const r = env.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + 40, 12);
      setTimeout(() => letter.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }), 250);
    }
  });

  // reason cards
  document.querySelectorAll('.card').forEach(c =>
    c.addEventListener('click', () => c.classList.toggle('flip')));

  // love meter
  const meterFill = document.getElementById('meterFill');
  const label = document.getElementById('meterLabel');
  const meter = document.getElementById('meter');
  document.getElementById('measure').addEventListener('click', e => {
    meterFill.style.width = '0';
    label.textContent = 'دارم اندازه می‌گیرم…';
    requestAnimationFrame(() => setTimeout(() => { meterFill.style.width = '100%'; }, 60));
    let n = 0;
    const t = setInterval(() => {
      n += 7;
      if (n >= 100) {
        clearInterval(t);
        meter.setAttribute('aria-valuenow', 100);
        label.textContent = 'خطا: عدد جا نشد. بی‌نهایت ♾️💗';
        burst(e.clientX, e.clientY, 20);
      } else label.textContent = fa(n) + '٪';
    }, 150);
  });
})();
