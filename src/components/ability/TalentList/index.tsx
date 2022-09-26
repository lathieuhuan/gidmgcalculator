import { useEffect, useState } from "react";
import type { CharInfo, DataCharacter, GetExtraStatsFn, Party, StatInfo, Talent } from "@Src/types";
import { TALENT_TYPES } from "@Src/constants";
import { ascsFromLv } from "@Src/utils";
import { findCharacter } from "@Data/controllers";
import { NORMAL_ATTACK_ICONS } from "./constants";

import { CloseButton } from "@Src/styled-components";
import { SharedSpace } from "@Components/minors";
import { SlideShow } from "@Components/ability/components";
import { ActiveTalent, PassiveTalent } from "./talent-overview";
import { SkillAttributes } from "./talent-details";

// import { useTabs } from "@Hooks/useTabs";

interface TalentListProps {
  char: CharInfo;
  party?: Party;
  onChangeLevelOf: (talentType: "NAs" | "ES" | "EB") => (newLevel: number) => void;
}
export function TalentList({ char, party, onChangeLevelOf }: TalentListProps) {
  const [position, setPosition] = useState(-1);
  const [atDetails, setAtDetails] = useState(false);

  const { code, vision, weapon, NAsConfig, activeTalents, passiveTalents } = findCharacter(char)!;
  const numOfActives = Object.keys(activeTalents).length;

  useEffect(() => {
    setAtDetails(false);
  }, [code]);

  const toDetailsAt = (newPosition: number) => {
    setAtDetails(true);
    setPosition(newPosition);
  };

  return (
    <SharedSpace
      atLeft={!atDetails}
      leftPart={
        <div className="h-full hide-scrollbar flex flex-col space-y-4">
          {(["NAs", "ES", "EB", "altSprint"] as const).map((talentType, i) => {
            const talentInfo =
              talentType === "NAs" ? { name: NAsConfig.name } : activeTalents[talentType];

            return talentInfo ? (
              <ActiveTalent
                key={i}
                char={char}
                talentInfo={talentInfo}
                talentType={talentType}
                talentLv={talentType === "altSprint" ? 1 : char[talentType]}
                {...{ party, vision, weapon }}
                onChangeLevel={talentType !== "altSprint" ? onChangeLevelOf(talentType) : undefined}
                onClickInfoSign={() => toDetailsAt(TALENT_TYPES.indexOf(talentType))}
              />
            ) : null;
          })}

          {passiveTalents.map((talent, i) => {
            const ascsRequired = i === 0 ? 1 : 4;
            return (
              <PassiveTalent
                key={i}
                vision={vision}
                talentInfo={talent}
                active={i === 2 || ascsFromLv(char.level) >= ascsRequired}
                onClickInfoSign={() => toDetailsAt(numOfActives + i)}
              />
            );
          })}
        </div>
      }
      rightPart={
        position === -1 || position >= numOfActives + passiveTalents.length ? null : (
          <Details
            position={position}
            {...{ vision, weapon, NAsConfig, activeTalents, passiveTalents }}
            changePosition={setPosition}
            close={() => {
              setAtDetails(false);
              setTimeout(() => setPosition(-1), 200);
            }}
          />
        )
      }
    />
  );
}

interface DetailsProps
  extends Pick<
    DataCharacter,
    "weapon" | "vision" | "NAsConfig" | "activeTalents" | "passiveTalents"
  > {
  position: number;
  changePosition: (position: number) => void;
  close: () => void;
}
function Details({
  position,
  weapon,
  vision,
  NAsConfig,
  activeTalents,
  passiveTalents,
  changePosition,
  close,
}: DetailsProps) {
  // // for when details for passiveTalents are available
  // const atActiveTalent = position < Object.keys(activeTalents).length;
  // const [switcher, tab, setTab] = useSwitcher([
  //   { text: "Talent Info", clickable: true },
  //   { text: "Skill Attributes", clickable: atActiveTalent },
  // ]);
  const { NA, CA, PA, ES, EB, altSprint } = activeTalents;
  const images = [NORMAL_ATTACK_ICONS[`${weapon}_${vision}`]!, ES.image, EB.image];

  if (altSprint) {
    images.push(altSprint.image);
  }
  // for (const talent of passiveTalents) {
  //   images.push(talent.image);
  // }

  const infoByPosition: Array<{
    type: Talent;
    name: string;
    stats: StatInfo[];
    getExtraStats?: GetExtraStatsFn;
  }> = [
    {
      type: "NAs",
      name: NAsConfig.name,
      stats: [...NA.stats, ...CA.stats, ...PA.stats],
      getExtraStats: NAsConfig.getExtraStats,
    },
    {
      type: "ES",
      name: ES.name,
      stats: ES.stats,
      getExtraStats: ES.getExtraStats,
    },
    {
      type: "EB",
      name: EB.name,
      stats: EB.stats,
      getExtraStats: EB.getExtraStats,
    },
    // { type: "A1 Passive", name: passiveTalents[0].name },
    // { type: "A4 Passive", name: passiveTalents[1].name },
  ];

  if (altSprint) {
    infoByPosition.splice(3, 0, { type: "altSprint" as const, name: altSprint.name, stats: [] });
  }

  const { type, name, stats, getExtraStats } = infoByPosition[position];

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-grow hide-scrollbar">
        <SlideShow
          forTalent
          currentIndex={position}
          images={images}
          vision={vision}
          onClickBack={() => {
            if (position >= 1) changePosition(position - 1);
          }}
          onClickNext={() => {
            if (position < Object.keys(activeTalents).length - 1) changePosition(position + 1);
          }}
          topLeftNote={<p className="absolute top-0 left-0 w-1/4 text-subtitle-1">{type}</p>}
        />
        <p className={`text-h5 font-bold text-${vision} text-center`}>{name}</p>
        <div className="mt-2 py-1 flex-center bg-default rounded-2xl">
          <p className="font-bold text-black cursor-default">Skill Attributes</p>
        </div>

        <SkillAttributes
          stats={stats}
          talentType={type}
          {...{ weapon, vision }}
          energyCost={type === "EB" ? EB.energyCost : undefined}
          getExtraStats={getExtraStats}
        />
      </div>

      <div className="mt-4">
        <CloseButton className="mx-auto glow-on-hover" onClick={close} />
      </div>
    </div>
  );
}
