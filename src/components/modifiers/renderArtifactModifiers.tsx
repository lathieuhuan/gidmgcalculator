import { $AppData } from "@Src/services";
import { AppArtifact, ArtifactModifier, ModifierCtrl } from "@Src/types";
import { findByIndex, parseArtifactDescription, toArray } from "@Src/utils";
import { ModifierTemplate, type ModifierTemplateProps } from "../ModifierTemplate";

export const getArtifactDescription = (data: AppArtifact, modifier: ArtifactModifier) => {
  return parseArtifactDescription(
    toArray(modifier.description).reduce<string>((acc, description) => {
      return `${acc} ${typeof description === "string" ? description : data.descriptions[description] || ""}`;
    }, "")
  );
};

interface RenderArtifactBuffsArgs {
  fromSelf?: boolean;
  keyPrefix: string | number;
  mutable?: boolean;
  code: number;
  ctrls: ModifierCtrl[];
  getHanlders?: (
    ctrl: ModifierCtrl,
    ctrlIndex: number
  ) => Pick<ModifierTemplateProps, "onToggle" | "onToggleCheck" | "onChangeText" | "onSelectOption">;
}
export const renderArtifactModifiers = ({
  fromSelf,
  keyPrefix,
  mutable,
  code,
  ctrls,
  getHanlders,
}: RenderArtifactBuffsArgs) => {
  const data = $AppData.getArtifactSetData(code);
  if (!data) return [];
  const { buffs = [] } = data;

  return ctrls.map((ctrl, index) => {
    const buff = findByIndex(buffs, ctrl.index);
    if (!buff) return null;

    const description = getArtifactDescription(data, buff);

    return (
      <ModifierTemplate
        key={`${keyPrefix}-${code}-${ctrl.index}`}
        mutable={mutable}
        checked={ctrl.activated}
        heading={`${data.name} ${fromSelf ? "(self)" : ""}`}
        description={description}
        inputs={ctrl.inputs}
        inputConfigs={buff.inputConfigs}
        {...getHanlders?.(ctrl, index)}
      />
    );
  });
};
