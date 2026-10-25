// Les photos et vidéos sont numérotées dans assets/img/<event>/001.jpg et assets/video/<event>/01.mp4
const pad = (n, len) => String(n).padStart(len, "0");

/* ---------- Police 62dragz ----------
   La police s'écrit entre ( ) (sauf côté chiffre) avec des _ à la place des espaces, sans accents ni ponctuation.
   On écrit le texte normalement dans le HTML et on le convertit ici, ligne par ligne (<br>). */
const displayText = (s) => {
  const t = s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9!?+]+/g, "_")
    .replace(/^_|_$/g, "");
  if (!t) return "";
  // Pas de ( ) côté chiffre : un chiffre qui ouvre ou ferme le texte se suffit
  const open = /^[0-9]/.test(t) ? "" : "(";
  const close = /[0-9]$/.test(t) ? "" : ")";
  return `${open}${t}${close}`;
};
const DISPLAY = ".title, .event__title, .event__date, .date__info h3, .date__day span, .pillar h3, .pillar__num, .values span, .stat strong, .marquee span:not(.stripes)";
document.querySelectorAll(DISPLAY).forEach((el) => {
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) node.textContent = displayText(node.textContent);
  });
});

// Les titres ne peuvent plus passer à la ligne (un seul mot avec les _) : on réduit la taille si ça dépasse
const FIT = ".title, .event__title, .date__info h3, .pillar h3";
const fitTitles = () => {
  document.querySelectorAll(FIT).forEach((el) => {
    el.style.fontSize = "";
    const ratio = el.clientWidth / el.scrollWidth;
    if (ratio < 1) el.style.fontSize = `${parseFloat(getComputedStyle(el).fontSize) * ratio * 0.98}px`;
  });
};
document.fonts.ready.then(fitTitles);
window.addEventListener("resize", fitTitles);

/* ---------- Nav ---------- */
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const toggle = nav.querySelector(".nav__toggle");
const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
};
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll(".nav__links a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");
const lbCount = lightbox.querySelector(".lightbox__count");
let lbList = [];
let lbIndex = 0;

function showLightbox(i) {
  lbIndex = (i + lbList.length) % lbList.length;
  lbImg.src = lbList[lbIndex];
  lbCount.textContent = displayText(`${lbIndex + 1} ${lbList.length}`);
}
function openLightbox(list, i) {
  lbList = list;
  showLightbox(i);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.hidden = true;
  lbImg.src = "";
  document.body.style.overflow = "";
}
lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox__prev").addEventListener("click", () => showLightbox(lbIndex - 1));
lightbox.querySelector(".lightbox__next").addEventListener("click", () => showLightbox(lbIndex + 1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
  if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
});

// Swipe dans la lightbox (mobile)
let touchX = null;
lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showLightbox(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});

/* ---------- Carrousels photos ---------- */
document.querySelectorAll("[data-gallery]").forEach((el) => {
  const name = el.dataset.gallery;
  const count = Number(el.dataset.count);
  const srcs = Array.from({ length: count }, (_, i) => `assets/img/${name}/${pad(i + 1, 3)}.jpg`);
  // Ordre aléatoire à chaque chargement (mélange de Fisher-Yates)
  for (let i = srcs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [srcs[i], srcs[j]] = [srcs[j], srcs[i]];
  }

  const track = document.createElement("div");
  track.className = "carousel__track";
  srcs.forEach((src, i) => {
    const item = document.createElement("button");
    item.className = "carousel__item";
    item.setAttribute("aria-label", `Agrandir la photo ${i + 1}`);
    item.innerHTML = `<img src="${src}" alt="" loading="lazy" decoding="async">`;
    item.addEventListener("click", () => openLightbox(srcs, i));
    track.appendChild(item);
  });

  const bar = document.createElement("div");
  bar.className = "carousel__bar";
  bar.innerHTML = `
    <span class="carousel__count">${displayText(`${pad(count, 2)} photos`)}</span>
    <div class="carousel__progress"><i></i></div>
    <div class="carousel__btns">
      <button class="carousel__btn" data-dir="-1" aria-label="Précédent">←</button>
      <button class="carousel__btn" data-dir="1" aria-label="Suivant">→</button>
    </div>`;

  el.append(track, bar);

  const progress = bar.querySelector(".carousel__progress i");
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    progress.style.width = max > 0 ? `${(track.scrollLeft / max) * 100}%` : "100%";
  };
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();

  bar.querySelectorAll("[data-dir]").forEach((btn) =>
    btn.addEventListener("click", () => {
      track.scrollBy({ left: Number(btn.dataset.dir) * track.clientWidth * 0.8 });
    })
  );
});

