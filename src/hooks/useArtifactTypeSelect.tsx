import { ARTIFACT_TYPE_ICONS } from "@Src/constants";
import { IconSelectConfig, IconSelectInitialValues, useIconSelect } from "@Src/pure-hooks";
import { ArtifactType } from "@Src/types";

export const useArtifactTypeSelect = (
  initialValues?: IconSelectInitialValues<ArtifactType>,
  config?: Omit<IconSelectConfig<ArtifactType>, "iconCls" | "selectedCls">
) => {
  const finalConfig: IconSelectConfig<ArtifactType> = {
    ...config,
    iconCls: "p-1",
    selectedCls: "bg-green-200",
  };
  const { selectedIcons, updateSelectedIcons, renderIconSelect } = useIconSelect(
    ARTIFACT_TYPE_ICONS,
    initialValues,
    finalConfig
  );

  return {
    artifactTypes: selectedIcons,
    updateArtifactTypes: updateSelectedIcons,
    renderArtifactTypeSelect: renderIconSelect,
  };
};
