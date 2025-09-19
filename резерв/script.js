window.addEventListener("load", () => {

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
  if (window.innerWidth > 900 && hero) {
    window.addEventListener("scroll", () => {
      hero.style.backgroundPositionY = window.pageYOffset * 0.5 + "px";
    });
  }

  /* =========================
     ⏳ Прогресс-бары
  ========================= */
  observeElements(".progress", "fill", 0.5, false);
  document.querySelectorAll(".progress").forEach(bar => {
    bar.style.width = bar.dataset.value + "%";
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

    function openUModal(card) {
      uModalImg.src = card.dataset.img || "";
      uModalName.textContent = card.dataset.name || "";
      uModalRole.textContent = card.dataset.role || "";
      uModalInfo.textContent = card.dataset.info || "";
      uModalComment.textContent = card.dataset.comment || "";

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
    uModal.addEventListener("click", e => {
      if (e.target === uModal) closeUModal();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeUModal();
    });
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
  const events = document.querySelectorAll(".event-card");
  if (events.length) {
    const now = new Date();
    let nextEvent = null;

    events.forEach(event => {
      const eventDate = new Date(event.dataset.date);
      if (eventDate > now) {
        event.style.display = "flex";
        if (!nextEvent || eventDate < new Date(nextEvent.dataset.date)) {
          nextEvent = event;
        }
      } else {
        event.style.display = "none";
      }
    });

    if (nextEvent) {
      const targetDate = new Date(nextEvent.dataset.date);
      const titleEl = document.getElementById("next-event-title");
      if (titleEl) {
        const eventName = nextEvent.querySelector("h3").textContent;
        titleEl.textContent = `До события "${eventName}" осталось:`;
      }

      const daysEl = document.getElementById("days");
      const hoursEl = document.getElementById("hours");
      const minutesEl = document.getElementById("minutes");
      const secondsEl = document.getElementById("seconds");

      function updateCountdown() {
        const now = new Date();
        const distance = targetDate - now;

        if (distance <= 0) {
          daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = "00";
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
      setInterval(updateCountdown, 1000);
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
     Виджет ВКонтакте
  ========================= */
  (function() {
    const vk = document.createElement('script');
    vk.src = 'https://vk.com/js/api/openapi.js?169';
    vk.async = true;
    vk.onload = function() {
      if (window.VK) {
        VK.Widgets.Group("vk_groups", {mode: 4, width: "auto", height: "400"}, 186004438);
      }
    };
    document.head.appendChild(vk);
  })();

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
