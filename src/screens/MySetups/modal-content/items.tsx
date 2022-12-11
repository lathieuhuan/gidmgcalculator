import clsx from "clsx";
import { Fragment } from "react";
import { FaCircle } from "react-icons/fa";
import isEqual from "react-fast-compare";

import type { CalcArtifacts, CalcWeapon, UserArtifacts } from "@Src/types";

import { findById } from "@Src/utils";
import { useSelector } from "@Store/hooks";
import { selectMyArts, selectMyWps } from "@Store/userDatabaseSlice/selectors";

import { WeaponCard } from "@Components/WeaponCard";
import { ArtifactCard } from "@Components/ArtifactCard";
import { renderEquippedChar } from "@Components/item-stores/components";

interface OutdateWarnProps {
  className?: string;
  info: any;
  existedInfo: any;
}
function OutdateWarn({ className, info, existedInfo }: OutdateWarnProps) {
  const { owner, ...restInfo } = info;
  const { owner: existedOwner, ...restExistedInfo } = existedInfo;

  if (isEqual(restInfo, restExistedInfo)) {
    return null;
  }

  return (
    <div className={clsx("absolute flex group", className)}>
      <FaCircle size="1.5rem" color="red" />
      <span className="small-tooltip top-full right-0 origin-top-right group-hover:scale-100 text-lightred">
        This item has changed in the database!
      </span>
    </div>
  );
}

export function MySetupWeapon({ weapon }: { weapon: CalcWeapon }) {
  const existed = findById(useSelector(selectMyWps), weapon.ID);

  return (
    <div className="relative">
      {existed && <OutdateWarn className="top-0 right-0" info={weapon} existedInfo={existed} />}

      <div className="w-75 hide-scrollbar" style={{ height: "30rem" }}>
        <WeaponCard mutable={false} weapon={weapon} />
      </div>

      {existed && renderEquippedChar(existed.owner || "None")}
    </div>
  );
}

interface MySetupArtifactsProps {
  artifacts: UserArtifacts;
}
export function MySetupArtifacts({ artifacts }: MySetupArtifactsProps) {
  const myArts = useSelector(selectMyArts);

  return (
    <Fragment>
      {artifacts.map((artifact, i) => {
        if (artifact) {
          const existed = artifact.ID ? findById(myArts, artifact.ID) : undefined;

          return (
            <div key={i} className="px-1 relative" style={{ width: "14.5rem" }}>
              {existed && (
                <OutdateWarn className="top-0.5 right-2" info={artifact} existedInfo={existed} />
              )}

              <ArtifactCard mutable={false} artifact={artifact} space="mx-2" />

              {existed && renderEquippedChar(existed.owner || "None")}
            </div>
          );
        }
        return null;
      })}
    </Fragment>
  );
}
