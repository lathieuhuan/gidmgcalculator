import type { AppCharacter, Talent } from "@Src/types";
import { useConsDescriptions } from "./useConsDescriptions";

// Conponent
import { CloseButton, Green, Dim, LoadingIcon } from "@Src/pure-components";
import { SlideShow } from "../ability-list-components";

interface ConstellationDetailProps {
  appChar: AppCharacter;
  consLv: number;
  onChangeConsLv?: (newLv: number) => void;
  onClose?: () => void;
}
export const ConstellationDetail = ({ appChar, consLv, onChangeConsLv, onClose }: ConstellationDetailProps) => {
  const { vision: elementType, constellation, talentLvBonus = {}, activeTalents } = appChar;
  const consInfo = constellation[consLv - 1] || {};

  const { isLoading, isError, descriptions } = useConsDescriptions(appChar.name, {
    auto: !constellation[0].description,
  });

  let description;

  if (consLv === 3 || consLv === 5) {
    const [talent] = Object.entries(talentLvBonus).find(([, cons]) => cons === consLv) || [];
    const { name } = activeTalents[talent as Talent] || {};

    if (name) {
      description = `Increases the Level of ${name} by 3.\nMaximum upgrade level is 15.`;
    }
  } else {
    description = consInfo.description;
  }

  return (
    <div className="h-full flex flex-col hide-scrollbar">
      <SlideShow
        forTalent={false}
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
      <div className="mt-3 grow hide-scrollbar">
        {description ? (
          <p className="whitespace-pre-wrap">{description}</p>
        ) : (
          <p className={isLoading ? " py-4 flex justify-center" : ""}>
            <LoadingIcon active={isLoading} />
            {isError && <Dim>Error. Rebooting...</Dim>}
            {descriptions?.[consLv - 1]}
          </p>
        )}
      </div>

      <div className="mt-3">
        <CloseButton className="mx-auto" size="small" onClick={onClose} />
      </div>
    </div>
  );
};
