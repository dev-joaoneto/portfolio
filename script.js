AOS.init({ once: true });

// --- MODAL LÓGICA ---
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalTech = document.getElementById('modal-tech');
const modalLink = document.getElementById('modal-link');
let modalOpen = false;

//Modal cards
document.querySelectorAll('.projeto-card').forEach(card => {

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.querySelector('.card-content').style.setProperty('--x', `${x}px`);
    card.querySelector('.card-content').style.setProperty('--y', `${y}px`);
  });

  // Abrir Modal
  card.addEventListener('click', () => {
    modalOpen = true;
    stopAutoPlay();
    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.description;
    modalTech.textContent = card.dataset.tech;
    modalLink.href = card.dataset.link;
    modal.classList.add('active');
  });
});

// Fechar Modal
const closeModal = () => {
  modal.classList.remove('active');
  modalOpen = false;
  startAutoPlay();
};

modal.addEventListener('click', closeModal);
document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.querySelector('.modal-content').addEventListener('click', e => e.stopPropagation());

// --- NAVEGAÇÃO ATIVA NO SCROLL ---
const sections = document.querySelectorAll('section');
const menuLinks = document.querySelectorAll('.menu-link');
const headerHeight = document.querySelector('header').offsetHeight;

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight - 50;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  menuLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// --- CARROSSEL INFINITO DE HABILIDADES ---
const carrosselHabilidades = document.getElementById('carrossel');
function criarCarrosselAutomatico(container, velocidade = 0.5) {
  if (!container) return;
  let x = 0;
  container.innerHTML += container.innerHTML;

  function animar() {
    x += velocidade;
    if (x >= container.scrollWidth / 2) {
      x = 0;
    }
    container.style.transform = `translateX(${-x}px)`;
    requestAnimationFrame(animar);
  }
  requestAnimationFrame(animar);
}
criarCarrosselAutomatico(carrosselHabilidades);

// --- CARROSSEL DE PROJETOS ---
const carrossel = document.querySelector(".projeto-carrossel");
let cards = document.querySelectorAll(".projeto-card");
const totalOriginal = cards.length;

// Prevenção de bug se houver apenas 1 card
if (totalOriginal > 1) {
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[totalOriginal - 1].cloneNode(true);

  carrossel.appendChild(firstClone);
  carrossel.insertBefore(lastClone, carrossel.firstChild);

  let index = 1;
  let interval;
  let isAnimating = false;

  carrossel.style.transform = `translateX(-100%)`;

  function atualizar() {
    isAnimating = true;
    carrossel.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
    carrossel.style.transform = `translateX(-${index * 100}%)`;
  }

  function startAutoPlay() {
    stopAutoPlay();
    interval = setInterval(() => {
      index++;
      atualizar();
    }, 4000);
  }

  function stopAutoPlay() {
    clearInterval(interval);
  }

  carrossel.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;

    if (index === totalOriginal + 1) {
      carrossel.style.transition = "none";
      index = 1;
      carrossel.style.transform = `translateX(-100%)`;
    } else if (index === 0) {
      carrossel.style.transition = "none";
      index = totalOriginal;
      carrossel.style.transform = `translateX(-${index * 100}%)`;
    }
    isAnimating = false;
  });

  document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoPlay();
  } else {
    if (!modalOpen) {
      startAutoPlay();
    }
  }
});

  document.querySelector(".next").addEventListener("click", () => {
    if (isAnimating) return;

    stopAutoPlay();
    index++;
    atualizar();
    startAutoPlay();
  });

  document.querySelector(".prev").addEventListener("click", () => {
    if (isAnimating) return;

    stopAutoPlay();
    index--;
    atualizar();
    startAutoPlay();
  });

  const viewport = document.querySelector(".projeto-viewport");
  viewport.addEventListener("mouseenter", stopAutoPlay);
  viewport.addEventListener("mouseleave", () => {
    if (!modalOpen) startAutoPlay();
  });

  startAutoPlay();
}