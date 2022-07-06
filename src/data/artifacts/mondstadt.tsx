import { IArtifact } from "./types";

const mondstadt: IArtifact[] = [
  {
    code: 13,
    name: "Gladiator's Finale",
    variants: [4, 5],
    flower: {
      name: "Gladiator's Nostalgia",
      icon: "b/b1/Item_Gladiator%27s_Nostalgia"
    },
    plume: {
      name: "Gladiator's Destiny",
      icon: "9/94/Item_Gladiator%27s_Destiny"
    },
    sands: {
      name: "Gladiator's Longing",
      icon: "0/0c/Item_Gladiator%27s_Longing"
    },
    goblet: {
      name: "Gladiator's Intoxication",
      icon: "6/6d/Item_Gladiator%27s_Intoxication"
    },
    circlet: {
      name: "Gladiator's Triumphus",
      icon: "9/9b/Item_Gladiator%27s_Triumphus"
    },
    setBnes: [
      // {
      //   type: "2-Piece Set",
      //   desc: (
      //     <>
      //       <Green>ATK</Green> <Green b>+18%</Green>.
      //     </>
      //   ),
      //   addBnes: simpleAnTmaker("ATTRs", "ATK%", 18)
      // },
      // {
      //   type: "4-Piece Set",
      //   desc: (
      //     <>
      //       If the wielder of this artifact set uses a Sword, Claymore or
      //       Polearm, increases their <Green>Normal Attack DMG</Green> by{" "}
      //       <Green b>35%</Green>.
      //     </>
      //   ),
      //   addBnes: ({ hitBnes, charData, tkDesc, tracker }) => {
      //     const supported = ["Sword", "Claymore", "Polearm"];
      //     if (hitBnes && supported.includes(charData.weapon)) {
      //       addAndTrack(tkDesc, hitBnes, "NA.pct", 35, tracker);
      //     }
      //   }
      // }
    ]
  },
]

export default mondstadt;