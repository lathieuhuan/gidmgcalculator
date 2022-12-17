import clsx from "clsx";
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
import type { UserArtifacts, UserSetup, UserWeapon } from "@Src/types";
import type { MySetupModalType } from "../types";

// Constant
import { ARTIFACT_ICONS, ARTIFACT_TYPES } from "@Src/constants";

// Hook
import { useDispatch } from "@Store/hooks";

// Action
import { updateImportInfo } from "@Store/uiSlice";

// Selector
import {
  chooseUserSetup,
  switchShownSetupInComplex,
  uncombineSetups,
} from "@Store/userDatabaseSlice";

// Util
import { finalTalentLv, getImgSrc } from "@Src/utils";
import { findArtifactPiece, findCharacter, findWeapon, getPartyData } from "@Data/controllers";

// Component
import { CharacterPortrait, IconButton } from "@Components/atoms";
import { renderGearIcon } from "./utils";

interface SetupLayoutProps {
  ID: number;
  setup: UserSetup;
  setupName?: string;
  weapon: UserWeapon | null;
  artifacts: UserArtifacts;
  allIDs?: Record<string, number>;
  openModal: (type: MySetupModalType, ID?: number) => () => void;
}
export function SetupTemplate({
  ID,
  setup,
  setupName,
  weapon,
  artifacts,
  allIDs,
  openModal,
}: SetupLayoutProps) {
  const { type, char, party } = setup;
  const dispatch = useDispatch();

  const isOriginal = type === "original";

  const renderLinkButton = (ID: number, displayedID: number) => {
    const uncombine = () => {
      dispatch(uncombineSetups(ID));

      setTimeout(() => {
        dispatch(chooseUserSetup(displayedID));
      }, 10);
    };

    return window.innerWidth > 1025 ? (
      <button
        className="w-8 h-8 mr-2 rounded-circle text-default hover:bg-darkred flex-center group"
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

  const display = useMemo(() => {
    let mainCharacter = null;
    const charInfo = findCharacter(char);
    const weaponData = weapon ? findWeapon(weapon) : undefined;

    if (charInfo) {
      const talents = (["NAs", "ES", "EB"] as const).map((talentType) => {
        return finalTalentLv(char, talentType, getPartyData(party));
      });

      const renderSpan = (text: string | number) => (
        <span className={`font-medium text-${charInfo.vision}`}>{text}</span>
      );

      mainCharacter = (
        <div className="mx-auto lg:mx-0 flex">
          <img
            className="w-20 h-20"
            src={getImgSrc(charInfo.icon)}
            alt={char.name}
            draggable={false}
          />

          <div className="ml-4 flex-col justify-between">
            <p className="text-lg">Level {renderSpan(char.level)}</p>
            <p>Constellation {renderSpan(char.cons)}</p>
            <p>
              Talents: {renderSpan(talents[0])} / {renderSpan(talents[1])} /{" "}
              {renderSpan(talents[2])}
            </p>
          </div>
        </div>
      );
    }

    const teammate = (
      <div
        className={"flex space-x-4 " + (party.filter(Boolean).length ? "mt-4" : "")}
        style={{ width: "15.5rem" }}
      >
        {party.map((teammate, teammateIndex) => {
          if (!teammate) {
            return null;
          }
          const teammateSetupID = allIDs?.[teammate.name];
          const clickable = !isOriginal && teammateSetupID;
          // const { weapon, artifact } = teammate;
          // const teammateWp = findWeapon(weapon);
          // const teammateArt = findArtifactPiece({ code: artifact.code, type: "flower" });

          return (
            <div
              key={teammateIndex}
              className={clsx(
                "w-18 h-18",
                clickable
                  ? "rounded-circle shadow-3px-3px shadow-lightgold cursor-pointer"
                  : "group relative"
              )}
            >
              <CharacterPortrait
                name={teammate.name}
                onClickIcon={() => {
                  if (clickable) {
                    dispatch(
                      switchShownSetupInComplex({ complexID: ID, shownID: teammateSetupID })
                    );
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

    const gears = (
      <div className="mt-3 mx-auto grid grid-cols-3 gap-1">
        {weaponData ? renderGearIcon(weaponData, openModal("WEAPON"), "weapon") : null}

        {artifacts.map((artifact, i) => {
          if (artifact) {
            const artifactData = findArtifactPiece(artifact);
            return artifactData
              ? renderGearIcon(
                  {
                    icon: artifactData.icon,
                    beta: artifactData.beta,
                    rarity: artifact.rarity || 5,
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

    return {
      mainCharacter,
      teammate,
      gears,
    };
  }, []);

  return (
    <>
      <div
        className="px-2 flex justify-between flex-col lg:flex-row"
        onDoubleClick={() => console.log(setup)}
      >
        <div className="flex items-center" style={{ maxWidth: "22.5rem" }}>
          {!isOriginal && renderLinkButton(ID, setup.ID)}
          <p className="text-xl text-orange font-semibold truncate">{setupName || setup.name}</p>
        </div>

        <div className="mt-2 lg:mt-0 pb-2 flex space-x-4 justify-end">
          <IconButton
            className="p-2"
            variant="positive"
            onClick={() => {
              if (weapon) {
                const { weaponID, artifactIDs, ...rest } = setup;

                dispatch(
                  updateImportInfo({
                    type: "EDIT_SETUP",
                    data: {
                      ...rest,
                      weapon,
                      artifacts,
                    },
                  })
                );
              }
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
        <div className="flex flex-col">
          {display.mainCharacter}
          {display.teammate}
        </div>

        <div className="hidden lg:block w-0.5 mx-4 bg-darkblue-3" />

        <div className="mt-4 lg:mt-0 flex flex-col">
          <div className="flex justify-center space-x-4">
            <button
              className="px-4 py-1 bg-darkblue-3 font-semibold glow-on-hover leading-base rounded-2xl"
              onClick={openModal("STATS")}
            >
              Stats
            </button>
            <button
              className="px-4 py-1 bg-darkblue-3 font-semibold glow-on-hover leading-base rounded-2xl"
              onClick={openModal("MODIFIERS")}
            >
              Modifiers
            </button>
          </div>

          {display.gears}
        </div>
      </div>
    </>
  );
}
