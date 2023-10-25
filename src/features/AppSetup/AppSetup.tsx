import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

// Store
import { updateMessage } from "@Store/calculatorSlice";
import { useDispatch } from "@Store/hooks";
import { updateImportInfo } from "@Store/uiSlice";

// Util
import { decodeSetup } from "@Src/components/setup-porter/utils";
import { getSearchParam } from "@Src/utils";
import { appData } from "@Src/data";

// Component
import { Button, LoadingIcon, Modal } from "@Src/pure-components";

type CountDownControl = {
  start: () => void;
};

const maxSec = 300;

interface ICountDownProps {
  onDone: () => void;
}
const CountDown = forwardRef<CountDownControl, ICountDownProps>((props, ref) => {
  const startTime = useRef(0);
  const [time, setTime] = useState(0);

  const intervalId = useRef<NodeJS.Timer>();
  const timeRef = useRef(time);
  timeRef.current = time;

  const start = () => {
    startTime.current = Date.now();
    setTime(maxSec);

    intervalId.current = setInterval(() => {
      const currentTime = Date.now();
      const secElapsed = (currentTime - startTime.current) / 1000;

      if (secElapsed < maxSec) {
        setTime(Math.round(maxSec - secElapsed));
      } else {
        setTime(0);
        clearInterval(intervalId.current);
        props.onDone();
      }
    }, 1000);
  };

  useImperativeHandle(ref, () => ({
    start,
  }));

  useEffect(() => {
    start();

    return () => {
      clearInterval(intervalId.current);
    };
  }, []);

  return <span>{time}</span>;
});

export const AppSetup = () => {
  const dispatch = useDispatch();
  const countdown = useRef<CountDownControl>(null);
  const [status, setStatus] = useState<"done" | "loading" | "cooling" | "idle">("done");

  const getAppData = async () => {
    setStatus("loading");

    const isOk = await appData.fetchMetadata();

    if (isOk) {
      const importCode = getSearchParam("importCode");

      if (importCode) {
        try {
          dispatch(updateImportInfo(decodeSetup(importCode)));
        } catch (error) {
          dispatch(
            updateMessage({
              type: "error",
              content: "An unknown error has occurred. This setup cannot be imported.",
            })
          );
        }
      }

      setStatus("done");
    } else {
      countdown.current?.start();
      setStatus("cooling");
    }
  };

  useEffect(() => {
    getAppData();
  }, []);

  const onDoneCountDown = () => {
    setStatus("idle");
  };

  return (
    <Modal
      active={status !== "done"}
      className="small-modal p-4 bg-darkblue-1 flex flex-col items-center space-y-3"
      closeOnMaskClick={false}
      onClose={() => {}}
    >
      {status === "loading" ? (
        <p className="text-xl font-semibold">Getting App data</p>
      ) : (
        <p className="text-xl font-semibold text-red-400">Failed to get App data</p>
      )}
      <p>
        {["idle", "cooling"].includes(status) ? (
          <>
            Try again in <CountDown ref={countdown} onDone={onDoneCountDown} /> seconds
          </>
        ) : (
          <LoadingIcon />
        )}
      </p>

      <Button variant="positive" disabled={["loading", "cooling"].includes(status)} onClick={getAppData}>
        Get data
      </Button>
    </Modal>
  );
};
