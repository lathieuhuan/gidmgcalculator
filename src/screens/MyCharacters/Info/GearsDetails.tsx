import clsx from "clsx";
import { type CSSProperties, useEffect } from "react";
import type { ArtifactAttribute, AttributeStat, ArtifactSetBonus, UserArtifacts, UserWeapon } from "@Src/types";
import type { DetailsType } from "./types";

// Hook
import { useDispatch } from "@Store/hooks";

// Action
import { updateUserArtifactSubStat, updateUserArtifact, updateUserWeapon } from "@Store/userDatabaseSlice";

// Component
import { Button, AttributeTable, ButtonBar, SetBonusesDisplay, ArtifactCard, WeaponCard } from "@Components";

interface GearsDetailsProps {
  className: string;
  style: CSSProperties;
  activeDetails: DetailsType;
  weapon: UserWeapon;
  artifacts: UserArtifacts;
  setBonuses: ArtifactSetBonus[];
  artAttr: ArtifactAttribute;
  onClickSwitchWeapon: () => void;
  onClickSwitchArtifact: () => void;
  onClickUnequipArtifact: () => void;
  onCloseDetails: () => void;
}
export function GearsDetails({
  className,
  style,
  activeDetails,
  weapon,
  artifacts,
  setBonuses,
  artAttr,
  onClickSwitchWeapon,
  onClickSwitchArtifact,
  onClickUnequipArtifact,
  onCloseDetails,
}: GearsDetailsProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      (typeof activeDetails === "number" && activeDetails >= 0 && activeDetails < 5 && !artifacts[activeDetails]) ||
      (activeDetails === "setBonus" && !setBonuses.length)
    ) {
      onCloseDetails();
    }
  }, [activeDetails, weapon.owner]);

  switch (activeDetails) {
    case "weapon":
      return (
        <div className={clsx("flex flex-col", className)} style={style}>
          <div className="px-1 grow hide-scrollbar">
            <WeaponCard
              mutable
              weapon={weapon}
              upgrade={(level) => dispatch(updateUserWeapon({ ID: weapon.ID, level }))}
              refine={(refi) => dispatch(updateUserWeapon({ ID: weapon.ID, refi }))}
            />
          </div>
          <Button className="mt-4 mx-auto" variant="positive" onClick={onClickSwitchWeapon}>
            Switch
          </Button>
        </div>
      );

    case "setBonus":
      return (
        <div className={clsx("flex", className)} style={style}>
          <div className="px-1 hide-scrollbar">
            <SetBonusesDisplay setBonuses={setBonuses} />
          </div>
        </div>
      );

    case "statsBonus":
      return (
        <div className={clsx("flex", className)} style={style}>
          <div className="custom-scrollbar">
            <AttributeTable attributes={artAttr} />
          </div>
        </div>
      );

    default:
      const activeArtifact = artifacts[activeDetails];

      if (activeDetails !== -1 && activeArtifact) {
        return (
          <div className={className} style={style}>
            <div className="pb-2 hide-scrollbar">
              <ArtifactCard
                artifact={activeArtifact}
                mutable
                onEnhance={(level) => {
                  dispatch(updateUserArtifact({ ID: activeArtifact.ID, level }));
                }}
                onChangeMainStatType={(type) => {
                  dispatch(
                    updateUserArtifact({
                      ID: activeArtifact.ID,
                      mainStatType: type as AttributeStat,
                    })
                  );
                }}
                onChangeSubStat={(subStatIndex, changes) => {
                  dispatch(updateUserArtifactSubStat({ ID: activeArtifact.ID, subStatIndex, ...changes }));
                }}
              />
            </div>
            <ButtonBar
              className="mt-6"
              buttons={[
                { text: "Unequip", onClick: onClickUnequipArtifact },
                { text: "Switch", onClick: onClickSwitchArtifact },
              ]}
            />
          </div>
        );
      }
      return null;
  }
}
