import { FaBars, FaCog, FaQuestionCircle } from "react-icons/fa";
import { Lightgold, Red } from "@Components/atoms";

export const UPDATES = [
  {
    date: "February 28th, 2023",
    content: [<>Enabled uploading .json file in GOOD format.</>],
  },
  {
    date: "February 23th, 2023",
    content: [
      <>
        Fixed <Lightgold>Wanderer's Troupe</Lightgold> 4-piece set bonus did not work.
      </>,
      <>
        Fixed <Lightgold>Tulaytullah's Remembrance</Lightgold> gave less Normal Attack Speed than
        expected.
      </>,
      <>
        Removed <Lightgold>Thrilling Tales of Dragon Slayers</Lightgold>'s buff control on its
        wielder.
      </>,
      <>
        Added an option for 0 mirror consumption in <Lightgold>Alhaitham</Lightgold>'s C4 buff.
      </>,
      <>
        Added damage calculation for <Lightgold>Dori</Lightgold>'s C2,{" "}
        <Lightgold>Bennett</Lightgold>'s C4, and <Lightgold>Collei</Lightgold>'s C6.
      </>,
      <>
        Added shield damage absorption calculation for <Lightgold>Beidou</Lightgold>'s C1,{" "}
        <Lightgold>Yanfei</Lightgold>'s C4
      </>,
      <>
        Added a buff control for <Lightgold>Bennett</Lightgold>'s C2.
      </>,
      <>
        Limited Elemental Burst damage bonus based on team energy cap of{" "}
        <Lightgold>Watatsumi weapon series</Lightgold> (Mouun's Moon, Akuoumaru, Wavebreaker's Fin).
      </>,
      <>
        Hug thanks to <Red>Only_Pumpkin_801</Red> for the reports of all above problems!
      </>,
      <>
        Switched <Lightgold>Jean</Lightgold>'s C1 buff from auto to controllable. Thank you{" "}
        <Red>Jenny-sama</Red>!
      </>,
      <>
        Corrected <Lightgold>Ningguang</Lightgold>'s A4 buff control label. Thank you{" "}
        <Red>Ayan</Red>!
      </>,
    ],
  },
  {
    date: "February 19th, 2023",
    content: [
      <>
        Corrected <Lightgold>Alhaitham</Lightgold>'s C6 description and removed its stacks input.
      </>,
      <>
        Fixed <Lightgold>Wanderer</Lightgold> gained C1 benefits when his Elemental Skill is active
        at Ascension 4.
      </>,
      <>
        Thank you <Red>Only_Pumpkin_801</Red> for the bug report!
      </>,
    ],
  },
  {
    date: "February 7th, 2023",
    content: [
      <>
        Fixed Flat DMG Bonus from <Lightgold>Aggravate</Lightgold> and <Lightgold>Spread</Lightgold>{" "}
        reactions was not properly increased by Elemental Mastery.
      </>,
      <>
        Fixed <Lightgold>Yun Jin</Lightgold>'s Elemental Burst buff control mistook her C2 buff for
        her A4 buff, and missed the control for A4 buff.
      </>,
      <>
        Fixed <Lightgold>Dehya</Lightgold>'s ES and EB damage results got split into ATK part and HP
        part.
      </>,
      <>
        A big thank to <Red>Ayan</Red> for the tesing they have done!
      </>,
      <>Improved character sorting on large devices.</>,
    ],
  },
  {
    date: "February 6th, 2023",
    content: [
      <>
        Updated <Lightgold>Dehya</Lightgold> and <Lightgold>Mika</Lightgold>.
      </>,
      <>
        Fixed <Lightgold>Dehya</Lightgold>'s Constellation 1 did not give HP bonus. Thank you{" "}
        <Red>Gabriel Caminha</Red>!
      </>,
    ],
  },
  {
    date: "February 4th, 2023",
    content: [
      <>
        Corrected <Lightgold>Mika</Lightgold>'s Elemental Burst healing scaled off ATK instead of
        HP. Thank you <Red>Spiderninja_1</Red>!
      </>,
    ],
  },
  {
    date: "February 3rd, 2023",
    content: [
      <>
        Fixed a visual bug that makes inputs on the Artifact section of the Setups Manager keep
        their values after switched to another artifact. Thank you <Red>Meiflower</Red> and{" "}
        <Red>SeiRyuSeijin</Red>!
      </>,
      <>
        Fixed inputs controlling Artifact substats did not take "." as decimal separator. Thank you{" "}
        <Red>arthur cavalaro</Red>!
      </>,
    ],
  },
  {
    date: "February 2nd, 2023",
    content: [
      <>Prevented changes of teammates on combined setups in the Calculator.</>,
      <>
        Prevented bow-wielding characters from getting infusion to their charged and plunging
        attacks.
      </>,
    ],
  },
  {
    date: "February 1st, 2023",
    content: [
      <>
        Completed <FaQuestionCircle /> <Lightgold>Guides</Lightgold> on <FaBars /> Menu.
      </>,
      <>Fixed minor bugs and updated some UI.</>,
    ],
  },
  {
    date: "January 30th, 2023",
    content: [
      <>
        Completed <FaCog /> <Lightgold>Settings</Lightgold> feature on <FaBars /> Menu.
      </>,
      <>Corrected some skill names.</>,
    ],
  },
  {
    date: "January 29th, 2023",
    content: [
      <>
        Release GI DMG Calculator <Lightgold>v3.0.0-beta</Lightgold>. There're still many features
        that are under construction so I cannot let you download your data yet. Please consider it
        when you save new characters, items, setups.
      </>,
      <>
        Also please help me with some testing. The sooner the App becomes stable the soonner it gets
        officially released. Thank you very much!
      </>,
    ],
  },
];
