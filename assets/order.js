(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=c=>'$'+(c/100).toFixed(2);const esc=s=>s.replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const byId={};const menu=$('[data-menu]'),nav=$('[data-catnav]');
MENU.forEach(c=>{nav.insertAdjacentHTML('beforeend',`<a href="#${c.slug}">${esc(c.title)}</a>`);
 menu.insertAdjacentHTML('beforeend',`<section class="msec" id="${c.slug}" aria-labelledby="h-${c.slug}"><div class="sec-h"><h2 id="h-${c.slug}">${esc(c.title)}</h2><span>${c.items.length} items</span></div><div class="grid">${c.items.map(i=>{byId[i.id]=i;return `<article class="card"><div class="card-body"><h3>${esc(i.name)}</h3><p>${esc(i.desc)}</p><div class="card-row"><span class="price">${fmt(i.price)}</span><button type="button" class="add" data-add="${i.id}" aria-label="Add ${esc(i.name)} to cart">+ Add</button></div></div>${i.img?`<div class="thumb"><img src="${i.img}" alt="${esc(i.name)}" width="360" height="360" loading="lazy" decoding="async"></div>`:''}</article>`}).join('')}</div></section>`)});
let cart=JSON.parse(sessionStorage.getItem('nyg-cart')||'[]').filter(l=>byId[l.id]);let mode=sessionStorage.getItem('nyg-mode')||'pickup';
const save=()=>{sessionStorage.setItem('nyg-cart',JSON.stringify(cart));sessionStorage.setItem('nyg-mode',mode)};
function render(){const list=$('[data-cart-list]');const n=cart.reduce((a,l)=>a+l.q,0),t=cart.reduce((a,l)=>a+l.q*byId[l.id].price,0);
 list.innerHTML=cart.map(l=>{const i=byId[l.id];return `<li><span class="ci-name">${esc(i.name)}</span><span class="ci-price">${fmt(i.price*l.q)}</span><span class="qty"><button type="button" data-dec="${l.id}" aria-label="Decrease ${esc(i.name)}">−</button><output>${l.q}</output><button type="button" data-inc="${l.id}" aria-label="Increase ${esc(i.name)}">+</button></span><button type="button" class="rm" data-rm="${l.id}">Remove</button></li>`}).join('');
 $('[data-cart-empty]').hidden=n>0;$('[data-subtotal]').textContent=fmt(t);$('.cart-count').textContent=n;$('.cart-btn').setAttribute('aria-label','Open cart, '+n+(n==1?' item':' items'));$('[data-checkout]').disabled=!n;
 const mb=$('.mbar');mb.hidden=!n;$('[data-mbar-count]').textContent=n+(n==1?' item':' items');$('[data-mbar-total]').textContent=fmt(t);if(!n)$('[data-checkout-note]').hidden=true;save()}
let tt;const toast=m=>{const e=$('[data-toast]');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),1600)};
document.addEventListener('click',e=>{const b=e.target.closest('button,[data-close-cart]');if(!b)return;const d=b.dataset;
 if(d.add){const l=cart.find(x=>x.id===d.add);l?l.q++:cart.push({id:d.add,q:1});render();toast('Added '+byId[d.add].name);b.classList.add('done');b.textContent='Added';setTimeout(()=>{b.classList.remove('done');b.textContent='+ Add'},1200)}
 else if(d.inc){cart.find(x=>x.id===d.inc).q++;render()}
 else if(d.dec){const l=cart.find(x=>x.id===d.dec);if(--l.q<1)cart=cart.filter(x=>x!==l);render()}
 else if(d.rm){cart=cart.filter(x=>x.id!==d.rm);render()}
 else if('openCart' in d){document.body.classList.add('cart-open');$('[data-close-cart].x').focus()}
 else if('closeCart' in d){document.body.classList.remove('cart-open')}
 else if('checkout' in d){$('[data-checkout-note]').hidden=false}
 else if('changeLoc' in d){toast('Mockup: this site is for 79 Greenwich Ave')}
 else if(d.mode){mode=d.mode;setMode()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('cart-open')});
function setMode(){$$('[data-mode]').forEach(b=>b.setAttribute('aria-checked',b.dataset.mode===mode));const txt=mode==='pickup'?'Pickup at 79 Greenwich Ave':'Delivery to your address, enter it at checkout';$('[data-mode-note]').textContent=txt;$('[data-cart-mode]').textContent=mode==='pickup'?'Pickup · 79 Greenwich Ave':'Delivery · address at checkout';save()}
const links=$$('a',nav);const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){links.forEach(a=>{const on=a.getAttribute('href')==='#'+en.target.id;a.setAttribute('aria-current',on);if(on)a.parentNode.scrollTo({left:a.offsetLeft-a.parentNode.clientWidth/2+a.offsetWidth/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})})}})},{rootMargin:'-140px 0px -60% 0px'});
$$('.msec').forEach(s=>io.observe(s));const top0=()=>{if(scrollY<300){links.forEach((a,i)=>a.setAttribute('aria-current',i===0));nav.scrollLeft=0}};addEventListener('scroll',top0,{passive:true});top0();setMode();render();})();
