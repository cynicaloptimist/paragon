import { useState, useRef, useEffect, useCallback } from "react";

export function useHover<T extends HTMLElement>() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<T>(null);
  const handleMouseOver = useCallback(() => setHovered(true), []);
  const handleMouseOut = useCallback(() => setHovered(false), []);
  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener("mouseover", handleMouseOver);
      node.addEventListener("mouseout", handleMouseOut);
      return () => {
        node.removeEventListener("mouseover", handleMouseOver);
        node.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, [ref, handleMouseOver, handleMouseOut]);
  return { ref, hovered };
}
