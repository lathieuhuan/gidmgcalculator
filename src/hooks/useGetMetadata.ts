import { useEffect, useState } from "react";
import { appData } from "@Src/data";

interface UseGetMetadataOptions {
  onSuccess?: () => void;
  onError?: () => void;
}
export const useGetMetadata = (options: UseGetMetadataOptions = {}) => {
  const [status, setStatus] = useState<"done" | "loading" | "error" | "idle">("loading");

  const getMetadata = async () => {
    if (status !== "loading") {
      setStatus("loading");
    }

    const isOk = await appData.fetchMetadata();

    if (isOk) {
      setStatus("done");
      options.onSuccess?.();
    } else {
      setStatus("error");
      options.onError?.();
    }
  };

  useEffect(() => {
    getMetadata();
  }, []);

  return {
    status,
    getMetadata,
  };
};