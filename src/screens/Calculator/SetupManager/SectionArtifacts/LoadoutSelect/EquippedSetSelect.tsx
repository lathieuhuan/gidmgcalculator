import clsx from "clsx";
import { useMemo, useState, useEffect } from "react";

import type { ElementType, UserArtifact } from "@Src/types";
import { useSelector } from "@Store/hooks";
import { selectUserArts, selectUserChars } from "@Store/userDatabaseSlice/selectors";
import { $AppCharacter, $AppData } from "@Src/services";
import { findById } from "@Src/utils";
import { useIntersectionObserver } from "@Src/pure-hooks";

import { Button, Image, ItemCase } from "@Src/pure-components";

type EquippedSetOption = {
  character: {
    code: number;
    name: string;
    icon: string;
    elementType: ElementType;
  };
  artifacts: UserArtifact[];
};

interface EquippedSetSelectProps {
  keyword?: string;
  onChangeArtifact: (artifact?: UserArtifact) => void;
  onSelectSet: (artifacts: UserArtifact[]) => void;
}
export const EquippedSetSelect = ({ keyword, onChangeArtifact, onSelectSet }: EquippedSetSelectProps) => {
  const [chosen, setChosen] = useState({
    characterCode: 0,
    artifactId: 0,
  });

  const characters = useSelector(selectUserChars);
  const artifacts = useSelector(selectUserArts);

  const { observedAreaRef, observedItemCls, visibleItems } = useIntersectionObserver<HTMLDivElement>();

  const shouldCheckKeyword = keyword && keyword.length >= 1;
  const lowerKeyword = keyword?.toLowerCase() ?? "";

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
            elementType: appChar.vision,
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

  useEffect(() => {
    const chosenElmt = observedAreaRef.current?.querySelector(`.${observedItemCls}[data-id="${chosen.characterCode}"]`);

    if (chosenElmt && window.getComputedStyle(chosenElmt).display === "none") {
      setChosen({
        characterCode: 0,
        artifactId: 0,
      });
      onChangeArtifact(undefined);
    }
  }, [keyword]);

  return (
    <div ref={observedAreaRef} className="pr-2 h-full custom-scrollbar">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {options.map(({ character, artifacts }, i) => {
          const visible = visibleItems[character.code];
          const hidden = shouldCheckKeyword && !character.name.toLowerCase().includes(lowerKeyword);
          const opacityCls = `transition-opacity duration-400 ${visible ? "opacity-100" : "opacity-0"}`;

          return (
            <div
              key={i}
              className={clsx("break-inside-avoid relative", observedItemCls, hidden && "hidden")}
              style={{ height: "8.75rem" }}
              data-id={character.code}
            >
              <Button
                className="absolute top-3 right-3"
                variant={character.code === chosen.characterCode ? "positive" : "default"}
                size="small"
                onClick={() => onSelectSet(artifacts)}
              >
                Select
              </Button>

              <div className="px-2 py-3 rounded-lg bg-dark-900">
                <div className="flex items-start space-x-2">
                  <div className={`w-14 h-14 ${opacityCls}`}>
                    {visible && <Image src={character.icon} imgType="character" />}
                  </div>
                  <p className={`text-lg text-${character.elementType} font-bold`}>{character.name}</p>
                </div>

                <div className={`mt-3 flex space-x-2`}>
                  {artifacts.map((artifact, j) => {
                    return (
                      <ItemCase
                        key={j}
                        className={`w-12 h-12 cursor-pointer ${opacityCls}`}
                        chosen={artifact.ID === chosen.artifactId}
                        onClick={() => {
                          setChosen({
                            characterCode: character.code,
                            artifactId: artifact.ID,
                          });
                          onChangeArtifact(artifact);
                        }}
                      >
                        {(className, imgCls) => {
                          return visible ? (
                            <Image
                              className={["p-1 rounded-circle", className]}
                              imgCls={imgCls}
                              src={imgMap[`${artifact.code}-${artifact.type}`]}
                              imgType="artifact"
                            />
                          ) : null;
                        }}
                      </ItemCase>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
