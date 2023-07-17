import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { Green, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc } from "../constants";
import { checkCons, talentBuff } from "../utils";

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
      applyFinalBuff: ({ char, totalAttr, calcItemBonuses }) => {
        const buffValue = Math.min(totalAttr.em, 2000);
        const isValid = checkCons[6](char);

        calcItemBonuses.push(
          {
            ids: "EB.0",
            bonus: talentBuff([isValid, "mult_", [false, 6], buffValue * 0.2]),
          },
          {
            ids: "EB.1",
            bonus: talentBuff([isValid, "flat", [false, 6], buffValue * 3]),
          }
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
      applyBuff: ({ inputs, calcItemBonuses }) => {
        calcItemBonuses.push(
          {
            ids: "ES.0",
            bonus: talentBuff([true, "pct_", [false, 2], 3.3]),
          },
          {
            ids: ["ES.1", "ES.2"],
            bonus: talentBuff([true, "pct_", [false, 2], 3.3 * Math.floor((inputs[0] || 0) / 0.5)]),
          }
        );
      },
    },
  ],
};

export default Sayu as AppCharacter;
