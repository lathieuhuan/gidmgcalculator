import { useSelector } from "@Store/hooks";
import { useTabs } from "@Hooks/useTabs";
import { selectParty } from "@Store/calculatorSlice/selectors";
import { getPartyData } from "@Data/controllers";

import { CollapseList } from "@Components/collapse";
import { ArtifactBuffs, ElementBuffs } from "./buffs/others";
import { PartyBuffs, SelfBuffs } from "./buffs/characters";
import WeaponBuffs from "./buffs/weapons";
import { ArtifactDebuffs, ElementDebuffs } from "./debuffs/others";
import { PartyDebuffs, SelfDebuffs } from "./debuffs/characters";
import CustomModifiers from "./custom";

export default function Modifiers() {
  const party = useSelector(selectParty);
  const partyData = getPartyData(party);

  const { activeIndex, tabs } = useTabs({
    className: "text-lg shrink-0",
    defaultIndex: 1,
    configs: [{ text: "Debuffs" }, { text: "Buffs" }],
  });

  return (
    <div className="h-full flex flex-col">
      {tabs}

      <div className="mt-4 grow custom-scrollbar">
        {activeIndex ? (
          <CollapseList
            key="buff"
            headingList={[
              "Resonance & Reactions",
              "Self",
              "Party",
              "Weapons",
              "Artifacts",
              "Custom",
            ]}
            contentList={[
              <ElementBuffs />,
              <SelfBuffs />,
              <PartyBuffs />,
              <WeaponBuffs />,
              <ArtifactBuffs />,
              <CustomModifiers isBuffs />,
            ]}
          />
        ) : (
          <CollapseList
            key="debuff"
            headingList={["Resonance & Reactions", "Self", "Party", "Artifacts", "Custom"]}
            contentList={[
              <ElementDebuffs />,
              <SelfDebuffs partyData={partyData} />,
              <PartyDebuffs partyData={partyData} />,
              <ArtifactDebuffs />,
              <CustomModifiers isBuffs={false} />,
            ]}
          />
        )}
      </div>
    </div>
  );
}
