const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn('Storage full or blocked:', e)
    }
  },
  remove(key) {
    localStorage.removeItem(key)
  }
}

Storage.set('khatm.hafs', { khatms: 2, startDay: 1 })
const khatm = Storage.get('khatm.hafs')


function setupMobileMenu() {
  const openBtn  = document.getElementById('menu-open')
  const closeBtn = document.getElementById('menu-close')
  const backdrop = document.getElementById('menu-backdrop')
  const sidebar  = document.getElementById('menu-sidebar')

  if (!openBtn || !sidebar) return  // page might not have a menu

  function openMenu() {
    backdrop.classList.remove('hidden')
    sidebar.classList.remove('translate-x-full', 'rtl:-translate-x-full')
    document.body.style.overflow = 'hidden'   // lock page scroll
  }

  function closeMenu() {
    backdrop.classList.add('hidden')
    sidebar.classList.add('translate-x-full', 'rtl:-translate-x-full')
    document.body.style.overflow = ''
  }

  openBtn.addEventListener('click', openMenu)
  closeBtn.addEventListener('click', closeMenu)
  backdrop.addEventListener('click', closeMenu)

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu()
  })
}


function setupLanguageToggle() {
  const btn = document.getElementById('lang-toggle')
  if (!btn) return

  const current = Storage.get('lang', 'en')
  applyLanguage(current)

  btn.addEventListener('click', () => {
    const next = Storage.get('lang', 'en') === 'en' ? 'ar' : 'en'
    Storage.set('lang', next)
    applyLanguage(next)
  })
}


function applyLanguage(lang) {
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'

  // Swap the toggle label
  const label = document.getElementById('lang-label')
  if (label) label.textContent = lang === 'en' ? 'EN' : 'ع'
}


// function highlightActiveNav() {
//   const path = window.location.pathname
  
//   const map = {
//     '/': 'home',
//     '/quran/': 'quran',
//     '/audio.html': 'audio',
//     'todo.html': 'todo',
//     'dhikr.html': 'dhikr'
//   }
  
//   const current = map[path]
//   if (!current) return

//   // Desktop nav
//   document.querySelectorAll('nav a[data-nav]').forEach(link => {
//     if (link.dataset.nav === current) {
//       link.classList.add('underline', 'font-medium')
//     }
//   })
//   // Mobile sidebar too — same logic, different selector
// }


document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu()
  setupLanguageToggle()
  // highlightActiveNav()
})