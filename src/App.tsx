import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./App.css";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Fab
} from "@material-ui/core";
import GridLayout from "react-grid-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus } from "@fortawesome/free-solid-svg-icons";

import { TopBar } from "./TopBar";

type Action = {
  type: string;
  payload?: object;
};

const AddCardAction = "ADD_CARD";

function AppReducer(oldState: AppState, action: Action) {
  if (action.type === AddCardAction) {
    return {
      cardCount: oldState.cardCount + 1
    };
  }

  return oldState;
}

type AppState = {
  cardCount: number;
};

const GetInitialState = (): AppState => ({
  cardCount: 1
});

const App = () => {
  const [state, dispatch] = React.useReducer(AppReducer, GetInitialState());

  let cards: JSX.Element[] = [];
  for (let i = 0; i < state.cardCount; i++) {
    cards.push(
      <div key={i} data-grid={{ x: 2 * (i % 6) + 1, y: 0, w: 2, h: 4 }}>
        <HelloCard />
      </div>
    );
  }

  return (
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
        onClick={() => dispatch({ type: AddCardAction })}
      >
        <FontAwesomeIcon icon={faPlus} />
      </Fab>
    </Container>
  );
};

const HelloCard = () => (
  <Card style={{ height: "100%" }}>
    <CardContent>
      <FontAwesomeIcon icon={faBars} className="drag-handle" />
      <Typography>Hello World</Typography>
    </CardContent>
  </Card>
);

export default App;
