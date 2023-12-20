import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, getTalentMultiplier } from "../utils";

const Noelle: DefaultAppCharacter = {
  code: 14,
  name: "Noelle",
  icon: "8/8e/Noelle_Icon",
  sideIcon: "1/15/Noelle_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "geo",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.C2,
      description: `Increases her {Charged Attack DMG}#[k] by {15%}#[v].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", "CA.pct_", 15),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `• Grants Noelle a {Geo Infusion}#[geo] that cannot be overridden.
      <br />• Increases Noelle's {ATK}#[k] based on her {DEF}#[k]. At {C6}#[ms], the multipler bonus is increased by
      {50%}#[v].`,
      applyFinalBuff: (obj) => {
        let [level, mult] = getTalentMultiplier({ talentType: "EB", root: 40 }, Noelle as AppCharacter, obj);
        let description = obj.desc + ` Lv.${level}`;

        if (checkCons[6](obj.char)) {
          mult += 50;
          description += ` + ${EModSrc.C6}`;
        }
        description += ` / ${round(mult, 2)}% of DEF`;
        const buffValue = applyPercent(obj.totalAttr.def, mult);

        applyModifier(description, obj.totalAttr, "atk", buffValue, obj.tracker);
      },
      infuseConfig: {
        overwritable: false,
      },
    },
  ],
};

export default Noelle as AppCharacter;
