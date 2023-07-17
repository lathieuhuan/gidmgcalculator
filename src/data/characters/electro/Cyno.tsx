import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Electro, Green, Rose } from "@Src/pure-components";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, talentBuff } from "../utils";

const Cyno: DefaultAppCharacter = {
  code: 59,
  name: "Cyno",
  icon: "3/31/Cyno_Icon",
  sideIcon: "b/b1/Cyno_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "electro",
  weaponType: "polearm",
  EBcost: 80,
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          • Pactsworn Pathclearer's [EB] <Green>Normal Attack DMG</Green> is increased by <Green b>150%</Green> of
          Cyno's <Green>Elemental Mastery</Green>.
          <br />• <Green>Duststalker Bolt DMG</Green> [A1] is increased by <Green b>250%</Green> of Cyno's{" "}
          <Green>Elemental Mastery</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBonuses, totalAttr }) => {
        calcItemBonuses.push(
          {
            ids: "ES.1",
            bonus: talentBuff([true, "flat", [true, 4], totalAttr.em * 2.5]),
          },
          {
            ids: ["EB.0", "EB.1", "EB.2", "EB.3", "EB.4"],
            bonus: talentBuff([true, "flat", [true, 4], Math.round(totalAttr.em * 1.5)]),
          }
        );
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Under Pactsworn Pathclearer state:
          <br />• Cyno's <Green>Elemental Mastery</Green> is increased by <Green b>100</Green>.
          <br />• Cyno gains an <Electro>Electro Infusion</Electro> that cannot be overriden.
        </>
      ),
      applyBuff: makeModApplier("totalAttr", "em", 100),
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Cyno is in the Pactsworn Pathclearer state, he will enter the Endseer stance at intervals. If he
          activates Secret Rite: Chasmic Soulfarer <Green>[ES]</Green> whle affected by this stance, its{" "}
          <Green>DMG</Green> will be increased by <Green b>35%</Green>
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBonuses }) => {
        calcItemBonuses.push({
          ids: "ES.0",
          bonus: talentBuff([true, "pct_", [true, 1], 35]),
        });
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          After using Sacred Rite: Wolf's Swiftness, Cyno's <Green>Normal Attack SPD</Green> will be increased by{" "}
          <Green b>20%</Green> for 10s.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 20),
    },
    {
      index: 4,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Cyno's Normal Attacks hit opponents, his <Green>Electro DMG Bonus</Green> will increase by{" "}
          <Green b>10%</Green> for 4s. This effect can be triggered once every 0.1s. Max <Rose>5</Rose> stacks.
        </>
      ),
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "electro", (inputs[0] || 0) * 10, tracker);
      },
    },
  ],
};

export default Cyno as AppCharacter;
