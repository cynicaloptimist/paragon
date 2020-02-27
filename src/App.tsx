import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./App.css";

import React from "react";
import { Container, Fab } from "@material-ui/core";
import GridLayout from "react-grid-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { TopBar } from "./TopBar";
import { AppReducer } from "./AppReducer";
import { Actions } from "./Actions";
import { GetInitialState } from "./AppState";
import { ArticleCard } from "./ArticleCard";
import { ReducerContext } from "./ReducerContext";

const App = () => {
  const [state, dispatch] = React.useReducer(AppReducer, GetInitialState());

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
      <Container style={{ height: "100%", position: "relative" }}>
        <TopBar />
        <GridLayout
          cols={12}
          rowHeight={30}
          width={1200}
          draggableHandle=".drag-handle"
          compactType={null}
          style={{ position: "absolute" }}
        >
          {cards}
        </GridLayout>
        <Fab
          style={{ position: "absolute", top: 80, left: 50 }}
          color="primary"
          aria-label="add"
          onClick={() => dispatch(Actions.AddCard())}
        >
          <FontAwesomeIcon icon={faPlus} />
        </Fab>
      </Container>
    </ReducerContext.Provider>
  );
};

export default App;
