import { useEffect, useRef } from "react";

export function useScrollTo(entries: any[]) {
  const scrollBottom = useRef<HTMLDivElement>(null);
  const didInitialRenderScroll = useRef(false);

  useEffect(() => {
    const scrollTo = scrollBottom.current;
    if (scrollTo) {
      setImmediate(() => {
        scrollTo.scrollIntoView({
          behavior: didInitialRenderScroll.current ? "smooth" : "auto",
          block: "nearest",
        });
        didInitialRenderScroll.current = true;
      });
    }
  }, [entries]);

  return scrollBottom;
}
