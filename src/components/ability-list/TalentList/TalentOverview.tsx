import clsx from "clsx";
import type { CharInfo, AppCharacter, Party } from "@Src/types";

// Constant
import { TALENT_TYPES } from "@Src/constants";
import { NORMAL_ATTACK_ICONS } from "./constants";

// Util
import { appData } from "@Data/index";
import { ascsFromLv } from "@Src/utils";
import { totalXtraTalentLv } from "@Src/utils/calculation";

// Component
import { InfoSign } from "@Src/pure-components";
import { AbilityIcon } from "../components";

interface TalentOverviewProps {
  char: CharInfo;
  charData: AppCharacter;
  party?: Party;
  onChangeLevel: (talentType: "NAs" | "ES" | "EB", newLevel: number) => void;
  onClickInfoSign: (index: number) => void;
}
export const TalentOverview = ({ char, charData, party, onChangeLevel, onClickInfoSign }: TalentOverviewProps) => {
  const { vision, weaponType, activeTalents, passiveTalents } = charData;
  const partyData = party ? appData.getPartyData(party) : undefined;

  return (
    <div className="h-full hide-scrollbar flex flex-col space-y-3">
      {TALENT_TYPES.map((talentType, i) => {
        const talentName = activeTalents[talentType]?.name;
        const talentImg = talentType === "NAs" ? undefined : activeTalents[talentType]?.image;
        const xtraLv = totalXtraTalentLv({
          charData,
          talentType,
          char,
          partyData,
        });

        return talentName ? (
          <div key={i} className="flex">
            <AbilityIcon
              className="my-2 mr-2"
              img={talentImg === undefined ? NORMAL_ATTACK_ICONS[`${weaponType}_${vision}`]! : talentImg}
              vision={vision}
            />
            <div className="grow flex items-center">
              <div className="px-2">
                <p className="font-bold">{talentName}</p>
                <div className="flex items-center">
                  <p className="mr-1">Lv.</p>
                  {talentType === "altSprint" ? (
                    <p className={`ml-1 text-${vision} font-bold`}>1</p>
                  ) : (
                    <select
                      className={`text-${vision} font-bold`}
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
                  {!!xtraLv && <p className="ml-2 font-bold text-green">+{xtraLv}</p>}
                </div>
              </div>
              <div className="ml-auto" onClick={() => onClickInfoSign(TALENT_TYPES.indexOf(talentType))}>
                <InfoSign selfHover />
              </div>
            </div>
          </div>
        ) : null;
      })}

      {passiveTalents.map((talent, i) => {
        const ascsRequired = i === 0 ? 1 : 4;
        const active = i === 2 || ascsFromLv(char.level) >= ascsRequired;

        return (
          <div key={i} className="flex">
            <AbilityIcon className="my-2 mr-2" active={active} img={talent.image} vision={vision} />
            <div className="grow flex items-center">
              <div className={clsx("px-2", !active && "opacity-50")}>
                <p className="font-bold">{talent.name}</p>
                <div className="flex">
                  <p className="mr-2">Lv.</p>
                  <p className={`text-${vision} font-bold`}>1</p>
                </div>
              </div>
              {/* <div
                className="ml-auto"
                onClick={() => onClickInfoSign(Object.keys(activeTalents).length + i)}
              >
                <InfoSign selfHover />
              </div> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};
