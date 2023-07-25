import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Dendro, Green, Lightgold, Rose } from "@Src/pure-components";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getEBbuffValue = (level: number) => (level ? round(27.49 * TALENT_LV_MULTIPLIERS[2][level], 2) : 0);

const Kaveh: DefaultAppCharacter = {
  code: 69,
  name: "Kaveh",
  icon: "1/1f/Kaveh_Icon",
  sideIcon: "5/5e/Kaveh_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: (args) => {
        const level = finalTalentLv({ ...args, charData: Kaveh as AppCharacter, talentType: "EB" });
        return (
          <>
            • Grants <Dendro>Dendro Infusion</Dendro>.<br />• Increases Bloom DMG triggered by all party members by{" "}
            <Green b>{getEBbuffValue(level)}%</Green>.
            <br />• At <Lightgold>A4</Lightgold>, after Kaveh's Normal, Charged, and Plunging Attacks hit opponents, his{" "}
            <Green>Elemental Mastery</Green> will increase by <Green b>25</Green>. Max <Rose>4</Rose> stacks.
            <br />• At <Lightgold>C2</Lightgold>, within 3.5s after using Artistic Ingenuity [ES], Kaveh's Dendro RES
            and Incoming Healing Bonus will be increased by 50% and 25% respectively.
          </>
        );
      },
      inputConfigs: [
        {
          label: "A4 stacks",
          type: "stacks",
          initialValue: 0,
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, rxnBonus, char, partyData, inputs, desc, tracker }) => {
        const level = finalTalentLv({ char, charData: Kaveh as AppCharacter, talentType: "EB", partyData });
        applyModifier(desc, rxnBonus, "bloom.pct_", getEBbuffValue(level), tracker);

        if (checkAscs[4](char)) {
          const stacks = inputs[0];
          applyModifier(desc + ` / ${EModSrc.A4}`, totalAttr, "em", stacks * 25);
        }
        if (checkCons[2](char)) {
          applyModifier(desc + ` / ${EModSrc.C2}`, totalAttr, "naAtkSpd_", 15);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.TEAMMATE,
      desc: ({ inputs }) => (
        <>
          Increases Bloom DMG triggered by all party members by <Green b>{getEBbuffValue(inputs[0])}%</Green>.
        </>
      ),
      inputConfigs: [
        {
          label: "Elemental Burst level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: ({ rxnBonus, inputs, desc, tracker }) => {
        applyModifier(desc, rxnBonus, "bloom.pct_", getEBbuffValue(inputs[0]), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      isGranted: checkCons[4],
      desc: () => (
        <>
          Dendro Cores created from <Green>Bloom</Green> reactions Kaveh triggers will deal <Green b>60%</Green> more
          DMG when they burst.
        </>
      ),
      applyBuff: makeModApplier("rxnBonus", "bloom.pct_", 60),
    },
  ],
};

export default Kaveh as AppCharacter;
