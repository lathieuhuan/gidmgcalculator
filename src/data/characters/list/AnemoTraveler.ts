import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { VISION_TYPES } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO } from "../constants";
import { checkCons } from "../utils";

const AnemoTraveler: DefaultAppCharacter = {
  code: 1,
  name: "Anemo Traveler",
  ...TRAVELER_INFO,
  vision: "anemo",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.C2,
      description: `Increases {Energy Recharge}#[k] by {16%}#[v].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "er_", 16),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C6,
      description: `Gust Surge [EB] decreases targets' {Anemo RES}#[k] by {20%}#[v]. Also decreases {RES}#[k] towards the
      {absorbed Element}#[k] (if any) by {20%}#[v].`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          label: "Element absorbed",
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

export default AnemoTraveler as AppCharacter;
