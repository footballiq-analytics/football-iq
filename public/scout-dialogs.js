(()=>{
 const panels=Array.from(document.querySelectorAll('.overlay-panel'));
 const closePanels=()=>{panels.forEach(p=>p.classList.add('hidden'));document.querySelector('#playerModal')?.classList.add('hidden');document.querySelector('#mobileMenu')?.classList.remove('open')};
 document.addEventListener('pointerdown',e=>{
  if(!(e.target instanceof Element))return;
  if(!e.target.closest('.overlay-panel,.player-modal-card,#mobileMenu,#mobileMenuBtn,#mobileMore'))closePanels();
  if(!e.target.closest('#mobileMenu,#mobileMenuBtn,#mobileMore'))document.querySelector('#mobileMenu')?.classList.remove('open');
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const scoresOpen=!document.getElementById('scoresPanel').classList.contains('hidden');closePanels();if(scoresOpen)document.getElementById('scoresBtn').focus()}});
 const sync=()=>{document.getElementById('scoresBtn').setAttribute('aria-expanded',String(!document.getElementById('scoresPanel').classList.contains('hidden')))};
 new MutationObserver(sync).observe(document.getElementById('scoresPanel'),{attributes:true,attributeFilter:['class']});sync();
})();
