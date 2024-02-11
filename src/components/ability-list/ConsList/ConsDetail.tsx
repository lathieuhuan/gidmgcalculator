import { useEffect, useRef, useState } from "react";

import type { AppCharacter, Talent } from "@Src/types";
import { $AppData } from "@Src/services";

// Conponent
import { CloseButton, Green, Dim, LoadingIcon } from "@Src/pure-components";
import { SlideShow } from "../components";

const useConsDescriptions = (name: string, options?: { auto: boolean }) => {
  const { auto = true } = options || {};
  const state = useRef({
    mounted: true,
    status: "idle" as "idle" | "loading" | "error" | "success",
    descriptions: null as string[] | null,
  });
  const [boo, setBoo] = useState(false);

  useEffect(() => {
    return () => {
      state.current.mounted = false;
    };
  }, []);

  const getConstellation = async () => {
    const response = await $AppData.fetchConsDescriptions(name);

    if (state.current.mounted) {
      if (response.code === 200) {
        state.current.status = "success";
        state.current.descriptions = response.data || [];
      } else {
        state.current.status = "error";
      }
    }
    setBoo(!boo);
  };

  if (auto && state.current.status === "idle") {
    state.current.status = "loading";
  }

  if (state.current.status === "loading") {
    getConstellation();
  }

  const { status, descriptions } = state.current;

  return {
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
    descriptions,
  };
};

interface ConsDetailProps {
  appChar: AppCharacter;
  consLv: number;
  onChangeConsLv?: (newLv: number) => void;
  onClose?: () => void;
}
export const ConsDetail = ({ appChar, consLv, onChangeConsLv, onClose }: ConsDetailProps) => {
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
    <div className="h-full flex-col hide-scrollbar">
      <SlideShow
        forTalent={false}
        currentIndex={consLv - 1}
        images={constellation.map((cons) => cons.image)}
        elementType={elementType}
        onClickBack={() => onChangeConsLv?.(consLv - 1)}
        onClickNext={() => onChangeConsLv?.(consLv + 1)}
      />
      <p className={`text-xl text-${elementType} font-bold`}>{consInfo.name}</p>
      <p className="text-lg">
        Constellation Lv. <Green b>{consLv}</Green>
      </p>
      {description ? (
        <p className="mt-4 whitespace-pre-wrap">{description}</p>
      ) : (
        <p className={"mt-4" + (isLoading ? " py-4 flex justify-center" : "")}>
          <LoadingIcon active={isLoading} />
          {isError && <Dim>Error. Rebooting...</Dim>}
          {descriptions?.[consLv - 1]}
        </p>
      )}

      <div className="mt-4">
        <CloseButton className="mx-auto" size="small" onClick={onClose} />
      </div>
    </div>
  );
};
