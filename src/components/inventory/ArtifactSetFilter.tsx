import clsx, { ClassValue } from "clsx";
import { Button, Image } from "@Src/pure-components";
import { FilterSet } from "./hooks";
import { BiReset } from "react-icons/bi";

interface ArtifactSetFilterProps {
  className?: ClassValue;
  setsWrapCls?: string;
  filterSets: FilterSet[];
  onClickSet: (index: number) => void;
  onClearFilter: () => void;
}
export const ArtifactSetFilter = ({
  className,
  setsWrapCls,
  filterSets,
  onClickSet,
  onClearFilter,
}: ArtifactSetFilterProps) => {
  return (
    <div className={clsx("w-full h-full flex flex-col", className)}>
      <div className="shrink-0 flex justify-end space-x-2">
        <Button
          size="small"
          icon={<BiReset className="text-lg" />}
          disabled={filterSets.every((set) => !set.chosen)}
          onClick={onClearFilter}
        >
          Clear All
        </Button>
      </div>

      <div className="mt-4 grow hide-scrollbar">
        <div className={setsWrapCls}>
          {filterSets.map((set, i) => {
            return (
              <div
                key={i}
                className="p-2"
                style={{
                  minWidth: 76,
                }}
                onClick={() => onClickSet(i)}
              >
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
    </div>
  );
};
