import { Button } from "@Src/pure-components";
import { useEffect, useRef, useState } from "react";

interface IRefetchMetadataProps {
  cooldown?: number;
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
}
export const RefetchMetadata = ({ cooldown = 10, isLoading, isError, onRefetch }: IRefetchMetadataProps) => {
  const startTime = useRef(0);
  const [time, setTime] = useState(0);

  const intervalId = useRef<NodeJS.Timer>();
  const timeRef = useRef(time);
  const triesRef = useRef(0);
  timeRef.current = time;

  const start = () => {
    startTime.current = Date.now();
    setTime(cooldown);

    intervalId.current = setInterval(() => {
      const currentTime = Date.now();
      const secElapsed = (currentTime - startTime.current) / 1000;

      if (secElapsed < cooldown) {
        setTime(Math.round(cooldown - secElapsed));
      } else {
        setTime(0);
        clearInterval(intervalId.current);
      }
    }, 1000);
  };

  useEffect(() => {
    triesRef.current++;
    start();

    return () => {
      clearInterval(intervalId.current);
    };
  }, [isError]);

  if (isLoading) {
    return <p>Loading App Data...</p>;
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-lightred">
          Failed to fetch App Data. <span>{time ? `Try again in ${time}s.` : "Please try again."}</span>
        </p>
        <Button
          className="mt-1"
          variant="positive"
          size="small"
          shape="square"
          disabled={time !== 0}
          onClick={onRefetch}
        >
          Refetch
        </Button>
      </div>
    );
  }
  return null;
};
