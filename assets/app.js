/* ==================================================================
   Lesko Help — team deck
   Vanilla JS, no build step. Seed data comes from data/team.js.
   Admin edits are kept in localStorage until they are exported back
   into data/team.js and committed.
   ================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------- constants */

  var STORAGE_KEY = "leskoTeamDeck.v1";
  var ADMIN_KEY   = "leskoTeamDeck.admin";
  var PASSCODE    = "lesko";          // change me — see README
  var SECRET_TAPS = 5;                // taps on the "?" badge to unlock
  var TAP_WINDOW  = 2500;             // ms

  var CIRCLES = {
    steering:   { suit: "♠", label: "Steering",            short: "Steering" },
    membership: { suit: "♥", label: "Membership",          short: "Membership" },
    events:     { suit: "♦", label: "Events & Learning",   short: "Events" },
    tech:       { suit: "♣", label: "Tech, Platform & AI", short: "Tech & AI" },
    wildcard:   { suit: "★", label: "Wildcard",            short: "Wildcard" }
  };

  var STATUSES = {
    "in-community": "In the community",
    "quiet":        "In, but quieter",
    "off-platform": "Not on the platform",
    "unknown":      "Status to confirm"
  };

  var NO_ROLE_LINES = [
    "Role still being written",
    "Card in progress",
    "Role coming soon",
    "To be dealt"
  ];

  /* -------------------------------------------------------------- state */

  var state = {
    people: [],
    filter: "all",      // "all" | circle key | "coach"
    query: "",
    order: null         // array of ids when shuffled
  };

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

  function normalise(p) {
    return {
      id:         p.id || uniqueId(slug(p.name), state.people),
      name:       p.name || "",
      role:       p.role || "",
      circle:     CIRCLES[p.circle] ? p.circle : "wildcard",
      coach:      !!p.coach,
      status:     STATUSES[p.status] ? p.status : "unknown",
      photo:      p.photo || "",
      email:      p.email || "",
      blurb:      p.blurb || "",
      superpower: p.superpower || "",
      funFact:    p.funFact || "",
      since:      p.since || ""
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, people: state.people }));
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

  /* ------------------------------------------------------------ ordering */

  function visiblePeople() {
    var q = state.query.trim().toLowerCase();
    var list = state.people.filter(function (p) {
      if (state.filter === "coach" && !p.coach) return false;
      if (state.filter !== "all" && state.filter !== "coach" && p.circle !== state.filter) return false;
      if (!q) return true;
      return (p.name + " " + p.role + " " + p.blurb + " " + p.superpower)
        .toLowerCase().indexOf(q) !== -1;
    });

    if (state.order) {
      var pos = {};
      state.order.forEach(function (id, i) { pos[id] = i; });
      list.sort(function (a, b) {
        return (pos[a.id] == null ? 999 : pos[a.id]) - (pos[b.id] == null ? 999 : pos[b.id]);
      });
    } else {
      // coaches first, then people with a circle, then wildcards
      list.sort(function (a, b) {
        if (a.coach !== b.coach) return a.coach ? -1 : 1;
        var aw = a.circle === "wildcard", bw = b.circle === "wildcard";
        if (aw !== bw) return aw ? 1 : -1;
        return a.name.localeCompare(b.name);
      });
    }
    return list;
  }

  /* -------------------------------------------------------------- render */

  function avatarMarkup(p, cls) {
    if (p.photo) {
      return '<div class="' + cls + '"><img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy"></div>';
    }
    return '<div class="' + cls + '"><span class="mono-initials">' + esc(initials(p.name)) + "</span></div>";
  }

  function roleLine(p, i) {
    if (p.role) return { text: p.role, empty: false };
    return { text: NO_ROLE_LINES[i % NO_ROLE_LINES.length], empty: true };
  }

  function renderStats() {
    var total   = state.people.length;
    var coaches = state.people.filter(function (p) { return p.coach; }).length;
    var inComm  = state.people.filter(function (p) {
      return p.status === "in-community" || p.status === "quiet";
    }).length;

    el.stats.innerHTML =
      stat(total, total === 1 ? "person" : "people") +
      stat(coaches, coaches === 1 ? "coach" : "coaches") +
      stat(inComm, "in the community") +
      stat(4, "circles");

    function stat(n, label) {
      return '<div class="stat"><b>' + n + "</b><span>" + esc(label) + "</span></div>";
    }
  }

  function renderFilters() {
    var counts = { all: state.people.length, coach: 0 };
    Object.keys(CIRCLES).forEach(function (k) { counts[k] = 0; });
    state.people.forEach(function (p) {
      counts[p.circle] = (counts[p.circle] || 0) + 1;
      if (p.coach) counts.coach++;
    });

    var defs = [{ key: "all", suit: "", label: "Everyone", cls: "" }];
    Object.keys(CIRCLES).forEach(function (k) {
      if (!counts[k]) return;
      defs.push({ key: k, suit: CIRCLES[k].suit, label: CIRCLES[k].short, cls: "is-" + k });
    });
    if (counts.coach) defs.push({ key: "coach", suit: "♛", label: "Coaches", cls: "is-coach" });

    el.filters.innerHTML = defs.map(function (d) {
      return '<button class="chip ' + d.cls + '" data-filter="' + d.key + '" ' +
        'aria-pressed="' + (state.filter === d.key) + '">' +
        (d.suit ? '<span class="chip-suit">' + d.suit + "</span>" : "") +
        esc(d.label) + ' <span class="chip-count">' + counts[d.key] + "</span></button>";
    }).join("");
  }

  function renderDeck() {
    var list = visiblePeople();

    if (!list.length) {
      el.deck.innerHTML =
        '<div class="empty-state"><span>♠♥♦♣</span>' +
        "No cards match that. Try another search.</div>";
      return;
    }

    el.deck.innerHTML = list.map(function (p, i) {
      var c = CIRCLES[p.circle];
      var role = roleLine(p, i);
      return (
        '<button class="card c-' + p.circle + (p.coach ? " is-coach" : "") + '" ' +
          'data-id="' + esc(p.id) + '" data-suit="' + c.suit + '" ' +
          'style="animation-delay:' + Math.min(i * 45, 700) + 'ms" ' +
          'aria-label="Open ' + esc(p.name) + '">' +
          (p.coach ? '<div class="coach-ribbon">COACH</div>' : "") +
          '<div class="card-corner"><b>' + esc(initials(p.name).charAt(0)) + "</b>" +
            "<span>" + c.suit + "</span></div>" +
          '<div class="admin-tools">' +
            '<span class="icon-btn edit" data-edit="' + esc(p.id) + '" role="button" title="Edit" tabindex="0">✎</span>' +
            '<span class="icon-btn del" data-del="' + esc(p.id) + '" role="button" title="Delete" tabindex="0">✕</span>' +
          "</div>" +
          avatarMarkup(p, "avatar") +
          '<h2 class="card-name">' + esc(p.name) + "</h2>" +
          '<p class="card-role' + (role.empty ? " empty" : "") + '">' + esc(role.text) + "</p>" +
          '<div class="card-foot">' +
            '<span class="circle-tag">' + esc(c.short) + "</span>" +
            '<span class="status"><span class="dot ' + p.status + '"></span>' +
              esc(shortStatus(p.status)) + "</span>" +
          "</div>" +
        "</button>"
      );
    }).join("");
  }

  function shortStatus(s) {
    return { "in-community": "Active", "quiet": "Quieter", "off-platform": "Off-platform", "unknown": "TBC" }[s] || "TBC";
  }

  function render() {
    renderStats();
    renderFilters();
    renderDeck();
  }

  /* --------------------------------------------------------- person view */

  function openPerson(id) {
    var p = state.people.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var c = CIRCLES[p.circle];
    var role = p.role ? { text: p.role, empty: false } : { text: "Role not decided yet", empty: true };

    var facts = "";
    facts += fact("Circle", c.suit + " " + esc(c.label));
    facts += fact("In the community", esc(STATUSES[p.status]));
    if (p.superpower) facts += fact("Superpower", esc(p.superpower));
    if (p.since)      facts += fact("With us since", esc(p.since));
    if (p.funFact)    facts += fact("Fun fact", esc(p.funFact));
    facts += fact("Contact", p.email
      ? '<a href="' + contactHref(p.email) + '">' + esc(p.email) + "</a>"
      : '<span style="color:var(--ink-faint)">Nothing public to share</span>');

    el.personContent.innerHTML =
      '<div class="sheet-head c-' + p.circle + (p.coach ? " is-coach" : "") + '" data-suit="' + c.suit + '">' +
        avatarMarkup(p, "sheet-avatar") +
        '<div class="sheet-id">' +
          '<h2 id="sheetName">' + esc(p.name) + "</h2>" +
          '<p class="role' + (role.empty ? " empty" : "") + '">' + esc(role.text) + "</p>" +
          '<div class="sheet-badges">' +
            (p.coach ? '<span class="badge gold">♛ Team coach</span>' : "") +
            '<span class="badge">' + c.suit + " " + esc(c.label) + "</span>" +
            '<span class="badge"><span class="dot ' + p.status + '"></span>' + esc(STATUSES[p.status]) + "</span>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="sheet-body">' +
        '<p class="blurb' + (p.blurb ? "" : " empty") + '">' +
          esc(p.blurb || "No intro written yet — this card is waiting for its story.") + "</p>" +
        '<div class="facts">' + facts + "</div>" +
        (p.circle === "wildcard"
          ? '<p class="note">Circle not assigned yet. It gets decided in the first circle meetings, ' +
            "then this card updates.</p>"
          : "") +
        (isAdmin()
          ? '<div class="editor-actions"><button class="btn" data-edit="' + esc(p.id) + '">Edit this card</button></div>'
          : "") +
      "</div>";

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
    $("f-id").value         = p ? p.id : "";
    $("f-name").value       = p ? p.name : "";
    $("f-role").value       = p ? p.role : "";
    $("f-circle").value     = p ? p.circle : "wildcard";
    $("f-status").value     = p ? p.status : "unknown";
    $("f-coach").checked    = p ? p.coach : false;
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
    var data = {
      id: id,
      name:       $("f-name").value.trim(),
      role:       $("f-role").value.trim(),
      circle:     $("f-circle").value,
      status:     $("f-status").value,
      coach:      $("f-coach").checked,
      photo:      $("f-photo").value.trim(),
      email:      $("f-email").value.trim(),
      blurb:      $("f-blurb").value.trim(),
      superpower: $("f-superpower").value.trim(),
      since:      $("f-since").value.trim(),
      funFact:    $("f-funfact").value.trim()
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
      state.order = null;
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

  /* -------------------------------------------------------------- export */

  function exportSource() {
    var body = JSON.stringify({ version: 1, updated: today(), people: state.people }, null, 2);
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
    if (taps >= SECRET_TAPS) {
      taps = 0;
      askForPasscode();
    }
  }

  function askForPasscode() {
    if (isAdmin()) { toast("Already in admin mode"); return; }
    var input = prompt("Admin passcode");
    if (input === null) return;
    if (input.trim().toLowerCase() === PASSCODE) {
      enterAdmin();
    } else {
      toast("Nope — try again");
    }
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
    // deck: open a person, or use the admin tools on the card
    el.deck.addEventListener("click", function (e) {
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

    el.filters.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-filter]");
      if (!chip) return;
      state.filter = chip.getAttribute("data-filter");
      render();
    });

    el.search.addEventListener("input", function () {
      state.query = el.search.value;
      renderDeck();
    });

    $("shuffle").addEventListener("click", function () {
      var ids = state.people.map(function (p) { return p.id; });
      for (var i = ids.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = ids[i]; ids[i] = ids[j]; ids[j] = t;
      }
      state.order = ids;
      renderDeck();
      toast("Deck shuffled");
    });

    // overlays
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
      // hidden admin shortcut
      if (e.key && e.key.toLowerCase() === "a" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        isAdmin() ? exitAdmin() : askForPasscode();
      }
    });

    // editor
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
      if (file.size > 900 * 1024) {
        toast("That image is large — try one under 900 KB");
      }
      var reader = new FileReader();
      reader.onload = function () {
        $("f-photo").value = reader.result;
        updatePhotoPreview();
      };
      reader.readAsDataURL(file);
    });

    // admin bar
    $("addPerson").addEventListener("click", function () { openEditor(null); });
    $("exportBtn").addEventListener("click", openExport);
    $("exitAdmin").addEventListener("click", exitAdmin);
    $("resetBtn").addEventListener("click", function () {
      if (!confirm("Throw away local changes and go back to the deck saved in the repository?")) return;
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      state.people = seedPeople();
      state.order = null;
      render();
      toast("Back to the saved deck");
    });

    // export helpers
    $("copyExport").addEventListener("click", function () {
      el.exportBox.select();
      var ok = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(el.exportBox.value).then(
          function () { toast("Copied — paste into data/team.js"); },
          function () { toast("Select the text and copy manually"); }
        );
        return;
      }
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

    // the hidden way in
    $("secretMark").addEventListener("click", secretTap);
    $("secretFoot").addEventListener("click", secretTap);
  }

  /* ----------------------------------------------------------------- init */

  function init() {
    el.deck          = $("deck");
    el.stats         = $("stats");
    el.filters       = $("filters");
    el.search        = $("search");
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
