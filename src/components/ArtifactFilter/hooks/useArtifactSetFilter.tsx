import clsx, { ClassValue } from "clsx";
import { useMemo, useState } from "react";

import type { ArtifactType, CalcArtifact } from "@Src/types";
import { FilterTemplate, Image } from "@Src/pure-components";
import { $AppData } from "@Src/services";
import { findByCode } from "@Src/utils";
import { ArtifactFilterSet } from "../types";

type Config = {
  artifactType?: ArtifactType;
  title?: React.ReactNode;
};

export function useArtifactSetFilter(artifacts: CalcArtifact[], chosenCodes: number[], config?: Config) {
  const { artifactType = "flower", title = "Filter by Set" } = config || {};

  const initialSets = useMemo(() => {
    const result: ArtifactFilterSet[] = [];

    for (const { code } of artifacts) {
      if (!findByCode(result, code)) {
        const { icon = "" } = $AppData.getArtifact({ code, type: artifactType }) || {};

        result.push({
          code,
          chosen: chosenCodes.includes(code),
          icon,
        });
      }
    }
    return result;
  }, []);

  const [setOptions, setSetOptions] = useState<ArtifactFilterSet[]>(initialSets);

  const toggleSet = (index: number) => {
    setSetOptions((prev) => {
      const result = [...prev];
      result[index].chosen = !result[index].chosen;
      return result;
    });
  };

  const clearFilter = () => {
    setSetOptions(setOptions.map((set) => ({ ...set, chosen: false })));
  };

  const renderArtifactSetFilter = (className?: ClassValue, setsWrapCls = "") => {
    return (
      <FilterTemplate
        className={["h-full flex flex-col", className]}
        title={title}
        disabledClearAll={setOptions.every((set) => !set.chosen)}
        onClickClearAll={clearFilter}
      >
        <div className="grow custom-scrollbar">
          <div className={setsWrapCls}>
            {setOptions.map((set, i) => {
              return (
                <div key={i} className="p-2" onClick={() => toggleSet(i)}>
                  <div
                    className={clsx(
                      "rounded-circle",
                      set.chosen ? "shadow-3px-2px shadow-green-300 bg-dark-900" : "bg-transparent"
                    )}
                  >
                    <Image className="p-1" src={set.icon} imgType="artifact" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FilterTemplate>
    );
  };

  return {
    setOptions,
    renderArtifactSetFilter,
  };
}
