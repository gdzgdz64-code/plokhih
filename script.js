window.addEventListener("load", () => {
  /* =========================
     музыка
  ========================= */

document.addEventListener('click', (e) => {
  if (e.target.closest('.team-card, .achievement-card')) {
    const audio = document.getElementById('trainer-sound');
    audio.play().catch(err => console.log('Не удалось воспроизвести:', err));
  }
});

  /* =========================
     🌟 Универсальная функция появления элементов
  ========================= */
  function observeElements(selector, visibleClass = "visible", threshold = 0.2, once = true) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
          if (once) observer.unobserve(entry.target);
        }
      });
    }, { threshold });

    elements.forEach(el => observer.observe(el));
  }
  const timelineModal = document.getElementById("timeline-modal");

if (timelineModal) {
  const modalImg = document.getElementById("timeline-modal-img");
  const modalTitle = document.getElementById("timeline-modal-title");
  const modalText = document.getElementById("timeline-modal-text");
  const modalClose = timelineModal.querySelector(".modal-close");

  function openTimelineModal(card) {
    modalImg.src = card.dataset.img || "";
    modalTitle.textContent = card.dataset.title || "";
    modalText.textContent = card.dataset.text || "";

    timelineModal.classList.add("show");
    timelineModal.style.display = "flex";
    document.body.classList.add("no-scroll");
  }

  function closeTimelineModal() {
    timelineModal.classList.remove("show");
    document.body.classList.remove("no-scroll");
    setTimeout(() => timelineModal.style.display = "none", 300);
  }

  document.querySelectorAll(".timeline-item").forEach(item => {
    item.addEventListener("click", () => openTimelineModal(item));
  });

  modalClose.addEventListener("click", closeTimelineModal);
  timelineModal.addEventListener("click", e => {
    if (e.target === timelineModal) closeTimelineModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeTimelineModal();
  });
}


  // 🔥 Плавная анимация при скролле
  observeElements(".fade-in");
  observeElements(".benefit-item");
  observeElements(".stat-item");
  observeElements(".partner-item");
  observeElements(".review");
  observeElements(".timeline-item");
  observeElements(".belt-item");
  observeElements(".step-item");

  /* =========================
     Параллакс hero (только десктоп)
  ========================= */
const hero = document.getElementById("hero");

function initParallax() {
  if (window.innerWidth > 900 && hero) {
    let lastScrollY = 0;
    function updateParallax() {
      hero.style.backgroundPosition = `center ${lastScrollY * 0.4}px`;
    }
    window.addEventListener("scroll", () => {
      lastScrollY = window.pageYOffset;
      requestAnimationFrame(updateParallax);
    });
  }
}
window.addEventListener("load", initParallax);

  /* =========================
     📊 Анимация счётчиков
  ========================= */
  function animateCounters(section) {
    section.querySelectorAll(".counter").forEach(counter => {
      if (counter.dataset.animated) return;
      counter.dataset.animated = true;

      const target = +counter.dataset.target;
      const duration = 1000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        counter.textContent = Math.floor(progress * target);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  ["#club-achievements", ".medals-counter"].forEach(selector => {
    const section = document.querySelector(selector);
    if (section) {
      new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) animateCounters(section);
      }, { threshold: 0.4 }).observe(section);
    }
  });

  /* =========================
     Слайдеры Swiper
  ========================= */
  const swiperConfig = {
    loop: true,
    pagination: { clickable: true },
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    },
    autoplay: { delay: 5000, disableOnInteraction: false }
  };

  [
    '.trainers-swiper',
    '.achievements-swiper',
    '.albums-swiper',
    '.reviews-swiper'
  ].forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
      swiperConfig.pagination.el = `${selector} .swiper-pagination`;
      new Swiper(selector, swiperConfig);
    }
  });
  /* =========================
     Модалка для тренеров и спортсменов
  ========================= */
const uModal = document.getElementById("universal-modal");
const trainerSound = document.getElementById("trainer-sound");

