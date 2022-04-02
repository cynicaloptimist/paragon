import { createContext } from "react";

export type PlayerViewUser = {
  name: string | null;
  setName: (name: string) => void;
};

export const PlayerViewUserContext = createContext<PlayerViewUser>({
  name: null,
  setName: () => {},
});
