import type { AppCharacter, AttributeStat, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Geo, Green, Red } from "@Src/pure-components";
import { countVision } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getESBuffValue = (level: number) => Math.round(206 * TALENT_LV_MULTIPLIERS[2][level]);

const Gorou: DefaultAppCharacter = {
  code: 44,
  name: "Gorou",
  icon: "f/fe/Gorou_Icon",
  sideIcon: "7/7e/Gorou_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "geo",
  weaponType: "bow",
  EBcost: 80,
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          • Inuzaka All-Round Defense <Green>[ES] DMG</Green> increased by <Green b>156%</Green> of DEF.
          <br />• Juuga: Forward Unto Victory <Green>[ES] DMG</Green> increased by <Green b>15.6%</Green> of DEF.
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const buffValues = [totalAttr.def * 1.56, totalAttr.def * 0.156];
        applyModifier(desc, attPattBonus, ["ES.flat", "EB.flat"], buffValues, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.ACTIVE_UNIT,
      desc: ({ toSelf, charData, inputs, partyData }) => {
        const { geo = 0 } = countVision(partyData, charData);
        return (
          <>
            Provides up to 3 buffs to active characters within the skill's AoE based on the number of <Geo>Geo</Geo>{" "}
            characters in the party:
            <br />
            <span className={geo >= 1 ? "" : "opacity-50"}>
              • 1 Geo character: Adds "Standing Firm" - <Green>DEF bonus</Green>
              {toSelf ? (
                "."
              ) : (
                <>
                  : <Red>{getESBuffValue(inputs[0] || 0)}.</Red>
                </>
              )}
            </span>
            <br />
            <span className={geo >= 2 ? "" : "opacity-50"}>
              • 2 Geo characters: Adds "Impregnable" - Increased resistance to interruption.
            </span>
            <br />
            <span className={geo >= 3 ? "" : "opacity-50"}>
              • 3 Geo character: Adds "Crunch" - <Green b>15%</Green> <Green>Geo DMG Bonus</Green>.
            </span>
          </>
        );
      },
      inputConfigs: [
        {
          label: "Elemental Skill Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        const level = obj.toSelf
          ? finalTalentLv({ ...obj, charData: Gorou as AppCharacter, talentType: "ES" })
          : obj.inputs[0] || 1;
        const fields: AttributeStat[] = ["def"];
        const buffValues = [getESBuffValue(level)];
        const { geo = 0 } = countVision(obj.partyData, obj.charData);

        if (geo > 2) {
          fields.push("geo");
          buffValues.push(15);
        }
        applyModifier(obj.desc, obj.totalAttr, fields, buffValues, obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          After using Juuga: Forward Unto Victory [EB], all nearby party members' <Green>DEF</Green> is increased by{" "}
          <Green b>25%</Green> for 12s.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "def_", 25),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      desc: ({ charData, partyData }) => {
        const { geo = 0 } = countVision(partyData, charData);
        return (
          <>
            For 12s after using Inuzaka All-Round Defense [ES] or Juuga: Forward Unto Victory [EB], increases all nearby
            party members' <Geo>Geo</Geo> <Green>CRIT DMG</Green> based on the buff level of the skill's field:
            <br />
            <span className={geo === 1 ? "" : "opacity-50"}>
              • "Standing Firm": <Green b>+10%</Green>
            </span>
            <br />
            <span className={geo === 2 ? "" : "opacity-50"}>
              • "Impregnable": <Green b>+20%</Green>
            </span>
            <br />
            <span className={geo >= 3 ? "" : "opacity-50"}>
              • "Crunch": <Green b>+40%</Green>
            </span>
          </>
        );
      },
      isGranted: checkCons[6],
      applyBuff: (obj) => {
        const { geo = 0 } = countVision(obj.partyData, obj.charData);
        const buffValue = [10, 20, 40, 40][geo - 1];
        applyModifier(obj.desc, obj.attElmtBonus, "geo.cDmg_", buffValue, obj.tracker);
      },
    },
  ],
};

export default Gorou as AppCharacter;
