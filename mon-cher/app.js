// Mon Cher — минимум скриптов: год, кастомный список услуг, форма, появление.
(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* Кастомный выбор услуги — вместо системного select с синей подсветкой */
  var root = document.getElementById("svcSelect");
  var btn = root.querySelector(".cselect-btn");
  var list = root.querySelector(".cselect-list");
  var items = Array.prototype.slice.call(list.querySelectorAll("[role=option]"));
  var hidden = document.getElementById("svc");
  var label = document.getElementById("svcValue");
  var focusIdx = 0;

  function paint() {
    items.forEach(function (it, i) {
      it.classList.toggle("focused", i === focusIdx && !list.hidden);
    });
  }

  function setService(value) {
    var idx = 0;
    items.forEach(function (it, i) {
      var on = it.getAttribute("data-value") === value;
      it.setAttribute("aria-selected", on ? "true" : "false");
      if (on) idx = i;
    });
    hidden.value = value;
    label.textContent = value;
    focusIdx = idx;
    paint();
  }

  function open() {
    list.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    paint();
  }

  function close(focusBtn) {
    list.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    items.forEach(function (it) { it.classList.remove("focused"); });
    if (focusBtn) btn.focus();
  }

  btn.addEventListener("click", function () {
    list.hidden ? open() : close(false);
  });

  btn.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });

  list.addEventListener("click", function (e) {
    var li = e.target.closest("[role=option]");
    if (!li) return;
    setService(li.getAttribute("data-value"));
    close(true);
  });

  document.addEventListener("click", function (e) {
    if (!root.contains(e.target) && !list.hidden) close(false);
  });

  document.addEventListener("keydown", function (e) {
    if (list.hidden) return;
    if (e.key === "Escape") { close(true); }
    else if (e.key === "ArrowDown") { e.preventDefault(); focusIdx = (focusIdx + 1) % items.length; paint(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); focusIdx = (focusIdx - 1 + items.length) % items.length; paint(); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setService(items[focusIdx].getAttribute("data-value")); close(true); }
    else if (e.key === "Tab") { close(false); }
  });

  // Кнопки «Записаться» в списке услуг подставляют услугу в форму.
  document.querySelectorAll(".booklink").forEach(function (b) {
    b.addEventListener("click", function () {
      setService(b.getAttribute("data-service"));
      document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
      document.getElementById("name").focus({ preventScroll: true });
    });
  });

  // Демо-отправка: валидация без сервера.
  var form = document.getElementById("form");
  var error = document.getElementById("formError");
  var done = document.getElementById("formDone");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value.trim();
    var phone = document.getElementById("phone").value.trim();
    if (!name || !phone) {
      error.hidden = false;
      return;
    }
    error.hidden = true;
    form.hidden = true;
    done.hidden = false;
  });

  // Одно появление при прокрутке; без движения — просто показ.
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  var blocks = document.querySelectorAll(".hero-in, .section");
  blocks.forEach(function (el) { el.classList.add("rise"); });
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06 }
  );
  blocks.forEach(function (el) { io.observe(el); });
})();
