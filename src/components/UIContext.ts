import { createContext, useState } from "react";

export type LibrarySidebarMode =
  | "hidden"
  | "cards"
  | "dashboards"
  | "campaigns";

type UIContextValue = {
  librarySidebarMode: LibrarySidebarMode;
  setLibrarySidebarMode: (mode: LibrarySidebarMode) => void;
  appSettingsVisible: boolean;
  setAppSettingsVisible: (visible: boolean) => void;
  cardRefsById: Record<string, React.RefObject<HTMLDivElement>>;
};

export const UIContext = createContext<UIContextValue>({
  librarySidebarMode: "hidden",
  appSettingsVisible: false,
  setLibrarySidebarMode: () => {},
  setAppSettingsVisible: () => {},
  cardRefsById: {},
});

export function useUIContextState(): UIContextValue {
  const [librarySidebarMode, setLibrarySidebarMode] =
    useState<LibrarySidebarMode>("hidden");
  const [appSettingsVisible, setAppSettingsVisible] = useState(false);

  return {
    librarySidebarMode,
    setLibrarySidebarMode,
    appSettingsVisible,
    setAppSettingsVisible,
    cardRefsById: {},
  };
}
