import { useEffect, useRef } from "react";

export function useScrollTo(entries: any[]) {
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const didInitialRenderScroll = useRef(false);

  useEffect(() => {
    const scrollTarget = scrollTargetRef.current;
    if (scrollTarget) {
      setTimeout(() => {
        scrollTarget.scrollIntoView({
          behavior: didInitialRenderScroll.current ? "smooth" : "auto",
          block: "nearest",
        });
        didInitialRenderScroll.current = true;
      });
    }
  }, [entries]);

  return scrollTargetRef;
}
