import { NotificationProps } from "@Components/molecules";

export type NotificationControl = Pick<NotificationProps, "type" | "content" | "onClose"> & {
  id: number;
  duration?: number;
};

type AddRequest = {
  type: "add";
  noti: NotificationControl;
};

type RemoveRequest = {
  type: "remove";
  id: number;
};

export interface NotificationCenterProps {
  request: AddRequest | RemoveRequest;
}
