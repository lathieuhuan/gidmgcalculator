import { useEffect, useState } from "react";
import cn from "classnames";
import type { CharInfo, DataCharacter, Party } from "@Src/types";
import { findCharacter } from "@Data/controllers";
import { SharedSpace } from "@Components/minors";
import { TALENT_TYPES } from "@Src/constants";
import { ascsFromLv } from "@Src/utils";
import SlideShow from "@Components/ability-components/SlideShow";
import { colorByVision } from "@Styled/tw-compounds";
import { NORMAL_ATTACK_ICONS } from "./constants";
import { ActiveTalent, PassiveTalent } from "./talent-overview";
import { useSwitcher } from "@Hooks/useSwitcher";
import { CloseButton } from "@Styled/Inputs";
import { TalentInfo } from "./talent-details";

interface TalentListProps {
  char: CharInfo;
  party?: Party;
  onChangeLevelOf: (talentType: "NAs" | "ES" | "EB") => (newLevel: number) => void;
}
export default function TalentList({ char, party, onChangeLevelOf }: TalentListProps) {
  const [position, setPosition] = useState(-1);
  const [atDetails, setAtDetails] = useState(false);

  const { code, vision, weapon, activeTalents, passiveTalents } = findCharacter(char)!;
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
        <div className="h-full hide-scrollbar">
          <div>
            {TALENT_TYPES.map((talentType, i) => {
              const talentInfo = activeTalents[talentType];
              if (talentInfo) {
                return (
                  <ActiveTalent
                    key={i}
                    char={char}
                    talentInfo={talentInfo}
                    talentType={talentType}
                    talentLv={talentType === "AltSprint" ? 1 : char[talentType]}
                    party={party}
                    vision={vision}
                    weapon={weapon}
                    onChangeLevel={
                      talentType !== "AltSprint" ? onChangeLevelOf(talentType) : undefined
                    }
                    onClickInfoSign={() => toDetailsAt(TALENT_TYPES.indexOf(talentType))}
                  />
                );
              }
              return null;
            })}
          </div>
          {passiveTalents.map((talent, i) => {
            const ascsRequired = i === 0 ? 1 : 4;
            return (
              <PassiveTalent
                key={i}
                vision={vision}
                talentInfo={talent}
                active={i < 2 && ascsFromLv(char.level) >= ascsRequired}
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
            {...{ vision, weapon, activeTalents, passiveTalents }}
            changePosition={setPosition}
            close={() => setAtDetails(false)}
          />
        )
      }
    />
  );
}

interface DetailsProps
  extends Pick<DataCharacter, "weapon" | "vision" | "activeTalents" | "passiveTalents"> {
  position: number;
  changePosition: (position: number) => void;
  close: () => void;
}
function Details({
  position,
  weapon,
  vision,
  activeTalents,
  passiveTalents,
  changePosition,
  close,
}: DetailsProps) {
  const atActiveTalent = position < Object.keys(activeTalents).length;

  const [switcher, tab, setTab] = useSwitcher([
    { text: "Talent Info", clickable: true },
    { text: "Skill Attributes", clickable: atActiveTalent },
  ]);
  const { NAs, ES, EB, AltSprint } = activeTalents;
  const images = [NORMAL_ATTACK_ICONS[`${weapon}_${vision}`]!, ES.image, EB.image];

  if (AltSprint) {
    images.push(AltSprint.image);
  }
  for (const talent of passiveTalents) {
    images.push(talent.image);
  }

  const infoByPosition = [
    { type: "Normal Attack", name: NAs.name },
    { type: "Elemental Skill", name: ES.name },
    { type: "Elemental Burst", name: EB.name },
    { type: "A1 Passive", name: passiveTalents[0].name },
    { type: "A4 Passive", name: passiveTalents[1].name },
  ];
  if (AltSprint) {
    infoByPosition.splice(3, 0, { type: "Alternate Sprint", name: AltSprint.name });
  }

  return (
    <div className="h-full flex flex-col relative">
      <div className="hide-scrollbar">
        <SlideShow
          forTalent
          currentIndex={position}
          images={images}
          vision={vision}
          onClickBack={() => changePosition(position - 1)}
          onClickNext={() => changePosition(position + 1)}
          topLeftNote={
            <div className="absolute w-full top-0">
              <div className=" w-1/4">
                <p className="text-subtitle-1">{infoByPosition[position].type}</p>
              </div>
            </div>
          }
        />
        <p className={cn("text-h5 font-bold text-center", colorByVision[vision])}>
          {infoByPosition[position].name}
        </p>
        <div className="mt-2">{switcher}</div>
        {tab === "Talent Info" ? (
          <TalentInfo />
        ) : (
          <SkillAttributes tlData={actvTalents[index]} isActv={isActv} code={code} />
        )}
      </div>
      <div className="mt-3">
        <CloseButton className="mx-auto glow-on-hover" onClick={close} />
      </div>
    </div>
  );
}
