import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { EModSrc } from "../constants";
import { checkCons, genExclusiveBuff } from "../utils";

const Sayu: DefaultAppCharacter = {
  code: 36,
  name: "Sayu",
  icon: "2/22/Sayu_Icon",
  sideIcon: "7/7d/Sayu_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "anemo",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.C6,
      description: `Each point of Sayu's {Elemental Mastery}#[gr] will:
      <br />• Increases {Daruma DMG}#[gr] by {0.2%}#[b,gr] {ATK}#[gr], up to {400%}#[r].
      <br />• Increases {HP restored}#[gr] by Daruma by {3}#[b,gr], up to {6,000}#[r] additional HP.`,
      isGranted: checkCons[6],
      applyFinalBuff: ({ totalAttr, calcItemBuffs }) => {
        const buffValue = Math.min(totalAttr.em, 2000);
        calcItemBuffs.push(
          genExclusiveBuff(EModSrc.C6, "EB.0", "mult_", buffValue * 0.2),
          genExclusiveBuff(EModSrc.C6, "EB.1", "flat", buffValue * 3)
        );
      },
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `Yoohoo Art: Fuuin Dash [ES] gains the following effects:
      <br />• {Press Kick DMG}#[gr] increased by {3.3%}#[b,gr].
      <br />• {Hold Kick DMG}#[gr] increased by {3.3%}#[b,gr] for every 0.5s Sayu in Fuufuu Windwheel state, up to
      {66%}#[r].`,
      isGranted: checkCons[2],
      inputConfigs: [
        {
          label: "Seconds (max. 10)",
          type: "text",
          max: 10,
        },
      ],
      applyBuff: ({ inputs, calcItemBuffs }) => {
        calcItemBuffs.push(
          genExclusiveBuff(EModSrc.C2, "ES.0", "pct_", 3.3),
          genExclusiveBuff(EModSrc.C2, "ES.1", "pct_", 3.3 * Math.floor((inputs[0] || 0) / 0.5))
        );
      },
    },
  ],
};

export default Sayu as AppCharacter;