if (uModal) {
  const uModalImg = document.getElementById("u-modal-img");
  const uModalName = document.getElementById("u-modal-name");
  const uModalRole = document.getElementById("u-modal-role");
  const uModalInfo = document.getElementById("u-modal-info");
  const uModalComment = document.getElementById("u-modal-comment");
  const uModalClose = uModal.querySelector(".modal-close");
  const uModalBadges = document.getElementById("u-modal-badges");
 const titleDescriptions = {
  "ЗМС": "Заслуженный мастер спорта России (ЗМС) — высшее спортивное звание в РФ. Присваивается за выдающиеся достижения на международной арене.",
  "МСМК": "Мастер спорта России международного класса (МСМК) — одно из высших званий. Присваивается за успешные выступления на чемпионатах мира, Европы и других крупных международных турнирах.",
  "МС": "Мастер спорта России (МС) — федеральное спортивное звание первой категории. Присваивается за выполнение высоких нормативов на чемпионатах России и других официальных соревнованиях.",
  "КМС": "Кандидат в мастера спорта России (КМС) — промежуточное звание перед МС. Требует серьёзных спортивных результатов на региональном и всероссийском уровне.",
  "1 разряд": "Первый спортивный разряд — высокий уровень спортивной квалификации, предшествующий званию КМС.",
  "2 разряд": "Второй спортивный разряд — средний уровень спортивной подготовки.",
  "3 разряд": "Третий спортивный разряд — начальный уровень спортивной квалификации для взрослых спортсменов.",
  "1 юношеский разряд": "Первый юношеский разряд — высший уровень среди юношеских категорий.",
  "2 юношеский разряд": "Второй юношеский разряд — средний уровень подготовки для детей и подростков.",
  "3 юношеский разряд": "Третий юношеский разряд — начальный уровень спортивной квалификации для юных спортсменов."
};

 function openUModal(card) {
  uModalImg.src = card.dataset.img || "";
  uModalName.textContent = card.dataset.name || "";
  uModalRole.textContent = card.dataset.role || "";
  uModalInfo.textContent = card.dataset.info || "";
  uModalComment.textContent = card.dataset.comment || "";

  uModalBadges.innerHTML = "";
  if (card.dataset.badges) {
    try {
      const badges = JSON.parse(card.dataset.badges);
      badges.forEach((b, i) => {
        const badge = document.createElement("span");
        badge.classList.add("badge", b.type);
        badge.style.animation = `badgePop 0.4s ease ${i * 0.15}s forwards`;

        if (b.type === "gold") {
          badge.textContent = `🥇 ${b.count}`;
          badge.setAttribute("data-info", `Золотых медалей: ${b.count}`);
        }
        if (b.type === "silver") {
          badge.textContent = `🥈 ${b.count}`;
          badge.setAttribute("data-info", `Серебряных медалей: ${b.count}`);
        }
        if (b.type === "bronze") {
          badge.textContent = `🥉 ${b.count}`;
          badge.setAttribute("data-info", `Бронзовых медалей: ${b.count}`);
        }
        if (b.type === "title") {
          badge.textContent = `🏅 ${b.label}`;
          // Если есть расшифровка — используем её, иначе просто "Звание: ..."
          const desc = titleDescriptions[b.label] || `Звание: ${b.label}`;
          badge.setAttribute("data-info", desc);
        }

        uModalBadges.appendChild(badge);
      });
    } catch (e) {
      console.warn("Ошибка парсинга бейджей:", e);
    }
  }
  uModalBadges.style.display = uModalBadges.children.length ? "flex" : "none";

  uModal.classList.add("show");
  uModal.style.display = "flex";
  document.body.classList.add("no-scroll");

  if (trainerSound) {
    trainerSound.volume = 0.4;
    trainerSound.currentTime = 0;
    trainerSound.play();
  }
}

  function closeUModal() {
    uModal.classList.remove("show");
    document.body.classList.remove("no-scroll");
    setTimeout(() => uModal.style.display = "none", 300);

    if (trainerSound) {
      trainerSound.pause();
      trainerSound.currentTime = 0;
    }
  }

  document.querySelectorAll(".card-item").forEach(card => {
    card.addEventListener("click", () => openUModal(card));
  });

  uModalClose.addEventListener("click", closeUModal);
  uModal.addEventListener("click", e => { if (e.target === uModal) closeUModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeUModal(); });
}

 /* =========================
     Модалка для событий
  ========================= */

  /* =========================
     Переключатель темы
  ========================= */
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Установка иконки на основе текущей темы
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '🌞' : '🌙';

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDarkNow = document.body.classList.contains('dark');
      themeToggle.textContent = isDarkNow ? '🌞' : '🌙';
      localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
    });

    // Двойной клик для сброса к автоматической теме
    themeToggle.addEventListener('dblclick', () => {
      localStorage.removeItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('dark', prefersDark);
      themeToggle.textContent = prefersDark ? '🌞' : '🌙';
      alert('Тема сброшена к системным настройкам');
    });
  }
  /* =========================
     Обработка формы
  ========================= */
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const status = document.getElementById("form-status");

      fetch("signup.php", { method: "POST", body: formData })
        .then(res => res.text())
        .then(data => {
          if (data.trim() === "OK") {
            status.textContent = "Спасибо! Ваша заявка отправлена.";
            status.style.color = "green";
            this.reset();
          } else {
            status.textContent = "Ошибка отправки. Попробуйте позже.";
            status.style.color = "red";
          }
        })
        .catch(() => {
          status.textContent = "Ошибка соединения.";
          status.style.color = "red";
        });
    });
  }

  /* =========================
     Слайдер отзывов (автопереключение)
  ========================= */
  const testimonials = document.querySelectorAll(".testimonial");
  let testimonialIndex = 0;
  if (testimonials.length) {
    testimonials[testimonialIndex].classList.add("active");
    setInterval(() => {
      testimonials[testimonialIndex].classList.remove("active");
      testimonialIndex = (testimonialIndex + 1) % testimonials.length;
      testimonials[testimonialIndex].classList.add("active");
    }, 5000);
  }
