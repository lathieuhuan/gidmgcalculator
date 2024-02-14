import { useEffect, useRef, useState } from "react";
import { $AppData } from "@Src/services";

type State = {
  fetchingFor: string;
  mounted: boolean;
  status: "loading" | "error" | "success" | "";
  data: string[];
};

export const useConsDescriptions = (characterName: string, options?: { auto: boolean }) => {
  const { auto = true } = options || {};

  const state = useRef<State>({
    fetchingFor: "",
    status: "",
    data: [],
    mounted: true,
  });
  const [, setCount] = useState(0);

  useEffect(() => {
    return () => {
      state.current.mounted = false;
    };
  }, []);

  const render = () => {
    setCount((n) => n + 1);
  };

  const getData = async (characterName: string) => {
    const response = await $AppData.fetchConsDescriptions(characterName);

    if (state.current.mounted && characterName === state.current.fetchingFor) {
      if (response.code === 200) {
        state.current.status = "success";
        state.current.data = response.data || [];
      } else {
        state.current.status = "error";
      }
      render();
    }
  };

  if (auto && characterName && characterName !== state.current.fetchingFor) {
    state.current.fetchingFor = characterName;
    state.current.status = "loading";

    getData(characterName);
    render();
  }

  const { status, data } = state.current;

  return {
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
    descriptions: data,
  };
};
