import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { Green, Lightgold } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, TRAVELER_INFO } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const ElectroMC: DefaultAppCharacter = {
  code: 46,
  name: "Electro Traveler",
  ...TRAVELER_INFO,
  vision: "electro",
  EBcost: 80,
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.ONE_UNIT,
      desc: () => (
        <>
          Increases <Green>Energy Recharge</Green> during the Abundance Amulet's duration.
          <br />• At <Lightgold>A4</Lightgold>, increases the bonus by <Green b>10%</Green> of the Traveler's{" "}
          <Green>Energy Recharge</Green>.
        </>
      ),
      inputConfigs: [
        { label: "A4 Passive", type: "check", for: "teammate" },
        { label: "Energy Recharge", type: "text", initialValue: 100, max: 999, for: "teammate" },
      ],
      applyBuff: ({ totalAttr, char, inputs, toSelf, desc, tracker }) => {
        let buffValue = 20;
        const boosted = toSelf ? checkAscs[4](char) : inputs[0] === 1;

        if (boosted) {
          const ER = toSelf ? totalAttr.er_ : inputs[1] || 0;
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
      desc: () => (
        <>
          When Falling Thunder created by Bellowing Thunder hits an opponent, it will decrease their{" "}
          <Green>Electro RES</Green> by <Green b>15%</Green> for 8s.
        </>
      ),
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "electro", 15),
    },
  ],
};

export default ElectroMC as AppCharacter;
