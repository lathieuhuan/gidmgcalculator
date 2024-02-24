import { AppEntityOptions } from "@Src/components";
import { $AppData } from "@Src/services";
import { useMemo } from "react";

type SetOption = {
  code: number;
  beta?: boolean;
  name: string;
  rarity: number;
  icon: string;
};

interface DefaultSetOptionsProps {
  className?: string;
  rarity: number;
  onSelect: (option: SetOption) => void;
  onClose: () => void;
}
export const DefaultSetOptions = ({ className, rarity, onSelect, onClose }: DefaultSetOptionsProps) => {
  const data = useMemo(() => {
    const result: SetOption[] = [];

    for (const artifact of $AppData.getAllArtifacts()) {
      if (artifact.variants.includes(rarity)) {
        result.push({
          code: artifact.code,
          beta: artifact.beta,
          name: artifact.name,
          rarity,
          icon: artifact.flower.icon,
        });
      }
    }
    return result;
  }, []);

  return (
    <AppEntityOptions
      className={className}
      data={data}
      onSelect={(info) => {
        onSelect(info);
        return true;
      }}
      onClose={onClose}
    />
  );
};
