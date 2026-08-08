/* =========================================================
   Zeeshan Mehdi Qasimi — Portfolio JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* Loader */
  window.addEventListener("load", () => {
    const loader = $("#loader");
    if (!loader) return;
    setTimeout(() => loader.classList.add("is-hidden"), 250);
  });

  /* AOS */
  if (window.AOS) {
    AOS.init({ duration: 850, once: true, offset: 80, easing: "ease-out-cubic" });
  }

  /* Typing */
  const typing = $("#typing");
  const words = [
    "BS Data Science Student",
    "Python Developer",
    "Data Analyst",
    "Machine Learning Enthusiast",
    "AI & NLP Enthusiast"
  ];
  let wordIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    if (!typing) return;
    const word = words[wordIndex];
    typing.textContent = deleting
      ? word.slice(0, charIndex - 1)
      : word.slice(0, charIndex + 1);

    charIndex += deleting ? -1 : 1;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      setTimeout(typeLoop, 1300);
      return;
    }
    if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
    setTimeout(typeLoop, deleting ? 45 : 75);
  }
  typeLoop();

  /* Mobile menu */
  const menuBtn = $(".menu-btn");
  const navLinks = $(".nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuBtn.setAttribute("aria-expanded", navLinks.classList.contains("active"));
    });
    $$(".nav-links a").forEach(link => {
      link.addEventListener("click", () => navLinks.classList.remove("active"));
    });
  }

  /* Header + active nav + scroll progress */
  const header = $("header");
  const progressBar = $("#progressBar");
  const sections = $$("section[id]");
  const navItems = $$(".nav-links a");

  function updateScrollUI() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 20);

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    }

    let current = "";
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 140) current = section.id;
    });
    navItems.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });

    const backToTop = $("#backToTop");
    if (backToTop) backToTop.style.display = window.scrollY > 500 ? "grid" : "none";
  }
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  /* Back to top */
  const backToTop = $("#backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* Theme */
  const themeToggle = $("#theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") document.body.classList.add("light-mode");
  if (themeToggle) {
    themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", "Toggle color theme");
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const light = document.body.classList.contains("light-mode");
      localStorage.setItem("theme", light ? "light" : "dark");
      themeToggle.textContent = light ? "☀️" : "🌙";
    });
  }

  /* Skill bars */
  const skillBars = $$(".progress-bar");
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const target = bar.dataset.width || "0";
      requestAnimationFrame(() => { bar.style.width = target; });
      observer.unobserve(bar);
    });
  }, { threshold: 0.35 });

  skillBars.forEach(bar => {
    const match = bar.getAttribute("style")?.match(/width\s*:\s*([^;]+)/i);
    if (match) bar.dataset.width = match[1];
    bar.style.width = "0";
    skillObserver.observe(bar);
  });

  /* Counters: supports optional .counter elements */
  const counters = $$(".counter");
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        const decimals = Number(el.dataset.decimal || 0);
        const suffix = el.dataset.suffix || "";
        const start = performance.now();
        const duration = 1200;

        function animate(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(counter => counterObserver.observe(counter));
  }

  /* Custom cursor on desktop */
  const cursor = $(".cursor");
  if (cursor && window.matchMedia("(pointer:fine)").matches) {
    document.addEventListener("mousemove", e => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursor.style.opacity = "1";
    });
    document.addEventListener("mouseleave", () => cursor.style.opacity = "0");
  }

  /* Particles */
  if (window.particlesJS && $("#particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 55, density: { enable: true, value_area: 1000 } },
        color: { value: "#38bdf8" },
        shape: { type: "circle" },
        opacity: { value: 0.25 },
        size: { value: 2.5, random: true },
        line_linked: { enable: true, distance: 145, color: "#38bdf8", opacity: 0.12, width: 1 },
        move: { enable: true, speed: 1.2, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, resize: true },
        modes: { grab: { distance: 150, line_linked: { opacity: 0.25 } } }
      },
      retina_detect: true
    });
  }

  /* Project image fallback */
  $$(".project-image img").forEach(img => {
    img.addEventListener("error", () => {
      img.removeAttribute("src");
      img.alt = "";
      img.classList.add("broken-image");
    });
  });

  /* EmailJS */
  const form = $("#contact-form");
  const sendBtn = $("#sendBtn");

  if (form && window.emailjs) {
    emailjs.init({ publicKey: "MLs0Mi4U2jtA3mhMA" });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const nameInput = $('[name="from_name"]', form);
      const emailInput = $('[name="from_email"]', form);
      const messageInput = $('[name="message"]', form);
      const hiddenName = $("#emailjs-name");
      const hiddenTime = $("#emailjs-time");

      if (hiddenName) hiddenName.value = nameInput.value.trim();
      if (hiddenTime) hiddenTime.value = new Date().toLocaleString();

      const originalText = sendBtn?.innerHTML;
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }

      try {
        /* 1) Main email to Zeeshan */
        await emailjs.sendForm("service_47a8dwc", "template_gn4p6qh", form);

        /* 2) Auto-reply to the visitor.
           The Auto Reply template must use the visitor email as its recipient. */
        await emailjs.send("service_47a8dwc", "template_pw4o93q", {
          from_name: nameInput.value.trim(),
          from_email: emailInput.value.trim(),
          message: messageInput.value.trim(),
          name: nameInput.value.trim(),
          time: new Date().toLocaleString()
        });

        if (window.Swal) {
          await Swal.fire({
            icon: "success",
            title: "Message Sent!",
            text: "Your message has been sent successfully. A confirmation email has also been requested.",
            confirmButtonColor: "#2563eb"
          });
        } else {
          alert("Message sent successfully!");
        }

        form.reset();
      } catch (error) {
        console.error("EmailJS error:", error);
        if (window.Swal) {
          Swal.fire({
            icon: "error",
            title: "Message not sent",
            text: "Please try again. If the problem continues, use the email or WhatsApp buttons.",
            confirmButtonColor: "#ef4444"
          });
        } else {
          alert("Message could not be sent. Please try again.");
        }
      } finally {
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.innerHTML = originalText || '<i class="fas fa-paper-plane"></i> Send Message';
        }
      }
    });
  }

  /* Smooth anchors */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const target = $(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* Add a subtle fallback visual for missing project thumbnails */
  const fallbackStyle = document.createElement("style");
  fallbackStyle.textContent = `
    .project-image img.broken-image{display:none}
    .project-image:has(img.broken-image)::before{
      content:"DATA • ML • NLP";
      position:absolute;inset:0;display:grid;place-items:center;
      color:#7dd3fc;font:800 18px Poppins,sans-serif;letter-spacing:2px;
      background:radial-gradient(circle at 30% 30%,rgba(56,189,248,.28),transparent 35%),
                 linear-gradient(135deg,#0b1d3a,#0b4653);
      z-index:1;
    }
  `;
  document.head.appendChild(fallbackStyle);

  console.log("Portfolio initialized successfully.");
});


/* ================= EMAILJS CONTACT FORM ================= */
const EMAILJS_PUBLIC_KEY = "MLs0Mi4U2jtA3mhMA";
const EMAILJS_SERVICE_ID = "service_47a8dwc";
const EMAILJS_TEMPLATE_ID = "template_gn4p6qh";

if (window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

if (contactForm && window.emailjs) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const button = contactForm.querySelector('button[type="submit"]');
        const oldText = button ? button.textContent : "";
        if (button) { button.disabled = true; button.textContent = "Sending..."; }
        if (contactStatus) { contactStatus.textContent = ""; contactStatus.className = "contact-status"; }

        try {
            await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm);
            if (contactStatus) {
                contactStatus.textContent = "Message sent successfully. Thank you!";
                contactStatus.classList.add("success");
            }
            contactForm.reset();
        } catch (error) {
            console.error("EmailJS error:", error);
            if (contactStatus) {
                contactStatus.textContent = "Message could not be sent. Please try again or email me directly.";
                contactStatus.classList.add("error");
            }
        } finally {
            if (button) { button.disabled = false; button.textContent = oldText; }
        }
    });
}
