import { useRef, useState } from "react";

export function useToast(
  timeoutMs: number
): [string | null, (toast: string) => void] {
  const [state, setState] = useState<string | null>(null);
  const timer = useRef<NodeJS.Timeout>();
  return [
    state,
    (newState: string) => {
      setState(newState);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => setState(null), timeoutMs);
    },
  ];
}
