import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Tighnari: DefaultAppCharacter = {
  code: 54,
  name: "Tighnari",
  icon: "8/87/Tighnari_Icon",
  sideIcon: "1/15/Tighnari_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "bow",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `For every point of Tighnari's Elemental Mastery, his {Charged Attack DMG}#[k] and Fashioner's
      Tanglevine Shaft {[EB] DMG}#[k] are increased by {0.08%}#[v]. Max {80%}#[m].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ desc, totalAttr, attPattBonus, tracker }) => {
        const buffValue = Math.min(totalAttr.em, 1000) * 0.08;
        applyModifier(desc, attPattBonus, ["CA.pct_", "EB.pct_"], buffValue, tracker);
      },
    },
    {
      src: EModSrc.C1,
      description: `Tighnari's {Charged Attack CRIT Rate}#[k] is increased by {15%}#[v].`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "CA.cRate_", 15),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `After Tighnari fires a Wreath Arrow, his {Elemental Mastery}#[k] is increased by {50}#[v]
      for 4s.`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "em", 50),
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When there are opponents within Vijnana-Phala Mine [ES] field, Tighnari gains {20%}#[v]
      {Dendro DMG Bonus}#[k].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "dendro", 20),
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      description: `When Fashioner's Tanglevine Shaft [EB] is unleashed, all party members gain {60}#[v]
      {Elemental Mastery}#[k] for 8s. If this skill triggers a Burning, Bloom, Aggravate, or Spread reaction, their
      {Elemental Mastery}#[k] will be further increased by {60}#[v].`,
      isGranted: checkCons[4],
      inputConfigs: [
        {
          label: "Trigger reactions",
          type: "check",
        },
      ],
      applyBuff: ({ desc, totalAttr, inputs, tracker }) => {
        applyModifier(desc, totalAttr, "em", 60 + (inputs[0] === 1 ? 60 : 0), tracker);
      },
    },
  ],
};

export default Tighnari as AppCharacter;
