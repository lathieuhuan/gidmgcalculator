import { useEffect, useRef } from "react";
import type { NotificationAnimatorProps } from "./types";

const ANIMATION_DURATION = 200;

export const NotificationAnimator = ({
  id,
  duration,
  isClosing,
  children,
  onMount,
  afterClose,
  ...noti
}: NotificationAnimatorProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const onClose = () => {
    if (ref.current) {
      ref.current.classList.replace("opacity-1", "opacity-20");
      ref.current.classList.replace("translate-y-0", "-translate-y-8");
    }

    noti.onClose?.(id);

    setTimeout(afterClose, ANIMATION_DURATION);
  };

  useEffect(() => {
    let isUnmounted = false;

    if (ref.current) {
      onMount?.(ref.current);

      ref.current.classList.replace("-translate-y-8", "translate-y-0");
      ref.current.classList.replace("opacity-20", "opacity-1");
    }

    if (duration) {
      setTimeout(() => {
        if (!isUnmounted) {
          onClose();
        }
      }, duration * 1000);
    }

    return () => {
      isUnmounted = true;
    };
  }, []);

  useEffect(() => {
    if (isClosing) {
      onClose();
    }
  }, [isClosing]);

  return (
    <div ref={ref} className="-translate-y-8 opacity-20" style={{ transitionDuration: `${ANIMATION_DURATION}ms` }}>
      {children({ onClose })}
    </div>
  );
};
