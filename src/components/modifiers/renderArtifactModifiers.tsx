import { appData } from "@Data/index";
import { AppArtifact, ArtifactModifier, ModifierCtrl } from "@Src/types";
import { findByIndex, parseArtifactDescription, toArray } from "@Src/utils";
import { ModifierTemplate, type ModifierTemplateProps } from "../ModifierTemplate";

export const getArtifactDescription = (data: AppArtifact, modifier: ArtifactModifier) => {
  return parseArtifactDescription(
    toArray(modifier.description).reduce((acc, index) => `${acc} ${data.descriptions[index] || ""}`, "")
  );
};

interface RenderArtifactBuffsArgs {
  fromSelf?: boolean;
  keyPrefix: string | number;
  mutable?: boolean;
  code: number;
  ctrls: ModifierCtrl[];
  getHanlders?: (ctrl: ModifierCtrl, ctrlIndex: number) => Pick<ModifierTemplateProps, "onToggle" | "onSelectOption">;
}
export const renderArtifactBuffs = ({
  fromSelf,
  keyPrefix,
  mutable,
  code,
  ctrls,
  getHanlders,
}: RenderArtifactBuffsArgs) => {
  const data = appData.getArtifactSetData(code);
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
