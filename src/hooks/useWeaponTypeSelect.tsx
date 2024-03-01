import { WEAPON_TYPE_ICONS } from "@Src/constants";
import { IconSelectConfig, IconSelectInitialValues, useIconSelect } from "@Src/pure-hooks";
import { WeaponType } from "@Src/types";

export const useWeaponTypeSelect = (
  initialValues?: IconSelectInitialValues<WeaponType>,
  config?: Omit<IconSelectConfig<WeaponType>, "selectedCls">
) => {
  const mergedConfig: IconSelectConfig<WeaponType> = {
    ...config,
    selectedCls: "shadow-3px-3px shadow-green-200",
  };
  const { selectedIcons, updateSelectedIcons, renderIconSelect } = useIconSelect(
    WEAPON_TYPE_ICONS,
    initialValues,
    mergedConfig
  );

  return {
    weaponTypes: selectedIcons,
    updateWeaponTypes: updateSelectedIcons,
    renderWeaponTypeSelect: renderIconSelect,
  };
}
