const reveals = document.querySelectorAll('.reveal');
const galleryCards = document.querySelectorAll('.gallery-card');
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-stage img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeButton = document.querySelector('.lightbox-close');
const prevButton = document.querySelector('.lightbox-nav.prev');
const nextButton = document.querySelector('.lightbox-nav.next');
 
const customCursor = document.querySelector('.custom-cursor');
const cursorFiles = [
  'assets/cursor.png',
  'assets/cursor5.png'
];
const clickCursor = 'assets/cursor click.png';

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((section) => revealObserver.observe(section));

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let cursorX = targetX;
let cursorY = targetY;

document.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty('--mouse-x', `${x}%`);
  document.documentElement.style.setProperty('--mouse-y', `${y}%`);
  targetX = event.clientX;
  targetY = event.clientY;
});

const moveCursor = () => {
  if (customCursor) {
    cursorX += (targetX - cursorX) * 0.45;
    cursorY += (targetY - cursorY) * 0.45;
    customCursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
  }
  requestAnimationFrame(moveCursor);
};
moveCursor();

const cursorKey = 'pomder-visit-cursor';
let cursorIndex = Number(window.localStorage.getItem(cursorKey) || '-1');
cursorIndex = (cursorIndex + 1) % cursorFiles.length;
window.localStorage.setItem(cursorKey, String(cursorIndex));
const defaultCursor = cursorFiles[cursorIndex] || 'assets/cursor.png';
if (customCursor) {
  customCursor.style.backgroundImage = `url('${defaultCursor}')`;
}

const interactiveSelectors = ['a', 'button', '[role="button"]', '.gallery-card', '.lightbox-close', '.lightbox-nav'];
const interactiveElements = document.querySelectorAll(interactiveSelectors.join(','));
interactiveElements.forEach((element) => {
  element.addEventListener('pointerenter', () => {
    if (!customCursor) return;
    customCursor.style.backgroundImage = `url('${clickCursor}')`;
    customCursor.classList.add('link-hover');
  });
  element.addEventListener('pointerleave', () => {
    if (!customCursor) return;
    customCursor.style.backgroundImage = `url('${defaultCursor}')`;
    customCursor.classList.remove('link-hover');
  });
});

 

const ben10Audio = document.getElementById('ben10-player');
const audioPlayButton = document.querySelector('.audio-play');
const audioSeek = document.querySelector('.audio-seek');
const audioTime = document.querySelector('.audio-time');

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

if (ben10Audio && audioPlayButton && audioSeek && audioTime) {
  ben10Audio.volume = 0.7;

  ben10Audio.addEventListener('loadedmetadata', () => {
    audioTime.textContent = `0:00 / ${formatTime(ben10Audio.duration)}`;
  });

  ben10Audio.addEventListener('timeupdate', () => {
    if (!ben10Audio.duration) return;
    const progress = (ben10Audio.currentTime / ben10Audio.duration) * 100;
    audioSeek.value = progress;
    audioTime.textContent = `${formatTime(ben10Audio.currentTime)} / ${formatTime(ben10Audio.duration)}`;
  });

  ben10Audio.addEventListener('play', () => {
    audioPlayButton.classList.add('playing');
    audioPlayButton.setAttribute('aria-label', 'Pause Sherifflazone91');
  });

  ben10Audio.addEventListener('pause', () => {
    audioPlayButton.classList.remove('playing');
    audioPlayButton.setAttribute('aria-label', 'Play Sherifflazone91');
  });

  audioPlayButton.addEventListener('click', () => {
    if (ben10Audio.paused) {
      ben10Audio.play().catch(() => {});
    } else {
      ben10Audio.pause();
    }
  });

  audioSeek.addEventListener('input', () => {
    if (!ben10Audio.duration) return;
    ben10Audio.currentTime = (Number(audioSeek.value) / 100) * ben10Audio.duration;
  });

  
}

window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 1200);
  }
  if (typeof ben10Audio !== 'undefined' && ben10Audio) {
    ben10Audio.play().catch(() => {});
  }
});

let currentIndex = 0;
const items = Array.from(galleryCards);

const openLightbox = (index) => {
  currentIndex = index;
  const item = items[currentIndex];
  if (!item) return;

  lightboxImg.src = item.dataset.src;
  lightboxImg.alt = item.dataset.alt;
  lightboxCaption.textContent = item.dataset.caption;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

const updateLightbox = (direction) => {
  currentIndex = (currentIndex + direction + items.length) % items.length;
  const item = items[currentIndex];
  if (!item) return;

  lightboxImg.src = item.dataset.src;
  lightboxImg.alt = item.dataset.alt;
  lightboxCaption.textContent = item.dataset.caption;
};

galleryCards.forEach((card) => {
  card.addEventListener('click', () => openLightbox(Number(card.dataset.index)));
});

closeButton.addEventListener('click', closeLightbox);
prevButton.addEventListener('click', () => updateLightbox(-1));
nextButton.addEventListener('click', () => updateLightbox(1));

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
  }
  if (lightbox.classList.contains('open')) {
    if (event.key === 'ArrowRight') updateLightbox(1);
    if (event.key === 'ArrowLeft') updateLightbox(-1);
  }
});
