import type { CharInfo, AppCharacter, DefaultAppCharacter, ModifierInput } from "@Src/types";
import { Green, Lightgold, Red, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc } from "../constants";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

interface DetectorBuffValueArgs {
  toSelf: boolean;
  char: CharInfo;
  inputs: ModifierInput[];
}
const detectorBuff = ({ toSelf, char, inputs }: DetectorBuffValueArgs) => {
  let maxStacks = 5;

  if (toSelf) {
    if (!checkAscs[4](char)) maxStacks--;
    if (!checkCons[6](char)) maxStacks--;
  }
  return {
    value: Math.min(toSelf ? inputs[0] || 0 : inputs[1] || 0, maxStacks) * 10,
    maxStacks,
  };
};

const Mika: DefaultAppCharacter = {
  code: 67,
  name: "Mika",
  icon: "d/dd/Mika_Icon",
  sideIcon: "8/84/Mika_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 70,
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.ACTIVE_UNIT,
      desc: (obj) => (
        <>
          Grants nearby active characters Soulwind, increasing their ATK SPD.
          <br />• At <Lightgold>A1</Lightgold>, Soulwind can grant characters the Detector effect, increasing their{" "}
          <Green>Physical DMG</Green> by <Green>10%</Green> each stack. Max <Rose>3</Rose> stacks.
          <br />• At <Lightgold>A4</Lightgold>, the maximum number of <Green>stacks</Green> is increased by{" "}
          <Green>1</Green>.
          <br />• At <Lightgold>C6</Lightgold>, the maximum number of <Green>stacks</Green> is increased by{" "}
          <Green>1</Green>. Grants <Green b>60%</Green> <Green>Physical CRIT DMG</Green> bonus.
          {obj.toSelf && (
            <>
              <br />
              <Red>--- Max Detector stacks: {checkAscs[1](obj.char) ? detectorBuff(obj).maxStacks : 0} ---</Red>
            </>
          )}
        </>
      ),
      inputConfigs: [
        { label: "Elemental Skill Level", type: "level", for: "teammate" },
        { label: "Detector stacks (A1)", type: "select", initialValue: 0, max: 5 },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: ({ toSelf, char, totalAttr, attElmtBonus, inputs, partyData, desc, tracker }) => {
        const level = toSelf
          ? finalTalentLv({ char, charData: Mika as AppCharacter, talentType: "ES", partyData })
          : inputs[0] || 0;
        const buffValue = level ? Math.min(12 + level, 25) : 0;
        applyModifier(desc, totalAttr, "naAtkSpd_", buffValue, tracker);

        if (!toSelf || checkAscs[1](char)) {
          const buffValue = detectorBuff({ toSelf, char, inputs }).value;
          applyModifier(desc + ` + ${EModSrc.A1}`, totalAttr, "phys", buffValue, tracker);
        }
        if ((toSelf && checkCons[6](char)) || (!toSelf && inputs[2])) {
          applyModifier(desc + ` + ${EModSrc.C6}`, attElmtBonus, "phys.cDmg_", 60, tracker);
        }
      },
    },
  ],
};

export default Mika as AppCharacter;
