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
 /* =========================
     Фильтр
  ========================= */
window.addEventListener("load", initParallax);

const searchInput = document.getElementById('search-events');
const monthFilter = document.getElementById('filter-month');
const placeFilter = document.getElementById('filter-place');
const eventCards = document.querySelectorAll('.event-card');

function normalize(text) {
  return text.toLowerCase().trim();
}

function filterEvents() {
  const searchValue = normalize(searchInput.value);
  const monthValue = monthFilter.value.toLowerCase();
  const placeValue = normalize(placeFilter.value);

  eventCards.forEach(card => {
    const title = normalize(card.querySelector('h3').textContent);
    const placeText = normalize(card.querySelector('.event-info p').textContent);
    const dateText = normalize(card.querySelector('.event-date').textContent);
    const tags = normalize(card.dataset.tags || "");

    // --- новый блок: проверка числа в диапазоне дат ---
    let matchDateNumber = true;
    if (searchValue && /^\d+$/.test(searchValue)) {
      const num = parseInt(searchValue, 10);

      const start = new Date(card.dataset.start);
      const end = card.dataset.end ? new Date(card.dataset.end) : start;

      const startDay = start.getDate();
      const endDay = end.getDate();

      matchDateNumber = (num >= startDay && num <= endDay);
    }

    // если есть дата начала — берём месяц из неё
    let monthText = "";
    if (card.dataset.start) {
      const start = new Date(card.dataset.start);
      monthText = start.toLocaleString('ru-RU', { month: 'short' }).toLowerCase();
    }

    const matchSearch =
      !searchValue ||
      title.includes(searchValue) ||
      tags.includes(searchValue) ||
      placeText.includes(searchValue) ||
      dateText.includes(searchValue) ||
      matchDateNumber;

    const matchMonth = !monthValue || monthText.includes(monthValue);
    const matchPlace = !placeValue || placeText.includes(placeValue);

    if (matchSearch && matchMonth && matchPlace) {
      card.classList.remove('hide');
    } else {
      card.classList.add('hide');
    }
  });
}

function isTodayInRange(startDate, endDate) {
  const today = new Date();
  today.setHours(0,0,0,0);
  return today >= startDate && today <= endDate;
}

function splitEvents() {
  const today = new Date();
  today.setHours(0,0,0,0);

  document.querySelectorAll('.event-card').forEach(card => {
    const start = new Date(card.dataset.start || card.dataset.date);
    const end = card.dataset.end ? new Date(card.dataset.end) : start;

    if (end < today) {
      card.classList.add('past');
      card.classList.remove('today');
    } else if (isTodayInRange(start, end)) {
      card.classList.add('today');
      card.classList.remove('past');
    } else {
      card.classList.remove('past', 'today');
    }
  });
}

// запуск при загрузке
window.addEventListener('load', () => {
  splitEvents();
  filterEvents();
});

[searchInput, monthFilter, placeFilter].forEach(el => {
  el.addEventListener('input', () => {
    filterEvents();
    splitEvents();
  });
});

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
  const eventModal = document.getElementById("event-modal");
  if (eventModal) {
    const eventModalImg = document.getElementById("event-modal-img");
    const eventModalTitle = document.getElementById("event-modal-title");
    const eventModalPlace = document.getElementById("event-modal-place");
    const eventModalDescription = document.getElementById("event-modal-description");
    const eventModalClose = eventModal.querySelector(".modal-close");

    function openEventModal(card) {
      eventModalImg.src = card.dataset.img || "";
      eventModalTitle.textContent = card.dataset.title || "";
      eventModalPlace.textContent = card.dataset.place || "";
      eventModalDescription.textContent = card.dataset.description || "";
      eventModal.classList.add("show");
      eventModal.style.display = "flex";
      document.body.classList.add("no-scroll");
    }

    function closeEventModal() {
      eventModal.classList.remove("show");
      document.body.classList.remove("no-scroll");
      setTimeout(() => eventModal.style.display = "none", 300);
    }

    document.querySelectorAll(".event-more").forEach(btn => {
      btn.addEventListener("click", e => {
        const card = e.target.closest(".event-card");
        if (card) openEventModal(card);
      });
    });

    eventModalClose.addEventListener("click", closeEventModal);
    eventModal.addEventListener("click", e => {
      if (e.target === eventModal) closeEventModal();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeEventModal();
    });
  }

 /* =========================
   Автоматический выбор ближайшего события
========================= */

// нормализуем дату (обнуляем часы)
function normalizeDate(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// конец дня (если дата без времени)
function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

const events = document.querySelectorAll(".event-card");

if (events.length) {
  let nextEvent = null;
  const today = normalizeDate(new Date());

  events.forEach(event => {
    const start = normalizeDate(event.dataset.start || event.dataset.date);
    const end = event.dataset.end
      ? normalizeDate(event.dataset.end)
      : endOfDay(start);

    // событие уже прошло
    if (end < today) {
      event.classList.add("past");
      event.style.display = "none";
      return;
    }

    // событие идёт сегодня
    if (start <= today && end >= today) {
      event.classList.add("today");
      event.style.display = "flex";
      if (!nextEvent) nextEvent = event; // приоритетное
      return;
    }

    // будущее событие
    event.classList.remove("past", "today");
    event.style.display = "flex";

    if (!nextEvent || start < normalizeDate(nextEvent.dataset.start || nextEvent.dataset.date)) {
      nextEvent = event;
    }
  });

  if (nextEvent) {
    const titleEl = document.getElementById("next-event-title");
    const eventName = nextEvent.querySelector("h3").textContent;

    const start = new Date(nextEvent.dataset.start || nextEvent.dataset.date);
    const end = nextEvent.dataset.end
      ? new Date(nextEvent.dataset.end)
      : endOfDay(start);

    // акцент на карточке
    document.querySelectorAll(".event-card").forEach(c => c.classList.remove("highlight"));
    nextEvent.classList.add("highlight");

    if (titleEl) {
      if (start <= new Date() && end >= new Date()) {
        titleEl.textContent = `Событие "${eventName}" уже идёт!`;
      } else {
        titleEl.textContent = `До события "${eventName}" осталось:`;
      }
    }

    // таймер
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateCountdown() {
      const now = new Date();

      // если событие идёт сегодня → отсчёт до конца
      if (start <= now && end >= now) {
        const distance = end - now;

        if (distance <= 0) {
          clearInterval(timer);
          daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = "00";
          return;
        }

        titleEl.textContent = `Событие "${eventName}" уже идёт! Осталось:`;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, "0");
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");
        return;
      }

      // если событие ещё не началось → отсчёт до старта
      const distance = start - now;
      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
  }
}

  /* =========================
     Переключатель темы
  ========================= */
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      document.body.classList.toggle('dark', savedTheme === 'dark');
      themeToggle.textContent = savedTheme === 'dark' ? '🌞' : '🌙';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark');
      themeToggle.textContent = '🌞';
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      themeToggle.textContent = isDark ? '🌞' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
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

});
