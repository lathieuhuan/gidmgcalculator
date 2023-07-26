import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green, Lesser, Rose } from "@Src/pure-components";
import { applyPercent, round } from "@Src/utils";
import { finalTalentLv } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO } from "../constants";
import { checkAscs, exclBuff } from "../utils";

const HydroMC: DefaultAppCharacter = {
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
      desc: () => (
        <>
          When the Traveler's HP is higher than 50%, they will continuously lose HP and cause Dewdrop DMG to increase
          based on their HP.
        </>
      ),
      applyFinalBuff: ({ calcItemBuffs, char, partyData, totalAttr }) => {
        const level = finalTalentLv({ char, charData: HydroMC as AppCharacter, talentType: "ES", partyData });
        const multiplier = round(0.64 * TALENT_LV_MULTIPLIERS[2][level], 2);
        const desc = `Suffusion / ${multiplier}% of ${totalAttr.hp} HP`;
        calcItemBuffs.push(exclBuff(desc, "ES.1", "flat", applyPercent(totalAttr.hp, multiplier)));
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      desc: () => (
        <>
          If HP has been consumed via Suffusion [~ES], increases the <Green>Torrent Surge DMG</Green> by{" "}
          <Green b>45%</Green> of the <Green>total HP consumed</Green>. The maximum DMG Bonus that can be gained this
          way is <Rose>5,000</Rose>.{" "}
          <Lesser>
            HP comsumed will be calculated based on "Suffusion time". "HP consumed" is manually input and should be used
            when Max HP changes while holding. Set "Suffusion time" to 0 to use "HP consumed".
          </Lesser>
        </>
      ),
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
        calcItemBuffs.push(exclBuff(desc, "ES.0", "flat", buffValue));
      },
    },
  ],
};

export default HydroMC as AppCharacter;
