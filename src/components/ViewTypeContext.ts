import { createContext } from "react";

export enum ViewType {
  GameMaster,
  Player,
  Dashboard,
}

export const ViewTypeContext = createContext<ViewType>(ViewType.GameMaster);
