  document.querySelectorAll('.script-toggle').forEach((toggle) => {
    const panel = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!panel) return;
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  });
  (function(){
    const t=document.getElementById('moreWorksToggle'), p=document.getElementById('moreWorksPanel');
    if(!t||!p) return;
    t.addEventListener('click', () => {
      const open=p.classList.toggle('open');
      t.setAttribute('aria-expanded', String(open));
    });
  })();
  document.querySelectorAll('.carousel').forEach((c) => {
    const track=c.querySelector('.carousel-track');
    const slides=c.querySelectorAll('.carousel-slide');
    const prev=c.querySelector('.carousel-btn.prev'), next=c.querySelector('.carousel-btn.next');
    const dots=c.querySelectorAll('.carousel-dot');
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const idx=() => Math.round(track.scrollLeft / track.clientWidth);
    const go=(i) => {
      i=Math.max(0, Math.min(slides.length-1, i));
      track.scrollTo({ left:i*track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    };
    const update=() => {
      const i=idx();
      prev.disabled=i<=0; next.disabled=i>=slides.length-1;
      dots.forEach((d,k) => { d.classList.toggle('active', k===i); if(k===i) d.setAttribute('aria-current','true'); else d.removeAttribute('aria-current'); });
    };
    prev.addEventListener('click', () => go(idx()-1));
    next.addEventListener('click', () => go(idx()+1));
    dots.forEach((d,k) => d.addEventListener('click', () => go(k)));
    track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive:true });
    track.addEventListener('keydown', (e) => {
      if(e.key==='ArrowLeft'){ e.preventDefault(); go(idx()-1); }
      else if(e.key==='ArrowRight'){ e.preventDefault(); go(idx()+1); }
    });
    window.addEventListener('resize', update);
    update();
  });
  (function(){
    const tabs=[...document.querySelectorAll('.writing-tab')], pieces=[...document.querySelectorAll('.writing-piece')];
    const next=document.querySelector('.writing-next'), no=document.querySelector('.sheet-no');
    if(!tabs.length) return;
    let cur=0;
    const pad=(n) => String(n).padStart(2,'0');
    const show=(i) => {
      cur=i;
      tabs.forEach((t,k) => { t.classList.toggle('active',k===i); t.setAttribute('aria-pressed',String(k===i)); });
      pieces.forEach((p,k) => { p.classList.toggle('active',k===i); if(k===i) p.scrollTop=0; });
      if(no) no.textContent=pad(i+1)+' / '+pad(tabs.length);
    };
    tabs.forEach((t,i) => t.addEventListener('click', () => show(i)));
    if(tabs.length>1 && next){ next.hidden=false; next.addEventListener('click', () => show((cur+1)%tabs.length)); }
    show(0);
  })();
