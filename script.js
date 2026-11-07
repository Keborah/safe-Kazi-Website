// SAFEKAZI SCRIPT.JS - every part is small and independent
function $(id) { return document.getElementById(id); }

// A. Page change: shrink the sheet into a tile, then open the new page
function go(url) {
  var sheet = document.querySelector(".sheet");
  sheet.classList.add("leave");
  setTimeout(function () {
    if (window.SK_NAV) { window.SK_NAV(url); } else { window.location.href = url; }
  }, 380);
}
// One click listener for the menu button and for every internal link
document.addEventListener("click", function (e) {
  var btn = e.target.closest("#menu-btn");
  if (btn) {
    var open = $("menu").classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    return;
  }
  if (e.target.closest(".ask-open,#ask-btn")) { e.preventDefault(); toggleAsk(); return; }
  if (e.target.closest("#ask-close")) { toggleAsk(false); return; }
  var a = e.target.closest("a");
  if (!a) return;
  var h = a.getAttribute("href");
  if (!h || h.charAt(0) === "#" || /^(https?:|mailto:|tel:)/.test(h)) return;
  e.preventDefault();
  go(h);
});

// B. Everything that must start when a page is shown
function init() {
  reveal(); counters(); verify(); flags(); report(); help(); assistant(); stamps();
  if (window.initGlobe && $("globe")) { initGlobe(); }
}

// C. Reveal: add class "in" when an element scrolls into view (CSS does the animation)
function reveal() {
  var io = new IntersectionObserver(function (list) {
    list.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
}

// D. Count-up numbers (reads data-count, data-prefix, data-suffix, data-dec)
function counters() {
  var co = new IntersectionObserver(function (list) {
    list.forEach(function (e) {
      if (!e.isIntersecting) return;
      var n = e.target, to = +n.dataset.count, dec = +(n.dataset.dec || 0);
      var pre = n.dataset.prefix || "", suf = n.dataset.suffix || "", t0 = null;
      function step(t) {
        t0 = t0 || t;
        var k = Math.min((t - t0) / 1600, 1), v = to * (1 - Math.pow(1 - k, 3));
        n.textContent = pre + v.toLocaleString("en", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      co.unobserve(n);
    });
  });
  document.querySelectorAll("[data-count]").forEach(function (n) { co.observe(n); });
}

// E. Verify page: show what to compare in the official register
function verify() {
  var f = $("verify-form"); if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("agency-name").value.trim(), out = $("verify-out");
    if (!name) { out.textContent = "Please type the agency name first."; return; }
    var steps = [
      "Exact legal name: compare the spelling of \u201C" + name + "\u201D with your documents and adverts.",
      "Licence status and dates: read the current status and validity dates.",
      "Contact details: compare the official address and phone numbers.",
      "Job approval: ask whether the vacancy and the employer have approval."];
    out.textContent = "";
    var ol = document.createElement("ol");
    steps.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
    out.appendChild(ol);
    var p = document.createElement("p");
    p.textContent = "If you cannot confirm the agency, treat it as not verified. Missing from a search is not proof of fraud.";
    out.appendChild(p);
  });
}

// F. Red flags: count the ticks and give advice
function flags() {
  var f = $("flag-form"); if (!f) return;
  $("flag-review").onclick = function () {
    var n = f.querySelectorAll("input:checked").length, out = $("flag-out"), msg;
    if (n === 0) msg = "No warning signs ticked. Keep checking the agency in the official register.";
    else if (n < 3) msg = n + " warning sign(s). Pause, ask questions and verify independently before you pay.";
    else msg = n + " warning signs. Strong caution: do not pay or hand over documents until you have verified the agency.";
    out.textContent = msg;
    out.className = "note" + (n >= 3 ? " warn" : "");
  };
  $("flag-clear").onclick = function () { f.reset(); $("flag-out").textContent = ""; };
}

// G. Report: prepare notes in the browser (nothing is sent or stored)
function report() {
  var f = $("report-form"); if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    $("report-out").textContent = "Agency: " + (f.agency.value || "not given") + "\nWhere: " + f.where.value +
      "\nConcern: " + f.concern.value + "\nWhat happened: " + (f.story.value || "not given");
    $("report-copy").hidden = false;
  });
  $("report-copy").onclick = function () {
    if (navigator.clipboard) { navigator.clipboard.writeText($("report-out").textContent); this.textContent = "Copied"; }
  };
}

