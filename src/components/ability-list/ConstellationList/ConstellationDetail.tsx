import type { AppCharacter } from "@Src/types";
import { $AppCharacter } from "@Src/services";
import { useQuery } from "@Src/hooks/useQuery";

// Conponent
import { CloseButton, Green, Dim, LoadingIcon } from "@Src/pure-components";
import { AbilityCarousel } from "../ability-list-components";

const useConsDescriptions = (characterName: string) => {
  return useQuery(characterName, () => $AppCharacter.fetchConsDescriptions(characterName));
};

interface ConstellationDetailProps {
  appChar: AppCharacter;
  consLv: number;
  onChangeConsLv?: (newLv: number) => void;
  onClose?: () => void;
}
export const ConstellationDetail = ({ appChar, consLv, onChangeConsLv, onClose }: ConstellationDetailProps) => {
  const { vision: elementType, constellation } = appChar;
  const consInfo = constellation[consLv - 1] || {};

  const { isLoading, isError, data: descriptions } = useConsDescriptions(appChar.name);

  return (
    <div className="h-full flex flex-col hide-scrollbar">
      <AbilityCarousel
        className="pt-2 pb-4"
        currentIndex={consLv - 1}
        images={constellation.map((cons) => cons.image)}
        elementType={elementType}
        onClickBack={() => onChangeConsLv?.(consLv - 1)}
        onClickNext={() => onChangeConsLv?.(consLv + 1)}
      />
      <p className={`text-xl text-${elementType} font-bold`}>{consInfo.name}</p>
      <p className="text-sm">
        Constellation Lv. <Green b>{consLv}</Green>
      </p>
      <div className="mt-3 hide-scrollbar">
        <p className={isLoading ? "py-4 flex justify-center" : "whitespace-pre-wrap"}>
          <LoadingIcon active={isLoading} />
          {isError && <Dim>Error. Rebooting...</Dim>}
          {descriptions?.[consLv - 1]}
        </p>
      </div>

      <div className="mt-3">
        <CloseButton className="mx-auto" size="small" onClick={onClose} />
      </div>
    </div>
  );
};
