import type { CharInfo, AppCharacter, DefaultAppCharacter, ModifierInput, PartyData } from "@Src/types";
import { Cryo, Green, Lightgold, Red, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc } from "../constants";
import { round } from "@Src/utils";
import { finalTalentLv, applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs } from "../utils";

const getNApctBonus = (args: { char: CharInfo; partyData: PartyData; inputs: ModifierInput[] }) => {
  const level = finalTalentLv({
    char: args.char,
    charData: Aloy as AppCharacter,
    talentType: "ES",
    partyData: args.partyData,
  });
  let stacks = args.inputs[0] || 0;
  stacks = stacks === 4 ? 5 : stacks;
  return round(5.846 * TALENT_LV_MULTIPLIERS[5][level] * stacks, 2);
};

const Aloy: DefaultAppCharacter = {
  code: 39,
  name: "Aloy",
  icon: "e/e5/Aloy_Icon",
  sideIcon: "4/46/Aloy_Side_Icon",
  rarity: 5,
  nation: "outland",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 40,
  buffs: [
    {
      index: 0,
      src: "Coil stacks",
      affect: EModAffect.SELF,
      desc: (args) => (
        <>
          Increases Aloy's <Green>Normal Attack DMG</Green>. When she has 4 Coil stacks, all stacks are cleared. Aloy
          then enters the Rushing Ice state, which further increases her <Green>Normal Attack DMG</Green> and converts
          it to <Cryo>Cryo DMG</Cryo>. <Red>Total bonus: {getNApctBonus(args)}%.</Red>
          <br />• At <Lightgold>A1</Lightgold> when Aloy receives Coil effect, her <Green>ATK</Green> is increased by{" "}
          <Green b>16%</Green> for 10s.
          <br />• At <Lightgold>A4</Lightgold> when Aloy is in Rushing Ice state, her <Green>Cryo DMG Bonus</Green>{" "}
          increases by <Green b>3.5%</Green> every 1s, up to <Rose>35%</Rose>.
        </>
      ),
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
        {
          label: "Time passed (A4)",
          type: "stacks",
          max: 10,
        },
      ],
      applyBuff: (obj) => {
        const { char, desc, tracker } = obj;
        applyModifier(desc, obj.attPattBonus, "NA.pct_", getNApctBonus(obj), tracker);

        if (checkAscs[1](char)) {
          applyModifier(desc, obj.totalAttr, "atk_", 16, tracker);
        }
        if (checkAscs[4](char)) {
          applyModifier(desc, obj.totalAttr, "cryo", 3.5 * (obj.inputs[1] || 0), tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.A1,
      affect: EModAffect.TEAMMATE,
      desc: () => (
        <>
          when Aloy receives the Coil effect, nearby party members' <Green>ATK</Green> is increased by{" "}
          <Green b>8%</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "atk_", 8),
    },
  ],
};

export default Aloy as AppCharacter;
