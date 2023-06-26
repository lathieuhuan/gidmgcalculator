import { Green, Lightgold, Red } from "@Src/components";

export const UPDATES = [
  {
    date: "June 22th, 2023",
    content: ["Fixed a bug where removing a teammate's artifact with active debuff, the debuff was not removed."],
  },
  {
    date: "May 25th, 2023",
    content: [
      <>
        Added <Lightgold>Ibis Piercer</Lightgold>.
      </>,
    ],
  },
  {
    date: "May 16th, 2023",
    content: [
      <>
        Corrected <Lightgold>King's Squire</Lightgold> substat from Energy Recharge to ATK%. Thank you{" "}
        <Red>Victor H</Red>!
      </>,
      <>
        Added additional attacks or shield for: <Lightgold>Razor</Lightgold> C6, <Lightgold>Chongyun</Lightgold> C1,{" "}
        <Lightgold>Xiangling</Lightgold> C2, <Lightgold>Noelle</Lightgold> A1 & C4, <Lightgold>Wanderer</Lightgold> C6.
        Thank you <Red>Meiflower</Red>!
      </>,
    ],
  },
  {
    date: "May 3rd, 2023 (v3.1.0)",
    content: [
      <>
        Updated <Lightgold>Baizhu</Lightgold> and <Lightgold>Kaveh</Lightgold>.
      </>,
      <>
        Released <Lightgold>Export Setup</Lightgold> feature.
      </>,
    ],
  },
  {
    date: "April 13th, 2023",
    content: [
      <>
        Added <Lightgold>Kirara</Lightgold>.
      </>,
      <>
        Fixed <Lightgold>Tighnari</Lightgold>'s A4 did not factor in some Elemenetal Mastery bonuses.
      </>,
      <>
        Fixed <Lightgold>Raiden Shogun</Lightgold>'s resolve count did not work at C1, when Total Energy spent by all
        characters is equal to Total Energy spent by Electro characters. Thank you <Red>Only_Pumpkin_801</Red>!
      </>,
      <>
        Changed buffs that are based on characters' Max HP from --[1 bonus value each 1,000 Max HP]-- to --[0.001 bonus
        value each 1 Max HP]--. For example, <Lightgold>Nilou</Lightgold>'s A4 will now get 0.009% Bloom DMG bonus every
        1 Max HP above 30,000, instead of 9% bonus every 1,000 Max HP above 30,000. Thank you <Red>StockedSix</Red> for
        the testing on Nilou!
      </>,
      <>
        Other characters affected by the above change: <Lightgold>Baizhu, Candace, Kirara</Lightgold>.
      </>,
    ],
  },
  {
    date: "March 30th, 2023",
    content: [
      <>
        Prevented <Lightgold>Wanderer</Lightgold>'s A1 from triggering the third infused element buff when he is not yet
        at C4. Thank you <Red>Only_Pumpkin_801</Red>!
      </>,
      <>
        Corrected <Lightgold>Desert Pavilion Chronicle</Lightgold>'s description form 10s to 15s. Thank you{" "}
        <Red>Hounth</Red>!
      </>,
    ],
  },
  {
    date: "March 28th, 2023",
    content: [
      <>
        Fixed setting "Keep artifact stats when switching to a new set" did not work properly. Thank you{" "}
        <Red>Only_Pumpkin_801</Red>!
      </>,
    ],
  },
  {
    date: "March 20th, 2023",
    content: [
      <>Fixed broken image links.</>,
      <>
        Setting "Keep artifact stats when switching to a new set" will be no longer applied when switching to your saved
        artifacts.
      </>,
    ],
  },
  {
    date: "March 19th, 2023",
    content: [
      <>
        Updated <Lightgold>Baizhu</Lightgold>, <Lightgold>Jadefall's Splendor</Lightgold>, and{" "}
        <Lightgold>Dewflower's Glow</Lightgold>.
      </>,
      <>
        Corrected a wrong label on <Lightgold>Lisa</Lightgold>'s A4 debuff. Thank you <Red>Izzo</Red>!
      </>,
      <>Added limits to the amount of items that can be uploaded from a file.</>,
      <>
        Enabled <Green>Download</Green> function. Removed options for downloading & uploading data from local storage.
      </>,
      <>
        Added a <Green>new setting</Green> that will make the App <Green>auto save your database</Green> to browser's
        local storage.
      </>,
      <>
        <Red b>GI DMG Calculator v3.0.0</Red> is officially released! Head to <Green b>New in v3.0.0</Green> to see the
        recap of changes and new functionalities compared to previous version.
      </>,
    ],
  },
];
