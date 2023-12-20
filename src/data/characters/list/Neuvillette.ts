import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Neuvillette: DefaultAppCharacter = {
  code: 77,
  name: "Neuvillette",
  icon: "https://images2.imgbox.com/ae/d2/PqXhvc16_o.png",
  sideIcon: "",
  rarity: 5,
  nation: "fontaine",
  vision: "hydro",
  weaponType: "catalyst",
  EBcost: 70,
  talentLvBonusAtCons: {
    NAs: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
      description: `When a party member triggers a hydro-related reaction, Neuvillette obtains 1 stack of Past Draconic
      Glories for 30s. Max 3 stacks. The effect increases Charged Attack: {Equitable Judgment DMG}#[k] by
      {1.1}#[v]/{1.25}#[v]/{1.6}#[v] times.
      <br/>• At {C2}#[ms], each stack also increases {Equitable Judgment CRIT DMG}#[k] by {14%}#[v].`,
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: (obj) => {
        const stacks = obj.inputs[0] || 0;
        const buffValue = [10, 25, 60][stacks - 1] || 0;

        obj.calcItemBuffs.push(genExclusiveBuff(obj.desc, "CA.0", "multPlus", buffValue));

        if (checkCons[2](obj.char)) {
          obj.calcItemBuffs.push(genExclusiveBuff(obj.desc, "CA.0", "cDmg_", 14 * stacks));
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      description: `For each {1%}#[k] of Neuvillette's {HP}#[k] over 30%, he will gain {0.6%}#[v]
      {Hydro DMG Bonus}#[k], upto {30%}#[m].`,
      inputConfigs: [
        {
          label: "Current HP%",
          type: "text",
          initialValue: 100,
          max: 100,
        },
      ],
      applyBuff: (obj) => {
        const stacks = (obj.inputs[0] || 0) - 30;
        const buffValue = Math.max(Math.min(stacks * 0.6, 30), 0);
        applyModifier(obj.desc, obj.totalAttr, "hydro", buffValue, obj.tracker);
      },
    },
  ],
};

export default Neuvillette as AppCharacter;
