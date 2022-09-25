import cn from "classnames";
import { useMemo } from "react";
import {
  FaCalculator,
  FaLink,
  FaPlus,
  FaShareAlt,
  FaTrashAlt,
  FaUnlink,
  FaWrench,
} from "react-icons/fa";
import type { Rarity, UsersSetup } from "@Src/types";
import type { MySetupModalType } from "../types";
import { ARTIFACT_ICONS, ARTIFACT_TYPES } from "@Src/constants";

import { findArtifactPiece, findCharacter, findWeapon, getPartyData } from "@Data/controllers";
import { useDispatch } from "@Store/hooks";
import { updateImportInfo } from "@Store/uiSlice";
import { finalTalentLv, wikiImg } from "@Src/utils";

import { CharFilledSlot } from "@Components/minors";
import { Button, IconButton } from "@Src/styled-components";
import { chooseUsersSetup, uncombineSetups } from "@Store/usersDatabaseSlice";

interface SetupLayoutProps {
  ID: number;
  setup: UsersSetup;
  setupName?: string;
  allIDs?: Record<string, number>;
  openModal: (type: MySetupModalType, ID?: number) => () => void;
}
export function SetupLayout({ ID, setup, setupName, allIDs, openModal }: SetupLayoutProps) {
  const { type, char, party } = setup;
  const dispatch = useDispatch();

  const isOriginal = type === "original";

  const renderLinkButton = (ID: number, displayedID: number) => {
    const uncombine = () => {
      dispatch(uncombineSetups(ID));

      setTimeout(() => {
        dispatch(chooseUsersSetup(displayedID));
      }, 10);
    };

    return window.innerWidth > 1050 ? (
      <button
        className="w-8 h-8 mr-2 rounded-circle text-white hover:bg-darkred flex-center group"
        onClick={uncombine}
      >
        <FaUnlink className="hidden group-hover:block" />
        <FaLink className="block group-hover:hidden" />
      </button>
    ) : (
      <IconButton className="mr-2" variant="negative" onClick={uncombine}>
        <FaUnlink />
      </IconButton>
    );
  };

  const mainCharacterDisplay = (() => {
    const charInfo = findCharacter(char);
    if (!charInfo) return null;

    const talents = (["NAs", "ES", "EB"] as const).map((talentType) => {
      return finalTalentLv(char, talentType, getPartyData(party));
    });

    const renderSpan = (text: string | number) => (
      <span className={`font-bold text-${charInfo.vision}`}>{text}</span>
    );

    return (
      <div className="flex justify-center">
        <img
          className="w-24"
          src={charInfo.beta ? charInfo.icon : wikiImg(charInfo.icon)}
          alt={char.name}
          draggable={false}
        />

        <div className="ml-2 pt-2 flex-col justify-between">
          <p className="text-h5">Level {renderSpan(char.level)}</p>
          <p className="text-h6">Constellation {renderSpan(char.cons)}</p>
          <p className="text-h6">
            Talents: {renderSpan(talents[0])} / {renderSpan(talents[1])} / {renderSpan(talents[2])}
          </p>
        </div>
      </div>
    );
  })();

  const teammatesDisplay = (
    <div className="mt-6 w-68 flex justify-between">
      {party.map((tm, tmIndex) => {
        if (!tm) return null;
        const memberID = allIDs?.[tm.name];
        const clickable = !isOriginal && memberID;

        return (
          <div
            key={tmIndex}
            className={cn(
              "w-20",
              clickable
                ? "rounded-circle shadow-3px-3px shadow-lightgold cursor-pointer"
                : "group relative"
            )}
          >
            <CharFilledSlot
              mutable={false}
              name={tm.name}
              onClickSlot={() => {
                if (clickable) {
                  // dispatch(
                  //   switchActiveSetupInComplexSetup({
                  //     complexID: ID,
                  //     newID: memberID,
                  //   })
                  // );
                }
              }}
            />
            {!clickable && (
              <div className="absolute -bottom-1 -right-1 z-10 hidden group-hover:block">
                <IconButton
                  variant="positive"
                  onClick={() => {
                    // dispatch(startImportSetup({ importInfo: { setup, tmIndex }, type: 3 }));
                  }}
                >
                  <FaCalculator />
                </IconButton>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const gearsDisplay = useMemo(() => {
    const weaponData = findWeapon(setup.weapon);

    const renderGearIcon = (
      { beta, icon, rarity }: { beta?: boolean; icon: string; rarity?: Rarity },
      onClick?: () => void,
      key?: number | string
    ) => {
      return (
        <div key={key} className="p-1">
          <button
            className={cn(
              `p-1 rounded flex glow-on-hover bg-gradient-${rarity}`,
              !onClick && "cursor-default"
            )}
            onClick={onClick}
          >
            <img style={{ width: "4.25rem" }} src={beta ? icon : wikiImg(icon)} alt="" />
          </button>
        </div>
      );
    };

    return (
      <div className="flex flex-wrap mx-auto" style={{ width: "15.75rem" }}>
        {weaponData ? renderGearIcon(weaponData, openModal("WEAPON"), "weapon") : null}

        {setup.artInfo.pieces.map((artP, i) => {
          if (artP) {
            const artifactData = findArtifactPiece(artP);
            return artifactData
              ? renderGearIcon(
                  {
                    icon: artifactData.icon,
                    beta: artifactData.beta,
                    rarity: artP.rarity || 5,
                  },
                  openModal("ARTIFACTS"),
                  i
                )
              : null;
          }
          return renderGearIcon({ icon: ARTIFACT_ICONS[ARTIFACT_TYPES[i]] }, undefined, i);
        })}
      </div>
    );
  }, [setup.ID]);

  return (
    <>
      <div
        className="px-2 flex justify-between flex-col lg:flex-row"
        onDoubleClick={() => console.log(setup)}
      >
        <div className="w-68 lg:w-96 flex items-center">
          {!isOriginal && renderLinkButton(ID, setup.ID)}
          <p className="text-h3 text-orange font-bold truncate">{setupName || setup.name}</p>
        </div>

        <div className="mt-4 lg:mt-0 pb-4 flex space-x-6 justify-end">
          <IconButton
            className="p-2"
            variant="positive"
            onClick={() => {
              dispatch(updateImportInfo({ type: "EDIT_SETUP", data: setup }));
            }}
          >
            <FaWrench />
          </IconButton>

          <IconButton
            className="p-2 glow-on-hover"
            variant="neutral"
            onClick={openModal("SHARE_SETUP", setup.ID)}
          >
            <FaShareAlt />
          </IconButton>

          {isOriginal ? (
            <IconButton variant="negative" onClick={openModal("REMOVE_SETUP", setup.ID)}>
              <FaTrashAlt />
            </IconButton>
          ) : (
            <IconButton
              variant="neutral"
              disabled={!allIDs || Object.keys(allIDs).length >= 4}
              onClick={openModal("COMBINE_MORE", ID)}
            >
              <FaPlus />
            </IconButton>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 pb-3 rounded-lg bg-darkblue-1 flex flex-col lg:flex-row">
        <div>
          {mainCharacterDisplay}
          {teammatesDisplay}
        </div>

        <div className="hidden lg:block w-0.5 mx-4 bg-darkblue-3" />

        <div className="mt-4 lg:mt-0">
          <div className="mb-2 flex justify-center space-x-4">
            <Button variant="default" onClick={openModal("STATS")}>
              Stats
            </Button>

            <Button variant="default" onClick={openModal("MODIFIERS")}>
              Modifiers
            </Button>
          </div>

          {gearsDisplay}
        </div>
      </div>
    </>
  );
}
