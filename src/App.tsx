import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./App.css";

import React from "react";
import {
  Typography,
  Container,
  Fab,
  Paper,
  Box,
  AppBar,
  Toolbar,
  IconButton
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

function BaseCard(props: {
  header: React.ReactElement;
  children?: React.ReactElement;
}) {
  return (
    <Paper style={{ height: "100%" }}>
      <AppBar position="relative" className="drag-handle">
        <Toolbar variant="dense">{props.header}</Toolbar>
      </AppBar>
      {props.children}
    </Paper>
  );
}

const HelloCard = () => (
  <BaseCard header={<Typography>Card Title</Typography>}>
    <Typography>Hello World</Typography>
  </BaseCard>
);

export default App;
