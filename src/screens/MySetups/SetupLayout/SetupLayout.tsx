import cn from "classnames";
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
import { finalTalentLv, wikiImg } from "@Src/utils";

import { CharFilledSlot } from "@Components/minors";
import { Button, IconButton } from "@Src/styled-components";
import { useMemo } from "react";

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
      // dispatch(unCombineComplexSetup(ID));
      // setTimeout(() => {
      //   dispatch(chooseUsersSetup(shownID));
      // }, 10);
    };

    return window.innerWidth > 1050 ? (
      <button className="w-8 h-8 rounded-circle text-white hover:bg-darkred" onClick={uncombine}>
        <FaLink />
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
    <div className="mt-6 w-68 flex">
      {party.map((tm, tmIndex) => {
        if (!tm) return null;
        const memberID = allIDs?.[tm.name];
        const clickable = !isOriginal && memberID;

        return (
          <div
            key={tmIndex}
            className={cn(
              "w-20",
              clickable ? "shadow-3px-3px shadow-lightgold cursor-pointer" : "group relative"
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
      onClick: () => void = () => {},
      index?: number
    ) => {
      return (
        <div key={index} className="p-1">
          <button
            className={`p-1 rounded flex glow-on-hover bg-gradient-${rarity}`}
            onClick={onClick}
          >
            <img style={{ width: "4.25rem" }} src={beta ? icon : wikiImg(icon)} alt="" />
          </button>
        </div>
      );
    };

    return (
      <div className="flex flex-wrap" style={{ width: "15.75rem" }}>
        {weaponData ? renderGearIcon(weaponData, openModal("WEAPON")) : null}

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
      <div className="px-2 flex justify-between">
        <div className="flex items-center" style={{ width: "24.5rem" }}>
          {!isOriginal && renderLinkButton(ID, setup.ID)}
          <p className="text-h3 text-orange font-bold truncate">{setupName || setup.name}</p>
        </div>

        <div className="pb-4 flex gap-6">
          <IconButton
            className="p-2"
            variant="positive"
            onClick={() => {
              // dispatch(startImportSetup({ importInfo: setup, type: 1 }));
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
              disabled={!allIDs || Object.keys(allIDs).length < 4}
              onClick={openModal("ADD_TO_COMPLEX", ID)}
            >
              <FaPlus />
            </IconButton>
          )}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-darkblue-1 flex">
        <div>
          {mainCharacterDisplay}
          {teammatesDisplay}
        </div>

        <div className="w-0.5 mx-4 bg-darkblue-3" />

        <div>
          <div className="mb-2 flex justify-center gap-4">
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
