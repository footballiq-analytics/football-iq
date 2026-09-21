(()=>{
 const indicator=document.createElement('div');indicator.className='scout-pull-indicator';indicator.setAttribute('role','status');indicator.hidden=true;document.body.appendChild(indicator);
 let start=null,pull=0,engaged=false,busy=false;
 const reset=()=>{start=null;pull=0;engaged=false;indicator.hidden=true;};
 const modalOpen=()=>Array.from(document.querySelectorAll('.overlay-panel,#playerModal')).some(e=>!e.classList.contains('hidden'));
 document.addEventListener('touchstart',e=>{
  reset();if(busy||e.touches.length!==1||window.scrollY>0||modalOpen())return;
  if(!(e.target instanceof Element)||e.target.closest('button,a,input,select,textarea,summary,.table-wrap'))return;
  for(let n=e.target;n;n=n.parentElement)if(n.scrollTop>0&&n.scrollHeight>n.clientHeight+2)return;
  start={x:e.touches[0].clientX,y:e.touches[0].clientY};
 },{passive:true});
 document.addEventListener('touchmove',e=>{
  if(!start)return;if(e.touches.length!==1){reset();return;}
  const dy=e.touches[0].clientY-start.y,dx=Math.abs(e.touches[0].clientX-start.x);
  if(dy<0||dx>Math.max(18,dy*.65)){reset();return;}
  if(dy<12&&!engaged)return;if(!e.cancelable){reset();return;}
  e.preventDefault();engaged=true;pull=Math.min(110,dy*.65);indicator.hidden=false;indicator.textContent=pull>=70?'Yenilemek için bırak':'Yenilemek için aşağı çek';
 },{passive:false});
 document.addEventListener('touchend',()=>{const refresh=engaged&&pull>=70;reset();if(refresh&&!busy){busy=true;indicator.hidden=false;indicator.textContent='Yenileniyor…';location.reload();}},{passive:true});
 document.addEventListener('touchcancel',reset,{passive:true});window.addEventListener('orientationchange',reset);
})();
