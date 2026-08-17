/* ==================================================================
   Lesko Help — team deck
   Vanilla JS, no build step. Seed data comes from data/team.js.
   Admin edits are kept in localStorage until they are exported back
   into data/team.js and committed.
   ================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------- constants */

  var STORAGE_KEY = "leskoTeamDeck.v3";
  var ADMIN_KEY   = "leskoTeamDeck.admin";
  var PASSCODE    = "lesko";          // change me — see README
  var SECRET_TAPS = 5;                // taps on the "?" badge to unlock
  var TAP_WINDOW  = 2500;             // ms

  var TINTS = ["blue", "red", "yellow", "green", "deepred"];

  /* a card's suit follows its colour — decorative, and it keeps the four
     suits from the brand alive without pretending to mean anything */
  var SUITS = {
    blue: "♠", red: "♥", yellow: "♦",
    green: "♣", deepred: "♥"
  };

  var NO_TITLE_LINES = [
    "Title still being written",
    "Card in progress",
    "Coming soon",
    "To be dealt"
  ];

  /* -------------------------------------------------------------- state */

  var state = { people: [] };
  var el = {};

  /* ------------------------------------------------------------ helpers */

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function initials(name) {
    var parts = String(name || "?").trim().split(/\s+/);
    var out = parts[0] ? parts[0].charAt(0) : "?";
    if (parts.length > 1) out += parts[parts.length - 1].charAt(0);
    return out.toUpperCase();
  }

  function slug(name) {
    return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "person";
  }

  function uniqueId(base, people) {
    var id = base, n = 2;
    while (people.some(function (p) { return p.id === id; })) { id = base + "-" + n++; }
    return id;
  }

  /* A card's colour: whatever admin picked, otherwise one derived from the
     person's id — so it stays theirs even as other cards come and go. */
  function tintOf(p) {
    if (p.color && TINTS.indexOf(p.color) !== -1) return p.color;
    var h = 0;
    for (var i = 0; i < p.id.length; i++) { h = (h * 31 + p.id.charCodeAt(i)) >>> 0; }
    return TINTS[h % 4];               // auto never picks deepred — that's Matthew's
  }

  function suitOf(p) {
    return SUITS[tintOf(p)] || "♠";
  }

  /* true / false / null — null means "we haven't confirmed yet, say nothing" */
  function communityOf(p) {
    if (p.inCommunity === true)  return true;
    if (p.inCommunity === false) return false;
    return null;
  }

  function normalise(p) {
    var inC = p.inCommunity;
    return {
      id:          p.id || uniqueId(slug(p.name), state.people),
      name:        p.name || "",
      title:       p.title || p.role || "",          // `role` = the old field name
      inCommunity: inC === true ? true : (inC === false ? false : null),
      color:       TINTS.indexOf(p.color) !== -1 ? p.color : "",
      photo:       p.photo || "",
      email:       p.email || "",
      blurb:       p.blurb || "",
      superpower:  p.superpower || "",
      funFact:     p.funFact || "",
      since:       p.since || ""
    };
  }

  function seedPeople() {
    var seed = window.LESKO_TEAM_SEED || { people: [] };
    return (seed.people || []).map(normalise);
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && Array.isArray(saved.people) && saved.people.length) {
          return saved.people.map(normalise);
        }
      }
    } catch (e) { /* corrupt or unavailable storage — fall through to seed */ }
    return seedPeople();
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 3, people: state.people }));
    } catch (e) {
      toast("Could not save locally");
    }
  }

  var toastTimer;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.hidden = true; }, 2400);
  }

  function isAdmin() { return document.body.classList.contains("admin"); }

  /* -------------------------------------------------------------- render */

  function avatarMarkup(p, cls) {
    if (p.photo) {
      // a missing file is swapped for the monogram — see wireImageFallbacks
      return '<div class="' + cls + '" data-initials="' + esc(initials(p.name)) + '">' +
             '<img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy"></div>';
    }
    return '<div class="' + cls + '"><span class="mono-initials">' +
           esc(initials(p.name)) + "</span></div>";
  }

  /* A photo path that 404s falls back to the monogram, not a broken image
     icon — this is what lets photos be dropped into photos/ one at a time. */
  function wireImageFallbacks(root) {
    var imgs = root.querySelectorAll(".avatar img, .sheet-avatar img");
    Array.prototype.forEach.call(imgs, function (img) {
      img.addEventListener("error", function () {
        var box = img.parentNode;
        box.innerHTML = '<span class="mono-initials">' +
          esc(box.getAttribute("data-initials") || "?") + "</span>";
      });
    });
  }

  function communityMarkup(p) {
    var inC = communityOf(p);
    if (inC === null) return "";
    return '<span class="status"><span class="dot ' + (inC ? "in" : "out") + '"></span>' +
           (inC ? "In the community" : "Not in the community") + "</span>";
  }

  function cardMarkup(p, i) {
    var title = p.title
      ? { text: p.title, empty: false }
      : { text: NO_TITLE_LINES[i % NO_TITLE_LINES.length], empty: true };

    return (
      '<button class="card t-' + tintOf(p) + '" ' +
        'data-id="' + esc(p.id) + '" data-suit="' + suitOf(p) + '" ' +
        'style="animation-delay:' + Math.min(i * 45, 600) + 'ms" ' +
        'aria-label="Open ' + esc(p.name) + '">' +
        '<div class="card-corner"><b>' + esc(initials(p.name).charAt(0)) + "</b>" +
          "<span>" + suitOf(p) + "</span></div>" +
        '<div class="admin-tools">' +
          '<span class="icon-btn" data-move-up="' + esc(p.id) + '" role="button" title="Move earlier" tabindex="0">↑</span>' +
          '<span class="icon-btn" data-move-down="' + esc(p.id) + '" role="button" title="Move later" tabindex="0">↓</span>' +
          '<span class="icon-btn" data-edit="' + esc(p.id) + '" role="button" title="Edit" tabindex="0">✎</span>' +
          '<span class="icon-btn del" data-del="' + esc(p.id) + '" role="button" title="Delete" tabindex="0">✕</span>' +
        "</div>" +
        avatarMarkup(p, "avatar") +
        '<h3 class="card-name">' + esc(p.name) + "</h3>" +
        '<p class="card-role' + (title.empty ? " empty" : "") + '">' + esc(title.text) + "</p>" +
        '<div class="card-foot">' + communityMarkup(p) + "</div>" +
      "</button>"
    );
  }

  function renderDeck() {
    el.deck.innerHTML = state.people.map(cardMarkup).join("");
    wireImageFallbacks(el.deck);
  }

  function render() {
    renderDeck();
    reportHeight();
  }

  /* ------------------------------------------------------- iframe embeds */

  /* When this page is embedded, tell the host page how tall it is so the
     iframe can grow instead of scrolling inside itself. Harmless when the
     page is opened directly. See the embed snippet in the README. */
  var lastHeight = 0;
  function reportHeight() {
    if (window.parent === window) return;
    var h = Math.ceil(document.documentElement.scrollHeight);
    if (h === lastHeight) return;
    lastHeight = h;
    try {
      window.parent.postMessage({ type: "lesko-team-height", height: h }, "*");
    } catch (e) { /* cross-origin host that won't listen — nothing to do */ }
  }

  /* --------------------------------------------------------- person view */

  function openPerson(id) {
    var p = state.people.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var title = p.title
      ? { text: p.title, empty: false }
      : { text: "Title not decided yet", empty: true };
    var inC = communityOf(p);

    var facts = "";
    if (p.superpower) facts += fact("Superpower", esc(p.superpower));
    if (p.since)      facts += fact("With us since", esc(p.since));
    if (p.funFact)    facts += fact("Fun fact", esc(p.funFact));
    facts += fact("Contact", p.email
      ? '<a href="' + contactHref(p.email) + '">' + esc(p.email) + "</a>"
      : '<span style="color:var(--ink-faint)">Nothing public to share</span>');

    el.personContent.innerHTML =
      '<div class="sheet-head t-' + tintOf(p) + '" data-suit="' + suitOf(p) + '">' +
        avatarMarkup(p, "sheet-avatar") +
        '<div class="sheet-id">' +
          '<h2 id="sheetName">' + esc(p.name) + "</h2>" +
          '<p class="role' + (title.empty ? " empty" : "") + '">' + esc(title.text) + "</p>" +
          (inC === null ? "" :
            '<div class="sheet-badges"><span class="badge"><span class="dot ' +
            (inC ? "in" : "out") + '"></span>' +
            (inC ? "In the community" : "Not in the community") + "</span></div>") +
        "</div>" +
      "</div>" +
      '<div class="sheet-body">' +
        '<p class="blurb' + (p.blurb ? "" : " empty") + '">' +
          esc(p.blurb || "No intro written yet — this card is waiting for its story.") + "</p>" +
        '<div class="facts">' + facts + "</div>" +
        (isAdmin()
          ? '<div class="editor-actions"><button class="btn" data-edit="' + esc(p.id) + '">Edit this card</button></div>'
          : "") +
      "</div>";

    wireImageFallbacks(el.personContent);
    show(el.personOverlay);

    function fact(label, value) {
      return '<div class="fact"><span class="mono-label">' + esc(label) + "</span><p>" + value + "</p></div>";
    }
  }

  function contactHref(v) {
    var s = String(v).trim();
    if (/^https?:\/\//i.test(s)) return esc(s);
    if (s.indexOf("@") !== -1) return "mailto:" + esc(s);
    return esc(s);
  }

  /* -------------------------------------------------------------- modals */

  var lastFocus = null;

  function show(overlay) {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    var focusable = overlay.querySelector("input, button, select, textarea");
    if (focusable) focusable.focus();
  }

  function hide(overlay) {
    overlay.hidden = true;
    if (!document.querySelector(".overlay:not([hidden])")) document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function hideAll() {
    [el.personOverlay, el.editorOverlay, el.exportOverlay].forEach(function (o) { o.hidden = true; });
    document.body.style.overflow = "";
  }

  /* -------------------------------------------------------------- editor */

  function openEditor(id) {
    var p = id ? state.people.filter(function (x) { return x.id === id; })[0] : null;

    $("editorTitle").textContent = p ? "Edit " + p.name : "Add a card";
    $("f-id").value        = p ? p.id : "";
    $("f-name").value      = p ? p.name : "";
    $("f-title").value     = p ? p.title : "";
    $("f-community").value = p ? (p.inCommunity === true ? "yes"
                                : p.inCommunity === false ? "no" : "") : "";
    $("f-color").value      = p ? p.color : "";
    $("f-photo").value      = p ? p.photo : "";
    $("f-email").value      = p ? p.email : "";
    $("f-blurb").value      = p ? p.blurb : "";
    $("f-superpower").value = p ? p.superpower : "";
    $("f-since").value      = p ? p.since : "";
    $("f-funfact").value    = p ? p.funFact : "";
    $("editorDelete").hidden = !p;

    updatePhotoPreview();
    hideAll();
    show(el.editorOverlay);
    $("f-name").focus();
  }

  function updatePhotoPreview() {
    var url = $("f-photo").value.trim();
    var name = $("f-name").value.trim();
    el.photoPreview.innerHTML = url
      ? '<img src="' + esc(url) + '" alt="">'
      : esc(initials(name));
  }

  function submitEditor(e) {
    e.preventDefault();
    var id = $("f-id").value;
    var comm = $("f-community").value;
    var data = {
      id: id,
      name:        $("f-name").value.trim(),
      title:       $("f-title").value.trim(),
      inCommunity: comm === "yes" ? true : (comm === "no" ? false : null),
      color:       $("f-color").value,
      photo:       $("f-photo").value.trim(),
      email:       $("f-email").value.trim(),
      blurb:       $("f-blurb").value.trim(),
      superpower:  $("f-superpower").value.trim(),
      since:       $("f-since").value.trim(),
      funFact:     $("f-funfact").value.trim()
    };
    if (!data.name) { toast("A card needs a name"); return; }

    if (id) {
      state.people = state.people.map(function (p) {
        return p.id === id ? normalise(data) : p;
      });
      toast(data.name + " updated");
    } else {
      data.id = uniqueId(slug(data.name), state.people);
      state.people.push(normalise(data));
      toast(data.name + " joined the deck");
    }
    save();
    render();
    hide(el.editorOverlay);
  }

  function deletePerson(id) {
    var p = state.people.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    if (!confirm("Remove " + p.name + " from the team page?")) return;
    state.people = state.people.filter(function (x) { return x.id !== id; });
    save();
    render();
    hideAll();
    toast(p.name + " removed");
  }

  /* Move a person one place earlier or later in the deck. */
  function movePerson(id, delta) {
    var idx = state.people.findIndex(function (p) { return p.id === id; });
    if (idx === -1) return;
    var to = idx + delta;
    if (to < 0 || to >= state.people.length) {
      toast("Already at the " + (delta < 0 ? "start" : "end"));
      return;
    }
    var moved = state.people[idx];
    state.people[idx] = state.people[to];
    state.people[to] = moved;
    save();
    render();
  }

  /* -------------------------------------------------------------- export */

  function exportSource() {
    var body = JSON.stringify({ version: 3, updated: today(), people: state.people }, null, 2);
    return "/* Lesko Help — the team deck. Exported from the admin panel. */\n\n" +
           "window.LESKO_TEAM_SEED = " + body + ";\n";
  }

  function today() {
    var d = new Date();
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function openExport() {
    el.exportBox.value = exportSource();
    hideAll();
    show(el.exportOverlay);
    el.exportBox.focus();
    el.exportBox.select();
  }

  /* --------------------------------------------------------- admin unlock */

  var taps = 0, tapTimer = null;

  function secretTap() {
    taps++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(function () { taps = 0; }, TAP_WINDOW);
    if (taps >= SECRET_TAPS) { taps = 0; askForPasscode(); }
  }

  function askForPasscode() {
    if (isAdmin()) { toast("Already in admin mode"); return; }
    var input = prompt("Admin passcode");
    if (input === null) return;
    if (input.trim().toLowerCase() === PASSCODE) enterAdmin();
    else toast("Nope — try again");
  }

  function enterAdmin() {
    document.body.classList.add("admin");
    try { sessionStorage.setItem(ADMIN_KEY, "1"); } catch (e) {}
    render();
    toast("Admin mode on");
  }

  function exitAdmin() {
    document.body.classList.remove("admin");
    try { sessionStorage.removeItem(ADMIN_KEY); } catch (e) {}
    render();
    toast("Admin mode off");
  }

  /* --------------------------------------------------------------- events */

  function bind() {
    el.deck.addEventListener("click", function (e) {
      var up = e.target.closest("[data-move-up]");
      if (up) { e.stopPropagation(); movePerson(up.getAttribute("data-move-up"), -1); return; }
      var down = e.target.closest("[data-move-down]");
      if (down) { e.stopPropagation(); movePerson(down.getAttribute("data-move-down"), 1); return; }
      var del = e.target.closest("[data-del]");
      if (del) { e.stopPropagation(); deletePerson(del.getAttribute("data-del")); return; }
      var edit = e.target.closest("[data-edit]");
      if (edit) { e.stopPropagation(); openEditor(edit.getAttribute("data-edit")); return; }
      var card = e.target.closest(".card");
      if (card) openPerson(card.getAttribute("data-id"));
    });

    el.personContent.addEventListener("click", function (e) {
      var edit = e.target.closest("[data-edit]");
      if (edit) openEditor(edit.getAttribute("data-edit"));
    });

    $("personClose").addEventListener("click", function () { hide(el.personOverlay); });
    $("editorClose").addEventListener("click", function () { hide(el.editorOverlay); });
    $("editorCancel").addEventListener("click", function () { hide(el.editorOverlay); });
    $("exportClose").addEventListener("click", function () { hide(el.exportOverlay); });

    [el.personOverlay, el.editorOverlay, el.exportOverlay].forEach(function (o) {
      o.addEventListener("click", function (e) { if (e.target === o) hide(o); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        var open = document.querySelector(".overlay:not([hidden])");
        if (open) hide(open);
      }
      if (e.key && e.key.toLowerCase() === "a" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        isAdmin() ? exitAdmin() : askForPasscode();
      }
    });

    el.editorForm.addEventListener("submit", submitEditor);
    $("editorDelete").addEventListener("click", function () { deletePerson($("f-id").value); });
    $("f-photo").addEventListener("input", updatePhotoPreview);
    $("f-name").addEventListener("input", updatePhotoPreview);
    $("clearPhoto").addEventListener("click", function () {
      $("f-photo").value = "";
      updatePhotoPreview();
    });
    $("f-upload").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      if (file.size > 900 * 1024) toast("That image is large — try one under 900 KB");
      var reader = new FileReader();
      reader.onload = function () {
        $("f-photo").value = reader.result;
        updatePhotoPreview();
      };
      reader.readAsDataURL(file);
    });

    $("addPerson").addEventListener("click", function () { openEditor(null); });
    $("exportBtn").addEventListener("click", openExport);
    $("exitAdmin").addEventListener("click", exitAdmin);
    $("resetBtn").addEventListener("click", function () {
      if (!confirm("Throw away local changes and go back to the deck saved in the repository?")) return;
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      state.people = seedPeople();
      render();
      toast("Back to the saved deck");
    });

    $("copyExport").addEventListener("click", function () {
      el.exportBox.select();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(el.exportBox.value).then(
          function () { toast("Copied — paste into data/team.js"); },
          function () { toast("Select the text and copy manually"); }
        );
        return;
      }
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      toast(ok ? "Copied — paste into data/team.js" : "Select the text and copy manually");
    });

    $("downloadExport").addEventListener("click", function () {
      var blob = new Blob([exportSource()], { type: "text/javascript" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "team.js";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      toast("Downloaded team.js");
    });

    $("secretMark").addEventListener("click", secretTap);
    $("secretFoot").addEventListener("click", secretTap);
  }

  /* ----------------------------------------------------------------- init */

  function init() {
    el.deck          = $("deck");
    el.toast         = $("toast");
    el.personOverlay = $("personOverlay");
    el.personContent = $("personContent");
    el.editorOverlay = $("editorOverlay");
    el.editorForm    = $("editorForm");
    el.exportOverlay = $("exportOverlay");
    el.exportBox     = $("exportBox");
    el.photoPreview  = $("photoPreview");

    state.people = load();

    try {
      if (sessionStorage.getItem(ADMIN_KEY) === "1") document.body.classList.add("admin");
    } catch (e) {}

    bind();
    render();

    window.addEventListener("resize", reportHeight);
    window.addEventListener("load", reportHeight);
    setInterval(reportHeight, 1000);   // catches photos finishing their load
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
