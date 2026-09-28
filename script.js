document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initReadingProgressBar();
  initScrollObserver();
  initChart();
  initLightboxZoom();
});

/* 1. MODO OSCURO / CLARO */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');

  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.body.removeAttribute('data-theme');
      icon.innerText = '🌙';
      toggleBtn.childNodes[1].textContent = ' MODO OSCURO';
    } else {
      document.body.setAttribute('data-theme', 'dark');
      icon.innerText = '☀️';
      toggleBtn.childNodes[1].textContent = ' MODO CLARO';
    }
  });
}

/* 2. BARRA DE PROGRÉS DE LECTURA */
function initReadingProgressBar() {
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progress-bar').style.width = scrolled + '%';
  });
}

/* 3. ENTRADA SUAV EN SCROLL I OBSERVER NAV */
function initScrollObserver() {
  const sections = document.querySelectorAll('.project-section');
  const navLinks = document.querySelectorAll('.sidebar-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(section => observer.observe(section));
}

/* 4. COMPARADOR BEFORE / AFTER SLIDER */
function moveComparisonSlider(slider) {
  const wrapper = slider.parentElement.querySelector('.img-after-wrapper');
  const line = slider.parentElement.querySelector('.slider-line');
  const val = slider.value + '%';
  wrapper.style.width = val;
  line.style.left = val;
}

/* 5. GRÀFICA INTERACTIVA AMB CHART.JS */
function initChart() {
  const ctx = document.getElementById('telemetryChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['0ms', '100ms', '200ms', '300ms', '400ms', '500ms'],
      datasets: [
        {
          label: 'Àngul Sensor Flex (°)',
          data: [0, 25, 45, 70, 85, 90],
          borderColor: '#0076ff',
          tension: 0.3,
          fill: false
        },
        {
          label: 'Posició Servo (°)',
          data: [0, 20, 42, 68, 83, 89],
          borderColor: '#00ff66',
          tension: 0.3,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { labels: { color: 'gray' } } }
    }
  });
}

/* 6. PESTAÑES DE CODI */
function openTab(evt, tabId) {
  const container = evt.target.closest('.code-tabs-container');
  container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  evt.target.classList.add('active');
}

/* 7. COPIAR CODI I ANCORATGES */
function copyCode(btn) {
  const code = btn.parentElement.querySelector('code').innerText;
  navigator.clipboard.writeText(code);
  btn.innerText = 'Coptiat!';
  setTimeout(() => btn.innerText = 'Copiar Codi', 2000);
}

function copyAnchor(hash) {
  const url = window.location.origin + window.location.pathname + hash;
  navigator.clipboard.writeText(url);
  alert('Enllaç copiat al porta-retalls: ' + url);
}

/* 8. FILTRE EN VIU A LA TAULA BOM */
function filterBOMTable() {
  const input = document.getElementById('bomSearch').value.toLowerCase();
  const rows = document.querySelectorAll('#bomTable tbody tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? '' : 'none';
  });
}

/* 9. LIGHTBOX AMB ZOOM I PANNING */
let zoomScale = 1;
let isDragging = false, startX, startY, translateX = 0, translateY = 0;

function openLightbox(src) {
  const modal = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  modal.style.display = 'flex';
  zoomScale = 1; translateX = 0; translateY = 0;
  updateTransform();
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

function initLightboxZoom() {
  const container = document.getElementById('lightbox-container');
  
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomScale += e.deltaY < 0 ? 0.2 : -0.2;
    zoomScale = Math.min(Math.max(0.8, zoomScale), 4);
    updateTransform();
  });

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => isDragging = false);
}

function updateTransform() {
  const container = document.getElementById('lightbox-container');
  container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomScale})`;
}

function showCadStep(step) {
  const img = document.getElementById('cad-img');
  const title = document.getElementById('cad-title');
  const desc = document.getElementById('cad-desc');
  const buttons = document.querySelectorAll('.cad-step-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  if (buttons[step - 1]) buttons[step - 1].classList.add('active');

  switch(step) {
    case 1:
      img.src = 'Brazo3.jpg';
      title.innerText = 'Modelat CAD v1.0';
      desc.innerText = 'Primera versió del disseny estructural imprès en PLA. Es van identificar punts de fatiga a l\'eix principal de rotació.';
      break;
    case 2:
      img.src = 'Brazo2.jpg';
      title.innerText = 'Reforç Estructural v2.0';
      desc.innerText = 'Redisseny de la base articulada augmentant el gruix de paret i afegint coixinets de bola per reduir la fricció.';
      break;
    case 3:
      img.src = 'Brazo4.jpg';
      title.innerText = 'Integració de Servos v3.0';
      desc.innerText = 'Ajust final dels acoblaments mecànics per als servomotors i optimització del guiat de cables intern.';
      break;
  }
}
