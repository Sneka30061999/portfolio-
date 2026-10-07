"use strict";

// Replace with your real email address
const CONTACT_EMAIL = "sneka30061999@gmail.com ";

document.documentElement.classList.add("js");

// ---------- Mobile menu ----------
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

function setMenu(open) {
  navMenu.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
navToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("is-open")));
navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ---------- Dark / light theme ----------
const root = document.documentElement;
const themeBtn = document.querySelector(".theme-toggle");

function currentTheme() {
  return root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
function updateThemeLabel() {
  themeBtn.setAttribute("aria-label", currentTheme() === "dark" ? "Switch to light mode" : "Switch to dark mode");
}
themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
  updateThemeLabel();
});
updateThemeLabel();

// ---------- Active nav link while scrolling ----------
const navLinks = document.querySelectorAll(".nav-link");
const sections = [...navLinks].map((l) => document.querySelector(l.getAttribute("href")));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => s && sectionObserver.observe(s));

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Contact form ----------
const form = document.getElementById("contact-form");
const statusEl = form.querySelector(".form-status");

function validateField(input) {
  const field = input.closest(".field");
  let error = "";
  const value = input.value.trim();
  if (!value) error = "This field is required.";
  else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Enter a valid email address.";
  field.classList.toggle("has-error", Boolean(error));
  field.querySelector(".field__error").textContent = error;
  return !error;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = [...form.querySelectorAll("input, textarea")];
  const allValid = fields.map(validateField).every(Boolean);
  if (!allValid) {
    statusEl.textContent = "";
    return;
  }
  // No backend yet: this opens the visitor's email app with the message filled in.
  // To send directly from the site, connect a form service (e.g. Formspree) instead.
  const name = form.name.value.trim();
  const body = `${form.message.value.trim()}\n\nFrom: ${name} (${form.email.value.trim()})`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Portfolio message from " + name)}&body=${encodeURIComponent(body)}`;
  statusEl.textContent = "Opening your email app to send the message.";
  form.reset();
});
form.querySelectorAll("input, textarea").forEach((i) => i.addEventListener("blur", () => validateField(i)));
