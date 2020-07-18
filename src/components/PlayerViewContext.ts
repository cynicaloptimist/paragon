import { createContext } from "react";
type PlayerViewContext = {
  playerViewId: string;
};
export const PlayerViewContext = createContext<null | PlayerViewContext>(null);
