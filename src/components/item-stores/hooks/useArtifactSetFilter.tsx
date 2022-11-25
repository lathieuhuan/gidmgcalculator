import cn from "classnames";
import { useState } from "react";
import type { Artifact, CalcArtPiece } from "@Src/types";
import { findByCode, getImgSrc } from "@Src/utils";
import { findArtifactPiece } from "@Data/controllers";
import { Button } from "@Src/styled-components";

interface UseArtifactSetFilterArgs {
  artifactType?: Artifact;
  artifacts: CalcArtPiece[];
  codes: number[];
}
export function useArtifactSetFilter({
  artifactType = "flower",
  artifacts,
  codes,
}: UseArtifactSetFilterArgs) {
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

  const renderArtifactSetFilter = () => (
    <div className="w-72 flex flex-col rounded-lg bg-darkblue-2" style={{ minWidth: "18rem" }}>
      <Button
        className="mt-2 mx-auto"
        variant="negative"
        disabled={tempSets.every((set) => !set.chosen)}
        onClick={() => setTempSets(tempSets.map((set) => ({ ...set, chosen: false })))}
      >
        Turn all off
      </Button>
      <div className="px-1 py-2 h-96 hide-scrollbar">
        <div className="flex flex-wrap">
          {tempSets.map((set, i) => {
            return (
              <div
                key={i}
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
                      findArtifactPiece({ code: set.code, type: artifactType })?.icon || ""
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

  const filteredTempCodes = tempSets.reduce((codes: number[], tempSet) => {
    if (tempSet.chosen) {
      codes.push(tempSet.code);
    }
    return codes;
  }, []);

  return {
    filteredTempCodes,
    setTempSets,
    renderArtifactSetFilter,
  };
}
