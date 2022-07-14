import { useEffect, useState } from "react";
import type { CharInfo, DataCharacter, Party } from "@Src/types";
import { findCharacter } from "@Data/controllers";
import { SharedSpace } from "@Components/minors";
import { TALENT_TYPES } from "@Src/constants";
import { ActiveTalent, PassiveTalent } from "./talent-overview";
import { ascsFromLv } from "@Src/utils";
import SlideShow from "@Components/ability-components/SlideShow";
import { NORMAL_ATTACK_ICONS } from "./constants";

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
          <Details position={position} {...{ vision, weapon, activeTalents, passiveTalents }} />
        )
      }
    />
  );
}

interface DetailsProps
  extends Pick<DataCharacter, "weapon" | "vision" | "activeTalents" | "passiveTalents"> {
  position: number;
  changePosition: (position: number) => void;
}
function Details({
  position,
  weapon,
  vision,
  activeTalents,
  passiveTalents,
  changePosition,
}: DetailsProps) {
  const images = [
    NORMAL_ATTACK_ICONS[`${weapon}_${vision}`]!,
    activeTalents.ES.image,
    activeTalents.EB.image,
  ];
  if (activeTalents.AltSprint) {
    images.push(activeTalents.AltSprint.image);
  }
  images.push(...passiveTalents.map((talent) => talent.image));

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
                <p className="text-subtitle-1">
                  {type}
                  {!isNaN(type.slice(-1)) && " Passive"}
                </p>
              </div>
            </div>
          }
        />
        <Text variant="h5" color={vision} bold align="center">
          {name}
        </Text>
        <div className="mt-2">{switcher}</div>
        {tab === "Talent Info" ? (
          <TalentInfo desc={desc} isActv={isActv} />
        ) : (
          <SkillAttributes tlData={actvTalents[index]} isActv={isActv} code={code} />
        )}
      </div>
      <div className="mt-3">
        <CloseBtn className="mx-auto glow-on-hover" onClick={close} />
      </div>
    </div>
  );
}
