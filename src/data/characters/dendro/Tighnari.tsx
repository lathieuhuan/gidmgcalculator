import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
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
      desc: () => (
        <>
          For every point of Elemental Mastery Tighnari possesses, his <Green>Charged Attack DMG</Green> and Fashioner's
          Tanglevine Shaft <Green>[EB] DMG</Green> are increased by <Green b>0.08%</Green>. Max <Rose>80%</Rose>.
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ desc, totalAttr, attPattBonus, tracker }) => {
        const buffValue = Math.min(totalAttr.em, 1000) * 0.08;
        applyModifier(desc, attPattBonus, ["CA.pct_", "EB.pct_"], buffValue, tracker);
      },
    },
    {
      src: EModSrc.C1,
      desc: () => (
        <>
          Tighnari's <Green>Charged Attack CRIT Rate</Green> is increased by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "CA.cRate_", 15),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          After Tighnari fires a Wreath Arrow, his <Green>Elemental Mastery</Green> is increased by <Green b>50</Green>{" "}
          for 4s.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "em", 50),
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When there are opponents within Vijnana-Phala Mine [ES] field, Tighnari gains <Green b>20%</Green>{" "}
          <Green>Dendro DMG Bonus</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "dendro", 20),
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          When Fashioner's Tanglevine Shaft [EB] is unleashed, all party members gain <Green b>60</Green>{" "}
          <Green>Elemental Mastery</Green> for 8s. If this skill triggers a Burning, Bloom, Aggravate, or Spread
          reaction, their <Green>Elemental Mastery</Green> will be further increased by <Green b>60</Green>.
        </>
      ),
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
