(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=c=>'$'+(c/100).toFixed(2);const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const byId={};const menu=$('[data-menu]'),nav=$('[data-catnav]');
MENU.forEach(c=>{nav.insertAdjacentHTML('beforeend',`<a href="#${c.slug}">${esc(c.title)}</a>`);
 menu.insertAdjacentHTML('beforeend',`<section class="msec" id="${c.slug}" aria-labelledby="h-${c.slug}"><div class="sec-h"><h2 id="h-${c.slug}">${esc(c.title)}</h2><span>${c.items.length} items</span></div><div class="grid">${c.items.map(i=>{byId[i.id]=i;return `<article class="card" data-open="${i.id}"><div class="card-body"><h3>${esc(i.name)}</h3><p>${esc(i.desc)}</p><div class="card-row"><span class="price">${fmt(i.price)}</span><button type="button" class="add" data-add="${i.id}" aria-haspopup="dialog" aria-label="Customize and add ${esc(i.name)}">+ Add</button></div></div>${i.img?`<div class="thumb"><img src="${i.img}" alt="${esc(i.name)}" width="360" height="360" loading="lazy" decoding="async"></div>`:''}</article>`}).join('')}</div></section>`)});
/* cart line: {id,q,opts:[{g,n,p}],notes} ; identical id+opts+notes merge */
const keyOf=l=>l.id+'|'+JSON.stringify(l.opts.map(o=>o.g+':'+o.n))+'|'+(l.notes||'').trim().toLowerCase();
const unit=l=>byId[l.id].price+l.opts.reduce((a,o)=>a+o.p,0);
let cart=JSON.parse(sessionStorage.getItem('nyg-cart')||'[]').filter(l=>byId[l.id]).map(l=>({opts:[],notes:'',...l}));let mode=sessionStorage.getItem('nyg-mode')||'pickup';
const save=()=>{sessionStorage.setItem('nyg-cart',JSON.stringify(cart));sessionStorage.setItem('nyg-mode',mode)};
function render(){const list=$('[data-cart-list]');const n=cart.reduce((a,l)=>a+l.q,0),t=cart.reduce((a,l)=>a+l.q*unit(l),0);
 list.innerHTML=cart.map((l,k)=>{const i=byId[l.id];const ops=l.opts.length?`<span class="ci-opts">${l.opts.map(o=>esc(o.n)+(o.p?` <i>+${fmt(o.p)}</i>`:'')).join(', ')}</span>`:'';const nt=l.notes?`<span class="ci-notes">“${esc(l.notes)}”</span>`:'';
  return `<li><span class="ci-main"><button type="button" class="ci-name" data-edit="${k}" aria-label="Edit ${esc(i.name)}">${esc(i.name)}</button>${ops}${nt}</span><span class="ci-price">${fmt(unit(l)*l.q)}</span><span class="qty"><button type="button" data-dec="${k}" aria-label="Decrease ${esc(i.name)}">−</button><output>${l.q}</output><button type="button" data-inc="${k}" aria-label="Increase ${esc(i.name)}">+</button></span><span class="ci-acts"><button type="button" class="rm" data-edit="${k}">Edit</button><button type="button" class="rm" data-rm="${k}">Remove</button></span></li>`}).join('');
 $('[data-cart-empty]').hidden=n>0;$('[data-subtotal]').textContent=fmt(t);$('.cart-count').textContent=n;$('.cart-btn').setAttribute('aria-label','Open cart, '+n+(n==1?' item':' items'));$('[data-checkout]').disabled=!n;
 const mb=$('.mbar');mb.hidden=!n;$('[data-mbar-count]').textContent=n+(n==1?' item':' items');$('[data-mbar-total]').textContent=fmt(t);if(!n)$('[data-checkout-note]').hidden=true;save()}
function addLine(l,replace){if(replace!=null)cart.splice(replace,1);const k=keyOf(l);const ex=cart.find(x=>keyOf(x)===k);if(ex)ex.q+=l.q;else if(replace!=null)cart.splice(Math.min(replace,cart.length),0,l);else cart.push(l);render()}
let tt;const toast=m=>{const e=$('[data-toast]');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),1600)};
/* ---- item sheet ---- */
const sh=$('[data-sheet]'),dlg=$('.sheet',sh),gBox=$('[data-sheet-groups]'),notesEl=$('#sheet-notes'),addBtn=$('[data-sheet-add]');
let cur=null,sq=1,editIdx=null,lastFocus=null;
const rule=g=>g.type==='single'?(g.required?'Choose 1':'Choose up to 1'):(g.min>0?(g.min===g.max?`Choose ${g.min}`:`Choose ${g.min} to ${g.max}`):`Choose up to ${g.max}`);
function openSheet(id,idx){const i=byId[id];cur=i;editIdx=idx??null;const line=idx!=null?cart[idx]:null;sq=line?line.q:1;lastFocus=document.activeElement;
 $('[data-sheet-photo]').innerHTML=i.img?`<img src="${i.img}" alt="" width="480" height="480">`:'';$('[data-sheet-photo]').hidden=!i.img;dlg.classList.toggle('no-photo',!i.img);
 $('[data-sheet-name]').textContent=i.name;$('[data-sheet-price]').textContent=fmt(i.price);$('[data-sheet-desc]').textContent=i.desc||'';
 const chosen=new Set((line?line.opts:[]).map(o=>o.g+'\u0001'+o.n));
 gBox.innerHTML=(i.mods||[]).map((g,gi)=>{const t=g.type==='single'?'radio':'checkbox';
  return `<fieldset class="mg" data-g="${gi}"><legend><span class="mg-t">${esc(g.name.replace(/\?$/,''))}</span><span class="mg-r">${rule(g)}</span>${g.required||g.min>0?'<span class="badge">Required</span>':'<span class="badge opt">Optional</span>'}</legend><p class="mg-err" hidden>Please make a selection.</p>${g.options.map((o,oi)=>`<label class="opt-row"><input type="${t}" name="g${gi}" value="${oi}"${chosen.has(g.name+'\u0001'+o.name)?' checked':''}><span class="opt-n">${esc(o.name)}</span>${o.price?`<span class="opt-p">+${fmt(o.price)}</span>`:''}</label>`).join('')}</fieldset>`}).join('');
 notesEl.value=line?line.notes:'';sh.hidden=false;document.body.classList.add('sheet-open');requestAnimationFrame(()=>sh.classList.add('on'));update();setTimeout(()=>dlg.focus(),30)}