// H. Help: prepare a WhatsApp message for a trusted contact, with optional location
function help() {
  var f = $("wa-form"); if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var num = $("wa-number").value.replace(/\D/g, ""), out = $("wa-out");
    if (num.length < 9) { out.textContent = "Enter the WhatsApp number with country code, for example 2567..."; return; }
    function openWa(loc) {
      var text = $("wa-text").value + (loc ? "\nMy location: " + loc : "");
      window.location.href = "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
    }
    if ($("wa-loc").checked && navigator.geolocation) {
      out.textContent = "Finding your location...";
      navigator.geolocation.getCurrentPosition(function (p) {
        openWa("https://maps.google.com/?q=" + p.coords.latitude + "," + p.coords.longitude);
      }, function () { openWa(""); });
    } else { openWa(""); }
  });
}

// I. Assistant: keyword rules (not generative AI), typing or voice
var ANSWERS = [
  [["hello", "hi ", "hey"], "Hello. Ask me about checking an agency, warning signs, contracts, reporting or getting help."],
  [["agency", "licen", "verify", "register"], "Check the agency on the Ministry\u2019s official EEMIS register. Our Verify page shows what to compare."],
  [["pay", "fee", "money", "deduct"], "Be careful with up-front payments. Ask for a written receipt and make sure fees and deductions are in the contract."],
  [["contract", "sign", "salary"], "Get a written contract before you travel. It should name the employer, job, salary, working hours, housing and return travel."],
  [["red flag", "scam", "fake", "warning"], "Warning signs include pressure to pay fast, no written contract, changing job details and asking for documents without a reason."],
  [["passport", "document", "visa"], "Keep copies of your passport, visa, contract and receipts. Your employer or agent should not keep your passport."],
  [["report", "complain"], "Use the Report page to prepare your notes, then take them to the Ministry or the police. This site does not send reports."],
  [["help", "danger", "emergency", "abuse", "trapped"], "If you are in immediate danger, contact local emergency services. On the Get help page you can prepare a WhatsApp message with your location."]
];
function assistant() {
  var form = $("chat-form"); if (!form || form.dataset.ready) return;
  form.dataset.ready = "1";
  var box = $("chat"), input = $("chat-input");
  function add(text, me) {
    var d = document.createElement("div");
    d.className = "msg" + (me ? " me" : ""); d.textContent = text;
    box.appendChild(d); box.scrollTop = box.scrollHeight;
  }
  function reply(q) {
    var t = q.toLowerCase() + " ", ans = "I am a simple scripted helper and do not know that. Try the Verify, Rights or Get help pages, or ask the Ministry.";
    ANSWERS.forEach(function (r) { if (ans.indexOf("scripted") > -1 && r[0].some(function (k) { return t.indexOf(k) > -1; })) ans = r[1]; });
    add(ans, false);
    if ($("chat-speak").checked && window.speechSynthesis) speechSynthesis.speak(new SpeechSynthesisUtterance(ans));
  }
  function send() {
    var q = input.value.trim(); if (!q) return;
    add(q, true); input.value = ""; reply(q);
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); send(); });
  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition, mic = $("chat-mic");
  if (!Rec) { mic.hidden = true; } else {
    mic.onclick = function () {
      var r = new Rec(); r.lang = "en-UG";
      r.onresult = function (e) { input.value = e.results[0][0].transcript; send(); };
      r.start();
    };
  }
  add("Hello. Ask me about an agency, warning signs, contracts or reporting.", false);
}

document.addEventListener("DOMContentLoaded", init);
window.SK = { init: init };

// J. Open or close the Ask SafeKazi panel (on every page)
function toggleAsk(force) {
  var p = $("ask-panel");
  var show = (force === undefined) ? p.hidden : force;
  p.hidden = !show;
  $("ask-btn").setAttribute("aria-expanded", show);
  if (show) { $("chat-input").focus(); }
}

// K. Safety passport: remember visited pages and stamp them
function stamps() {
  var list = $("stamps"); if (!list) return;
  var cur = document.querySelector(".sheet").dataset.page, seen = [];
  try { seen = JSON.parse(localStorage.getItem("sk_seen") || "[]"); } catch (e) { seen = []; }
  if (seen.indexOf(cur) < 0) {
    seen.push(cur);
    try { localStorage.setItem("sk_seen", JSON.stringify(seen)); } catch (e) { }
  }
  var n = 0;
  list.querySelectorAll("li").forEach(function (li) {
    var on = seen.indexOf(li.dataset.page) > -1;
    li.classList.toggle("on", on);
    if (on) n++;
  });
  $("stamp-count").textContent = n + " of 7 stamps collected" + (n === 7 ? ". Cleared for departure!" : "");
}
