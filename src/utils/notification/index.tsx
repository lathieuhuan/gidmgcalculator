import { notifRoot } from "./root";
import type { NotificationRequest } from "./types";
import { NotificationCenter } from "./NotificationCenter";

export let notiRequests: NotificationRequest[] = [];

const updateNotification = () => {
  notifRoot.render(<NotificationCenter requests={notiRequests} afterCloseNoti={cleanup} />);
};

const cleanup = (id: number) => {
  notiRequests = notiRequests.filter((request) => request.id !== id);

  updateNotification();
};

const destroy = (id?: number | "all") => {
  if (id === "all") {
    for (const request of notiRequests) {
      request.isClosing = true;
    }
  } else if (typeof id === "number") {
    const request = notiRequests.find((request) => request.id === id);

    if (request) {
      request.isClosing = true;
    }
  } else {
    const lastRequest = notiRequests[notiRequests.length - 1];

    if (lastRequest) {
      lastRequest.isClosing = true;
    }
  }

  console.log("destroy");
  console.log(notiRequests);

  updateNotification();
};

const show = (type: NotificationRequest["type"]) => (noti: Omit<NotificationRequest, "id" | "type">) => {
  //
  for (let id = 0; id < 100; id++) {
    if (notiRequests.every((notification) => notification.id !== id)) {
      //
      notiRequests.push({
        id,
        type,
        duration: 5,
        ...noti,
      });

      console.log("show", type);
      console.log(notiRequests);

      updateNotification();

      return id;
    }
  }
  return 0;
};

export const notification = {
  info: show("info"),
  success: show("success"),
  error: show("error"),
  warn: show("warn"),
  destroy,
};