// создаём модалку один раз
const photoModal = document.createElement("div");
photoModal.id = "photo-modal";
photoModal.innerHTML = `
  <div class="photo-overlay"></div>
  <img id="photo-modal-img" src="" alt="Фото">
`;
document.body.appendChild(photoModal);

const modalImg = document.getElementById("photo-modal-img");
const overlay = photoModal.querySelector(".photo-overlay");

// обработка клика по фото
document.querySelectorAll(".about-media img, .event-card img").forEach(img => {
  img.style.cursor = "zoom-in"; // курсор увеличения
  img.addEventListener("click", () => {
    modalImg.src = img.src;
    photoModal.classList.add("show");
    document.body.classList.add("no-scroll");
  });
});

// закрытие по клику на фон
overlay.addEventListener("click", () => {
  photoModal.classList.remove("show");
  document.body.classList.remove("no-scroll");
});

  /* =========================
     Плавающие иконки
  ========================= */
  const icons = ["🥋", "🥇", "🥊"];
  const floatingContainer = document.querySelector(".floating-icons");
  if (floatingContainer) {
    for (let i = 0; i < 10; i++) {
      const span = document.createElement("span");
      span.textContent = icons[Math.floor(Math.random() * icons.length)];
      span.style.left = Math.random() * 100 + "%";
      span.style.animationDuration = 8 + Math.random() * 5 + "s";
      span.style.fontSize = 1.5 + Math.random() * 1.5 + "rem";
      floatingContainer.appendChild(span);
    }
  }

  // Load club achievements from JSON (medals, titles, dans)
  function renderBenefitItems(container, items) {
    if (!container || !Array.isArray(items)) return;
    container.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "benefit-item";

      const icon = document.createElement("div");
      icon.className = "icon-circle";
      if (item.gradient) icon.style.background = item.gradient;
      icon.textContent = item.icon || "";

      const label = document.createElement("strong");
      label.textContent = item.label || "";

      const count = document.createElement("p");
      count.textContent = item.count != null ? String(item.count) : "";

      card.appendChild(icon);
      card.appendChild(label);
      card.appendChild(count);
      container.appendChild(card);
    });
  }

  const clubSection = document.getElementById("club-achievements");
  if (clubSection) {
    const grids = clubSection.querySelectorAll(".benefits-grid.achievements-grid");
    if (grids.length >= 3) {
      fetch("/data/club-achievements.json")
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (!data) return;
          renderBenefitItems(grids[0], data.medals);
          renderBenefitItems(grids[1], data.titles);
          renderBenefitItems(grids[2], data.dans);
        })
        .catch(() => {});
    }
  }

});

// Редактирование контента
document.addEventListener('DOMContentLoaded', () => {
  const editModal = document.getElementById('edit-modal');
  const editTextarea = document.getElementById('edit-textarea');
  const saveEditBtn = document.getElementById('save-edit');
  let currentSection = '';

  // Админ-вход отключён: кнопка входа удалена, режим администратора не активируется

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentSection = e.target.dataset.section;
      const section = document.getElementById(currentSection);
      const content = section.innerHTML;
      editTextarea.value = content;
      editModal.classList.add('show');
      editModal.style.display = 'flex';
      document.body.classList.add('no-scroll');
    });
  });

  editModal.querySelector('.modal-close').addEventListener('click', () => {
    editModal.classList.remove('show');
    editModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
  });

  saveEditBtn.addEventListener('click', () => {
    const newContent = editTextarea.value;
    localStorage.setItem(currentSection + '_content', newContent);
    document.getElementById(currentSection).innerHTML = newContent;
    editModal.classList.remove('show');
    editModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
  });

  // Загрузка сохранённого контента
  ['trainers', 'achievements', 'club-achievements'].forEach(section => {
    const saved = localStorage.getItem(section + '_content');
    if (saved) {
      document.getElementById(section).innerHTML = saved;
    }
  });
});
