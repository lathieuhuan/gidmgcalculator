import type { DataArtifact } from "@Src/types";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";
import { Green } from "@Styled/DataDisplay";

const mondstadt: DataArtifact[] = [
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>ATK</Green> <Green b>+18%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttrs", "atk", 18)
      },
      {
        desc: (
          <>
            If the wielder of this artifact set uses a Sword, Claymore or
            Polearm, increases their <Green>Normal Attack DMG</Green> by{" "}
            <Green b>35%</Green>.
          </>
        ),
        applyBuff: ({ skillBonuses, charData, desc, tracker }) => {
          const supported = ["sword", "claymore", "polearm"];
          if (skillBonuses && supported.includes(charData.weapon)) {
            applyModifier(desc, skillBonuses, "NA.pct", 35, tracker);
          }
        }
      }
    ]
  },
]

export default mondstadt;