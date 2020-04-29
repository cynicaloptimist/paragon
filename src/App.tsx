import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./App.css";

import React from "react";
import GridLayout from "react-grid-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { TopBar } from "./TopBar";
import { AppReducer } from "./AppReducer";
import { Actions } from "./Actions";
import { GetInitialState } from "./AppState";
import { ArticleCard } from "./ArticleCard";
import { ReducerContext } from "./ReducerContext";
import { Grommet, Button, Box } from "grommet";
import { useStorageBackedReducer } from "./useStorageBackedReducer";

const App = () => {
  const [state, dispatch] = useStorageBackedReducer(
    AppReducer,
    GetInitialState(),
    "appState"
  );

  const cards = state.openCardIds.map((cardId, index) => {
    return (
      <div
        key={cardId}
        data-grid={{ x: 2 * (index % 6) + 1, y: 0, w: 2, h: 4 }}
      >
        <ArticleCard cardId={cardId} />
      </div>
    );
  });

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <Grommet style={{ height: "100%" }}>
        <Box fill align="center">
          <Box fill="vertical" width="xxlarge">
            <TopBar />
            <Button
              primary
              aria-label="add"
              onClick={() => dispatch(Actions.AddCard())}
              icon={<FontAwesomeIcon icon={faPlus} />}
            />
            <GridLayout
              cols={12}
              rowHeight={30}
              width={1200}
              draggableHandle=".drag-handle"
              compactType={null}
              style={{ flexGrow: 1 }}
            >
              {cards}
            </GridLayout>
          </Box>
        </Box>
      </Grommet>
    </ReducerContext.Provider>
  );
};

export default App;
