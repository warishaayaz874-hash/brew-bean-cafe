document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });

    document.addEventListener("click", (event) => {
      if (
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      }
    });
  }
  const navContainer = document.querySelector(".nav-container");
  let themeToggle = document.querySelector(".theme-toggle");

  if (navContainer && !themeToggle) {
    themeToggle = document.createElement("button");
    themeToggle.type = "button";
    themeToggle.className = "theme-toggle";
    themeToggle.setAttribute("aria-label", "Toggle dark mode");
    navContainer.appendChild(themeToggle);
  }

  const savedTheme = localStorage.getItem("cafe-theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  function updateThemeButton() {
    if (!themeToggle) return;

    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  }

  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("cafe-theme", isDark ? "dark" : "light");

      updateThemeButton();
    });
  }
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) return;

    question.setAttribute(
      "aria-expanded",
      String(item.classList.contains("active"))
    );

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach((otherItem) => {
        otherItem.classList.remove("active");

        const otherQuestion = otherItem.querySelector(".faq-question");
        if (otherQuestion) {
          otherQuestion.setAttribute("aria-expanded", "false");
        }
      });

      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
  const contactForm = document.querySelector(".contact-form");
  const formStatus = document.querySelector(".form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const subject = contactForm.querySelector('[name="subject"]');
      const message = contactForm.querySelector('[name="message"]');

      let isValid = true;

      function showError(field, errorText) {
        const group = field.closest(".form-group");
        const errorElement = group
          ? group.querySelector(".error-message")
          : null;

        if (errorElement) {
          errorElement.textContent = errorText;
        }

        field.setAttribute("aria-invalid", "true");
        isValid = false;
      }

      function clearError(field) {
        const group = field.closest(".form-group");
        const errorElement = group
          ? group.querySelector(".error-message")
          : null;

        if (errorElement) {
          errorElement.textContent = "";
        }

        field.removeAttribute("aria-invalid");
      }

      [name, email, subject, message].forEach((field) => {
        if (field) clearError(field);
      });

      if (!name || name.value.trim().length < 2) {
        if (name) showError(name, "Please enter at least 2 characters.");
        isValid = false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailPattern.test(email.value.trim())) {
        if (email) showError(email, "Please enter a valid email address.");
        isValid = false;
      }

      if (!subject || subject.value.trim().length < 3) {
        if (subject) showError(subject, "Please enter a subject.");
        isValid = false;
      }

      if (!message || message.value.trim().length < 10) {
        if (message) {
          showError(message, "Message must be at least 10 characters.");
        }
        isValid = false;
      }

      if (!isValid) {
        if (formStatus) {
          formStatus.textContent = "Please correct the errors above.";
        }
        return;
      }

      if (formStatus) {
        formStatus.textContent =
          "Your form looks good! This demo does not send messages yet.";
      }

      contactForm.reset();
    });

    contactForm.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        const group = field.closest(".form-group");
        const errorElement = group
          ? group.querySelector(".error-message")
          : null;

        if (errorElement) errorElement.textContent = "";
        field.removeAttribute("aria-invalid");

        if (formStatus) formStatus.textContent = "";
      });
    });
  }
  let scrollTopButton = document.querySelector(".scroll-top");

  if (!scrollTopButton) {
    scrollTopButton = document.createElement("button");
    scrollTopButton.type = "button";
    scrollTopButton.className = "scroll-top";
    scrollTopButton.textContent = "↑";
    scrollTopButton.setAttribute("aria-label", "Scroll to top");
    document.body.appendChild(scrollTopButton);
  }

  function updateScrollButton() {
    scrollTopButton.classList.toggle("show", window.scrollY > 300);
  }

  window.addEventListener("scroll", updateScrollButton);
  updateScrollButton();

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
  const counters = document.querySelectorAll(".stat-number[data-target]");

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target)) return;

    const duration = 1500;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easedProgress * target);

      counter.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(animateCounter);
  }
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 650 && navLinks && menuToggle) {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    }
  });
});