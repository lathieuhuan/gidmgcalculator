import type { AppCharacter, CharInfo, DefaultAppCharacter, ModifierInput, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, talentBuff } from "../utils";

const getESDebuffValue = (fromSelf: boolean, char: CharInfo, inputs: ModifierInput[], partyData: PartyData) => {
  const level = fromSelf
    ? finalTalentLv({ char, charData: Eula as AppCharacter, talentType: "ES", partyData })
    : inputs[0] || 0;
  return level ? Math.min(15 + level, 25) : 0;
};

const Eula: DefaultAppCharacter = {
  code: 33,
  name: "Eula",
  icon: "a/af/Eula_Icon",
  sideIcon: "8/8d/Eula_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "claymore",
  EBcost: 80,
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Every time Grimheart stacks [~ES] are consumed, Eula's <Green>Physical DMG</Green> is increased by{" "}
          <Green b>30%</Green> for 6s. Each stack consumed increases the duration by 6s.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "phys", 30),
    },
    {
      index: 1,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          <Green>Lightfall Swords DMG</Green> is increased by <Green b>25%</Green> against opponents with less than 50%
          HP.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: ({ calcItemBonuses }) => {
        calcItemBonuses.push({
          ids: ["EB.0", "EB.1"],
          bonus: talentBuff([true, "pct_", [false, 4], 25]),
        });
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.ES,
      desc: ({ fromSelf, char, inputs, partyData }) => (
        <>
          If Grimheart stacks are consumed, surrounding opponents will have their <Green>Physical RES</Green> and{" "}
          <Green>Cryo RES</Green> decreased by <Green b>{getESDebuffValue(fromSelf, char, inputs, partyData)}%</Green>.
        </>
      ),
      inputConfigs: [
        {
          label: "Elemental Skill Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyDebuff: ({ fromSelf, resistReduct, char, inputs, partyData, desc, tracker }) => {
        const penaltyValue = getESDebuffValue(fromSelf, char, inputs, partyData);
        applyModifier(desc, resistReduct, ["phys", "cryo"], penaltyValue, tracker);
      },
    },
  ],
};

export default Eula as AppCharacter;
