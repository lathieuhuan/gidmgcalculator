import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { EModSrc } from "../constants";
import { checkCons, exclBuff } from "../utils";

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
  innateBuffs: [
    {
      src: EModSrc.C6,
      desc: () => (
        <>
          Each point of Sayu's <Green>Elemental Mastery</Green> will:
          <br />• Increases <Green>Daruma DMG</Green> by <Green b>0.2%</Green> <Green>ATK</Green>, up to{" "}
          <Rose>400%</Rose> ATK.
          <br />• Increases <Green>HP restored</Green> by Daruma by <Green b>3</Green>, up to <Rose>6,000</Rose>{" "}
          additional HP.
        </>
      ),
      isGranted: checkCons[6],
      applyFinalBuff: ({ totalAttr, calcItemBuffs }) => {
        const buffValue = Math.min(totalAttr.em, 2000);

        calcItemBuffs.push(
          exclBuff(EModSrc.C6, "EB.0", "mult_", buffValue * 0.2),
          exclBuff(EModSrc.C6, "EB.1", "flat", buffValue * 3)
        );
      },
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Yoohoo Art: Fuuin Dash [ES] gains the following effects:
          <br />• <Green>Press Kick DMG</Green> increased by <Green b>3.3%</Green>.
          <br />• <Green>Hold Kick DMG</Green> increased by <Green b>3.3%</Green> for every 0.5s Sayu in Fuufuu
          Windwheel state, up to <Rose>66%</Rose>.
        </>
      ),
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
          exclBuff(EModSrc.C2, "ES.0", "pct_", 3.3),
          exclBuff(EModSrc.C2, ["ES.1", "ES.2"], "pct_", 3.3 * Math.floor((inputs[0] || 0) / 0.5))
        );
      },
    },
  ],
};

export default Sayu as AppCharacter;
