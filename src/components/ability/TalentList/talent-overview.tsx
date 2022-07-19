import cn from "classnames";
import type { CharInfo, Party, Talent, Vision, Weapon } from "@Src/types";
import { getPartyData } from "@Data/controllers";
import { totalXtraTalentLv } from "@Src/utils";
import { NORMAL_ATTACK_ICONS } from "./constants";

import { colorByVision } from "@Styled/tw-compounds";
import { Select } from "@Styled/Inputs";
import { InfoSign } from "@Components/minors";
import { AbilityIcon } from "../components";

interface ActiveTalentProps {
  talentInfo: {
    name: string;
    image?: string;
  };
  talentType: Talent;
  talentLv: number;
  char: CharInfo;
  weapon: Weapon;
  vision: Vision;
  party?: Party;
  onChangeLevel?: (newLv: number) => void;
  onClickInfoSign: () => void;
}
export function ActiveTalent({
  talentInfo,
  talentType,
  talentLv,
  char,
  weapon,
  vision,
  party,
  onChangeLevel,
  onClickInfoSign,
}: ActiveTalentProps) {
  const partyData = party ? getPartyData(party) : undefined;
  const xtraLv = talentType === "altSprint" ? 0 : totalXtraTalentLv(char, talentType, partyData);

  return (
    <div className="flex">
      <AbilityIcon
        className="my-2 mr-2"
        img={
          talentInfo.image === undefined
            ? NORMAL_ATTACK_ICONS[`${weapon}_${vision}`]!
            : talentInfo.image
        }
        vision={vision}
      />
      <div className="grow flex items-center">
        <div className="px-2">
          <p className="font-bold">{talentInfo.name}</p>
          <div className="flex items-center">
            <p className="mr-1">Lv.</p>
            {talentType === "altSprint" ? (
              <p className={cn("ml-1 font-bold", colorByVision[vision])}>1</p>
            ) : (
              <Select
                className={cn("font-bold", colorByVision[vision])}
                value={talentLv}
                onChange={(e) => onChangeLevel && onChangeLevel(+e.target.value)}
              >
                {[...Array(10).keys()].map((_, i) => (
                  <option key={i} className="text-black">
                    {i + 1}
                  </option>
                ))}
              </Select>
            )}
            {!!xtraLv && <p className="ml-2 font-bold text-green">+{xtraLv}</p>}
          </div>
        </div>
        <div className="ml-auto" onClick={onClickInfoSign}>
          <InfoSign selfHover={true} />
        </div>
      </div>
    </div>
  );
}

interface PassiveTalentProps {
  talentInfo: {
    name: string;
    image: string;
  };
  active: boolean;
  vision: Vision;
  onClickInfoSign: () => void;
}
export function PassiveTalent({ talentInfo, active, vision, onClickInfoSign }: PassiveTalentProps) {
  return (
    <div className="flex">
      <AbilityIcon className="my-2 mr-2" active={active} img={talentInfo.image} vision={vision} />
      <div className="grow flex items-center">
        <div className={cn("px-2", !active && "opacity-50")}>
          <p className="font-bold">{talentInfo.name}</p>
          <div className="flex">
            <p className="mr-2">Lv.</p>
            <p className={cn("font-bold", colorByVision[vision])}>1</p>
          </div>
        </div>
        {/* <div className="ml-auto" onClick={onClickInfoSign}>
          <InfoSign selfHover={true} />
        </div> */}
      </div>
    </div>
  );
}
