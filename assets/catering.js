(()=>{const f=document.querySelector('[data-inquiry]');if(!f)return;const note=f.querySelector('[data-form-note]');
f.addEventListener('submit',e=>{e.preventDefault();const bad=[...f.querySelectorAll('[required]')].find(i=>!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value)));
f.querySelectorAll('[aria-invalid]').forEach(i=>i.removeAttribute('aria-invalid'));
if(bad){bad.setAttribute('aria-invalid','true');bad.focus();note.textContent='Please add your '+bad.previousElementSibling.textContent.toLowerCase()+'.';return}
note.textContent='Mockup: thanks! In the live site this inquiry would be sent to the store.'})})();
