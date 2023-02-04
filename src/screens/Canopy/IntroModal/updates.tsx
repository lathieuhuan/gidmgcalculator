import { FaBars, FaCog } from "react-icons/fa";
import { Lightgold } from "@Components/atoms";

export const UPDATES = [
  {
    date: "February 4th, 2023",
    content: [
      <>
        Corrected <Lightgold>Mika</Lightgold>'s Elemental Burst healing scaled off ATK instead of
        HP. Thank you <Lightgold>Spiderninja_1</Lightgold>!
      </>,
    ],
  },
  {
    date: "February 3rd, 2023",
    content: [
      <>
        Fixed a visual bug that makes inputs on the Artifact section of the Setups Manager keep
        their values after switched to another artifact. Thank you <Lightgold>Meiflower</Lightgold>{" "}
        and <Lightgold>SeiRyuSeijin</Lightgold>!
      </>,
      <>
        Fixed inputs controlling Artifact substats did not take "." as decimal separator. Thank you{" "}
        <Lightgold>arthur cavalaro</Lightgold>!
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
        Completed <FaCog /> <Lightgold>Guides</Lightgold> on <FaBars /> Menu.
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
