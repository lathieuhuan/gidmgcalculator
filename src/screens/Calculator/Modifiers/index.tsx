import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { selectParty } from "@Store/calculatorSlice/selectors";

import { CollapseList } from "@Components/collapse";
import { MainSelect } from "../components";
import { ArtifactBuffs, ElememtBuffs } from "./buffs/others";
import { PartyBuffs, SelfBuffs } from "./buffs/characters";
import WeaponBuffs from "./buffs/weapons";
import { ArtifactDebuffs, ElementDebuffs } from "./debuffs/others";
import { PartyDebuffs, SelfDebuffs } from "./debuffs/characters";
import CustomModifiers from "./custom";
import TargetConfig from "./TargetConfig";
import { getPartyData } from "@Data/controllers";

function Modifiers() {
  const [tab, setTab] = useState("Buffs");
  const party = useSelector(selectParty);
  const partyData = getPartyData(party);

  return (
    <div className="h-full flex flex-col">
      <MainSelect tab={tab} onChangeTab={setTab} options={["Buffs", "Debuffs", "Target"]} />

      <div className="mt-4 grow custom-scrollbar">
        {tab === "Buffs" ? (
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
              <ElememtBuffs />,
              <SelfBuffs />,
              <PartyBuffs />,
              <WeaponBuffs />,
              <ArtifactBuffs />,
              <CustomModifiers isBuffs />,
            ]}
          />
        ) : tab === "Debuffs" ? (
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
        ) : (
          <TargetConfig />
        )}
      </div>
    </div>
  );
}

export default memo(Modifiers);
