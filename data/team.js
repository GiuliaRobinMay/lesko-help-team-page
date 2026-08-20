/* ------------------------------------------------------------------
   Lesko Help — the team deck (seed data)

   This is the file that ships with the site. Anything you change in the
   hidden admin panel is stored in your browser only, until you hit
   "Export deck" and paste the result back into this file.

   THE ORDER OF THIS LIST IS THE ORDER ON THE PAGE.

   FIELDS
   -------------------------------------------------------------------
   id        unique slug, lowercase, no spaces (used internally)
   name      display name
   title     what it says under their name. Leave "" if undecided.
   inCommunity  true  = green dot, "In the community"
                false = hollow dot, "Not in the community"
                null  = say nothing yet
   color     "blue" | "red" | "yellow" | "green" | "deepred"
             Leave "" to have one picked automatically.
   photo     path or URL. Cards point at photos/<id>.jpg — drop a file with
             that exact name into photos/ and it appears. Until then the
             card shows a monogram.
   email     "" if there is no contact info to share
   blurb     one or two sentences for the detail view
   superpower  short and playful — shows in the detail view
   funFact   optional
   since     optional, e.g. "2023"
   ------------------------------------------------------------------ */

window.LESKO_TEAM_SEED = {
  version: 3,
  updated: "2026-08-17",
  people: [
    {
      id: "matthew",
      name: "Matthew",
      title: "Your host & grant expert",
      inCommunity: true,
      color: "deepred",
      photo: "https://drive.google.com/thumbnail?id=13jADXBFtRKjjoaB4-cOC7QfCEOnF17Lz&sz=w1000",
      email: "",
      blurb:
        "The face and the voice of Lesko Help. Hosts Matthew Live every week and holds the brand — the video library, the tone, the promise we make to members.",
      superpower: "Turning a question into an answer people can use",
      funFact: "",
      since: ""
    },
    {
      id: "misty",
      name: "Misty",
      title: "Grant Coach",
      inCommunity: null,
      color: "blue",
      photo: "https://drive.google.com/thumbnail?id=1yHenitDSMrKP-hg7dhlOJwcg90ep-LDH&sz=w1000",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "amber",
      name: "Amber",
      title: "Grant Coach",
      inCommunity: null,
      color: "red",
      photo: "https://drive.google.com/thumbnail?id=1oLO_HcInVMnBZAiDpgPkgxHG46pO430d&sz=w1000",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "rose",
      name: "Rose",
      title: "Grant Coach",
      inCommunity: null,
      color: "yellow",
      photo: "photos/rose.jpg",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "tony",
      name: "Tony",
      title: "Grant Coach",
      inCommunity: null,
      color: "green",
      photo: "photos/tony.jpg",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "roger",
      name: "Roger",
      title: "Grant Coach",
      inCommunity: null,
      color: "red",
      photo: "https://drive.google.com/thumbnail?id=18m5j1pWWnVbqDgrumpkw_HN9vqAZqeYA&sz=w1000",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "megan",
      name: "Megan",
      title: "Grant Coach",
      inCommunity: null,
      color: "yellow",
      photo: "https://drive.google.com/thumbnail?id=1Utr3HK5U495uy1NfPlBnhoc8J1R5KzYC&sz=w1000",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "mary",
      name: "Mary",
      title: "",
      inCommunity: null,
      color: "green",
      photo: "photos/mary.jpg",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "giulia",
      name: "Giulia",
      title: "Community Admin & Strategist",
      inCommunity: true,
      color: "blue",
      photo: "https://drive.google.com/thumbnail?id=1RWAmNuocXKtJrHcxhzDmL7XwfnuKgH_A&sz=w1000",
      email: "",
      blurb:
        "Writes the plan and then makes it real. Runs the community day to day, and keeps strategy, marketing and tech pointing the same direction.",
      superpower: "Making complicated things sound simple",
      funFact: "",
      since: ""
    },
    {
      id: "carter",
      name: "Carter",
      title: "Marketing",
      inCommunity: null,
      color: "yellow",
      photo: "photos/carter.jpg",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "martin",
      name: "Martin",
      title: "Tech",
      inCommunity: null,
      color: "green",
      photo: "https://drive.google.com/thumbnail?id=1ovP_R7hfiN31szryUizMM_lUyodyUFFU&sz=w1000",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "zach",
      name: "Zach",
      title: "Social Media",
      inCommunity: null,
      color: "red",
      photo: "photos/zach.jpg",
      email: "",
      blurb: "",
      superpower: "",
      funFact: "",
      since: ""
    }
  ]
};
