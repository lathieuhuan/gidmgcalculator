import cn from "classnames";
import { useState } from "react";
import type { ArtifactAttribute, UsersWeapon } from "@Src/types";
import type { ArtifactInfo, Details } from "./types";

import { useDispatch } from "@Store/hooks";
import { switchArtifact, switchWeapon, unequipArtifact } from "@Store/usersDatabaseSlice";
import { ARTIFACT_TYPES } from "@Src/constants";

import { SharedSpace } from "@Components/minors";
import { InventoryWeapon } from "@Components/item-stores/InventoryWeapon";
import { InventoryArtifact } from "@Components/item-stores/InventoryArtifact";
import { CloseButton } from "@Src/styled-components";
import { GearsOverview } from "./GearsOverview";
import GearsDetails from "./GearsDetails";

interface GearsProps {
  wpInfo: UsersWeapon;
  artInfo: ArtifactInfo;
  artAttr: ArtifactAttribute;
}
export default function Gears(props: GearsProps) {
  const { wpInfo, artInfo } = props;

  const [activeDetails, setActiveDetails] = useState<Details>(-1);
  const [showingDetails, setShowingDetails] = useState(false);
  const [inventoryCode, setInventoryCode] = useState(-1);

  const dispatch = useDispatch();
  const oldOwner = wpInfo.owner;
  const onSmallDevice = window.innerWidth < 686;

  const toggleDetails = (type: Details) => {
    if (activeDetails === type) {
      setShowingDetails(false);
      setTimeout(() => setActiveDetails(-1), 200);
    } else {
      setShowingDetails(true);
      setActiveDetails(type);
    }
  };

  const overviewComponent = (
    <GearsOverview
      wpInfo={wpInfo}
      artInfo={artInfo}
      activeDetails={activeDetails}
      toggleDetails={toggleDetails}
      onClickEmptyArtIcon={setInventoryCode}
    />
  );

  const detailsComponent = activeDetails !== -1 && (
    <GearsDetails
      className={cn(
        "max-h-full",
        onSmallDevice ? "" : "px-3 py-4 border-l-2 border-darkblue-2 rounded-r-lg bg-darkblue-1"
      )}
      style={{ width: onSmallDevice ? undefined : "20.25rem" }}
      activeDetails={activeDetails}
      {...props}
      onClickSwitchWeapon={() => setInventoryCode(5)}
      onClickSwitchArtifact={() => {
        if (typeof activeDetails === "number") {
          setInventoryCode(activeDetails);
        }
      }}
      onClickUnequipArtifact={() => {
        if (typeof activeDetails === "number") {
          const artPiece = artInfo.pieces[activeDetails];

          if (artPiece) {
            setShowingDetails(false);
            setTimeout(() => {
              setActiveDetails(-1);
              dispatch(
                unequipArtifact({
                  owner: artPiece.owner,
                  artifactID: artPiece.ID,
                  artifactIndex: activeDetails,
                })
              );
            }, 200);
          }
        }
      }}
      onCloseDetails={() => toggleDetails(activeDetails)}
    />
  );

  return (
    <>
      {onSmallDevice ? (
        <div className="ml-2 h-full w-75 px-4 rounded-lg bg-darkblue-1 box-content">
          <SharedSpace
            atLeft={!showingDetails}
            leftPart={overviewComponent}
            rightPart={
              <div className="h-full py-4 flex flex-col">
                <div className="flex justify-center">
                  <CloseButton onClick={() => toggleDetails(activeDetails)} />
                </div>
                <div className="pt-3 grow hide-scrollbar">{detailsComponent}</div>
              </div>
            }
          />
        </div>
      ) : (
        <div className="ml-2 h-full flex">
          <div className="w-75 px-4 rounded-lg bg-darkblue-1 box-content">{overviewComponent}</div>
          <div
            className="py-2 hide-scrollbar transition-all duration-200 ease-in-out"
            style={{ width: showingDetails ? "20.25rem" : 0 }}
          >
            {detailsComponent}
          </div>
        </div>
      )}

      <InventoryWeapon
        active={inventoryCode === 5}
        owner={oldOwner}
        weaponType={wpInfo.type}
        buttonText="Switch"
        onClickButton={({ owner, ID }) => {
          if (oldOwner) {
            dispatch(switchWeapon({ newOwner: owner, newID: ID, oldOwner, oldID: wpInfo.ID }));
          }
        }}
        onClose={() => setInventoryCode(-1)}
      />

      <InventoryArtifact
        active={inventoryCode >= 0 && inventoryCode < 5}
        currentPieces={artInfo.pieces}
        artifactType={ARTIFACT_TYPES[inventoryCode]}
        owner={oldOwner}
        buttonText="Switch"
        onClickButton={({ owner, ID }) => {
          if (oldOwner) {
            dispatch(
              switchArtifact({
                newOwner: owner,
                newID: ID,
                oldOwner,
                oldID: artInfo.pieces[inventoryCode]?.ID || 0,
                artifactIndex: inventoryCode,
              })
            );
          }
        }}
        onClose={() => setInventoryCode(-1)}
      />
    </>
  );
}
