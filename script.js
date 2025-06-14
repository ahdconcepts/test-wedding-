/* ----------  Carousel set-up  ---------- */
const carousel = document.getElementById('carousel');
const items    = [...document.querySelectorAll('.item')];
const RADIUS   = 300, TOTAL = items.length;

items.forEach((it,i)=>{
  const ang = 360/TOTAL*i;
  it.style.transform = `rotateY(${ang}deg) translateZ(${RADIUS}px)`;
  it.querySelector('.label').style.transform = `rotateY(${-ang}deg) translateZ(1px)`;
});

/* ----------  Auto-spin + drag  ---------- */
let rotY=0,isDrag=false,startX=0,auto=true;
function spin(){ if(!isDrag && auto){ rotY+=0.15; carousel.style.transform=`translate(-50%,-50%) rotateY(${rotY}deg)`;} requestAnimationFrame(spin);} spin();

function dragStart(e){isDrag=true;auto=false;startX=e.touches?e.touches[0].clientX:e.clientX;}
function dragMove(e){ if(!isDrag) return; const x=e.touches?e.touches[0].clientX:e.clientX; rotY+=(x-startX)*0.4; startX=x; carousel.style.transform=`translate(-50%,-50%) rotateY(${rotY}deg)`;}
function dragEnd(){isDrag=false;setTimeout(()=>auto=true,500);}
carousel.addEventListener('mousedown',dragStart);window.addEventListener('mousemove',dragMove);window.addEventListener('mouseup',dragEnd);
carousel.addEventListener('touchstart',dragStart,{passive:true});window.addEventListener('touchmove',dragMove,{passive:true});window.addEventListener('touchend',dragEnd);

/* ----------  Modal zoom logic  ---------- */
const modal=document.getElementById('modal'), body=document.getElementById('modal-body');
let activeCard=null;
items.forEach(it=>{
  const card=it.querySelector('.card');
  it.addEventListener('click',()=>{
    activeCard=card; card.classList.add('zoom');
    setTimeout(()=>{
      card.classList.add('fadeout');
      const tpl=document.getElementById(it.dataset.target);
      body.innerHTML=`<button id="close">✕</button>${tpl.innerHTML}`;
      modal.classList.add('show');
      document.getElementById('close').onclick=closeModal;
    },500);
  });
});
function closeModal(){modal.classList.remove('show'); if(activeCard){activeCard.classList.remove('fadeout','zoom'); activeCard=null;} }
modal.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });

/* ----------  Full-screen image viewer  ---------- */
const viewer      = document.getElementById('viewer'),
      viewerImg   = document.getElementById('viewer-img'),
      btnPrev     = document.getElementById('viewer-prev'),
      btnNext     = document.getElementById('viewer-next'),
      btnClose    = document.getElementById('viewer-close');

let gallery=[], cur=0;

document.addEventListener('click',e=>{
  if(!e.target.classList.contains('modal-image')) return;
  gallery=[...document.querySelectorAll('.modal-image')];
  cur=gallery.indexOf(e.target);
  showImg();
});
function showImg(){ viewerImg.src=gallery[cur].src; viewer.classList.add('show'); }
function next(){cur=(cur+1)%gallery.length; showImg();}
function prev(){cur=(cur-1+gallery.length)%gallery.length; showImg();}
btnNext.onclick=next; btnPrev.onclick=prev; btnClose.onclick=()=>viewer.classList.remove('show');
viewer.addEventListener('click',e=>{ if(e.target===viewer) viewer.classList.remove('show'); });

/* swipe */
let sx=0;
viewerImg.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
viewerImg.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-sx;
  if(dx>50) prev();
  if(dx<-50) next();
},{passive:true});

/* esc key */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape' && viewer.classList.contains('show')) viewer.classList.remove('show');
});
