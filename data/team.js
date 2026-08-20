/* ------------------------------------------------------------------
   Lesko Help — the team deck (seed data)

   This is the file that ships with the site. Anything you change in the
   hidden admin panel is stored in your browser only, until you hit
   "Export deck" and paste the result back into this file.

   THE ORDER OF THIS LIST IS THE ORDER ON THE PAGE.

   NO CONTACT DETAILS. The page has no field for phone numbers, emails or
   personal links, by design. Please keep it that way.

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
   photo     path or URL. A path like photos/<id>.jpg wins if that file
             exists; otherwise the Drive link is used; otherwise a monogram.
   blurb     one or two sentences for the detail view
   superpower  short and playful — shows in the detail view
   funFact   optional
   since     optional, e.g. "2023"
   ------------------------------------------------------------------ */

window.LESKO_TEAM_SEED = {
  version: 4,
  updated: "2026-08-18",
  people: [
    {
      id: "matthew",
      name: "Matthew",
      title: "Your host & grant expert",
      inCommunity: true,
      color: "deepred",
      photo: "https://drive.google.com/thumbnail?id=13jADXBFtRKjjoaB4-cOC7QfCEOnF17Lz&sz=w1000",
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
      inCommunity: true,
      color: "blue",
      photo: "https://drive.google.com/thumbnail?id=1yHenitDSMrKP-hg7dhlOJwcg90ep-LDH&sz=w1000",
      blurb:
        "Holds the questions channel — for a lot of members she is the first person who ever answers them — and keeps a hundred small things moving on the community side.",
      superpower: "Answering before you've finished asking",
      funFact: "",
      since: ""
    },
    {
      id: "amber",
      name: "Amber",
      title: "Business Expert",
      inCommunity: true,
      color: "red",
      photo: "https://drive.google.com/thumbnail?id=1oLO_HcInVMnBZAiDpgPkgxHG46pO430d&sz=w1000",
      blurb:
        "Our business expert, and the one teaching most of the classes. Turns “I want to start something” into a plan you can actually follow.",
      superpower: "Making a business plan feel obvious",
      funFact: "",
      since: ""
    },
    {
      id: "rose",
      name: "Rose",
      title: "Grant Coach",
      inCommunity: true,
      color: "yellow",
      photo: "photos/rose.jpg",
      blurb:
        "On the questions channel, answering members and making sure nobody is left waiting.",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "tony",
      name: "Tony",
      title: "Grant Coach & Teacher",
      inCommunity: true,
      color: "green",
      photo: "photos/tony.jpg",
      blurb:
        "Coaches, teaches, and is another familiar name on the questions channel.",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "roger",
      name: "Roger",
      title: "AI Wizard",
      inCommunity: null,
      color: "red",
      photo: "https://drive.google.com/thumbnail?id=18m5j1pWWnVbqDgrumpkw_HN9vqAZqeYA&sz=w1000",
      blurb:
        "Our AI wizard. If something clever is happening quietly in the background, Roger probably built it.",
      superpower: "Making the machines do the boring part",
      funFact: "",
      since: ""
    },
    {
      id: "megan",
      name: "Megan",
      title: "Nonprofit Expert",
      inCommunity: null,
      color: "yellow",
      photo: "https://drive.google.com/thumbnail?id=1Utr3HK5U495uy1NfPlBnhoc8J1R5KzYC&sz=w1000",
      blurb:
        "Our nonprofit specialist — the one to ask the moment the question turns to nonprofits.",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "mary",
      name: "Mary",
      title: "Support",
      inCommunity: null,
      color: "green",
      photo: "photos/mary.jpg",
      blurb:
        "Support. Quietly makes sure members are looked after and nothing slips through.",
      superpower: "",
      funFact: "",
      since: ""
    },
    {
      id: "giulia",
      name: "Giulia",
      title: "Community Admin",
      inCommunity: true,
      color: "blue",
      photo: "https://drive.google.com/thumbnail?id=1RWAmNuocXKtJrHcxhzDmL7XwfnuKgH_A&sz=w1000",
      blurb:
        "Runs the community day to day, writes the plan, and keeps strategy, marketing and tech pointing the same direction.",
      superpower: "Making complicated things sound simple",
      funFact: "",
      since: ""
    },
    {
      id: "carter",
      name: "Carter",
      title: "Marketing Expert",
      inCommunity: null,
      color: "yellow",
      photo: "photos/carter.jpg",
      blurb:
        "Our marketing expert — how new members find us, and what they hear from us first.",
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
      blurb:
        "Tech. Keeps the platform, the tools and all the plumbing running so the rest of us can get on with it.",
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
      blurb:
        "Social media — our voice everywhere outside the community.",
      superpower: "",
      funFact: "",
      since: ""
    }
  ]
};
