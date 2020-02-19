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
import { AppReducer } from "./AppReducer";
import { Actions } from "./Actions";
import { GetInitialState } from "./AppState";

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
        onClick={() => dispatch(Actions.AddCard())}
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
