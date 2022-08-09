import { Ref, useEffect, useRef, useState } from "react";

export default function useHeight(): [Ref<HTMLDivElement>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          const contentBoxSize = Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0]
            : entry.contentBoxSize;
          setHeight(contentBoxSize.blockSize);
        } else {
          setHeight(entry.contentRect.height);
        }
      }
    });
    const elmt = ref.current;
    if (elmt) {
      resizeObserver.observe(elmt);
    }
    return () => {
      if (elmt) resizeObserver.unobserve(elmt);
    };
  }, []);

  return [ref, height];
}
