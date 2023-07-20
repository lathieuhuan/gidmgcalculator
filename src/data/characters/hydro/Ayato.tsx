import type { AppCharacter, CharInfo, DefaultAppCharacter, ModifierInput, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green, Hydro, Lightgold } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, exclBuff } from "../utils";

const getEBBuffValue = (toSelf: boolean, char: CharInfo, partyData: PartyData, inputs: ModifierInput[]) => {
  const level = toSelf
    ? finalTalentLv({ char, charData: Ayato as AppCharacter, talentType: "EB", partyData })
    : inputs[0] || 1;
  return level ? Math.min(level + 10, 20) : 0;
};

const Ayato: DefaultAppCharacter = {
  code: 50,
  name: "Ayato",
  GOOD: "KamisatoAyato",
  icon: "2/27/Kamisato_Ayato_Icon",
  sideIcon: "2/2c/Kamisato_Ayato_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 80,
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          • Converts his Normal Attack DMG into AoE <Hydro>Hydro DMG</Hydro> (Shunsuiken) that cannot be overridden.
          <br />• On hit, Shunsuikens grant Ayato Namisen stacks which increase <Green>Shunsuiken DMG</Green> based on
          his <Green>current Max HP</Green>.
          <br />• At <Lightgold>C2</Lightgold>, Ayato's <Green>Max HP</Green> is increased by <Green b>50%</Green> when
          he has at least 3 Namisen stacks.
        </>
      ),
      inputConfigs: [
        {
          label: "Namisen stacks",
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ char, totalAttr, inputs, desc, tracker }) => {
        if (checkCons[2](char) && (inputs[0] || 0) >= 3) {
          applyModifier(desc, totalAttr, "hp_", 50, tracker);
        }
      },
      applyFinalBuff: ({ char, totalAttr, calcItemBuffs, inputs, partyData }) => {
        const level = finalTalentLv({
          char,
          charData: Ayato as AppCharacter,
          talentType: "ES",
          partyData,
        });
        const finalMult = 0.56 * (inputs[0] || 0) * TALENT_LV_MULTIPLIERS[7][level];

        calcItemBuffs.push(
          exclBuff(EModSrc.ES, ["ES.0", "ES.1", "ES.2"], "flat", applyPercent(totalAttr.hp, finalMult))
        );
      },
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.ACTIVE_UNIT,
      desc: ({ toSelf, char, partyData, inputs }) => (
        <>
          Increases the <Green>Normal Attack DMG</Green> of characters within its AoE by{" "}
          <Green b>{getEBBuffValue(toSelf, char, partyData, inputs)}%</Green>.
        </>
      ),
      inputConfigs: [
        {
          label: "Elemental Burst Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: ({ toSelf, char, partyData, inputs, attPattBonus, desc, tracker }) => {
        const buffValue = getEBBuffValue(toSelf, char, partyData, inputs);
        applyModifier(desc, attPattBonus, "NA.pct_", buffValue, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          <Green>Shunsuiken DMG</Green> is increased by <Green b>40%</Green> against opponents with 50% HP or less.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.C1, ["ES.0", "ES.1", "ES.2", "ES.3"], "pct_", 40));
      },
    },
    {
      index: 5,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          After using Kamisato Art: Suiyuu [EB], all nearby party members will have <Green b>15%</Green> increased{" "}
          <Green>Normal Attack SPD</Green> for 15s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 15),
    },
  ],
};

export default Ayato as AppCharacter;
