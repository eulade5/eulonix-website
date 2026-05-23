/* ===== EULONIX ===== */

const SUPABASE_URL = "https://ushpbsbvqjtujjoraxzr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaHBic2J2cWp0dWpqb3JheHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDU5OTMsImV4cCI6MjA5NTEyMTk5M30.ZVX8cWhTGjeo8_-tftX82RocsiRe5ygDcrzb_P0FsNE";
const WHATSAPP = "https://wa.me/23057062864";

/* NAV */
const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
const burger = document.getElementById('navBurger');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30));
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* YEAR */
document.getElementById('year').textContent = new Date().getFullYear();

/* REVEAL */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* COUNTERS */
const counters = document.querySelectorAll('.stat__num');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; const target = +el.dataset.count; let cur = 0;
    const step = Math.max(1, Math.ceil(target/60));
    const tick = () => { cur += step; if (cur >= target){ el.textContent = target+'+'; } else { el.textContent = cur; requestAnimationFrame(tick); } };
    tick(); cio.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cio.observe(c));

/* SERVICES */
const services = [
  ["◆","Business Websites","Polished, conversion-focused sites for modern businesses."],
  ["◆","E-Commerce Stores","Premium online stores with secure checkout & smooth UX."],
  ["◆","Portfolio Websites","Editorial-grade portfolios for creatives and studios."],
  ["◆","Corporate Websites","Trust-driven sites for enterprises and institutions."],
  ["◆","Real Estate Platforms","Listings, search, and lead capture done elegantly."],
  ["◆","Hotel & Booking","Booking-ready hospitality experiences."],
  ["◆","Restaurant Websites","Menus, reservations, and ambience that converts."],
  ["◆","Blog & News","Fast, beautiful publishing platforms."],
  ["◆","Landing Pages","High-conversion pages crafted for campaigns."],
  ["◆","Custom Web Apps","Tailor-made platforms built for your workflow."],
  ["◆","Website Redesign","Refresh outdated sites into a premium experience."],
  ["◆","SEO Optimization","Climb the ranks with technical & on-page SEO."],
  ["◆","Domain & Hosting","Setup, DNS, SSL & infrastructure handled."],
  ["◆","Website Maintenance","Updates, security & performance, monthly."],
];
const sg = document.getElementById('servicesGrid');
sg.innerHTML = services.map(([i,t,d])=>`
  <article class="svc reveal" onmousemove="this.style.setProperty('--mx',event.offsetX+'px');this.style.setProperty('--my',event.offsetY+'px')">
    <div class="svc__icon">${i}</div>
    <h3>${t}</h3><p>${d}</p>
  </article>`).join('');
sg.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* PORTFOLIO — Supabase */
const PLACEHOLDER = [
  {title:"Maison Noir",category:"E-Commerce",description:"Luxury fashion store with editorial storytelling.",image_url:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",live_url:"#"},
  {title:"Aurum Holdings",category:"Corporate",description:"Investment group corporate presence.",image_url:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",live_url:"#"},
  {title:"Prime Estates",category:"Real Estate",description:"Premium real estate listings platform.",image_url:"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",live_url:"#"},
  {title:"Saveur",category:"Restaurant",description:"Fine dining reservation & menu site.",image_url:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",live_url:"#"},
  {title:"Studio Lume",category:"Portfolio",description:"Photographer's editorial portfolio.",image_url:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",live_url:"#"},
  {title:"Atelier Co.",category:"Business",description:"Premium service business website.",image_url:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",live_url:"#"},
];

async function loadProjects(){
  const grid = document.getElementById('portfolioGrid');
  let data = [];
  try{
    const r = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`,{
      headers:{ apikey:SUPABASE_ANON_KEY, Authorization:`Bearer ${SUPABASE_ANON_KEY}` }
    });
    if (r.ok){ data = await r.json(); }
  }catch(e){ console.warn('Supabase fetch failed, using placeholders', e); }
  if (!Array.isArray(data) || data.length === 0) data = PLACEHOLDER;
  renderProjects(data);
}
function renderProjects(list){
  const grid = document.getElementById('portfolioGrid');
  const cats = ['All', ...Array.from(new Set(list.map(p=>p.category).filter(Boolean)))];
  const filters = document.getElementById('filters');
  filters.innerHTML = cats.map((c,i)=>`<button class="filter ${i===0?'active':''}" data-cat="${c}">${c}</button>`).join('');
  filters.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{
    filters.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    paint(b.dataset.cat);
  }));
  function paint(cat){
    const items = cat==='All' ? list : list.filter(p=>p.category===cat);
    grid.innerHTML = items.map(p=>`
      <article class="proj reveal">
        <div class="proj__img" style="background-image:url('${p.image_url||''}')"></div>
        <div class="proj__body">
          <div class="proj__cat">${p.category||'Project'}</div>
          <h3>${p.title||'Untitled'}</h3>
          <p>${p.description||''}</p>
          ${p.live_url?`<a class="proj__link" href="${p.live_url}" target="_blank" rel="noopener">Visit Site →</a>`:''}
        </div>
      </article>`).join('');
    grid.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  }
  paint('All');
}
loadProjects();

/* TESTIMONIALS */
const testimonials = [
  {q:"EULONIX delivered beyond our expectations. The site feels like luxury.",who:"Amara K.",role:"Founder, Maison Noir"},
  {q:"Beautifully crafted, fast, and perfectly aligned with our brand.",who:"David R.",role:"CEO, Aurum Holdings"},
  {q:"A truly premium experience from start to finish. Highly recommended.",who:"Sofia L.",role:"Director, Studio Lume"},
  {q:"They turned our vision into a digital masterpiece. Five stars.",who:"Jean P.",role:"Owner, Saveur"},
];
const track = document.getElementById('testiTrack');
const dots = document.getElementById('testiDots');
track.innerHTML = testimonials.map(t=>`<div class="testi"><q>${t.q}</q><div class="testi__who">${t.who}</div><div class="testi__role">${t.role}</div></div>`).join('');
dots.innerHTML = testimonials.map((_,i)=>`<button data-i="${i}" class="${i===0?'active':''}"></button>`).join('');
let ti = 0;
function go(i){ ti=i; track.style.transform=`translateX(-${i*100}%)`; dots.querySelectorAll('button').forEach((b,j)=>b.classList.toggle('active',j===i)); }
dots.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>go(+b.dataset.i)));
setInterval(()=>go((ti+1)%testimonials.length), 5500);

/* CONTACT → WhatsApp */
function handleContact(e){
  e.preventDefault();
  const f = e.target;
  const msg = `Hello EULONIX!%0A%0AName: ${encodeURIComponent(f.name.value)}%0AEmail: ${encodeURIComponent(f.email.value)}%0APhone: ${encodeURIComponent(f.phone.value||'-')}%0A%0A${encodeURIComponent(f.message.value)}`;
  window.open(`${WHATSAPP}?text=${msg}`, '_blank');
  return false;
}
window.handleContact = handleContact;

/* PARTICLES */
(function(){
  const c = document.getElementById('particles'); if(!c) return;
  const ctx = c.getContext('2d');
  let w,h,parts=[];
  function resize(){ w=c.width=c.offsetWidth; h=c.height=c.offsetHeight;
    parts = Array.from({length: Math.min(60, Math.floor(w/22))},()=>({
      x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.4,
      vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25, a:Math.random()*.6+.2
    }));
  }
  function tick(){
    ctx.clearRect(0,0,w,h);
    parts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(212,175,55,${p.a})`; ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  resize(); window.addEventListener('resize',resize); tick();
})();
