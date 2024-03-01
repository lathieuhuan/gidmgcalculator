import { useState } from "react";
import { FaInfo } from "react-icons/fa";

import type { CharInfo, Party } from "@Src/types";
import { TALENT_TYPES } from "@Src/constants";
import NORMAL_ATTACK_ICONS from "./normalAttackIcons";

import { $AppCharacter } from "@Src/services";
import { ascsFromLv } from "@Src/utils";
import { totalXtraTalentLv } from "@Src/utils/calculation";

// Component
import { Button, SharedSpace } from "@Src/pure-components";
import { AbilityIcon } from "../ability-list-components";
import { TalentDetail } from "./TalentDetail";

type RenderedTalentConfig = {
  name?: string;
  image?: string;
  /** Default to true */
  active?: boolean;
  xtraLevel?: number;
};

interface TalentListProps {
  char: CharInfo;
  party?: Party;
  onChangeTalentLevel: (talentType: "NAs" | "ES" | "EB", newLevel: number) => void;
}
export const TalentList = ({ char, party, onChangeTalentLevel }: TalentListProps) => {
  const [atDetail, setAtDetail] = useState(false);
  const [detailIndex, setDetailIndex] = useState(-1);

  const appChar = $AppCharacter.get(char.name);
  const { weaponType, vision: elementType, activeTalents, passiveTalents } = appChar;
  const partyData = party ? $AppCharacter.getPartyData(party) : undefined;
  const elmtText = `text-${elementType}`;
  const numOfActives = Object.keys(activeTalents).length;

  const onClickInfoSign = (index: number) => {
    setAtDetail(true);
    setDetailIndex(index);
  };

  const renderTalent = (talent: RenderedTalentConfig, index: number, levelNode: React.ReactNode) => {
    const { active = true } = talent;
    return (
      <div key={index} className="flex">
        <AbilityIcon className="my-2 mr-2 shrink-0" img={talent.image} elementType={elementType} />
        <div className="grow flex items-center">
          <div className={"px-2" + (active ? "" : " opacity-50")}>
            <p className="font-bold">{talent.name}</p>
            <div className="flex items-center">
              <p className="mr-1">Lv.</p>
              {levelNode}
              {talent.xtraLevel ? <p className="ml-2 font-bold text-green-300">+{talent.xtraLevel}</p> : null}
            </div>
          </div>

          <Button
            className="ml-auto hover:bg-yellow-400"
            size="small"
            icon={<FaInfo />}
            onClick={() => onClickInfoSign(index)}
          />
        </div>
      </div>
    );
  };

  const immutableLvNode = <p className={`ml-1 ${elmtText} font-bold`}>1</p>;

  return (
    <SharedSpace
      atLeft={!atDetail}
      leftPart={
        <div className="h-full hide-scrollbar flex flex-col space-y-3">
          {TALENT_TYPES.map((talentType, index) => {
            const isAltSprint = talentType === "altSprint";
            const talent = activeTalents[talentType];
            if (!talent) return null;

            const xtraLevel = totalXtraTalentLv({
              appChar,
              talentType,
              char,
              partyData,
            });

            const mutableLvNode = (
              <select
                className={`${elmtText} font-bold`}
                value={isAltSprint ? 1 : char[talentType]}
                onChange={(e) => (isAltSprint ? null : onChangeTalentLevel?.(talentType, +e.target.value))}
              >
                {[...Array(10).keys()].map((_, i) => (
                  <option key={i} className="text-black">
                    {i + 1}
                  </option>
                ))}
              </select>
            );

            return renderTalent(
              {
                name: talent.name,
                image: talentType === "NAs" ? NORMAL_ATTACK_ICONS[`${weaponType}_${elementType}`] : talent.image,
                xtraLevel,
              },
              index,
              isAltSprint ? immutableLvNode : mutableLvNode
            );
          })}

          {passiveTalents.map((talent, index) => {
            const active = index === 2 || ascsFromLv(char.level) >= (index === 0 ? 1 : 4);
            return renderTalent(
              {
                name: talent.name,
                image: talent.image,
                active,
              },
              numOfActives + index,
              immutableLvNode
            );
          })}
        </div>
      }
      rightPart={
        detailIndex !== -1 && detailIndex < numOfActives + appChar.passiveTalents.length ? (
          <TalentDetail
            appChar={appChar}
            detailIndex={detailIndex}
            onChangeDetailIndex={setDetailIndex}
            onClose={() => {
              setAtDetail(false);
              setTimeout(() => setDetailIndex(-1), 200);
            }}
          />
        ) : null
      }
    />
  );
};
