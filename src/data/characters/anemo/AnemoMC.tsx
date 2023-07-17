import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { VISION_TYPES } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO } from "../constants";
import { checkCons } from "../utils";

const AnemoMC: DefaultAppCharacter = {
  code: 1,
  name: "Anemo Traveler",
  ...TRAVELER_INFO,
  vision: "anemo",
  EBcost: 60,
  innateBuffs: [
    {
      src: EModSrc.C2,
      desc: () => (
        <>
          Increases <Green>Energy Recharge</Green> by <Green b>16%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "er_", 16),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C6,
      desc: () => (
        <>
          Gust Surge [EB] decreases targets' <Green>Anemo RES</Green> by <Green b>20%</Green>. Also decreases{" "}
          <Green>RES</Green> towards the <Green>absorbed Element</Green> (if any) by <Green b>20%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      inputConfigs: [
        {
          label: "Element Absorbed",
          type: "anemoable",
        },
      ],
      applyDebuff: ({ resistReduct, inputs, desc, tracker }) => {
        const elmtIndex = inputs[0] || 0;
        applyModifier(desc, resistReduct, ["anemo", VISION_TYPES[elmtIndex]], 20, tracker);
      },
    },
  ],
};

export default AnemoMC as AppCharacter;
