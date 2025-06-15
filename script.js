
/* ----------  Carousel set-up  ---------- */
/* ----------  Carousel set-up (responsive)  ---------- */
const carousel = document.getElementById('carousel');
const items    = [...document.querySelectorAll('.item')];
const TOTAL    = items.length;

/* helper: decide radius from screen width */
function getRadius () {
  return window.matchMedia("(min-width: 769px)").matches ? 350 : 270;
}

/* helper: position every card around the ring */
function positionItems (radius) {
  items.forEach((it, i) => {
    const ang = 360 / TOTAL * i;
    it.style.transform = `rotateY(${ang}deg) translateZ(${radius}px)`;
    it.querySelector('.label').style.transform = 'none';
     /* `rotateY(${-ang}deg) translateZ(1px)`;*/
  });
}

/* initial layout */
let RADIUS = getRadius();
positionItems(RADIUS);

/* re-layout on resize / orientation change */
window.addEventListener('resize', () => {
  const newRadius = getRadius();
  if (newRadius !== RADIUS) {
    RADIUS = newRadius;
    positionItems(RADIUS);
  }
});
/* ----------  Auto-spin + drag  ---------- */
let rotY = 0,
    isDrag = false,
    startX = 0,
    auto = true;

function spin() {
  if (!isDrag && auto) {
    rotY += 0.15;
    carousel.style.transform = `translate(-50%,-50%) rotateX(-15deg) rotateY(${rotY}deg)`; // 🔧 added tilt
  }
  requestAnimationFrame(spin);
}
spin();

function dragStart(e) {
  isDrag = true;
  auto = false;
  startX = e.touches ? e.touches[0].clientX : e.clientX;
}

function dragMove(e) {
  if (!isDrag) return;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  rotY += (x - startX) * 0.4;
  startX = x;
  carousel.style.transform = `translate(-50%,-50%) rotateX(-15deg) rotateY(${rotY}deg)`; // 🔧 added tilt
}

function dragEnd() {
  isDrag = false;
  setTimeout(() => auto = true, 500);
}

// Event listeners for mouse and touch
carousel.addEventListener('mousedown', dragStart);
window.addEventListener('mousemove', dragMove);
window.addEventListener('mouseup', dragEnd);

carousel.addEventListener('touchstart', dragStart, { passive: true });
window.addEventListener('touchmove', dragMove, { passive: true });
window.addEventListener('touchend', dragEnd);

/* ----------  Modal zoom logic  ---------- */
const modal = document.getElementById('modal'),
      body = document.getElementById('modal-body');
let activeCard = null;

items.forEach(it => {
  const card = it.querySelector('.card');
  it.addEventListener('click', () => {
    activeCard = card;
    card.classList.add('zoom');
    setTimeout(() => {
      card.classList.add('fadeout');

      const tpl = document.getElementById(it.dataset.target);
      body.innerHTML = '';
      const closeBtn = document.createElement('button');
      closeBtn.id = 'close';
      closeBtn.textContent = '✕';

      const loader = document.createElement('div');
      loader.id = 'loading-indicator';
      loader.className = 'loading-text';
      loader.textContent = '↻ loading content';

      body.appendChild(closeBtn);
      body.appendChild(loader);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = tpl.innerHTML;
      body.appendChild(tempDiv);

      modal.classList.add('show');

      const images = body.querySelectorAll('.modal-image');
      let loadedCount = 0;

      images.forEach(img => {
        const originalSrc = img.src;
        img.style.display = 'none';

        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            requestAnimationFrame(() => {
              const loader = document.getElementById('loading-indicator');
              if (loader) loader.style.display = 'none';
              images.forEach(i => i.style.display = 'block');
            });
          }
        };

        img.src = ''; // force reload
        img.src = originalSrc;
      });

      closeBtn.onclick = closeModal;
    }, 500);
  });
});

function closeModal() {
  modal.classList.remove('show');
  if (activeCard) {
    activeCard.classList.remove('fadeout', 'zoom');
    activeCard = null;
  }
}

modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

/* ----------  Full-screen image viewer  ---------- */
const viewer      = document.getElementById('viewer'),
      viewerImg   = document.getElementById('viewer-img'),
      btnPrev     = document.getElementById('viewer-prev'),
      btnNext     = document.getElementById('viewer-next'),
      btnClose    = document.getElementById('viewer-close');

let gallery = [], cur = 0;

document.addEventListener('click', e => {
  if (!e.target.classList.contains('modal-image')) return;
  gallery = [...document.querySelectorAll('.modal-image')];
  cur = gallery.indexOf(e.target);
  showImg();
});

function showImg() {
  viewerImg.src = gallery[cur].src;
  viewer.classList.add('show');
}

function next() {
  cur = (cur + 1) % gallery.length;
  showImg();
}

function prev() {
  cur = (cur - 1 + gallery.length) % gallery.length;
  showImg();
}

btnNext.onclick = next;
btnPrev.onclick = prev;
btnClose.onclick = () => viewer.classList.remove('show');

viewer.addEventListener('click', e => {
  if (e.target === viewer) viewer.classList.remove('show');
});

/* swipe */
let sx = 0;
viewerImg.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
viewerImg.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx;
  if (dx > 50) prev();
  if (dx < -50) next();
}, { passive: true });

/* esc key */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && viewer.classList.contains('show')) viewer.classList.remove('show');
});
