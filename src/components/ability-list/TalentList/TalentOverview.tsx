import clsx from "clsx";
import { FaInfo } from "react-icons/fa";

import type { CharInfo, AppCharacter, Party } from "@Src/types";
import { $AppData } from "@Src/services";

// Constant
import { TALENT_TYPES } from "@Src/constants";
import NORMAL_ATTACK_ICONS from "./normalAttackIcons";

// Util
import { ascsFromLv } from "@Src/utils";
import { totalXtraTalentLv } from "@Src/utils/calculation";

// Component
import { Button } from "@Src/pure-components";
import { AbilityIcon } from "../ability-list-components";

interface TalentOverviewProps {
  char: CharInfo;
  appChar: AppCharacter;
  party?: Party;
  onChangeLevel: (talentType: "NAs" | "ES" | "EB", newLevel: number) => void;
  onClickInfoSign: (index: number) => void;
}
export const TalentOverview = ({ char, appChar, party, onChangeLevel, onClickInfoSign }: TalentOverviewProps) => {
  const { vision: elementType, weaponType, activeTalents, passiveTalents } = appChar;
  const partyData = party ? $AppData.getPartyData(party) : undefined;
  const elmtText = `text-${elementType}`;

  return (
    <div className="h-full hide-scrollbar flex flex-col space-y-3">
      {TALENT_TYPES.map((talentType, i) => {
        const talentName = activeTalents[talentType]?.name;
        const talentImg = talentType === "NAs" ? undefined : activeTalents[talentType]?.image;
        const xtraLv = totalXtraTalentLv({
          appChar,
          talentType,
          char,
          partyData,
        });

        return talentName ? (
          <div key={i} className="flex">
            <AbilityIcon
              className="my-2 mr-2"
              img={talentImg === undefined ? NORMAL_ATTACK_ICONS[`${weaponType}_${elementType}`] : talentImg}
              elementType={elementType}
            />
            <div className="grow flex items-center">
              <div className="px-2">
                <p className="font-bold">{talentName}</p>
                <div className="flex items-center">
                  <p className="mr-1">Lv.</p>
                  {talentType === "altSprint" ? (
                    <p className={`ml-1 ${elmtText} font-bold`}>1</p>
                  ) : (
                    <select
                      className={`${elmtText} font-bold`}
                      value={char[talentType]}
                      onChange={(e) => onChangeLevel(talentType, +e.target.value)}
                    >
                      {[...Array(10).keys()].map((_, i) => (
                        <option key={i} className="text-black">
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  )}
                  {!!xtraLv && <p className="ml-2 font-bold text-green-300">+{xtraLv}</p>}
                </div>
              </div>

              <Button
                className="ml-auto hover:bg-yellow-400"
                size="small"
                icon={<FaInfo />}
                onClick={() => onClickInfoSign(TALENT_TYPES.indexOf(talentType))}
              />
            </div>
          </div>
        ) : null;
      })}

      {passiveTalents.map((talent, i) => {
        const ascsRequired = i === 0 ? 1 : 4;
        const active = i === 2 || ascsFromLv(char.level) >= ascsRequired;

        return (
          <div key={i} className="flex">
            <AbilityIcon className="my-2 mr-2" active={active} img={talent.image} elementType={elementType} />
            <div className="grow flex items-center">
              <div className={clsx("px-2", !active && "opacity-50")}>
                <p className="font-bold">{talent.name}</p>
                <div className="flex">
                  <p className="mr-2">Lv.</p>
                  <p className={`${elmtText} font-bold`}>1</p>
                </div>
              </div>
              {/* <Button
                className="ml-auto hover:bg-yellow-400"
                size="small"
                icon={<FaInfo />}
                onClick={() => onClickInfoSign(Object.keys(activeTalents).length + i)}
              /> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};
