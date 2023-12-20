import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { countVision, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff, getTalentMultiplier } from "../utils";

const getPropSurplusValue = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "ES", root: 53.2 }, Lyney as AppCharacter, args);
};

const Lyney: DefaultAppCharacter = {
  code: 73,
  name: "Lyney",
  icon: "b/b2/Lyney_Icon",
  sideIcon: "6/6a/Lyney_Side_Icon",
  rarity: 5,
  nation: "fontaine",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(getPropSurplusValue(args)[1], 2)}%`],
  buffs: [
    {
      index: 0,
      src: "Prop Surplus",
      affect: EModAffect.SELF,
      description: `Each stack increases Bewildering Lights {[ES] DMG}#[k] by {@0}#[v] of {ATK}#[k].`,
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: (obj) => {
        const buffValue = getPropSurplusValue(obj)[1] * (obj.inputs[0] || 0);
        applyModifier(obj.desc, obj.attPattBonus, "ES.mult_", buffValue, obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `If Lyney consumes HP via firing a Prop Arrow, the Grin-Malkin Hat summoned will deal {80%}#[v]
      more {ATK}#[k] as DMG.`,
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.A1, "CA.0", "mult_", 80));
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      description: `When dealing DMG to opponents affected by Pyro, Lyney will receive {60%}#[v] {DMG Bonus}#[k].
      Each Pyro party member other than Lyney will increase the bonus by {20%}#[v], upto {100%}#[m].`,
      isGranted: checkAscs[4],
      applyBuff: ({ attPattBonus, partyData, desc, tracker }) => {
        const { pyro = 0 } = countVision(partyData);
        const buffValue = Math.min(60 + pyro * 20, 100);
        applyModifier(desc, attPattBonus, "all.pct_", buffValue, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When Lyney is on the field, he will gain {20%}#[v] {CRIT DMG}#[k] every 2s. Max {3}#[m] stacks.
      This effect is canceled when Lyney leaves the field.`,
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
      description: `Lyney's {Pyro}#[pyro] Charged Attacks decreases opponent's {Pyro RES}#[k] by {20%}#[v] for 6s.`,
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "pyro", 20),
    },
  ],
};

export default Lyney as AppCharacter;
