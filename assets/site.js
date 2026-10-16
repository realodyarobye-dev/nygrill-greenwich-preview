(()=>{const b=document.querySelector('[data-nav-toggle]'),root=document.documentElement;
if(b){const set=o=>{b.setAttribute('aria-expanded',o);root.classList.toggle('nav-open',o)};
b.addEventListener('click',()=>set(b.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('nav-open')){set(false);b.focus()}});
matchMedia('(min-width:1080px)').addEventListener('change',e=>{if(e.matches)set(false)})}
const y=document.querySelector('[data-year]');if(y)y.textContent=new Date().getFullYear()})();
(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
const els=document.querySelectorAll('.sec-head,.pick,.split-media,.split-copy,.steps li,.known li,.cgroup,.facts>div,.mapcard,.visit>*,.form');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
els.forEach((el,i)=>{if(el.getBoundingClientRect().top<innerHeight)return;el.classList.add('rv');el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)})})();
