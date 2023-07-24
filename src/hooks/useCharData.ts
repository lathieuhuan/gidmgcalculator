import { useRef, useState, useEffect } from "react";
import { appData } from "@Data/index";
import { AppCharacter } from "@Src/types";

type Status = "loading" | "error" | "success";

type State = {
  data: AppCharacter | null;
  dataOf: string;
  fetchingFor: string;
  unsubscriber?: () => void;
  status: Status | "";
  error: null | {
    code: number;
    message: string;
  };
};

export const useCharData = (name: string) => {
  const state = useRef<State>({
    data: null,
    dataOf: "",
    fetchingFor: "",
    status: "",
    error: null,
    // mounted: true,
  });
  const [boo, setBoo] = useState(false);
  state.current.fetchingFor = name;

  useEffect(() => {
    return () => {
      state.current.unsubscriber?.();
    };
  }, []);

  const render = () => {
    setBoo(!boo);
  };

  const onSuccess = (data: AppCharacter) => {
    state.current.status = "success";
    state.current.data = data;
    state.current.error = null;
    state.current.unsubscriber = undefined;
  };

  const onFetching = () => {
    state.current.status = "loading";
    state.current.data = null;
    state.current.fetchingFor = name;
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
    state.current.unsubscriber?.();

    switch (appData.getCharStatus(name)) {
      case "fetched":
        onSuccess(appData.getCharData(name));
        break;
      case "fetching":
        onFetching();

        state.current.unsubscriber = appData.subscribe(name, (data) => {
          if (data.name === state.current.fetchingFor) {
            onSuccess(data);
          }
        });
        break;
      case "unfetched":
        onFetching();
        fetchData();
        break;
      default:
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
