import clsx from "clsx";
import type { CharInfo, Party, Talent, Vision, WeaponType } from "@Src/types";

// Constant
import { NORMAL_ATTACK_ICONS } from "./constants";

// Util
import { totalXtraTalentLv } from "@Src/utils";
import { getPartyData } from "@Data/controllers";

// Component
import { Select } from "@Src/styled-components";
import { InfoSign } from "@Components/atoms";
import { AbilityIcon } from "../components";

interface ActiveTalentProps {
  talentInfo: {
    name: string;
    image?: string;
  };
  talentType: Talent;
  talentLv: number;
  char: CharInfo;
  weaponType: WeaponType;
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
  weaponType,
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
            ? NORMAL_ATTACK_ICONS[`${weaponType}_${vision}`]!
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
              <p className={`ml-1 text-${vision} font-bold`}>1</p>
            ) : (
              <Select
                className={`text-${vision} font-bold`}
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
          <InfoSign selfHover />
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
        <div className={clsx("px-2", !active && "opacity-50")}>
          <p className="font-bold">{talentInfo.name}</p>
          <div className="flex">
            <p className="mr-2">Lv.</p>
            <p className={`text-${vision} font-bold`}>1</p>
          </div>
        </div>
        {/* <div className="ml-auto" onClick={onClickInfoSign}>
          <InfoSign selfHover />
        </div> */}
      </div>
    </div>
  );
}
