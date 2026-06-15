/* =========================================================
   Brnas Ploče d.o.o. — site interactions (vanilla JS)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: solid on scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  if (menu) {
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* =======================================================
     Contact form — same logic as before:
     validate fields, POST to Formspree via fetch (AJAX),
     show success / error, reset on success.
     Fields preserved: name, _replyto (email), phone,
     message, _subject, _next, _gotcha (honeypot).
     ======================================================= */
  var form = document.getElementById("contactForm");
  var alertBox = document.getElementById("formAlert");
  var sendBtn = document.getElementById("sendBtn");

  if (form) {
    var fields = Array.prototype.slice.call(
      form.querySelectorAll("input[required], textarea[required]")
    );

    function fieldWrap(el) {
      return el.closest(".field");
    }

    function validateField(el) {
      var wrap = fieldWrap(el);
      var valid = el.checkValidity();
      if (wrap) {
        wrap.classList.toggle("has-error", !valid);
        var err = wrap.querySelector(".err");
        if (err) err.textContent = valid ? "" : el.getAttribute("data-error") || "";
      }
      return valid;
    }

    // live-clear errors while typing
    fields.forEach(function (el) {
      el.addEventListener("input", function () {
        var wrap = fieldWrap(el);
        if (wrap && wrap.classList.contains("has-error")) validateField(el);
      });
      el.addEventListener("blur", function () {
        if (el.value) validateField(el);
      });
    });

    function showAlert(type, msg) {
      if (!alertBox) return;
      alertBox.className = "form-alert show form-alert--" + type;
      alertBox.textContent = msg;
    }
    function clearAlert() {
      if (!alertBox) return;
      alertBox.className = "form-alert";
      alertBox.textContent = "";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: silently ignore bots
      var gotcha = form.querySelector('[name="_gotcha"]');
      if (gotcha && gotcha.value) return;

      // Validate all fields
      var allValid = true;
      fields.forEach(function (el) {
        if (!validateField(el)) allValid = false;
      });
      if (!allValid) {
        var firstError = form.querySelector(".field.has-error input, .field.has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      clearAlert();

      var nameVal = (document.getElementById("name").value || "").trim();
      var firstName = nameVal.indexOf(" ") >= 0
        ? nameVal.split(" ").slice(0, -1).join(" ")
        : nameVal;

      sendBtn.setAttribute("aria-busy", "true");
      sendBtn.disabled = true;

      var data = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            showAlert("ok", "Vaša poruka je poslana. Hvala Vam, javit ćemo se uskoro!");
            form.reset();
            fields.forEach(function (el) {
              var w = fieldWrap(el);
              if (w) w.classList.remove("has-error");
            });
          } else {
            return res.json().then(
              function () { throw new Error("bad"); },
              function () { throw new Error("bad"); }
            );
          }
        })
        .catch(function () {
          showAlert(
            "err",
            "Nažalost " + (firstName || "") +
              ", poruku trenutno nije moguće poslati. Pokušajte ponovno kasnije ili nas nazovite na 098 973 0587."
          );
        })
        .finally(function () {
          setTimeout(function () {
            sendBtn.removeAttribute("aria-busy");
            sendBtn.disabled = false;
          }, 800);
        });
    });

    // hide alert when user starts a new message
    var nameInput = document.getElementById("name");
    if (nameInput) nameInput.addEventListener("focus", clearAlert);
  }
})();
