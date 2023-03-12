import { notifRoot } from "./root";
import type { NotificationControl } from "./types";
import { NotificationCenter, trackedNotis } from "./NotificationCenter";

const show = (type: NotificationControl["type"]) => (args: Omit<NotificationControl, "id" | "type">) => {
  let id = 0;

  for (let i = 0; i < 100; i++) {
    if (trackedNotis.every((trackedNoti) => trackedNoti.id !== i)) {
      id = i;
      break;
    }
  }

  notifRoot.render(
    <NotificationCenter
      request={{
        type: "add",
        noti: {
          id,
          type,
          ...args,
        },
      }}
    />
  );

  return id;
};

const destroy = (id: number) => {
  notifRoot.render(<NotificationCenter request={{ type: "remove", id }} />);
};

export const notification = {
  info: show("info"),
  success: show("success"),
  error: show("error"),
  warn: show("warn"),
  destroy,
};
