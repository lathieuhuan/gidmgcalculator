import cn from "classnames";
import { memo, useState } from "react";

import CollapseList from "@Components/Collapse";
import { MainSelect } from "../components";
import { ArtifactBuffs, ElememtBuffs } from "./buffs/others";
import { PartyBuffs, SelfBuffs } from "./buffs/characters";
import WeaponBuffs from "./buffs/weapons";
import { ArtifactDebuffs, ElementDebuffs } from "./debuffs/others";
import { PartyDebuffs, SelfDebuffs } from "./debuffs/characters";
import CustomModifiers from "./custom";
import Target from "./Target";

import styles from "../styles.module.scss";

function Modifiers() {
  const [tab, setTab] = useState("Buffs");

  return (
    <div className={cn("px-6 py-4 flex flex-col bg-darkblue-1", styles.card)}>
      <MainSelect tab={tab} onChangeTab={setTab} options={["Buffs", "Debuffs", "Target"]} />
      <div className="mt-4 grow-1 custom-sb">
        {tab === "Buffs" ? (
          <CollapseList
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
            headingList={["Resonance & Reactions", "Self", "Party", "Artifacts", "Custom"]}
            contentList={[
              <ElementDebuffs />,
              <SelfDebuffs />,
              <PartyDebuffs />,
              <ArtifactDebuffs />,
              <CustomModifiers isBuffs={false} />,
            ]}
          />
        ) : (
          <Target />
        )}
      </div>
    </div>
  );
}

export default memo(Modifiers);
