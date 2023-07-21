import { appData } from "@Data/index";
import { AppCharacter } from "@Src/types";
import { useRef, useState } from "react";

type Status = "loading" | "error" | "success";

type State = {
  data: AppCharacter | null;
  dataOf: string;
  fetchingFor: string;
  status: Status | "";
  error: null | {
    code: number;
    message: string;
  };
};

export const useCharData = (name: string) => {
  const state = useRef<State>({
    fetchingFor: "",
    data: null,
    dataOf: "",
    status: "",
    error: null,
    // mounted: true,
  });
  const [boo, setBoo] = useState(false);
  state.current.fetchingFor = name;

  const render = () => {
    setBoo(!boo);
  };

  const onSuccess = (data: AppCharacter) => {
    state.current.status = "success";
    state.current.data = data;
    state.current.error = null;
  };

  const fetchData = async () => {
    const response = await appData.fetchCharacter(name);

    if (name !== state.current.fetchingFor) {
      // response is stale (name is old)
      return;
    }

    if (response.code === 200 && response.data) {
      onSuccess(response.data);
    } else {
      state.current.status = "error";
      state.current.error = {
        code: response.code,
        message: response.message || "Unknown error",
      };
    }
    render();
  };

  if (state.current.dataOf !== name) {
    state.current.dataOf = name;

    if (appData.isCharFetched(name)) {
      onSuccess(appData.getCharData(name));
    } else {
      state.current.status = "loading";
      state.current.data = null;
      state.current.fetchingFor = name;
      fetchData();
    }
  }

  const { status } = state.current;

  return {
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
    error: state.current.error,
    charData: state.current.data,
  };
};
