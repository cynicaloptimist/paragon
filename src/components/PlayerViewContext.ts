import { createContext } from "react";

type PlayerView = {
  playerViewId: string;
};

export const PlayerViewContext = createContext<null | PlayerView>(null);
