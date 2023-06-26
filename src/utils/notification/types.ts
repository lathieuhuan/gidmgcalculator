import type { PartiallyRequired } from "@Src/types";
import type { NotificationProps } from "@Src/components";

export type NotificationRequest = Omit<NotificationProps, "onClose"> & {
  id: number;
  duration?: number;
  isClosing?: boolean;
  onClose?: (id: number) => void;
  afterClose?: (id: number) => void;
};

export interface NotificationAnimatorProps extends PartiallyRequired<NotificationRequest, "afterClose"> {
  children: (operation: { onClose: () => void }) => React.ReactElement;
  onMount: (info: HTMLDivElement) => void;
}

export interface NotificationCenterProps {
  requests: NotificationRequest[];
  afterCloseNoti: (id: number) => void;
}
