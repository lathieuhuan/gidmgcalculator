import cn from "classnames";
import { useState } from "react";
import type { Artifact, CalcArtPiece } from "@Src/types";
import { findByCode, getImgSrc } from "@Src/utils";
import { findArtifactPiece } from "@Data/controllers";
import { Button } from "@Src/styled-components";

interface UseArtSetFilterArgs {
  artifactType?: Artifact;
  artifacts: CalcArtPiece[];
  codes: number[];
}
export function useArtSetFilter({ artifactType, artifacts, codes }: UseArtSetFilterArgs) {
  //
  const [tempSets, setTempSets] = useState(
    (() => {
      const result = [];
      for (const { code } of artifacts) {
        if (!findByCode(result, code)) {
          result.push({ code, chosen: codes.includes(code) });
        }
      }
      return result;
    })()
  );

  const setsFilter = (
    <div className="w-72 min-w-[18rem] flex flex-col rounded-lg bg-darkblue-2">
      <Button
        className="mt-2 mx-auto"
        variant="negative"
        disabled={tempSets.every((set) => !set.chosen)}
        onClick={() => setTempSets(tempSets.map((set) => ({ ...set, chosen: false })))}
      >
        Turn All Off
      </Button>
      <div className="px-1 py-2 h-96 hide-scrollbar">
        <div className="flex flex-wrap">
          {tempSets.map((set, i) => {
            return (
              <div
                key={set.code}
                className="w-1/4 p-1"
                onClick={() => {
                  setTempSets((prev) => {
                    const result = [...prev];
                    result[i].chosen = !set.chosen;
                    return result;
                  });
                }}
              >
                <div
                  className={cn(
                    "p-1 rounded-circle",
                    set.chosen ? "shadow-3px-2px shadow-green bg-darkblue-1" : "bg-transparent"
                  )}
                >
                  <img
                    src={getImgSrc(
                      findArtifactPiece({ code: set.code, type: artifactType || "flower" }).icon
                    )}
                    alt=""
                    width="100%"
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const filteredTempCode = [];
  for (const { chosen, code } of tempSets) {
    if (chosen) filteredTempCode.push(code);
  }

  return [setsFilter, filteredTempCode, setTempSets] as const;
}
