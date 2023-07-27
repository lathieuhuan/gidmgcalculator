import type { AppCharacter, CharInfo, DefaultAppCharacter, ModifierInput, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Anemo, Green, Lightgold } from "@Src/pure-components";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

interface GetWindGiftBuffValueArgs {
  toSelf: boolean;
  inputs: ModifierInput[];
  char: CharInfo;
  partyData: PartyData;
}
const getWindGiftBuffValue = ({ toSelf, inputs, char, partyData }: GetWindGiftBuffValueArgs) => {
  const level = toSelf
    ? finalTalentLv({ char, charData: Faruzan as AppCharacter, talentType: "EB", partyData })
    : inputs[0] || 0;
  return level ? round(18 * TALENT_LV_MULTIPLIERS[2][level], 1) : 0;
};

const Faruzan: DefaultAppCharacter = {
  code: 64,
  name: "Faruzan",
  icon: "b/b2/Faruzan_Icon",
  sideIcon: "c/c1/Faruzan_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "anemo",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: "Prayerful Wind's Benefit",
      affect: EModAffect.PARTY,
      desc: (args) => {
        return (
          <>
            Increases <Green>Anemo DMG Bonus</Green> to all nearby characters by{" "}
            <Green b>{getWindGiftBuffValue(args)}%</Green>.
            <br />• At <Lightgold>A4</Lightgold>, increases <Anemo>Anemo DMG</Anemo> based on <Green b>32%</Green> of
            Faruzan's <Green>Base ATK</Green>.
            <br />• At <Lightgold>C6</Lightgold>, increases <Anemo>Anemo</Anemo> <Green>CRIT DMG</Green> by{" "}
            <Green b>40%</Green>.
          </>
        );
      },
      inputConfigs: [
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: "Ascension 4", type: "check", for: "teammate" },
        { label: "Base ATK (A4)", type: "text", max: 9999, for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: ({ totalAttr, desc, tracker, ...rest }) => {
        applyModifier(desc, totalAttr, "anemo", getWindGiftBuffValue(rest), tracker);
      },
      applyFinalBuff: ({ toSelf, char, totalAttr, inputs, attElmtBonus, partyData, desc, tracker }) => {
        if (toSelf ? checkAscs[4](char) : inputs[1]) {
          const ATK = toSelf ? totalAttr.base_atk : inputs[2] || 0;
          const level = toSelf
            ? finalTalentLv({ char, charData: Faruzan as AppCharacter, talentType: "EB", partyData })
            : inputs[0] || 1;
          const mult = 32;
          const finalDesc = desc + ` / Lv. ${level} / ${mult}% of ${ATK} Base ATK`;

          applyModifier(finalDesc, attElmtBonus, "anemo.flat", applyPercent(ATK, mult), tracker);
        }
        if (toSelf ? checkCons[6](char) : inputs[3]) {
          const descC6 = `${toSelf ? "Self" : "Faruzan"} / ${EModSrc.C6}`;
          applyModifier(descC6, attElmtBonus, "anemo.cDmg_", 40, tracker);
        }
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: "Perfidious Wind's Bale",
      desc: () => (
        <>
          Decreases opponents' <Green>Anemo RES</Green> by <Green b>30%</Green>.
        </>
      ),
      applyDebuff: makeModApplier("resistReduct", "anemo", 30),
    },
  ],
};

export default Faruzan as AppCharacter;
