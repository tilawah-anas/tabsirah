// ─── Caches ───
let recitersCache = null;
let surahsCache = null;

// ─── Loaders ───
async function loadReciters() {
  if (recitersCache) return recitersCache;
  const res = await fetch("../data/reciters.json");
  recitersCache = await res.json();
  return recitersCache;
}

async function loadSurahs() {
  if (surahsCache) return surahsCache;
  const res = await fetch("../data/surahs.json");
  surahsCache = await res.json();
  return surahsCache;
}

// ─── Page 1: /audio/ (reciter list) ───
async function renderReciterList() {
  const list = document.getElementById("reciter-list");
  if (!list) return;

  const reciters = await loadReciters();
  const entries = Object.entries(reciters);

  if (!entries.length) {
    list.innerHTML =
      '<p class="text-gray-500 text-center py-8">No reciters yet.</p>';
    return;
  }

  list.innerHTML = entries
    .map(
      ([slug, r]) => `
    <a href="../reciter.html?name=${slug}"
      class="flex min-h-28 bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition">
      <div class="w-28 md:w-32 bg-gray-100 shrink-0">
        <img src="${r.image || "/assets/reciters/default.jpg"}" class="w-full h-full object-cover" alt="${r.name}">
      </div>
      <div class="flex-1 flex flex-col justify-center p-5">
        <p class="font-medium text-secondary">${r.name}</p>
        <p class="text-sm text-gray-400">${r.nameAr}</p>
      </div>
    </a>
  `,
    )
    .join("");
}

// ─── Page 2: /audio/reciter.html ───
async function renderReciterPage() {
  const nameEl = document.getElementById("reciter-name");
  if (!nameEl) return;

  const slug = new URLSearchParams(window.location.search).get("name");
  if (!slug) {
    window.location.href = "/audio/";
    return;
  }

  const reciters = await loadReciters();
  const surahs = await loadSurahs();
  const reciter = reciters[slug];

  if (!reciter) {
    nameEl.textContent = "Reciter not found";
    return;
  }

  nameEl.textContent = reciter.name;
  document.getElementById("reciter-name-ar").textContent = reciter.nameAr;

  const imgEl = document.getElementById("reciter-image");
  if (imgEl) {
    imgEl.src = reciter.image || "/images/reciters/default.jpg";
    imgEl.alt = reciter.name;
  }

  document.title = `${reciter.name} | Tabsirah`;

  const list = document.getElementById("surah-list");
  const numbers = Object.keys(reciter.surahs || {})
    .map(Number)
    .sort((a, b) => a - b);

  if (!numbers.length) {
    list.innerHTML =
      '<p class="text-gray-500 text-center py-8">No recordings yet.</p>';
    return;
  }

  list.innerHTML = numbers
    .map((n) => {
      const s = surahs[n] || {};
      return `
      <button class="play-btn w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-hover-pri transition text-left" data-url="${reciter.surahs[n]}" data-surah="${n}">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-primary text-sm font-medium">${n}</span>
          <div>
            <p class="font-medium text-secondary">${s.name || "Surah " + n}</p>
            <p class="text-xl text-gray-400 font-surah">${s.nameAr || ""}</p>
          </div>
        </div>
        <i class="fa-solid fa-play text-secondary"></i>
      </button>
    `;
    })
    .join("");

  let currentBtn = null;

  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const num = btn.dataset.surah;
      const s = surahs[num] || {};
      const player = document.getElementById("player");
      const bar = document.getElementById("player-bar");
      const icon = btn.querySelector("i");

      // ─── Clicking the SAME card that's already playing ───
      if (btn === currentBtn) {
        if (player.paused) {
          player.play();
          icon.className = "fa-solid fa-pause text-secondary";
        } else {
          player.pause();
          icon.className = "fa-solid fa-play text-secondary";
        }
        return;
      }

      // ─── Clicking a DIFFERENT card ───
      // Reset the old one
      if (currentBtn) {
        currentBtn.classList.remove("bg-hover-pri", "border-secondary");
        currentBtn.querySelector("i").className =
          "fa-solid fa-play text-secondary";
      }

      // Activate the new one
      currentBtn = btn;
      btn.classList.add("bg-hover-pri", "border-secondary");
      icon.className = "fa-solid fa-pause text-secondary";

      // Play
      document.getElementById("now-playing").textContent =
        `${reciter.name} — ${s.name || "Surah " + num}`;
      bar.classList.remove("hidden");
      player.src = btn.dataset.url;
      player.play();
    });
  });

  // ─── Keep icons in sync when the audio ends ───
  document.getElementById("player").addEventListener("ended", () => {
    if (currentBtn) {
      currentBtn.classList.remove("bg-hover-pri", "border-secondary");
      currentBtn.querySelector("i").className =
        "fa-solid fa-play text-secondary";
      currentBtn = null;
    }
  });
}

// ─── Route based on what's on the page ───
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("reciter-list")) renderReciterList();
  if (document.getElementById("reciter-name")) renderReciterPage();
});
