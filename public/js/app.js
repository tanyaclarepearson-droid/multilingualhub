(async function () {
  const params = new URLSearchParams(location.search);
  if (params.get('dev') === '1') document.documentElement.classList.add('dev');

  const layer = document.getElementById('hotspotLayer');

  let map = [];
  try {
    const r = await fetch('/data/hotspots.json', { cache: 'no-cache' });
    if (r.ok) map = await r.json();
  } catch (e) { map = []; }

  map.forEach(h => {
    const btn = document.createElement('button');
    btn.className = 'hotspot';
    btn.type = 'button';
    btn.setAttribute('aria-label', h.label || h.id || 'Hotspot');
    btn.dataset.id = h.id || '';
    const [x,y,w,hg] = h.rect;
    Object.assign(btn.style, {
      left:(x*100)+'%', top:(y*100)+'%',
      width:(w*100)+'%', height:(hg*100)+'%'
    });

    btn.addEventListener('click', () => {
      if (h.dataOpen) {
        document.dispatchEvent(new CustomEvent('hub:open', { detail:{ target:h.dataOpen, meta:h } }));
      } else if (h.href) {
        if (h.target === '_blank') window.open(h.href, '_blank', 'noopener');
        else location.href = h.href;
      }
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });

    layer.appendChild(btn);
  });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && !localStorage.getItem('hubOnboardingDone')) {
    layer.querySelectorAll('.hotspot').forEach(h => h.classList.add('pulse-once'));
    setTimeout(() => {
      layer.querySelectorAll('.hotspot').forEach(h => h.classList.remove('pulse-once'));
      localStorage.setItem('hubOnboardingDone','1');
    }, 3600);
  }

  document.addEventListener('hub:open', (e) => {
    const tgt = e.detail?.target;
    if (tgt === 'music') document.querySelector('.hotspot-music')?.click();
    if (tgt === 'pennants') document.querySelector('.hotspot-pennants')?.click();
  });
})();

