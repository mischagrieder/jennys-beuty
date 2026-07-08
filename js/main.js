/* Jenny's Beauty — Interaktion */
(function () {
  "use strict";

  var docEl = document.documentElement;
  docEl.classList.remove("no-js");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     Navigation: transparent über dem Hero, solide nach dem Scrollen
     --------------------------------------------------------------- */
  var nav = document.querySelector(".nav");

  function updateNav() {
    if (!nav) return;
    nav.classList.toggle("nav--solid", window.scrollY > 40);
  }

  if (nav && !nav.classList.contains("nav--solid")) {
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
  }

  /* ---------------------------------------------------------------
     Mobile-Menü
     --------------------------------------------------------------- */
  var toggle = document.querySelector(".nav__toggle");
  var overlay = document.querySelector(".menu-overlay");

  if (toggle && overlay) {
    toggle.addEventListener("click", function () {
      var open = overlay.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    overlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        overlay.classList.remove("open");
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) {
        overlay.classList.remove("open");
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------------
     Scroll-Reveal
     --------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------------------------------------------------------------
     Galerie-Filter
     --------------------------------------------------------------- */
  var filter = document.querySelector("[data-filter]");

  if (filter) {
    var items = document.querySelectorAll("[data-cat]");
    filter.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-value]");
      if (!btn) return;

      filter.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });

      var value = btn.getAttribute("data-value");
      items.forEach(function (item) {
        var show = value === "alle" || item.getAttribute("data-cat") === value;
        item.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------------------------------------------------------------
     Vorher/Nachher-Regler
     --------------------------------------------------------------- */
  document.querySelectorAll("[data-ba]").forEach(function (ba) {
    var range = ba.querySelector(".ba__range");
    if (!range) return;

    function apply() {
      ba.style.setProperty("--pos", range.value + "%");
    }
    range.addEventListener("input", apply);
    apply();
  });

  /* ---------------------------------------------------------------
     Kontaktformular: öffnet das Mailprogramm mit vorbereitetem Text
     --------------------------------------------------------------- */
  var form = document.querySelector("#kontakt-formular");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#f-name").value.trim();
      var phone = form.querySelector("#f-phone").value.trim();
      var service = form.querySelector("#f-service").value;
      var msg = form.querySelector("#f-msg").value.trim();
      var status = form.querySelector(".form-status");

      if (!name || !msg) {
        status.textContent = "Bitte Name und Nachricht ausfüllen.";
        return;
      }

      var body =
        "Guten Tag\n\n" + msg + "\n\n" +
        "Gewünschte Leistung: " + (service || "–") + "\n" +
        "Name: " + name + "\n" +
        (phone ? "Telefon: " + phone + "\n" : "");

      var mailto =
        "mailto:jennys_beauty@hotmail.ch" +
        "?subject=" + encodeURIComponent("Terminanfrage – " + name) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;
      status.textContent = "Ihr E-Mail-Programm öffnet sich mit der Anfrage.";
    });
  }

  /* ---------------------------------------------------------------
     Jahreszahl im Footer
     --------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
