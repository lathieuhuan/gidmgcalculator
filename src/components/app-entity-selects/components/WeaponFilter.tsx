import clsx, { ClassValue } from "clsx";
import { useWeaponTypeSelect } from "@Src/hooks";
import { useRaritySelect } from "@Src/pure-hooks";
import { WeaponType } from "@Src/types";

// Component
import { ButtonGroup, FilterTemplate } from "@Src/pure-components";

export type WeaponFilterState = {
  types: WeaponType[];
  rarities: number[];
};

export interface WeaponFilterProps {
  className?: ClassValue;
  initialFilter?: WeaponFilterState;
  withTypeSelect?: boolean;
  disabledCancel?: boolean;
  onCancel: () => void;
  onDone: (filter: WeaponFilterState) => void;
}
export const WeaponFilter = ({
  className,
  initialFilter,
  withTypeSelect = true,
  disabledCancel,
  onCancel,
  onDone,
}: WeaponFilterProps) => {
  const { weaponTypes, updateWeaponTypes, renderWeaponTypeSelect } = useWeaponTypeSelect(initialFilter?.types, {
    multiple: true,
  });
  const { rarities, updateRarities, renderRaritySelect } = useRaritySelect([5, 4, 3, 2, 1], initialFilter?.rarities, {
    multiple: true,
  });

  const onConfirm = () => {
    onDone({
      types: weaponTypes,
      rarities,
    });
  };

  return (
    <div className={clsx("p-4 bg-dark-900 flex flex-col", className)}>
      <div className="grow space-y-4 hide-scrollbar">
        {withTypeSelect ? (
          <>
            <FilterTemplate
              title="Filter by Type"
              disabledClearAll={!weaponTypes.length}
              onClickClearAll={() => updateWeaponTypes([])}
            >
              {renderWeaponTypeSelect("px-1")}
            </FilterTemplate>

            <div className="w-full h-px bg-dark-300" />
          </>
        ) : null}

        <FilterTemplate
          title="Filter by Rarity"
          disabledClearAll={!rarities.length}
          onClickClearAll={() => updateRarities([])}
        >
          {renderRaritySelect(undefined, { maxWidth: "14rem" })}
        </FilterTemplate>
      </div>

      <ButtonGroup.Confirm
        className="mt-4"
        justify="end"
        focusConfirm
        cancelButtonProps={{
          disabled: disabledCancel,
        }}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </div>
  );
};
