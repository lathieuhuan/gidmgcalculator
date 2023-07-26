import type { AppCharacter, CharInfo, DefaultAppCharacter, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green, Rose } from "@Src/pure-components";
import { applyPercent, countVision, round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const getPropSurplusValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({ char, charData: Lyney as AppCharacter, talentType: "ES", partyData });
  return round(53.2 * TALENT_LV_MULTIPLIERS[2][level], 2);
};

const Lyney: DefaultAppCharacter = {
  code: 73,
  name: "Lyney",
  icon: "https://images2.imgbox.com/0d/a5/ZREwNoes_o.png",
  sideIcon: "",
  rarity: 5,
  nation: "fontaine",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: "Prop Surplus",
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => (
        <>
          Each stack increases Bewildering Lights <Green>[ES] DMG</Green> by{" "}
          <Green b>{getPropSurplusValue(char, partyData)}% ATK</Green>.
        </>
      ),
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ attPattBonus, char, partyData, inputs, desc, tracker }) => {
        const buffValue = getPropSurplusValue(char, partyData) * (inputs[0] || 0);
        applyModifier(desc, attPattBonus, "ES.mult_", buffValue, tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          If Lyney consumes HP via firing a Prop Arrow, the Grin-Malkin Hat summoned will deal <Green b>80%</Green> more{" "}
          <Green>ATK</Green> as DMG.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.A1, "CA.0", "mult_", 80));
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When dealing DMG to opponents affected by Pyro, Lyney will receive the following buffs:
          <br />• <Green>Base ATK</Green> increased by <Green b>60%</Green>.
          <br />• Each Pyro party member other than Lyney will cause this effect to receive a further{" "}
          <Green b>20%</Green> bonus.
          <br />
          Lyney can gain a total of <Rose>100%</Rose> increased DMG to opponents affected by Pyro in this way.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: ({ totalAttr, partyData, desc, tracker }) => {
        const { pyro = 0 } = countVision(partyData);
        const percent = Math.min(60 + pyro * 20, 100);
        const buffValue = applyPercent(totalAttr.base_atk, percent);
        const finalDesc = desc + ` / ${percent}% of ${totalAttr.base_atk} Base ATK`;
        applyModifier(finalDesc, totalAttr, "base_atk", buffValue, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Lyney is on the field, he will gain a stack of Crisp Focus every 2s. This will increase his{" "}
          <Green>CRIT DMG</Green> by <Green>20%</Green>. Max <Rose>3</Rose> stacks. This effect will be canceled when
          Lyney leaves the field.
        </>
      ),
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "cDmg_", (inputs[0] || 0) * 20, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          After an opponent is hit by Lyney's Pyro Charged Attack, this opponent's <Green>Pyro RES</Green> will be
          decreased by <Green b>20%</Green> for 6s.
        </>
      ),
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "pyro", 20),
    },
  ],
};

export default Lyney as AppCharacter;
