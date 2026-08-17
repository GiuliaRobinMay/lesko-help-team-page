# The Lesko Help team page

A playful team page — one playing card per person, in the same visual language as
the *How we work together* document: cream paper, navy ink, red italics, yellow
spots, and the four card suits.

Open `index.html` in a browser. That's it — no build step, no dependencies,
no server required.

```
index.html          the page
assets/styles.css   all the styling
assets/app.js       all the behaviour
data/team.js        THE TEAM — this is the file you edit or export into
```

---

## What's on the page

* **A card per person.** Click any card to open their detail sheet — role, circle,
  whether they're in the community, contact (only when there is one to share),
  superpower, fun fact.
* **Coaches get gold cards** with a `COACH` ribbon and a gold detail sheet, so
  they stand out from everyone else at a glance.
* **Circles are the four suits** from the org document:
  ♠ Steering · ♥ Membership · ♦ Events & Learning · ♣ Tech, Platform & AI.
  Anyone whose circle isn't decided yet is a **★ Wildcard** — an honest placeholder
  rather than a wrong answer.
* **Community status** is a coloured dot: active · quieter · not on the platform ·
  to be confirmed. Not everyone is in the community, and the page says so plainly.
* **Search, filter chips, and a Shuffle button** for re-dealing the deck.
* Works on phones, keyboard-navigable, and respects reduced-motion settings.

---

## The hidden admin panel

Two ways in — both invisible to a normal visitor:

1. **Click the blue `?` badge five times** (top-left next to the logo, or the one
   in the footer), then enter the passcode.
2. **Press `Ctrl` + `Shift` + `A`**, then enter the passcode.

The default passcode is **`lesko`**. Change it on line 15 of `assets/app.js`:

```js
var PASSCODE = "lesko";   // ← change me
```

> This is a lock on a glass door: it keeps the panel out of a visitor's way, but
> anyone who reads the page source can find the passcode. It's the right level of
> protection for "don't let people stumble into the editor", not for secrets.

Once you're in, a black bar appears at the bottom of the screen and every card
grows a ✎ (edit) and ✕ (delete) button:

| Button | What it does |
| --- | --- |
| **+ Add person** | Opens a blank card. Only the name is required. |
| **✎ on a card** | Edit that person — role, circle, coach toggle, status, photo, contact, intro. |
| **✕ on a card** | Delete that person (with a confirmation). |
| **Export deck** | Gives you the new `data/team.js` to save for everyone — see below. |
| **Reset to saved file** | Throws away your local edits and reloads `data/team.js`. |
| **Exit admin** | Back to visitor view. |

### Adding a photo

The simplest way: drop a file into `photos/` named after the person's id —
`photos/misty.jpg`, `photos/zach.jpg` — and commit it. The cards already point at
those paths, so the photo just appears. See `photos/README.md`.

You can also paste an **image URL** in the editor, or hit **Upload** to embed a
file straight into the data (keep those under ~900 KB).

A card whose photo is missing falls back to a monogram rather than a broken
image, so you can add pictures one at a time without the page ever looking
unfinished.

---

## Making your changes permanent (important)

Edits made in admin mode are saved **in your browser only**. Nobody else sees them
until you write them back into the repository:

1. In admin mode, click **Export deck**.
2. Click **Copy to clipboard** (or **Download team.js**).
3. Paste it over the entire contents of `data/team.js`.
4. Commit and push.

That's the one manual step, and it's deliberate: it keeps the page a plain static
site with no server, no database, and no login to maintain — while the team list
stays version-controlled and reviewable.

You can also skip the panel entirely and edit `data/team.js` by hand. The field
list is documented at the top of that file.

---

## Publishing it

Any static host will do. For GitHub Pages: repository **Settings → Pages →
Deploy from a branch**, pick this branch and the root folder. The page will be
live at `https://<owner>.github.io/lesko-help-team-page/`.

---

## Still to fill in

The page ships with the nine people named so far. Seven of them are Wildcards with
no role written yet — those are placeholders waiting for real information, not
guesses:

* who else belongs on the page (the rest of the names)
* which circle each person sits in
* who the coaches are (only Matthew is flagged today)
* who is actually active in the community, and who isn't
* photos, intros, and contact details where there are any to share

All of it is editable from the admin panel — no code needed.
