import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const getESBonus = (args: DescriptionSeedGetterArgs) => {
  const level = args.fromSelf
    ? finalTalentLv({ ...args, charData: Furina as AppCharacter, talentType: "EB" })
    : args.inputs[1];
  return {
    level,
    dmgBonusPerS: (5 + level * 2) / 100,
    inHealBonusPerS: level / 100,
  };
};

const Furina: DefaultAppCharacter = {
  code: 78,
  name: "Furina",
  icon: "e/e6/Furina_Icon",
  sideIcon: "0/0d/Furina_Side_Icon",
  rarity: 5,
  nation: "fontaine",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  dsGetters: [(args) => `${getESBonus(args).dmgBonusPerS}%`],
  innateBuffs: [
    {
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      description: `Every 1,000 points of Furina's Max HP will increase {Salon Member DMG}#[k] by {0.7%}#[v],
      upto {28%}#[m].`,
      applyFinalBuff: (obj) => {
        let bonusValue = (obj.totalAttr.hp / 1000) * 0.7;
        bonusValue = bonusValue > 28 ? 28 : round(bonusValue, 2);
        obj.calcItemBuffs.push(genExclusiveBuff(EModSrc.ES, "ES.0", "pct_", bonusValue));
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `When 1/2/3/4 nearby characters with more than 50% HP get their HP consumed by Salon Members, the
      members DMG will be increased by {1.1}#[v]/{1.2}#[v]/{1.3}#[v]/{1.4}#[v] times.`,
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: (obj) => {
        const stacks = obj.inputs[0] || 0;
        obj.calcItemBuffs.push(genExclusiveBuff(EModSrc.ES, "ES.0", "multPlus", stacks * 10));
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.PARTY,
      description: `Every 1% of a party member's HP changed will grant Furina 1 Fanfare point. Each point increases
      {@0}#[v] {DMG}#[k] of all party members. Max {300}#[m] points.
      <br/>At {C1}#[ms], gains {150}#[v] points by default (auto added) and the limit is increased by 100.`,
      inputConfigs: [
        {
          type: "text",
          label: "Fanfare (max 300)",
          max: 300,
        },
        {
          type: "level",
          label: "Elemental Burst level",
          for: "teammate",
        },
        {
          type: "check",
          label: "Constellation 1",
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        let stacks = obj.inputs[0] || 0;
        const { level, dmgBonusPerS, inHealBonusPerS } = getESBonus(obj);
        const atC1 = obj.fromSelf ? checkCons[1](obj.char) : obj.inputs[2];
        if (atC1) {
          stacks = Math.min(stacks + 150, 400);
        }
        const xtraDesc = ` Lv.${level}${atC1 ? " + C1" : ""}`;
        const dmgDesc = `${xtraDesc} / ${dmgBonusPerS}% per stack / ${stacks} stacks`;
        applyModifier(obj.desc + dmgDesc, obj.attPattBonus, "all.pct_", dmgBonusPerS * stacks, obj.tracker);
        const healDesc = `${xtraDesc} / ${inHealBonusPerS}% per stack / ${stacks} stacks`;
        applyModifier(obj.desc + healDesc, obj.totalAttr, "inHealB_", inHealBonusPerS * stacks, obj.tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `Fanfare gain (not by C1) is increased by 250%. Each Fanfare point above the limit (400) will
      increase Furina's {Max HP}#[k] by {0.35%}#[v], upto {140%}#[m].`,
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "text",
          label: "Fanfare above limit",
          max: 9999,
        },
      ],
      applyBuff: (obj) => {
        const bonusValue = Math.min((obj.inputs[0] || 0) * 0.35, 140);
        applyModifier(obj.desc, obj.totalAttr, "hp_", bonusValue, obj.tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `When using Salon Solitaire [ES] Furina gains "Center of Attention" for 10s. Grants a Hydro
      Infusion and increases {Normal, Charged, and Plunging Attack DMG}#[k] by {18%}#[v] of Furina
      {Max HP}#[k]. At Pneuma alignment this bonus is increased further by {25%}#[v] of her {Max HP}#[k].`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "check",
          label: "Pneuma alignment",
        },
      ],
      applyFinalBuff: (obj) => {
        const bonusValue = Math.round((obj.totalAttr.hp * (obj.inputs[0] ? 43 : 18)) / 100);
        applyModifier(obj.desc, obj.attPattBonus, ["NA.flat", "CA.flat", "PA.flat"], bonusValue, obj.tracker);
      },
      infuseConfig: { overwritable: false },
    },
  ],
};

export default Furina as AppCharacter;
