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
      { threshold: 0.12, rootMargin: "0px 0px -12% 0px" }
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
     Öffnungszeiten: heutigen Tag hervorheben
     --------------------------------------------------------------- */
  var todayRow = document.querySelector(
    '.hours-row[data-day="' + new Date().getDay() + '"]'
  );
  if (todayRow) todayRow.classList.add("hours-row--today");

  /* ---------------------------------------------------------------
     Schwebender Termin-Button (erscheint beim Scrollen)
     Wird per JS eingefügt – nicht auf der Kontaktseite selbst.
     --------------------------------------------------------------- */
  if (!/\/kontakt\/?$/.test(window.location.pathname)) {
    var fab = document.createElement("a");
    fab.className = "fab";
    fab.href = "/kontakt/";
    fab.setAttribute("aria-label", "Termin vereinbaren");
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="3" y="4.5" width="18" height="16" rx="2"></rect>' +
      '<path d="M3 9h18M8 2.5v4M16 2.5v4"></path></svg>' +
      '<span class="fab__label">Termin</span>';
    document.body.appendChild(fab);

    var toggleFab = function () {
      fab.classList.toggle("is-visible", window.scrollY > 320);
    };
    window.addEventListener("scroll", toggleFab, { passive: true });
    toggleFab();
  }

  /* ---------------------------------------------------------------
     FAQ-Chat-Assistent (unten links)
     Vorprogrammierte Antworten auf häufige Fragen – kein Server nötig.
     --------------------------------------------------------------- */
  (function initChat() {
    var answers = {
      oeffnung:
        "Unsere Öffnungszeiten:<br>Mo, Do, Fr: 10:00 – 19:00<br>Di: 10:00 – 14:00<br>Sa: 08:30 – 16:00<br>Mi & So geschlossen · nur nach Voranmeldung.",
      preise:
        "Ein kleiner Auszug (CHF):<br>Damen Waschen/Schneiden/Styling ab 80.–<br>Herren ab 30.–<br>Kinder ab 20.–<br>Ganze Preisliste: <a href=\"/damen/\">Damen</a> · <a href=\"/herren/\">Herren</a>.",
      termin:
        "Am schnellsten telefonisch: <a href=\"tel:+41763450011\">076 345 00 11</a>.<br>Oder über unser <a href=\"/kontakt/\">Kontaktformular</a>. Wir arbeiten nur nach Voranmeldung.",
      anfahrt:
        "Sie finden uns an der Neue Aarburgerstrasse 22, 4852 Rothrist – im Breitenpark, Parkplätze sind vorhanden.",
      leistungen:
        "Wir bieten: Coiffeur für Damen, Herren & Kinder, Farbe & Mèches, Nägel, Kosmetik, Augenbrauen, Braut & Make-up sowie Extensions.<br>Mehr: <a href=\"/damen/\">Damen</a> · <a href=\"/herren/\">Herren</a> · <a href=\"/galerie/\">Galerie</a>."
    };
    var quick = [
      ["oeffnung", "Öffnungszeiten"],
      ["preise", "Preise"],
      ["termin", "Termin"],
      ["anfahrt", "Anfahrt"],
      ["leistungen", "Leistungen"]
    ];

    var toggle = document.createElement("button");
    toggle.className = "chat-toggle";
    toggle.setAttribute("aria-label", "Fragen? Chat öffnen");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML =
      '<svg class="chat-ico-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"></path></svg>' +
      '<svg class="chat-ico-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>';

    var panel = document.createElement("div");
    panel.className = "chat-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Chat mit Jenny's Beauty");
    panel.innerHTML =
      '<div class="chat-head"><strong>Jenny’s Beauty</strong>' +
      '<button type="button" class="chat-x" aria-label="Chat schliessen">×</button></div>' +
      '<div class="chat-body"></div>' +
      '<div class="chat-quick"></div>';

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    var body = panel.querySelector(".chat-body");
    var quickWrap = panel.querySelector(".chat-quick");
    var greeted = false;

    function addMsg(html, who) {
      var m = document.createElement("div");
      m.className = "chat-msg chat-msg--" + who;
      m.innerHTML = html;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
    }

    quick.forEach(function (q) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = q[1];
      btn.addEventListener("click", function () {
        addMsg(q[1], "user");
        window.setTimeout(function () { addMsg(answers[q[0]], "bot"); }, 300);
      });
      quickWrap.appendChild(btn);
    });

    function openChat() {
      document.body.classList.add("chat-open");
      toggle.setAttribute("aria-expanded", "true");
      if (!greeted) {
        greeted = true;
        addMsg(
          "Hallo! Schön, dass Sie da sind – wie kann ich helfen? Wählen Sie ein Thema:",
          "bot"
        );
      }
    }
    function closeChat() {
      document.body.classList.remove("chat-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      if (document.body.classList.contains("chat-open")) closeChat();
      else openChat();
    });
    panel.querySelector(".chat-x").addEventListener("click", closeChat);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("chat-open")) closeChat();
    });
  })();

  /* ---------------------------------------------------------------
     Jahreszahl im Footer
     --------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
