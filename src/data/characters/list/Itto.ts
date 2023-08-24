import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff, getTalentMultiplier } from "../utils";

const Itto: DefaultAppCharacter = {
  code: 45,
  name: "Itto",
  icon: "7/7b/Arataki_Itto_Icon",
  sideIcon: "c/c8/Arataki_Itto_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "geo",
  weaponType: "claymore",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `{Arataki Kesagiri DMG}#[gr] is increased by {35%}#[b,gr] of Itto's {DEF}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.A4, "CA.0", "flat", applyPercent(totalAttr.def, 35)));
      },
    },
    {
      src: EModSrc.C6,
      description: `Itto's {Charged Attacks}#[gr] deal +{70%}#[b,gr] {CRIT DMG}#[gr].`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "CA.cDmg_", 70),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `• Grants Itto a {Geo Infusion}#[geo] that cannot be overridden.
      <br />• Increases Itto's {Normal Attack SPD}#[gr] by {10%}#[b,gr]. Also increases his {ATK}#[gr] based on his
      {DEF}#[gr].`,
      applyFinalBuff: (obj) => {
        const [level, mult] = getTalentMultiplier({ talentType: "EB", root: 57.6 }, Itto as AppCharacter, obj);
        const description = obj.desc + ` Lv.${level} / ${round(mult, 2)}% of DEF`;
        const buffValue = applyPercent(obj.totalAttr.def, mult);
        applyModifier(description, obj.totalAttr, ["atk", "naAtkSpd_"], [buffValue, 10], obj.tracker);
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      description: `When the Raging Oni King state [EB] ends, all nearby party members gain {20%}#[b,gr] {DEF}#[gr] and
      {20%}#[b,gr] {ATK}#[gr] for 10s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", ["def_", "atk_"], 20),
    },
  ],
};

export default Itto as AppCharacter;
