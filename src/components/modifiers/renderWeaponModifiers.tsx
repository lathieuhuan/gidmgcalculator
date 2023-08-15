import type { AppWeapon, ModifierCtrl, Weapon, WeaponBuff } from "@Src/types";
import { findDataWeapon } from "@Data/controllers";
import { findByIndex, parseDescription } from "@Src/utils";
import { ModifierTemplate, type ModifierTemplateProps } from "../ModifierTemplate";

const getWeaponDescription = (descriptions: AppWeapon["descriptions"], buff: WeaponBuff, refi: number) => {
  if (descriptions?.length) {
    let { description = 0 } = buff;
    description = typeof description === "number" ? descriptions[description] : description;
    return parseDescription(description || "", refi);
  }
  return "";
};

interface RenderWeaponModifiersArgs {
  fromSelf?: boolean;
  keyPrefix: string | number;
  mutable?: boolean;
  weapon: Pick<Weapon, "code" | "type" | "refi">;
  ctrls: ModifierCtrl[];
  renderProps?: (
    ctrl: ModifierCtrl
  ) => Pick<ModifierTemplateProps, "checked" | "onToggle" | "onChangeText" | "onSelectOption" | "onToggleCheck">;
}
export const renderWeaponModifiers = ({
  fromSelf,
  keyPrefix,
  mutable,
  weapon,
  ctrls,
  renderProps,
}: RenderWeaponModifiersArgs) => {
  const data = findDataWeapon(weapon);
  if (!data) return [null];
  const { buffs = [], descriptions = [] } = data;

  return ctrls.map((ctrl) => {
    const buff = findByIndex(buffs, ctrl.index);
    if (!buff) return null;

    return (
      <ModifierTemplate
        key={`${keyPrefix}-${data.code}-${ctrl.index}`}
        mutable={mutable}
        heading={`${data.name} R${weapon.refi} ${fromSelf ? "(self)" : ""}`}
        description={getWeaponDescription(descriptions, buff, weapon.refi)}
        inputs={ctrl.inputs}
        inputConfigs={buff.inputConfigs}
        {...renderProps?.(ctrl)}
      />
    );
  });
};
