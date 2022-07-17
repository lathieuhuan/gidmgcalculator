import cn from "classnames";
import { memo, useState } from "react";
import { getPartyData } from "@Data/controllers";
import { selectParty } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";

import CollapseList from "@Components/Collapse";
import { MainSelect } from "../components";
import styles from "../styles.module.scss";

const contentByTab: Record<string, () => JSX.Element> = {
  Buffs: () => {
    const partyData = getPartyData(useSelector(selectParty));
    return (
      <CollapseList
        headingList={["Resonance & Reactions", "Self", "Party", "Weapons", "Artifacts", "Custom"]}
        contentList={[
          <ElmtBuffs />,
          <SelfBuffs partyData={partyData} />,
          <PartyBuffs partyData={partyData} />,
          <WpBuffs />,
          <ArtBuffs />,
          <CustomMods modType="BCs" />,
        ]}
      />
    );
  },
  Debuffs: () => (
    <CollapseList
      headingList={["Resonance & Reactions", "Self", "Party", "Artifacts", "Custom"]}
      contentList={[
        <ElmtDebuffs />,
        <SelfDebuffs />,
        <PartyDebuffs />,
        <ArtDebuffs />,
        <CustomMods modType="DCs" />,
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
