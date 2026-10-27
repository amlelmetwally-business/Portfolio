  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuBtn.textContent = isOpen ? '✕' : '☰';
    menuBtn.setAttribute('aria-expanded', isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.textContent = '☰';
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  (function(){
    const track = document.getElementById('rvTrack');
    const prev = document.getElementById('rvPrev');
    const next = document.getElementById('rvNext');
    if(!track) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = Array.from(track.querySelectorAll('.rv-card'));
    const centerOf = c => c.offsetLeft + c.offsetWidth / 2;
    const go = dir => {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let cur = 0;
      cards.forEach((c, i) => { if(Math.abs(centerOf(c) - mid) < Math.abs(centerOf(cards[cur]) - mid)) cur = i; });
      const t = cards[Math.max(0, Math.min(cards.length - 1, cur + dir))];
      track.scrollTo({ left: centerOf(t) - track.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
    };
    const sync = () => {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    };
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    track.addEventListener('scroll', sync, { passive:true });
    window.addEventListener('resize', sync);
    track.addEventListener('keydown', e => {
      if(e.key === 'ArrowRight'){ e.preventDefault(); go(1); }
      if(e.key === 'ArrowLeft'){ e.preventDefault(); go(-1); }
    });
    // drag to scroll with a mouse (touch and trackpads scroll natively)
    let down = false, startX = 0, startLeft = 0;
    track.addEventListener('pointerdown', e => {
      if(e.pointerType !== 'mouse') return;
      down = true; startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', e => {
      if(down) track.scrollLeft = startLeft - (e.clientX - startX);
    });
    window.addEventListener('pointerup', () => {
      if(!down) return;
      down = false; track.classList.remove('is-dragging');
    });
    // open with the featured card (2nd) centered in the view
    let touched = false;
    ['pointerdown','wheel','touchstart','keydown'].forEach(ev => track.addEventListener(ev, () => { touched = true; }, { passive:true }));
    const centerFeatured = () => {
      const c = track.querySelector('.is-featured');
      if(!c) return;
      const prevSnap = track.style.scrollSnapType;
      track.style.scrollSnapType = 'none';
      track.scrollLeft = c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2;
      track.style.scrollSnapType = prevSnap;
      sync();
    };
    centerFeatured();
    window.addEventListener('load', () => { if(!touched) centerFeatured(); });
    sync();
  })();
