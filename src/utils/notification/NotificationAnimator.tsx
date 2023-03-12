import { useEffect, useRef } from "react";
import type { PartiallyRequired } from "@Src/types";
import { Notification, type NotificationProps } from "@Components/molecules";

const ANIMATION_DURATION = 200;

interface NotificationAnimatorProps extends PartiallyRequired<NotificationProps, "onClose"> {
  id: number;
  duration?: number;
  onMount: (info: HTMLDivElement) => void;
}
export const NotificationAnimator = ({ id, duration, onMount, ...rest }: NotificationAnimatorProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const onClose = () => {
    const animator = document.querySelector(`#notif-${id}`) as HTMLDivElement;

    if (animator) {
      animator.classList.replace("opacity-1", "opacity-20");
      animator.classList.replace("translate-y-0", "-translate-y-8");
    }

    setTimeout(rest.onClose, ANIMATION_DURATION);
  };

  useEffect(() => {
    if (ref.current) {
      onMount?.(ref.current);
    }

    const animator = document.querySelector(`#notif-${id}`) as HTMLDivElement;

    if (animator) {
      animator.classList.replace("-translate-y-8", "translate-y-0");
      animator.classList.replace("opacity-20", "opacity-1");
    }

    if (duration) {
      setTimeout(onClose, duration * 1000);
    }
  }, []);

  return (
    <div
      ref={ref}
      id={`notif-${id}`}
      className="-translate-y-8 opacity-20"
      style={{ transitionDuration: `${ANIMATION_DURATION}ms` }}
    >
      <Notification {...rest} onClose={onClose} />
    </div>
  );
};
