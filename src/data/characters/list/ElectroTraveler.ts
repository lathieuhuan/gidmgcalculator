import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO } from "../constants";
import { checkAscs, checkCons } from "../utils";

const ElectroTraveler: DefaultAppCharacter = {
  code: 46,
  name: "Electro Traveler",
  ...TRAVELER_INFO,
  vision: "electro",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.ONE_UNIT,
      description: `Increases {Energy Recharge}#[k] during the Abundance Amulet's [~ES] duration.
      <br />• At {A4}#[ms], increases the bonus by {10%}#[v] of the Traveler's {Energy Recharge}#[k].`,
      inputConfigs: [
        { label: "A4 Passive", type: "check", for: "teammate" },
        { label: "Energy Recharge", type: "text", initialValue: 100, max: 999, for: "teammate" },
      ],
      applyBuff: ({ totalAttr, char, inputs, fromSelf, desc, tracker }) => {
        let buffValue = 20;
        const boosted = fromSelf ? checkAscs[4](char) : inputs[0] === 1;

        if (boosted) {
          const ER = fromSelf ? totalAttr.er_ : inputs[1] || 0;
          buffValue += Math.round(ER) / 10;
        }
        applyModifier(desc, totalAttr, "er_", buffValue, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `When Falling Thunder [~EB] hits an opponent, it will decrease their {Electro RES}#[k] by
      {15%}#[v] for 8s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "electro", 15),
    },
  ],
};

export default ElectroTraveler as AppCharacter;
