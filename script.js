document.addEventListener("DOMContentLoaded", () => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let scrollLockY = 0;
  let prevScrollBehavior = "";
  const lockScroll = () => {
    scrollLockY = window.scrollY || window.pageYOffset || 0;
    prevScrollBehavior = document.documentElement.style.scrollBehavior || "";
    document.body.style.top = `-${scrollLockY}px`;
    document.body.classList.add("no-scroll");
  };
  const unlockScroll = () => {
    document.body.classList.remove("no-scroll");
    document.body.style.top = "";
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, scrollLockY);
    // restore previous scroll behavior after position is set
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
    });
  };

  /* =========================
     Универсальная функция появления элементов
  ========================= */
  function observeElements(selector, visibleClass = "visible", threshold = 0.2, once = true) {
    const elements = qsa(selector);
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

  /* =========================
     Модалка таймлайна
  ========================= */
  const timelineModal = qs("#timeline-modal");
  if (timelineModal) {
    const modalImg = qs("#timeline-modal-img");
    const modalTitle = qs("#timeline-modal-title");
    const modalText = qs("#timeline-modal-text");
    const modalClose = qs(".modal-close", timelineModal);

    const openTimelineModal = card => {
      modalImg.src = card.dataset.img || "";
      modalTitle.textContent = card.dataset.title || "";
      modalText.textContent = card.dataset.text || "";

      timelineModal.classList.add("show");
      timelineModal.style.display = "flex";
      lockScroll();
    };

    const closeTimelineModal = () => {
      timelineModal.classList.remove("show");
      unlockScroll();
      setTimeout(() => { timelineModal.style.display = "none"; }, 300);
    };

    qsa(".timeline-item").forEach(item => {
      item.addEventListener("click", () => openTimelineModal(item));
    });

    if (modalClose) modalClose.addEventListener("click", closeTimelineModal);
    timelineModal.addEventListener("click", e => {
      if (e.target === timelineModal) closeTimelineModal();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeTimelineModal();
    });
  }

  /* =========================
     Плавная анимация при скролле
  ========================= */
  [
    ".fade-in",
    ".benefit-item",
    ".stat-item",
    ".partner-item",
    ".review",
    ".timeline-item",
    ".belt-item",
    ".step-item"
  ].forEach(selector => observeElements(selector));

  /* =========================
     Параллакс hero (только десктоп)
  ========================= */
  const hero = qs("#hero");
  if (hero && window.innerWidth > 900) {
    let lastScrollY = 0;
    let ticking = false;

    const updateParallax = () => {
      hero.style.backgroundPosition = `center ${lastScrollY * 0.4}px`;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      lastScrollY = window.pageYOffset;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
  }

  /* =========================
     Слайдеры Swiper
  ========================= */
  if (window.Swiper) {
    const baseSwiperConfig = {
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
      ".trainers-swiper",
      ".achievements-swiper",
      ".albums-swiper",
      ".reviews-swiper"
    ].forEach(selector => {
      const el = qs(selector);
      if (!el) return;

      new Swiper(el, {
        ...baseSwiperConfig,
        pagination: {
          ...baseSwiperConfig.pagination,
          el: `${selector} .swiper-pagination`
        }
      });
    });
  }

  /* =========================
     Модалка для тренеров и спортсменов
  ========================= */
  const uModal = qs("#universal-modal");
  const trainerSound = qs("#trainer-sound");

  if (uModal) {
    const uModalImg = qs("#u-modal-img");
    const uModalName = qs("#u-modal-name");
    const uModalRole = qs("#u-modal-role");
    const uModalInfo = qs("#u-modal-info");
    const uModalComment = qs("#u-modal-comment");
    const uModalClose = qs(".modal-close", uModal);
  const uModalBadges = qs("#u-modal-badges");

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
      "3 юношеский разряд": "Третий юношеский разряд — начальный уровень спортивной квалификации для юных спортсменов.",
      "status": "Официальный статус руководителя, определяющий развитие каратэ в регионе.",
      "belt": "Высшая ступень технического мастерства и знаний боевого искусства."
    };

    const openUModal = card => {
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
              badge.setAttribute("data-info", `${b.label || "Золотых медалей"}: ${b.count}`);
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
              const desc = titleDescriptions[b.label] || `Звание: ${b.label}`;
              badge.setAttribute("data-info", desc);
            }
            if (b.type === "status") {
              badge.textContent = `🏛️ ${b.label}`;
              badge.setAttribute("data-info", titleDescriptions.status);
            }
            if (b.type === "belt") {
              badge.textContent = `🥋 ${b.label}`;
              badge.setAttribute("data-info", `${titleDescriptions.belt} (${b.label})`);
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
    lockScroll();

      if (trainerSound) {
        trainerSound.volume = 0.4;
        trainerSound.currentTime = 0;
        trainerSound.play();
      }
    };

    const closeUModal = () => {
    uModal.classList.remove("show");
    unlockScroll();
      setTimeout(() => { uModal.style.display = "none"; }, 300);

      if (trainerSound) {
        trainerSound.pause();
        trainerSound.currentTime = 0;
      }
    };

    document.addEventListener("click", e => {
      const card = e.target.closest(".card-item");
      if (card) {
        openUModal(card);
      }
    });

    if (uModalClose) uModalClose.addEventListener("click", closeUModal);
    uModal.addEventListener("click", e => { if (e.target === uModal) closeUModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeUModal(); });
  }

  /* =========================
     Переключатель темы
  ========================= */
  const themeToggle = qs("#theme-toggle");
  if (themeToggle) {
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "🌞" : "🌙";

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDarkNow = document.body.classList.contains("dark");
      themeToggle.textContent = isDarkNow ? "🌞" : "🌙";
      localStorage.setItem("theme", isDarkNow ? "dark" : "light");
    });
  }

  /* =========================
     Слайдер отзывов (автопереключение)
  ========================= */
  const testimonials = qsa(".testimonial");
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
     Модалка для фото
  ========================= */
  const zoomImages = qsa(".about-media img, .event-card img");
  if (zoomImages.length) {
    const photoModal = document.createElement("div");
    photoModal.id = "photo-modal";
    photoModal.innerHTML = `
      <div class="photo-overlay"></div>
      <img id="photo-modal-img" src="" alt="Фото">
    `;
    document.body.appendChild(photoModal);

    const modalImg = qs("#photo-modal-img");
    const overlay = qs(".photo-overlay", photoModal);

    zoomImages.forEach(img => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        modalImg.src = img.src;
        photoModal.classList.add("show");
        lockScroll();
      });
    });

    overlay.addEventListener("click", () => {
      photoModal.classList.remove("show");
      unlockScroll();
    });
  }

  /* =========================
     Плавающие иконки
  ========================= */
  const icons = ["🥋", "🥇", "🥊"];
  const floatingContainer = qs(".floating-icons");
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

  /* =========================
     Загрузка достижений клуба из JSON
  ========================= */
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

  const clubSection = qs("#club-achievements");
  if (clubSection) {
    const grids = qsa(".benefits-grid.achievements-grid", clubSection);
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

  /* =========================
     Редактирование разделов (admin)
  ========================= */
  const editModal = qs("#edit-modal");
  const editTextarea = qs("#edit-textarea");
  const saveEditBtn = qs("#save-edit");
  const editButtons = qsa(".edit-btn");
  const editModalClose = editModal ? qs(".modal-close", editModal) : null;
  let currentSection = null;

  const openEditModal = sectionId => {
    const section = qs(`#${sectionId}`);
    if (!section) return;

    currentSection = sectionId;
    editTextarea.value = section.innerHTML;
    editModal.classList.add("show");
    editModal.style.display = "flex";
    lockScroll();
  };

  const closeEditModal = () => {
    editModal.classList.remove("show");
    editModal.style.display = "none";
    unlockScroll();
  };

  if (editModal && editTextarea && saveEditBtn && editButtons.length) {
    editButtons.forEach(btn => {
      btn.addEventListener("click", () => openEditModal(btn.dataset.section));
    });

    if (editModalClose) editModalClose.addEventListener("click", closeEditModal);
    editModal.addEventListener("click", e => {
      if (e.target === editModal) closeEditModal();
    });

    saveEditBtn.addEventListener("click", () => {
      if (!currentSection) return;
      const newContent = editTextarea.value;
      localStorage.setItem(`${currentSection}_content`, newContent);
      const section = qs(`#${currentSection}`);
      if (section) section.innerHTML = newContent;
      closeEditModal();
    });
  }

  // Загрузка сохранённого контента
  ["trainers", "achievements", "club-achievements"].forEach(sectionId => {
    const saved = localStorage.getItem(`${sectionId}_content`);
    const section = qs(`#${sectionId}`);
    if (saved && section) {
      section.innerHTML = saved;
    }
  });
});
