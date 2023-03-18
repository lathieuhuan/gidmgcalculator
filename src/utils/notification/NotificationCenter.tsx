import { Notification } from "@Components/molecules";
import { useRef } from "react";
import { NotificationAnimator } from "./NotificationAnimator";
import { NotificationCenterProps } from "./types";

export const NotificationCenter = (props: NotificationCenterProps) => {
  const heights = useRef<number[]>([]);

  console.log("run");
  console.log(props.requests);

  return (
    <div className="w-80 relative" style={{ maxWidth: "95%" }}>
      {props.requests.map((request, i, all) => {
        const { id } = request;

        const extraDistance = all.slice(0, i).reduce((total, ctrl) => {
          return total + (heights.current[ctrl.id] || 0);
        }, 0);

        return (
          <div
            key={id}
            className="absolute w-full"
            style={{
              top: 16 * (i + 1) + extraDistance,
            }}
          >
            <NotificationAnimator
              {...request}
              onMount={(element) => {
                heights.current[id] = element.clientHeight;
              }}
              afterClose={() => {
                request.afterClose?.(id);
                props.afterCloseNoti(id);
              }}
            >
              {({ onClose }) => <Notification {...request} onClose={onClose} />}
            </NotificationAnimator>
          </div>
        );
      })}
    </div>
  );
};
