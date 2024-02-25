import { useMemo, useState } from "react";

import { UserArtifact } from "@Src/types";
import { useSelector } from "@Store/hooks";
import { selectUserArts, selectUserChars } from "@Store/userDatabaseSlice/selectors";
import { $AppCharacter, $AppData } from "@Src/services";
import { findById } from "@Src/utils";

import { Button, Image } from "@Src/pure-components";

type EquippedSetOption = {
  character: {
    code: number;
    name: string;
    icon: string;
    rarity: number;
  };
  artifacts: UserArtifact[];
};

interface EquippedSetSelectProps {
  onClickArtifact: (artifact: UserArtifact) => void;
  onSelectSet: (artifacts: UserArtifact[]) => void;
}
export const EquippedSetSelect = ({ onClickArtifact, onSelectSet }: EquippedSetSelectProps) => {
  const [chosenCode, setChosenCode] = useState(0);

  const characters = useSelector(selectUserChars);
  const artifacts = useSelector(selectUserArts);

  const { options, imgMap } = useMemo(() => {
    const options: EquippedSetOption[] = [];
    const imgMap: Record<string, string> = {};

    for (const character of characters) {
      if (character.artifactIDs.filter(Boolean).length) {
        const appChar = $AppCharacter.get(character.name);

        const option: EquippedSetOption = {
          character: {
            code: appChar.code,
            name: character.name,
            icon: appChar.icon,
            rarity: appChar.rarity,
          },
          artifacts: [],
        };

        for (const id of character.artifactIDs) {
          const artifact = findById(artifacts, id);

          if (artifact) {
            option.artifacts.push(artifact);
            imgMap[`${artifact.code}-${artifact.type}`] = $AppData.getArtifact(artifact)?.icon ?? "";
          }
        }
        options.push(option);
      }
    }

    return {
      options,
      imgMap,
    };
  }, []);

  return (
    <div className="columns-1 lg:columns-2 gap-2">
      {options.map(({ character, artifacts }, i) => {
        return (
          <div key={i} className="py-1 break-inside-avoid">
            <div className="p-2 rounded-lg bg-dark-900">
              <div className="flex justify-between items-start">
                <div className="flex space-x-4">
                  <div className="w-14 h-14">
                    <Image src={character.icon} imgType="character" />
                  </div>
                  <p className={`mt-1 text-lg text-rarity-${character.rarity} font-semibold`}>{character.name}</p>
                </div>

                <Button
                  className="m-1"
                  variant={character.code === chosenCode ? "positive" : "default"}
                  size="small"
                  onClick={() => onSelectSet(artifacts)}
                >
                  Select
                </Button>
              </div>

              <div className="mt-2 flex space-x-2">
                {artifacts.map((artifact, j) => {
                  return (
                    <div
                      key={j}
                      className="w-12 h-12"
                      onClick={() => {
                        setChosenCode(character.code);
                        onClickArtifact(artifact);
                      }}
                    >
                      <Image src={imgMap[`${artifact.code}-${artifact.type}`]} imgType="artifact" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
