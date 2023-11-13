import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { countVision } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Navia: DefaultAppCharacter = {
  code: 80,
  name: "Navia",
  icon: "",
  sideIcon: "",
  rarity: 5,
  nation: "fontaine",
  vision: "geo",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      description: `Each Pyro/Electro/Cryo/Hydro party member increases Navia {ATK}#[k] by {20%}#[v], upto {2}#[m] times.`,
      applyBuff: (obj) => {
        const { pyro = 0, electro = 0, cryo = 0, hydro = 0 } = countVision(obj.partyData);
        const buffValue = Math.min((pyro + electro + cryo + hydro) * 20, 40);
        applyModifier(obj.desc, obj.totalAttr, "atk_", buffValue, obj.tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `When 0/1/2/3 or more Crystal Shrapnel charges consumed, 5/7/9/11 Rosula Shardshots will be fired.
      The more shardshots that hit a single target, the greater the DMG dealt to them. Every charge consumed beyond 3
      will increase {DMG}#[k] by {15%}#[v].
      <br />• At {C2}#[ms], each charge consumed increases the Ceremonial Crystalshot's {CRIT Rate}#[k] by {8%}#[v],
      upto {24%}#[m].
      <br />• At {C6}#[ms], each charge consumed beyond 3 will increase Ceremonial Crystalshot's {CRIT DMG}#[k] by
      {35%}#[v].
      <br>{If you leave "Rosula Shardshots hit" at 0, it will be set to max according to "Crystal Shrapnel consumed."}#[n]`,
      inputConfigs: [
        {
          type: "stacks",
          label: "Crystal Shrapnel consumed",
          initialValue: 0,
          max: 6,
        },
        {
          type: "text",
          label: "Rosula Shardshots hit",
          initialValue: 0,
          max: 11,
        },
      ],
      applyBuff: (obj) => {
        const charges = obj.inputs[0] ?? 0;
        const shotsHit = obj.inputs[1] || ([5, 7, 9, 11][charges] ?? 11);
        const multPlus = [0, 0, 5, 10, 15, 20, 36, 40, 60, 66.6, 90, 100][shotsHit] ?? 0;
        if (multPlus) {
          obj.calcItemBuffs.push(genExclusiveBuff(obj.desc, "ES.0", "multPlus", multPlus));
        }
        const chargesBeyond = charges - 3;
        if (charges > 3) {
          obj.calcItemBuffs.push(genExclusiveBuff(obj.desc, "ES.0", "mult_", chargesBeyond * 15));
        }
        if (checkCons[2](obj.char)) {
          applyModifier(EModSrc.C2, obj.attPattBonus, "ES.cRate_", Math.min(charges * 8, 24), obj.tracker);
        }
        if (checkCons[6](obj.char)) {
          obj.calcItemBuffs.push(genExclusiveBuff(EModSrc.C6, "ES.0", "cDmg_", chargesBeyond * 35));
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      isGranted: checkAscs[1],
      description: `For 4s after using Ceremonial Crystalshot [ES], Navia gains {Geo Infusion}#[geo] and {40%}#[v]
      {Normal, Changed, and Plunging Attack DMG Bonus}#[k].`,
      infuseConfig: {
        overwritable: false,
      },
      applyBuff: makeModApplier("attPattBonus", ["NA.pct_", "CA.pct_", "PA.pct_"], 40),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      isGranted: checkCons[4],
      description: `As the Sunlit Sky's Singing Salute [EB] attacks decrease opponent's {Geo RES}#[k] by {20%}#[v]
      for 8s.`,
      applyDebuff: makeModApplier("resistReduct", "geo", 20),
    },
  ],
};

export default Navia as AppCharacter;
