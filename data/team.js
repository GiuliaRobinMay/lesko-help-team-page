/* ------------------------------------------------------------------
   Lesko Help — the team deck (seed data)

   This is the file that ships with the site. Anything you change in the
   hidden admin panel is stored in your browser only, until you hit
   "Export deck" and paste the result back into this file.

   FIELDS
   -------------------------------------------------------------------
   id        unique slug, lowercase, no spaces (used internally)
   name      display name
   role      what they do. Leave "" if it isn't decided yet.
   circle    "steering" | "membership" | "events" | "tech" | "wildcard"
             (wildcard = circle not assigned yet)
   coach     true if this person is a team coach (gold card)
   status    "in-community" | "quiet" | "off-platform" | "unknown"
   photo     image URL or data: URI. Leave "" for a monogram card.
   email     "" if there is no contact info to share
   blurb     one or two sentences for the detail view
   superpower  short, playful — shows as a badge in the detail view
   funFact   optional, shows in the detail view
   since     optional, e.g. "2023"
   ------------------------------------------------------------------ */

window.LESKO_TEAM_SEED = {
  version: 1,
  updated: "2026-08-17",
  people: [
    {
      id: "matthew",
      name: "Matthew",
      role: "Founder & Brand",
      circle: "steering",
      coach: true,
      status: "in-community",
      photo: "",
      email: "",
      blurb:
        "The face and the voice of Lesko Help. Hosts Matthew Live every week and holds the brand — the video library, the tone, the promise we make to members.",
      superpower: "Turning a question into an answer people can use",
      funFact: "",
      since: ""
    },
    {
      id: "giulia",
      name: "Giulia",
      role: "Strategy & Structure",
      circle: "steering",
      coach: false,
      status: "in-community",
      photo: "",
      email: "",
      blurb:
        "Writes the plan and then makes it real. Org structure, the marketing-to-tech handoff, and the documents that keep everybody pointing the same direction.",
      superpower: "Making complicated things sound simple",
      funFact: "",
      since: ""
    },
    {
      id: "misty",
      name: "Misty",
      role: "",
      circle: "wildcard",
      coach: false,
      status: "unknown",
      photo: "",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "martin",
      name: "Martin",
      role: "",
      circle: "wildcard",
      coach: false,
      status: "unknown",
      photo: "",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "carter",
      name: "Carter",
      role: "",
      circle: "wildcard",
      coach: false,
      status: "unknown",
      photo: "",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "rose",
      name: "Rose",
      role: "",
      circle: "wildcard",
      coach: false,
      status: "unknown",
      photo: "",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "tony",
      name: "Tony",
      role: "",
      circle: "wildcard",
      coach: false,
      status: "unknown",
      photo: "",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "amber",
      name: "Amber",
      role: "",
      circle: "wildcard",
      coach: false,
      status: "unknown",
      photo: "",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "roger",
      name: "Roger",
      role: "",
      circle: "wildcard",
      coach: false,
      status: "unknown",
      photo: "",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    }
  ]
};
