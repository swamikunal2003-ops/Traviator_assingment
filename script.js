(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menu = $(".menu-toggle"), nav = $(".nav"), toast = $(".toast");
  let toastTimer;
  function showToast(text){toast.textContent=text;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}
  menu.addEventListener("click",()=>{const open=!nav.classList.contains("open");nav.classList.toggle("open",open);menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Close menu":"Open menu")});
  $$(".nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){nav.classList.remove("open");closeLightbox()}});
  const mode=document.body.dataset.scrollMode||"smooth";
  if(mode==="cinematic"){document.documentElement.style.scrollBehavior=reduced?"auto":"smooth";$$(".section").forEach(el=>el.classList.add("cinematic"))}
  if(mode==="light"){document.documentElement.style.scrollBehavior="auto";$$(".reveal").forEach(el=>el.style.transition="opacity .25s ease")}
  if("IntersectionObserver" in window&&!reduced){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target)}}),{threshold:.1,rootMargin:"0px 0px -20px"});$$(".reveal").forEach(el=>io.observe(el))}else $$(".reveal").forEach(el=>el.classList.add("is-visible"));
  const track=$("#tour-track");
  function scrollTours(dir){const card=$(".tour-card",track);track.scrollBy({left:dir*((card?.getBoundingClientRect().width||250)+14),behavior:reduced?"auto":"smooth"})}
  $(".track-prev").addEventListener("click",()=>scrollTours(-1));$(".track-next").addEventListener("click",()=>scrollTours(1));
  $$(".heart").forEach(btn=>btn.addEventListener("click",()=>{const saved=btn.getAttribute("aria-pressed")!=="true";btn.setAttribute("aria-pressed",String(saved));btn.textContent=saved?"♥":"♡";showToast(saved?"Tour added to favourites":"Tour removed from favourites")}));
  const box=$(".lightbox"), image=$("img",box);let focusBefore=null;
  $$(".gallery-item").forEach(btn=>btn.addEventListener("click",()=>{focusBefore=btn;image.src=btn.dataset.full;image.alt=btn.getAttribute("aria-label")||"Travel photo";box.hidden=false;document.body.style.overflow="hidden";$("button",box).focus()}));
  function closeLightbox(){if(box.hidden)return;box.hidden=true;image.src="";document.body.style.overflow="";focusBefore?.focus()}
  $(".lightbox button").addEventListener("click",closeLightbox);box.addEventListener("click",e=>{if(e.target===box)closeLightbox()});
  // Demo hero controls: swap between curated scenic backgrounds while retaining the layout.
  const heroImages=[
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=90",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2200&q=90",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=90"
  ];let heroIndex=0;
  function setHero(i){heroIndex=(i+heroImages.length)%heroImages.length;const bg=$(".hero-bg");bg.style.backgroundImage=`url("${heroImages[heroIndex]}")`;$("#hero-number").textContent=String(heroIndex+1).padStart(2,"0")}
  $("#hero-prev").addEventListener("click",()=>setHero(heroIndex-1));$("#hero-next").addEventListener("click",()=>setHero(heroIndex+1));
})();

// Scroll polish: reveal is IntersectionObserver-driven; this adds a subtle active nav state.
(() => {
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window) || !sections.length) return;
  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
  sections.forEach(section => activeObserver.observe(section));
})();
