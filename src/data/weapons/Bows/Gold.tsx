import { findByCode } from "@Src/utils";
import { Green } from "@Styled/DataDisplay";
import { IWeapon } from "../types";
import { addWpModMaker } from "../utils";

const GoldBows: IWeapon[] = [
  {
    code: 125,
    name: "Aqua Simulacra",
    icon: "c/cd/Weapon_Aqua_Simulacra",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cDmg", scale: "19.2%" },
    addBuff: addWpModMaker("totalAttrs", "hp", 4),
    buffs: [
      {
        index: 0,
        affect: "self",
        addBuff: addWpModMaker("skillBonus", "all.pct", 5),
        desc: ({ refinement }) =>
          findByCode(GoldBows, 125)!.passiveDesc({ refinement }).extra![0],
      },
    ],
    passiveName: "The Cleansing Form",
    passiveDesc: ({ refinement }) => ({
      get core() {
        return (
          <>
            <Green>HP</Green> is increased by{" "}
            <Green>{12 + refinement * 4}%</Green>. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          When there are opponents nearby, the <Green>DMG</Green> dealt by the
          wielder of this weapon is increased by{" "}
          <Green b>{15 + refinement * 5}%</Green>. This will take effect whether
          the character is on-field or not.
        </>,
      ],
    }),
  },
];

export default GoldBows;