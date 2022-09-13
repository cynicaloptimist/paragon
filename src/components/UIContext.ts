import { createContext, useState } from "react";

export type LibrarySidebarMode = "hidden" | "cards" | "dashboards";

type UIContextValue = {
  librarySidebarMode: LibrarySidebarMode;
  setLibrarySidebarMode: (mode: LibrarySidebarMode) => void;
};

export const UIContext = createContext<UIContextValue>({
  librarySidebarMode: "hidden",
  setLibrarySidebarMode: () => {},
});

export function useUIContext(): UIContextValue {
  const [librarySidebarMode, setLibrarySidebarMode] =
    useState<LibrarySidebarMode>("hidden");

  return { librarySidebarMode, setLibrarySidebarMode };
}
