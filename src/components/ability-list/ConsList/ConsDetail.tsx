import { useEffect, useRef, useState } from "react";

import type { AppCharacter } from "@Src/types";
import { appData } from "@Data/index";

// Conponent
import { CloseButton, Green, Lesser, LoadingIcon } from "@Src/pure-components";
import { SlideShow } from "../components";

const useConsDescriptions = (name: string, options?: { auto: boolean }) => {
  const { auto = true } = options || {};
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">(auto ? "loading" : "idle");
  const [descriptions, setDescriptions] = useState<string[]>();
  const state = useRef({
    fetchStarted: false,
    mounted: true,
  });

  useEffect(() => {
    return () => {
      state.current.mounted = false;
    };
  }, []);

  const getConstellation = async () => {
    const response = await appData.fetchConsDescriptions(name);

    if (state.current.mounted) {
      if (response.code === 200) {
        setStatus("success");
        setDescriptions(response.data || []);
      } else {
        setStatus("error");
      }
    }
  };

  if (status === "loading" && !state.current.fetchStarted) {
    state.current.fetchStarted = true;
    getConstellation();
  }

  return {
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
    data: descriptions,
  };
};

interface ConsDetailProps {
  charData: AppCharacter;
  consLv: number;
  onChangeConsLv?: (newLv: number) => void;
  onClose?: () => void;
}
export const ConsDetail = ({ charData, consLv, onChangeConsLv, onClose }: ConsDetailProps) => {
  const { isLoading, isError, data } = useConsDescriptions(charData.name);

  const { vision, constellation } = charData;
  const consInfo = constellation[consLv - 1] || {};

  return (
    <div className="h-full flex-col hide-scrollbar">
      <SlideShow
        forTalent={false}
        currentIndex={consLv - 1}
        images={constellation.map((cons) => cons.image)}
        vision={vision}
        onClickBack={() => onChangeConsLv?.(consLv - 1)}
        onClickNext={() => onChangeConsLv?.(consLv + 1)}
      />
      <p className={`text-xl text-${vision} font-bold`}>{consInfo.name}</p>
      <p className="text-lg">
        Constellation Lv. <Green b>{consLv}</Green>
      </p>
      {consInfo.description ? (
        <p className="mt-4">{consInfo.description}</p>
      ) : (
        <p className={"mt-4" + (isLoading ? " py-4 flex justify-center" : "")}>
          <LoadingIcon active={isLoading} />
          {isError && <Lesser>Error. Rebooting...</Lesser>}
          {data?.[consLv - 1]}
        </p>
      )}

      <div className="mt-4">
        <CloseButton className="mx-auto" size="small" onClick={onClose} />
      </div>
    </div>
  );
};
