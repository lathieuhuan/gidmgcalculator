import clsx from "clsx";
import { type CSSProperties, useEffect } from "react";

// Type
import type { ArtifactAttribute, AttributeStat, ArtifactSetBonus, UserArtifacts, UserWeapon } from "@Src/types";
import type { GearsDetailType } from "./types";

// Store
import { useDispatch } from "@Store/hooks";
import { updateUserArtifactSubStat, updateUserArtifact, updateUserWeapon } from "@Store/userDatabaseSlice";

// Component
import { Button } from "@Src/pure-components";
import { AttributeTable, SetBonusesDisplay, WeaponCard, ArtifactCard } from "@Src/components";

interface GearsDetailProps {
  className: string;
  style: CSSProperties;
  activeDetails: GearsDetailType;
  weapon: UserWeapon;
  artifacts: UserArtifacts;
  setBonuses: ArtifactSetBonus[];
  artAttr: ArtifactAttribute;
  onClickSwitchWeapon: () => void;
  onClickSwitchArtifact: () => void;
  onClickUnequipArtifact: () => void;
  onCloseDetails: () => void;
}
export function GearsDetail({
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
}: GearsDetailProps) {
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
          <ArtifactCard
            wrapperCls="h-full"
            className={className}
            style={style}
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
            actions={[
              { text: "Unequip", onClick: onClickUnequipArtifact },
              { text: "Switch", variant: "positive", onClick: onClickSwitchArtifact },
            ]}
          />
        );
      }
      return null;
  }
}
