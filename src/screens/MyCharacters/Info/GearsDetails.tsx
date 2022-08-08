import cn from "classnames";
import { type CSSProperties, useEffect } from "react";
import type { ArtifactAttribute, UsersWeapon } from "@Src/types";
import type { ArtifactInfo, Details } from "./types";

import { ArtifactCard } from "@Components/ArtifactCard";
import { AttributeTable } from "@Components/AttributeTable";
import { ButtonBar, SetBonus } from "@Components/minors";
import { WeaponCard } from "@Components/WeaponCard";
import { Button } from "@Src/styled-components";

interface GearsDetailsProps {
  className: string;
  style: CSSProperties;
  activeDetails: Details;
  wpInfo: UsersWeapon;
  artInfo: ArtifactInfo;
  artAttr: ArtifactAttribute;
  onClickSwitchWeapon: () => void;
  onClickSwitchArtifact: () => void;
  onClickUnequipArtifact: () => void;
  onCloseDetails: () => void;
}
export default function GearsDetails({
  className,
  style,
  activeDetails,
  wpInfo,
  artInfo,
  artAttr,
  onClickSwitchWeapon,
  onClickSwitchArtifact,
  onClickUnequipArtifact,
  onCloseDetails,
}: GearsDetailsProps) {
  const { pieces, sets } = artInfo;
  const { owner } = wpInfo;

  useEffect(() => {
    if (
      (typeof activeDetails === "number" &&
        activeDetails >= 0 &&
        activeDetails < 5 &&
        !pieces[activeDetails]) ||
      (activeDetails === "setBonus" && !sets.length)
    ) {
      onCloseDetails();
    }
  }, [activeDetails, owner]);

  switch (activeDetails) {
    case "weapon":
      return (
        <div className={cn("flex flex-col", className)} style={style}>
          <div className="px-1 grow hide-scrollbar">
            <WeaponCard weapon={wpInfo} mutable={true} />
          </div>
          <Button className="mt-4 mx-auto" variant="positive" onClick={onClickSwitchWeapon}>
            Switch
          </Button>
        </div>
      );

    case "setBonus":
      return (
        <div className={cn("flex", className)} style={style}>
          <div className="px-1 hide-scrollbar">
            <SetBonus sets={sets} />
          </div>
        </div>
      );

    case "statsBonus":
      return (
        <div className={cn("flex", className)} style={style}>
          <div className="custom-scrollbar">
            <AttributeTable attributes={artAttr} />
          </div>
        </div>
      );

    default:
      const artPiece = pieces[activeDetails];
      if (activeDetails !== -1 && artPiece) {
        return (
          <div className={className} style={style}>
            <div className="pb-2 hide-scrollbar">
              <ArtifactCard artPiece={artPiece} mutable={true} />
            </div>
            <ButtonBar
              className="mt-6"
              texts={["Unequip", "Switch"]}
              handlers={[onClickUnequipArtifact, onClickSwitchArtifact]}
            />
          </div>
        );
      }
      return null;
  }
}
