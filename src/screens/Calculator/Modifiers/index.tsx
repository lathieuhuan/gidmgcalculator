import cn from "classnames";
import { memo, useState } from "react";
import { getPartyData } from "@Data/controllers";
import { selectParty } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";

import CollapseList from "@Components/Collapse";
import { MainSelect } from "../components";
import styles from "../styles.module.scss";
import { ArtifactBuffs, ElememtBuffs } from "./buffs/others";
import { PartyBuffs, SelfBuffs } from "./buffs/characters";
import WeaponBuffs from "./buffs/weapons";
import { ArtifactDebuffs, ElementDebuffs } from "./debuffs/others";
import { PartyDebuffs, SelfDebuffs } from "./debuffs/characters";
import CustomModifiers from "./custom";

const contentByTab: Record<string, () => JSX.Element> = {
  Buffs: () => {
    const partyData = getPartyData(useSelector(selectParty));
    return (
      <CollapseList
        headingList={["Resonance & Reactions", "Self", "Party", "Weapons", "Artifacts", "Custom"]}
        contentList={[
          <ElememtBuffs />,
          <SelfBuffs partyData={partyData} />,
          <PartyBuffs partyData={partyData} />,
          <WeaponBuffs />,
          <ArtifactBuffs />,
          <CustomModifiers isBuffs />,
        ]}
      />
    );
  },
  Debuffs: () => (
    <CollapseList
      headingList={["Resonance & Reactions", "Self", "Party", "Artifacts", "Custom"]}
      contentList={[
        <ElementDebuffs />,
        <SelfDebuffs />,
        <PartyDebuffs />,
        <ArtifactDebuffs />,
        <CustomModifiers isBuffs={false} />,
      ]}
    />
  ),
};

function Modifiers() {
  const [tab, setTab] = useState("Buffs");
  const Content = contentByTab[tab];

  return (
    <div className={cn("px-6 py-4 flex flex-col bg-darkblue-1", styles.card)}>
      <MainSelect tab={tab} onChangeTab={setTab} options={["Buffs", "Debuffs", "Target"]} />
      <div className="mt-4 grow-1 custom-sb">
        <Content />
      </div>
    </div>
  );
}

export default memo(Modifiers);
