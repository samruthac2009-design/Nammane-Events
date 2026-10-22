// ---- Business details ----
const WHATSAPP_NUMBER = "917975763484"; // country code + number, no spaces or +

// ---- Footer year ----
document.getElementById("year").textContent = new Date().getFullYear();

// ---- Mobile menu ----
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

// ---- Package buttons: preselect package, jump to form ----
const packageSelect = document.getElementById("package");
document.querySelectorAll(".pkg-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    packageSelect.value = btn.dataset.package;
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("name").focus({ preventScroll: true }), 600);
  });
});

// ---- Enquiry form -> WhatsApp ----
const form = document.getElementById("enquiryForm");
const fallbackBtn = document.getElementById("fallbackBtn");

function setError(id, message) {
  document.getElementById(id + "Err").textContent = message;
  document.getElementById(id).classList.toggle("invalid", Boolean(message));
}

// Returns a clean number with country code, or "" if invalid
function cleanPhone(raw) {
  let digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 10) digits = "91" + digits;               // Indian mobile without code
  if (digits.length === 11 && digits.startsWith("0")) digits = "91" + digits.slice(1);
  return digits.length >= 11 && digits.length <= 15 ? digits : "";
}

function formatDate(value) {
  if (!value) return "Not specified";
  const [y, m, d] = value.split("-");
  return `${d}-${m}-${y}`;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const phoneRaw = form.phone.value.trim();
  const location = form.location.value.trim();
  const phone = cleanPhone(phoneRaw);

  setError("name", name ? "" : "Please enter your name.");
  setError("phone", phone ? "" : "Please enter a valid mobile number, for example 98765 43210.");
  setError("location", location ? "" : "Please enter the event location.");
  if (!name || !phone || !location) {
    form.querySelector(".invalid").focus();
    return;
  }

  const message =
`Hello Nammane Events!

I'd like to enquire about an event.

Name: ${name}
Contact Number: +${phone}
Event Type: ${form.type.value}
Event Date: ${formatDate(form.date.value)}
Event Location: ${location}
Preferred Package: ${form.package.value}
Budget / Additional Requirements: ${form.message.value.trim() || "None"}

Please contact me to discuss the arrangements.

Thank you!`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  fallbackBtn.href = url;
  fallbackBtn.hidden = false;
  window.open(url, "_blank", "noopener");
  document.getElementById("formNote").innerHTML =
    "WhatsApp is open. <strong>Press Send</strong> there to submit. It is not sent until you do.";
});
