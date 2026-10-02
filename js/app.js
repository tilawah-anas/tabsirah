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

setupMobileMenu()