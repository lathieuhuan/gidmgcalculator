import type { DataWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { findByCode } from "@Src/utils";
import { Green } from "@Src/styled-components";
import { makeWpModApplier } from "../utils";

const goldBows: DataWeapon[] = [
  {
    code: 125,
    name: "Aqua Simulacra",
    icon: "c/cd/Weapon_Aqua_Simulacra",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cDmg", scale: "19.2%" },
    applyBuff: makeWpModApplier("totalAttr", "hp", 4),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("attPattBonus", "all.pct", 5),
        desc: ({ refi }) => findByCode(goldBows, 125)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "The Cleansing Form",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>HP</Green> is increased by <Green>{12 + refi * 4}%</Green>. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          When there are opponents nearby, the <Green>DMG</Green> dealt by the wielder of this
          weapon is increased by <Green b>{15 + refi * 5}%</Green>. This will take effect whether
          the character is on-field or not.
        </>,
      ],
    }),
  },
];

export default goldBows;
