import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent, round } from "@Src/utils";
import { EModSrc, TRAVELER_INFO } from "../constants";
import { checkAscs, genExclusiveBuff, getTalentMultiplier } from "../utils";

const HydroTraveler: DefaultAppCharacter = {
  code: 75,
  name: "Hydro Traveler",
  ...TRAVELER_INFO,
  vision: "hydro",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: "Suffusion [~ES]",
      affect: EModAffect.SELF,
      description: `When the Traveler's HP is higher than 50%, they will continuously lose HP and cause
      {Dewdrop DMG}#[gr] to increase based on their {HP}#[gr].`,
      applyFinalBuff: (obj) => {
        const [level, mult] = getTalentMultiplier({ talentType: "ES", root: 2 }, HydroTraveler as AppCharacter, obj);
        const buffValue = applyPercent(obj.totalAttr.hp, mult);
        const description = `Suffusion Lv.${level} / ${round(mult, 2)}% of Max HP`;
        obj.calcItemBuffs.push(genExclusiveBuff(description, "ES.1", "flat", buffValue));
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      description: `If HP has been consumed via Suffusion [~ES], increases the {Torrent Surge DMG}#[gr] by {45%}#[b,gr]
      of the {total HP consumed}#[gr]. The maximum DMG Bonus that can be gained this way is {5,000}#[r].
      <br />{HP comsumed will be calculated based on "Suffusion time". "HP consumed" can be manually input and should be used when Max HP changes while holding. Set "Suffusion time" to 0 to use "HP consumed".}#[l]`,
      inputConfigs: [
        {
          type: "stacks",
          label: "Suffusion time (max 6s)",
          initialValue: 0,
          max: 6,
        },
        {
          type: "text",
          label: "HP consumed",
          max: 99999,
        },
      ],
      applyFinalBuff: ({ calcItemBuffs, inputs, totalAttr }) => {
        const multiplier = 45;
        const stacks = inputs[0] || 0;
        const consumedHP = stacks ? stacks * applyPercent(totalAttr.hp, 4) : inputs[1] || 0;
        let buffValue = applyPercent(consumedHP, multiplier);
        let desc = `${EModSrc.A4} / ${multiplier}% of ${consumedHP} HP consumed`;
        if (buffValue > 5000) {
          buffValue = 5000;
          desc += " / limit to 5000";
        }
        calcItemBuffs.push(genExclusiveBuff(desc, "ES.0", "flat", buffValue));
      },
    },
  ],
};

export default HydroTraveler as AppCharacter;