function closeSheet(){sh.classList.remove('on');document.body.classList.remove('sheet-open');setTimeout(()=>{sh.hidden=true},260);cur=null;if(lastFocus&&lastFocus.isConnected)lastFocus.focus()}
function picks(){return (cur.mods||[]).flatMap((g,gi)=>$$(`input[name=g${gi}]:checked`,gBox).map(x=>({g:g.name,n:g.options[+x.value].name,p:g.options[+x.value].price})))}
function update(){(cur.mods||[]).forEach((g,gi)=>{if(g.type!=='multi')return;const bs=$$(`input[name=g${gi}]`,gBox),n=bs.filter(b=>b.checked).length;bs.forEach(b=>{b.disabled=!b.checked&&n>=g.max;b.closest('label').classList.toggle('dis',b.disabled)})});
 const tot=(cur.price+picks().reduce((a,o)=>a+o.p,0))*sq;$('[data-sheet-q]').textContent=sq;$('[data-sq="-1"]').disabled=sq<=1;addBtn.textContent=(editIdx!=null?'Update order · ':'Add to order · ')+fmt(tot)}
function missing(){return (cur.mods||[]).map((g,gi)=>{const n=$$(`input[name=g${gi}]:checked`,gBox).length,need=Math.max(g.min,g.required?1:0);const fs=$(`[data-g="${gi}"]`,gBox);const bad=n<need;fs.classList.toggle('err',bad);$('.mg-err',fs).hidden=!bad;return bad?fs:null}).filter(Boolean)}
gBox.addEventListener('change',e=>{const fs=e.target.closest('.mg');if(fs&&fs.classList.contains('err'))missing();update()});
dlg.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.sq){sq=Math.max(1,Math.min(50,sq+ +b.dataset.sq));update()}
 else if('sheetAdd' in b.dataset){const m=missing();if(m.length){m[0].scrollIntoView({block:'center',behavior:'smooth'});$('input',m[0]).focus({preventScroll:true});return}
  const name=cur.name,ed=editIdx!=null;addLine({id:cur.id,q:sq,opts:picks(),notes:notesEl.value.trim()},editIdx);closeSheet();toast((ed?'Updated ':'Added ')+name)}});
sh.addEventListener('click',e=>{if(e.target.closest('[data-sheet-close]'))closeSheet()});
sh.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();closeSheet()}else if(e.key==='Tab'){const f=$$('button:not([disabled]),input:not([disabled]),textarea',dlg).filter(x=>x.offsetParent!==null);if(!f.length)return;const a=f[0],z=f[f.length-1];
 if(e.shiftKey&&(document.activeElement===a||document.activeElement===dlg)){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
menu.addEventListener('click',e=>{const c=e.target.closest('[data-open]');if(c&&!e.target.closest('button'))openSheet(c.dataset.open)});
document.addEventListener('click',e=>{if(e.target.closest('[data-sheet]'))return;const b=e.target.closest('button,[data-close-cart]');if(!b)return;const d=b.dataset;
 if(d.add){openSheet(d.add)}
 else if(d.edit){openSheet(cart[+d.edit].id,+d.edit)}
 else if(d.inc){cart[+d.inc].q++;render()}
 else if(d.dec){const l=cart[+d.dec];if(--l.q<1)cart.splice(+d.dec,1);render()}
 else if(d.rm){cart.splice(+d.rm,1);render()}
 else if('openCart' in d){document.body.classList.add('cart-open');$('[data-close-cart].x').focus()}
 else if('closeCart' in d){document.body.classList.remove('cart-open')}
 else if('checkout' in d){$('[data-checkout-note]').hidden=false}
 else if('changeLoc' in d){toast('Mockup: this site is for 79 Greenwich Ave')}
 else if(d.mode){mode=d.mode;setMode()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sh.hidden)document.body.classList.remove('cart-open')});
function setMode(){$$('[data-mode]').forEach(b=>b.setAttribute('aria-checked',b.dataset.mode===mode));const txt=mode==='pickup'?'Pickup at 79 Greenwich Ave':'Delivery to your address, enter it at checkout';$('[data-mode-note]').textContent=txt;$('[data-cart-mode]').textContent=mode==='pickup'?'Pickup · 79 Greenwich Ave':'Delivery · address at checkout';save()}
const links=$$('a',nav);const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){links.forEach(a=>{const on=a.getAttribute('href')==='#'+en.target.id;a.setAttribute('aria-current',on);if(on)a.parentNode.scrollTo({left:a.offsetLeft-a.parentNode.clientWidth/2+a.offsetWidth/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})})}})},{rootMargin:'-140px 0px -60% 0px'});
$$('.msec').forEach(s=>io.observe(s));const top0=()=>{if(scrollY<300){links.forEach((a,i)=>a.setAttribute('aria-current',i===0));nav.scrollLeft=0}};addEventListener('scroll',top0,{passive:true});top0();setMode();render();})();
