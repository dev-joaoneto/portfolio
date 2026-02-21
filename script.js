const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalTech = document.getElementById('modal-tech');
const modalLink = document.getElementById('modal-link');

const headerHeight = document.querySelector('header').offsetHeight;
const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

const sections = document.querySelectorAll('section');
const menuLinks = document.querySelectorAll('.menu-link');

const carrosselHabilidades = document.getElementById('carrossel');


document.body.classList.add('modal-open');
document.body.classList.remove('modal-open');
document.querySelectorAll('.projeto-card').forEach(card => {
  card.addEventListener('click', () => {
    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.description;
    modalTech.textContent = card.dataset.tech;
    modalLink.href = card.dataset.link;

    modal.classList.add('active');
  });
});

// fechar clicando fora
modal.addEventListener('click', () => {
  modal.classList.remove('active');
});

// impedir fechamento ao clicar dentro
modal.querySelector('.modal-content').addEventListener('click', e => {
  e.stopPropagation();
});

// botão fechar
document.querySelector('.modal-close').addEventListener('click', () => {
  modal.classList.remove('active');
});

// Background
let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const mouse = { x: w / 2, y: h / 2 };
const explosions = [];

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("click", (e) => {
  explosions.push(new Explosion(e.clientX, e.clientY));
});

// Particulas
class Particle {
  constructor(depth) {
    this.reset(depth);
  }

  reset(depth) {
    this.depth = depth;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = 0;
    this.vy = 0;
    this.size = depth * 1.6;
  }

  update() {
    // gravidade do mouse
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.hypot(dx, dy) + 0.1;

    const gravity = Math.min(30 / dist, 2000);
    this.vx += (dx / dist) * gravity * this.depth;
    this.vy += (dy / dist) * gravity * this.depth;

    // efeito das explosões
    explosions.forEach(exp => {
      const ex = this.x - exp.x;
      const ey = this.y - exp.y;
      const d = Math.hypot(ex, ey);

      if (d < exp.radius) {
        const force = (1 - d / exp.radius) * exp.power;
        this.vx += (ex / d) * force;
        this.vy += (ey / d) * force;
      }
    });

    this.vx *= 0.75;
    this.vy *= 0.75;

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -60 || this.x > w + 60 || this.y < -60 || this.y > h + 60) {
      this.reset(this.depth);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.6 * this.depth})`;
    ctx.fill();
  }
}

// Explosão
class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 180;
    this.power = 6;
    this.life = 1;
  }

  update() {
    this.radius += 5;
    this.life -= 0.04;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${this.life})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

const particles = [];
const COUNT = 1000;

for (let i = 0; i < COUNT; i++) {
  particles.push(new Particle(Math.random() * 0.8 + 0.2));
}

function animate() {
  ctx.clearRect(0, 0, w, h);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  explosions.forEach((e, i) => {
    e.update();
    e.draw();
    if (e.life <= 0) explosions.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

animate();

AOS.init();

criarCarrosselAutomatico(carrosselHabilidades, 0.5);

function criarCarrosselAutomatico(container, velocidade = 0.4) {
  let x = 0;

  // duplica o conteúdo para efeito infinito
  container.innerHTML += container.innerHTML;

  function animar() {
    x += velocidade;

    if (x >= container.scrollWidth / 2) {
      x = 0;
    }

    container.style.transform = `translateX(${-x}px)`;
    requestAnimationFrame(animar);
  }

  animar();
}



window.addEventListener('load', () => {
  const track = document.querySelector('.projeto-carrossel');
  const prev = document.querySelector('.carrossel-btn.prev');
  const next = document.querySelector('.carrossel-btn.next');

  if (!track) return;

  let cards = Array.from(track.children);

  const cardStyle = getComputedStyle(track);
  const gap = parseFloat(cardStyle.gap);
  let cardWidth = cards[0].getBoundingClientRect().width + gap;

  // CLONES
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);

  firstClone.classList.add('clone');
  lastClone.classList.add('clone');

  track.appendChild(firstClone);
  track.insertBefore(lastClone, cards[0]);

  cards = Array.from(track.children);

  let index = 1;

  function updatePosition(animate = true) {
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  updatePosition(false);

  next.addEventListener('click', () => {
    index++;
    updatePosition();
  });

  prev.addEventListener('click', () => {
    index--;
    updatePosition();
  });

  track.addEventListener('transitionend', () => {
    if (cards[index].classList.contains('clone')) {
      index = cards[index] === firstClone ? 1 : cards.length - 2;
      updatePosition(false);
    }
  });

  window.addEventListener('resize', () => {
    cardWidth = cards[0].getBoundingClientRect().width + gap;
    updatePosition(false);
  });
});

AOS.init();

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight - 10;

    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  const scrollBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

  if (scrollBottom) {
    current = sections[sections.length - 1].getAttribute('id');
  }

  menuLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

