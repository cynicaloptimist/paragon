import { createContext, useState } from "react";

export type LibrarySidebarMode = "hidden" | "cards" | "dashboards";

type LibrarySidebarContextValue = {
  librarySidebarMode: LibrarySidebarMode;
  setLibrarySidebarMode: (mode: LibrarySidebarMode) => void;
};

export const LibrarySidebarContext = createContext<LibrarySidebarContextValue>({
  librarySidebarMode: "hidden",
  setLibrarySidebarMode: () => {},
});

export function useLibrarySidebarContext(): LibrarySidebarContextValue {
  const [librarySidebarMode, setLibrarySidebarMode] =
    useState<LibrarySidebarMode>("hidden");

  return { librarySidebarMode, setLibrarySidebarMode };
}
