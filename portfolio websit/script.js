"use strict";

document.documentElement.classList.add("js-ready");

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#primary-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const currentYear = document.querySelector("#current-year");
const portrait = document.querySelector(".portrait-frame img");

function closeMenu() {
  if (!menuToggle || !navMenu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
    navMenu.classList.toggle("is-open", !isExpanded);
    document.body.classList.toggle("menu-open", !isExpanded);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) closeMenu();
  });
}

// Keep the current section reflected in the navigation while scrolling.
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
}

if (portrait) {
  portrait.addEventListener("error", () => portrait.classList.add("image-missing"));
  if (portrait.complete && portrait.naturalWidth === 0) {
    portrait.classList.add("image-missing");
  }
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    formStatus.textContent = "Thanks for your message. This demo form does not send data to a server.";
    contactForm.reset();
  });
}

if (currentYear) currentYear.textContent = String(new Date().getFullYear());
