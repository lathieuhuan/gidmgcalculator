import { FaBars, FaCog } from "react-icons/fa";
import { Lightgold } from "@Components/atoms";

export const UPDATES = [
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
        Also please help me with some testing. The sooner it becomes stable the soonner it gets
        officially released. Thank you very much!
      </>,
    ],
  },
];
