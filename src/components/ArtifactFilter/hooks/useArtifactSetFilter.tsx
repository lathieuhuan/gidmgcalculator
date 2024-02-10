import clsx, { ClassValue } from "clsx";
import { useMemo, useState } from "react";
import { FaEraser } from "react-icons/fa";

import type { ArtifactType, CalcArtifact } from "@Src/types";
import { Button, Image } from "@Src/pure-components";
import { $AppData } from "@Src/services";
import { findByCode } from "@Src/utils";
import { ArtifactFilterSet } from "../types";

export function useArtifactSetFilter(
  artifacts: CalcArtifact[],
  chosenCodes: number[],
  artifactType: ArtifactType = "flower"
) {
  const initialSets = useMemo(() => {
    const result: ArtifactFilterSet[] = [];

    for (const { code } of artifacts) {
      if (!findByCode(result, code)) {
        const { icon = "" } = $AppData.getArtifactData({ code, type: artifactType }) || {};

        result.push({
          code,
          chosen: chosenCodes.includes(code),
          icon,
        });
      }
    }
    return result;
  }, []);

  const [filterSets, setFilterSets] = useState<ArtifactFilterSet[]>(initialSets);

  const toggleSet = (index: number) => {
    setFilterSets((prev) => {
      const result = [...prev];
      result[index].chosen = !result[index].chosen;
      return result;
    });
  };

  const clearFilter = () => {
    setFilterSets(filterSets.map((set) => ({ ...set, chosen: false })));
  };

  const renderArtifactSetFilter = (className?: ClassValue, setsWrapCls = "") => {
    return (
      <div className={clsx("w-full h-full flex flex-col space-y-4", className)}>
        <div className="grow hide-scrollbar">
          <div className={setsWrapCls}>
            {filterSets.map((set, i) => {
              return (
                <div key={i} className="p-2" onClick={() => toggleSet(i)}>
                  <div
                    className={clsx(
                      "rounded-circle",
                      set.chosen ? "shadow-3px-2px shadow-green-300 bg-dark-900" : "bg-transparent"
                    )}
                  >
                    <Image src={set.icon} imgType="artifact" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="shrink-0 flex space-x-2">
          <Button
            size="small"
            icon={<FaEraser />}
            disabled={filterSets.every((set) => !set.chosen)}
            onClick={clearFilter}
          >
            Clear all
          </Button>
        </div>
      </div>
    );
  };

  return {
    filterSets,
    operate: {
      toggleSet,
      clearFilter,
    },
    renderArtifactSetFilter,
  };
}
