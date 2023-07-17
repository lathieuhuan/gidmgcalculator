import type { CharInfo, AppCharacter, DefaultAppCharacter, ModifierInput, PartyData } from "@Src/types";
import { Cryo, Green, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { NCPA_PERCENTS } from "@Data/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc } from "../constants";
import { applyPercent, round } from "@Src/utils";
import { finalTalentLv, applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const getEBDebuffValue = (fromSelf: boolean, char: CharInfo, inputs: ModifierInput[], partyData: PartyData) => {
  const level = fromSelf
    ? finalTalentLv({ char, charData: Shenhe as AppCharacter, talentType: "EB", partyData })
    : inputs[0] || 0;
  return level ? Math.min(5 + level, 15) : 0;
};

const Shenhe: DefaultAppCharacter = {
  code: 47,
  name: "Shenhe",
  icon: "a/af/Shenhe_Icon",
  sideIcon: "3/31/Shenhe_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 80,
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          When Normal, Charged and Plunging Attacks, Elemental Skills, and Elemental Bursts deal <Cryo>Cryo</Cryo>{" "}
          <Green>DMG</Green> the DMG dealt is increased based on Shenhe's <Green>current ATK</Green>.
        </>
      ),
      inputConfigs: [
        { label: "Current ATK", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Skill Level", type: "level", for: "teammate" },
      ],
      applyFinalBuff: (obj) => {
        const { toSelf, inputs, attElmtBonus } = obj;
        const ATK = toSelf ? obj.totalAttr.atk : inputs[0] || 0;
        const level = toSelf
          ? finalTalentLv({ ...obj, charData: Shenhe as AppCharacter, talentType: "ES" })
          : inputs[1] || 1;
        const mult = 45.66 * TALENT_LV_MULTIPLIERS[2][level];
        const finalDesc = obj.desc + ` / Lv. ${level} / ${round(mult, 2)}% of ${ATK} ATK`;

        applyModifier(finalDesc, attElmtBonus, "cryo.flat", applyPercent(ATK, mult), obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          An active character within Divine Maiden's Deliverance [EB] field gain <Green b>15%</Green>{" "}
          <Green>Cryo DMG Bonus</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "cryo", 15),
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      desc: ({ inputs }) => (
        <>
          After Shenhe uses Spring Spirit Summoning, she will grant all nearby party members the following effects:
          <br />
          <span className={inputs[0] ? "" : "opacity-50"}>
            • Press: <Green>Elemental Skill and Elemental Burst DMG</Green> increased by <Green b>15%</Green> for 10s.
          </span>
          <br />
          <span className={inputs[1] ? "" : "opacity-50"}>
            • Hold: <Green>Normal, Charged and Plunging Attack DMG</Green> increased by <Green b>15%</Green> for 15s.
          </span>
        </>
      ),
      isGranted: checkAscs[4],
      inputConfigs: [
        { label: "Press", type: "check", initialValue: 1 },
        { label: "Hold", type: "check", initialValue: 0 },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        if (inputs[0] === 1) {
          applyModifier(desc + " / Press", attPattBonus, ["ES.pct_", "EB.pct_"], 15, tracker);
        }
        if (inputs[1] === 1) {
          applyModifier(desc + " / Hold", attPattBonus, [...NCPA_PERCENTS], 15, tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          Active characters within Divine Maiden's Deliverance's field deal <Green b>15%</Green> increased{" "}
          <Cryo>Cryo</Cryo> <Green>CRIT DMG</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attElmtBonus", "cryo.cDmg_", 15),
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Every time a character triggers Icy Quill's DMG Bonus, Shenhe will gain a Skyfrost Mantra stack for 60s. Each
          stack increases her next Spring Spirit Summoning <Green>[ES] DMG</Green> by <Green b>5%</Green>. Maximum{" "}
          <Rose>50</Rose> stacks.
        </>
      ),
      isGranted: checkCons[4],
      inputConfigs: [
        {
          label: "Stacks",
          type: "text",
          max: 50,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", 5 * (inputs[0] || 0), tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.EB,
      desc: ({ fromSelf, char, inputs, partyData }) => (
        <>
          The field decreases opponents' <Green>Cryo RES</Green> and <Green>Physical RES</Green> by{" "}
          <Green b>{getEBDebuffValue(fromSelf, char, inputs, partyData)}%</Green>.
        </>
      ),
      inputConfigs: [
        {
          label: "Elemental Burst Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyDebuff: ({ fromSelf, resistReduct, inputs, char, partyData, desc, tracker }) => {
        const pntValue = getEBDebuffValue(fromSelf, char, inputs, partyData);
        applyModifier(desc, resistReduct, ["phys", "cryo"], pntValue, tracker);
      },
    },
  ],
};

export default Shenhe as AppCharacter;
