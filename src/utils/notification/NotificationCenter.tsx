import { useState, useEffect } from "react";
import type { NotificationCenterProps, NotificationControl } from "./types";
import { NotificationAnimator } from "./NotificationAnimator";

export let trackedNotis: Array<NotificationControl & { height: number }> = [];

export const NotificationCenter = ({ request }: NotificationCenterProps) => {
  const [ids, setIds] = useState<number[]>([]);

  const removeNoti = (id: number) => {
    const index = trackedNotis.findIndex((trackedNoti) => trackedNoti.id === id);

    if (index !== -1) {
      trackedNotis[index].onClose?.();
      trackedNotis.splice(index, 1);
    }

    setIds((prevIds) => prevIds.filter((prevId) => prevId !== id));
  };

  useEffect(() => {
    switch (request.type) {
      case "add":
        trackedNotis.push({
          ...request.noti,
          height: 0,
        });

        setIds((prevIds) => [...prevIds, request.noti.id]);

        break;
      case "remove":
        removeNoti(request.id);
        break;
    }
  }, [request]);

  return (
    <div className="w-80 relative" style={{ maxWidth: "95%" }}>
      {ids.map((id, i) => {
        const noti = trackedNotis.find((trackedNoti) => trackedNoti.id === id);

        const extraDistance = Array.from({ length: Math.min(ids.length, i + 1) }).reduce(
          (accumulator: number, _, j) => accumulator + (trackedNotis[j - 1]?.height || 0),
          0
        );

        return noti ? (
          <div
            key={id}
            className="absolute w-full"
            style={{
              top: 16 * (i + 1) + extraDistance,
            }}
          >
            <NotificationAnimator
              {...noti}
              onMount={(element) => {
                noti.height = element.clientHeight;
              }}
              onClose={() => removeNoti(noti.id)}
            />
          </div>
        ) : null;
      })}
    </div>
  );
};