/* ---------- Lecture auto des vidéos ----------
   Sur téléphone (iOS en mode économie d'énergie notamment), la lecture auto peut être refusée :
   on retente au premier toucher, et un tap sur la vidéo la lance / la met en pause. */
const blockedVideos = new Set();
const setPaused = (video, paused) => video.parentElement.classList.toggle("is-paused", paused);
const tryPlay = (video) => {
  video
    .play()
    .then(() => blockedVideos.delete(video))
    .catch(() => {
      blockedVideos.add(video);
      setPaused(video, true);
    });
};
const retryBlocked = () => blockedVideos.forEach((v) => v.dataset.visible === "1" && tryPlay(v));
["touchstart", "click", "keydown"].forEach((evt) => document.addEventListener(evt, retryBlocked, { passive: true }));

// Classe .is-paused sur le parent pour afficher le bouton ▶ (lecture refusée ou pause au tap)
const watchPaused = (video) => video.addEventListener("playing", () => setPaused(video, false));

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.dataset.visible = isIntersecting ? "1" : "0";
      if (isIntersecting) tryPlay(target);
      else target.pause();
    });
  },
  { threshold: 0.5 }
);

const heroVideo = document.querySelector(".hero__video");
heroVideo.muted = true;
heroVideo.playsInline = true;
watchPaused(heroVideo);
videoObserver.observe(heroVideo);
document.querySelector(".hero").addEventListener("click", (e) => {
  if (!e.target.closest("a") && heroVideo.paused) tryPlay(heroVideo);
});

/* ---------- Carrousels vidéos ---------- */
document.querySelectorAll("[data-reels]").forEach((el) => {
  const name = el.dataset.reels;
  const count = Number(el.dataset.count);
  // After movie Instagram en première carte, recadré au format des reels (on masque l'en-tête et le bas du lecteur)
  if (el.dataset.aftermovie) {
    const card = document.createElement("div");
    card.className = "reel reel--aftermovie";
    card.innerHTML = `
      <iframe src="${el.dataset.aftermovie.replace(/\/?$/, "/")}embed/" title="After movie 07BPM" loading="lazy" scrolling="no" allowtransparency="true"></iframe>
      <span class="reel__tag">{07BPM)</span>
      <a class="reel__sound" href="${el.dataset.aftermovie}" target="_blank" rel="noopener">After movie</a>`;
    el.appendChild(card);
  }
  for (let i = 1; i <= count; i++) {
    const reel = document.createElement("div");
    reel.className = "reel";
    reel.innerHTML = `
      <video src="assets/video/${name}/${pad(i, 2)}.mp4" poster="assets/posters/${name}-${pad(i, 2)}.jpg"
        muted loop playsinline preload="none"></video>
      <span class="reel__play" aria-hidden="true"></span>
      <span class="reel__tag">{07BPM)</span>
      <button class="reel__sound">Son off</button>`;
    const video = reel.querySelector("video");
    const sound = reel.querySelector(".reel__sound");
    video.muted = true;
    video.playsInline = true;
    watchPaused(video);
    video.addEventListener("click", () => {
      if (video.paused) return tryPlay(video);
      video.pause();
      setPaused(video, true);
    });
    sound.addEventListener("click", () => {
      // Un seul reel avec le son à la fois
      document.querySelectorAll(".reel video").forEach((v) => {
        if (v !== video) {
          v.muted = true;
          v.parentElement.querySelector(".reel__sound").textContent = "Son off";
        }
      });
      video.muted = !video.muted;
      sound.textContent = video.muted ? "Son off" : "Son on";
      tryPlay(video);
    });
    el.appendChild(reel);
    videoObserver.observe(video);
  }
});

/* ---------- Apparition au scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".title, .lead, .values, .stats, .pillar, .date, .event__head").forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});
